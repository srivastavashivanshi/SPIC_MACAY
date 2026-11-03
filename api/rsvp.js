import { dbConfigured, getSql, ensureTable } from '../server/db.js';
import { clean, hashId, isBot, isEmail } from '../server/forms.js';

// GET ?eventId=: how many people plan to attend. POST {eventId, name, email?}: record an RSVP.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!dbConfigured()) return res.status(503).json({ error: 'RSVPs are not open yet.' });
  const sql = getSql();
  await ensureTable(sql, 'rsvps');

  if (req.method === 'GET') {
    const eventId = clean(req.query.eventId, 80);
    if (!eventId) return res.status(400).json({ error: 'eventId is required' });
    const [row] = await sql.query(`select count(*)::int as n from rsvps where data->>'eventId' = $1`, [eventId]);
    return res.status(200).json({ count: row.n });
  }
  if (req.method === 'POST') {
    const body = req.body ?? {};
    if (isBot(body)) return res.status(200).json({ ok: true });
    const eventId = clean(body.eventId, 80);
    const name = clean(body.name, 80);
    const email = clean(body.email, 200).toLowerCase();
    if (!eventId || !name) return res.status(400).json({ error: 'Please add your name.' });
    if (email && !isEmail(email)) return res.status(400).json({ error: 'That email doesn’t look right.' });
    // One RSVP per person per programme: the same name/email updates instead of adding.
    const id = hashId(eventId, email || name);
    await sql.query(
      `insert into rsvps (id, data) values ($1, $2) on conflict (id) do update set data = excluded.data, updated_at = now()`,
      [id, JSON.stringify({ id, eventId, name, email, createdAt: new Date().toISOString() })],
    );
    const [row] = await sql.query(`select count(*)::int as n from rsvps where data->>'eventId' = $1`, [eventId]);
    return res.status(200).json({ ok: true, count: row.n });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
