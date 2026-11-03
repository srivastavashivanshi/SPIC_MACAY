import {
  acceptInvite,
  authConfigured,
  clearSession,
  currentUser,
  isEmail,
  normaliseEmail,
  passwordMatches,
  setSession,
  signInAccount,
} from '../../server/auth.js';
import { dbConfigured } from '../../server/db.js';

const slowDown = () => new Promise((r) => setTimeout(r, 800)); // make guessing slow

// GET: who am I and what's configured.
// POST {password}: sign in with the chapter password.
// POST {email, password}: sign in with a personal account.
// POST {email, invite, password}: accept an invitation and set a password.
// DELETE: sign out.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const user = await currentUser(req);
    return res.status(200).json({
      authenticated: Boolean(user),
      user,
      configured: { auth: authConfigured(), db: dbConfigured(), blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN) },
    });
  }
  if (req.method === 'POST') {
    if (!authConfigured()) return res.status(503).json({ error: 'Admin sign-in is not set up. Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET.' });
    const body = req.body ?? {};
    const email = normaliseEmail(body.email);
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email) {
      if (!passwordMatches(password)) {
        await slowDown();
        return res.status(401).json({ error: 'That password is not right.' });
      }
      setSession(req, res, { sub: 'owner', role: 'owner' });
      return res.status(200).json({ authenticated: true });
    }

    if (!isEmail(email)) return res.status(400).json({ error: 'That email doesn’t look right.' });
    if (!dbConfigured()) return res.status(503).json({ error: 'Personal accounts need the database. Add DATABASE_URL.' });

    if (body.invite) {
      if (password.length < 10) return res.status(400).json({ error: 'Choose a password of at least 10 characters.' });
      const account = await acceptInvite(email, String(body.invite), password);
      if (!account) {
        await slowDown();
        return res.status(400).json({ error: 'This invitation link is invalid or has expired. Ask an owner for a new one.' });
      }
      setSession(req, res, { sub: account.email, role: account.role, sv: account.sessionVersion });
      return res.status(200).json({ authenticated: true });
    }

    const account = await signInAccount(email, password);
    if (!account) {
      await slowDown();
      return res.status(401).json({ error: 'That email and password don’t match.' });
    }
    setSession(req, res, { sub: account.email, role: account.role, sv: account.sessionVersion });
    return res.status(200).json({ authenticated: true });
  }
  if (req.method === 'DELETE') {
    clearSession(req, res);
    return res.status(200).json({ authenticated: false });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
