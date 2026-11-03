import { requireAdmin } from '../../server/auth.js';
import { PRIVATE_TABLES, dbConfigured, deleteRow, getSql, listRows } from '../../server/db.js';

// GET ?type=rsvps|subscribers: list responses. DELETE ?type=&id=: remove one (e.g. an unsubscribe request).
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!(await requireAdmin(req, res))) return;
  if (!dbConfigured()) return res.status(503).json({ error: 'Database not configured. Add DATABASE_URL.' });
  const table = PRIVATE_TABLES[req.query.type];
  if (!table) return res.status(400).json({ error: 'Unknown type' });
  const sql = getSql();
  if (req.method === 'GET') return res.status(200).json(await listRows(sql, table));
  if (req.method === 'DELETE') {
    const removed = await deleteRow(sql, table, String(req.query.id || ''));
    return removed ? res.status(200).json({ deleted: removed.id }) : res.status(404).json({ error: 'Not found' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
