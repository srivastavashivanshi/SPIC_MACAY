import { TABLES, dbConfigured, getSql, listRows } from '../server/db.js';

// Public, read-only access to the site's data in NeonDB.
export default async function handler(req, res) {
  const table = TABLES[req.query.resource];
  if (!table) return res.status(404).json({ error: 'Unknown resource' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!dbConfigured()) return res.status(503).json({ error: 'Database not configured' });

  try {
    const rows = await listRows(getSql(), table);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
