import { requireAdmin } from '../../server/auth.js';
import { TABLES, dbConfigured, getSql, upsertRows } from '../../server/db.js';
import { events } from '../../src/data/events.js';
import { artists } from '../../src/data/artists.js';
import { team } from '../../src/data/team.js';

const bundled = { events, artists, team };

// POST {resource}: copy the site's bundled records for one dataset into NeonDB, so
// editing in /admin starts from the full list instead of an empty table.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await requireAdmin(req, res))) return;
  if (!dbConfigured()) return res.status(503).json({ error: 'Database not configured. Add DATABASE_URL.' });
  const resource = req.body?.resource;
  if (!bundled[resource]) return res.status(400).json({ error: 'Unknown resource' });
  try {
    await upsertRows(getSql(), TABLES[resource], bundled[resource]);
    return res.status(200).json({ copied: bundled[resource].length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
