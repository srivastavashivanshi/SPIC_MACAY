import { createHmac, createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { dbConfigured, ensureTable, getSql } from './db.js';

// Admin sessions are a signed, expiring token in an HttpOnly cookie.
// Two kinds of sign-in:
//  - the chapter password (ADMIN_PASSWORD), which signs in as the "owner";
//  - personal accounts (email + password), created by invitation from the Access tab
//    and stored in the `admins` table (needs DATABASE_URL).
// Both need ADMIN_SESSION_SECRET (32+ random characters).
const COOKIE = 'iiml_admin';
const MAX_AGE = 12 * 60 * 60; // seconds
const INVITE_DAYS = 7;
const scrypt = promisify(scryptCb);

export const authConfigured = () => Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET || '').length >= 32);

const sign = (payload) => createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(payload).digest('base64url');

const sameText = (a, b) => {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
};

export const passwordMatches = (candidate) => authConfigured() && sameText(candidate ?? '', process.env.ADMIN_PASSWORD);

export const normaliseEmail = (v) => (typeof v === 'string' ? v.trim().toLowerCase().slice(0, 200) : '');
export const isEmail = (v) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v);

// ── Passwords and invite tokens ───────────────────────────────────────────
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url');
  const hash = (await scrypt(password, salt, 64)).toString('base64url');
  return `scrypt$${salt}$${hash}`;
}

async function verifyPassword(password, stored) {
  const [, salt, hash] = String(stored || '').split('$');
  if (!salt || !hash) return false;
  const candidate = await scrypt(password, salt, 64);
  const expected = Buffer.from(hash, 'base64url');
  return expected.length === candidate.length && timingSafeEqual(candidate, expected);
}

const tokenHash = (token) => createHash('sha256').update(String(token)).digest('base64url');

// ── Accounts ──────────────────────────────────────────────────────────────
async function accounts() {
  const sql = getSql();
  await ensureTable(sql, 'admins');
  return sql;
}

export async function getAccount(email) {
  if (!dbConfigured() || !email) return null;
  const sql = await accounts();
  const [row] = await sql.query('select data from admins where id = $1', [email]);
  return row?.data ?? null;
}

async function saveAccount(account) {
  const sql = await accounts();
  await sql.query(
    `insert into admins (id, data) values ($1, $2) on conflict (id) do update set data = excluded.data, updated_at = now()`,
    [account.email, JSON.stringify(account)],
  );
}

// Public view of an account: never includes password or invite hashes.
export const publicAccount = (a) => ({
  email: a.email,
  role: a.role,
  status: a.passwordHash ? 'active' : a.inviteExpires > Date.now() ? 'invited' : 'invite expired',
  inviteExpires: a.passwordHash ? null : a.inviteExpires,
  invitedBy: a.invitedBy,
  createdAt: a.createdAt,
  lastLogin: a.lastLogin ?? null,
});

export async function listAccounts() {
  if (!dbConfigured()) return [];
  const sql = await accounts();
  return (await sql.query('select data from admins order by id')).map((r) => publicAccount(r.data));
}

// Creates an account (or resets an existing one) and returns a one-time invite token.
// Resetting signs the person out everywhere until they set a new password.
export async function inviteAccount(email, role, invitedBy) {
  const token = randomBytes(32).toString('base64url');
  const existing = await getAccount(email);
  await saveAccount({
    email,
    role,
    passwordHash: null,
    inviteHash: tokenHash(token),
    inviteExpires: Date.now() + INVITE_DAYS * 864e5,
    sessionVersion: (existing?.sessionVersion ?? 0) + 1,
    invitedBy,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    lastLogin: existing?.lastLogin ?? null,
  });
  return token;
}

export async function acceptInvite(email, token, password) {
  const account = await getAccount(email);
  if (!account?.inviteHash || account.inviteExpires < Date.now() || !sameText(tokenHash(token), account.inviteHash)) return null;
  const updated = { ...account, passwordHash: await hashPassword(password), inviteHash: null, inviteExpires: null, lastLogin: new Date().toISOString() };
  await saveAccount(updated);
  return updated;
}

export async function signInAccount(email, password) {
  const account = await getAccount(email);
  if (!account?.passwordHash || !(await verifyPassword(password, account.passwordHash))) return null;
  const updated = { ...account, lastLogin: new Date().toISOString() };
  await saveAccount(updated);
  return updated;
}

export async function revokeAccount(email) {
  if (!dbConfigured()) return false;
  const sql = await accounts();
  const rows = await sql.query('delete from admins where id = $1 returning id', [email]);
  return rows.length > 0;
}

// ── Sessions ──────────────────────────────────────────────────────────────
const isHttps = (req) => (req.headers['x-forwarded-proto'] || '').includes('https');

// user: { sub: 'owner' | email, role: 'owner' | 'admin', sv?: sessionVersion }
export function setSession(req, res, user = { sub: 'owner', role: 'owner' }) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  res.setHeader('Set-Cookie', `${COOKIE}=${payload}.${sign(payload)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}${isHttps(req) ? '; Secure' : ''}`);
}

export function clearSession(req, res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${isHttps(req) ? '; Secure' : ''}`);
}

function readSession(req) {
  if (!authConfigured()) return null;
  const cookie = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!cookie) return null;
  const [payload, sig] = cookie.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig || !sameText(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    // Tokens from before personal accounts carry no `sub`: they were chapter-password sessions.
    return data.exp > Date.now() ? { sub: data.sub ?? 'owner', role: data.role ?? 'owner', sv: data.sv } : null;
  } catch {
    return null;
  }
}

// The signed-in user, or null. Personal accounts are re-checked against the database,
// so revoking access or resetting a password ends existing sessions straight away.
export async function currentUser(req) {
  const session = readSession(req);
  if (!session) return null;
  if (session.sub === 'owner') return { email: null, role: 'owner', label: 'Chapter password' };
  const account = await getAccount(session.sub).catch(() => null);
  if (!account?.passwordHash || account.sessionVersion !== session.sv) return null;
  return { email: account.email, role: account.role, label: account.email };
}

export const isAdmin = async (req) => Boolean(await currentUser(req));

// Responds 401 and returns null when the request has no valid admin session.
export async function requireAdmin(req, res) {
  const user = await currentUser(req);
  if (!user) res.status(401).json({ error: 'Please sign in again.' });
  return user;
}

// Managing who has access needs an owner: the chapter password, or an account with the owner role.
export async function requireOwner(req, res) {
  const user = await requireAdmin(req, res);
  if (user && user.role !== 'owner') {
    res.status(403).json({ error: 'Only owners can manage admin access.' });
    return null;
  }
  return user;
}
