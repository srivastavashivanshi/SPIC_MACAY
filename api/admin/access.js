import { inviteAccount, isEmail, listAccounts, normaliseEmail, requireOwner, revokeAccount } from '../../server/auth.js';
import { dbConfigured } from '../../server/db.js';

// Owners only. GET: list admin accounts. POST {email, role}: invite (or reset) someone and
// return a one-time invitation token. DELETE ?email=: remove their access.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const owner = await requireOwner(req, res);
  if (!owner) return;
  if (!dbConfigured()) return res.status(503).json({ error: 'Personal accounts need the database. Add DATABASE_URL.' });

  if (req.method === 'GET') return res.status(200).json(await listAccounts());
  if (req.method === 'POST') {
    const email = normaliseEmail(req.body?.email);
    const role = req.body?.role === 'owner' ? 'owner' : 'admin';
    if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    const token = await inviteAccount(email, role, owner.email ?? 'chapter password');
    return res.status(200).json({ email, role, invite: token, expiresInDays: 7 });
  }
  if (req.method === 'DELETE') {
    const email = normaliseEmail(req.query.email);
    if (email && email === owner.email) return res.status(400).json({ error: 'You can’t remove your own access.' });
    return (await revokeAccount(email)) ? res.status(200).json({ removed: email }) : res.status(404).json({ error: 'Not found' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
