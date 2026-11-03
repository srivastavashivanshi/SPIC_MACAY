import { dbConfigured, getSql, ensureTable } from '../server/db.js';
import { clean, hashId, isBot, isEmail, isPhone } from '../server/forms.js';

// GET: is sign-up open? POST {name, email?, phone?, consent}: join the announcement list.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ open: dbConfigured() });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!dbConfigured()) return res.status(503).json({ error: 'Sign-ups are not open yet.' });

  const body = req.body ?? {};
  if (isBot(body)) return res.status(200).json({ ok: true });
  const name = clean(body.name, 80);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 20);
  if (!name) return res.status(400).json({ error: 'Please add your name.' });
  if (!email && !phone) return res.status(400).json({ error: 'Add an email or a WhatsApp number.' });
  if (email && !isEmail(email)) return res.status(400).json({ error: 'That email doesn’t look right.' });
  if (phone && !isPhone(phone)) return res.status(400).json({ error: 'That WhatsApp number doesn’t look right.' });
  if (body.consent !== true) return res.status(400).json({ error: 'Please tick the consent box.' });

  const sql = getSql();
  await ensureTable(sql, 'subscribers');
  const id = hashId(email || phone);
  await sql.query(
    `insert into subscribers (id, data) values ($1, $2) on conflict (id) do update set data = excluded.data, updated_at = now()`,
    [id, JSON.stringify({ id, name, email, phone, consentAt: new Date().toISOString() })],
  );
  return res.status(200).json({ ok: true });
}
