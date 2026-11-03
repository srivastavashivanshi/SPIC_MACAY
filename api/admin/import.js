import { requireAdmin } from '../../server/auth.js';
import { dbConfigured, getSql, listRows, upsertRows } from '../../server/db.js';
import { importProgrammes } from '../../server/spicmacayImport.js';

// POST {match}: pull the chapter's programmes from spicmacay.org into NeonDB.
// Existing records keep any details added here (time, attendance, artist link, description).
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await requireAdmin(req, res))) return;
  if (!dbConfigured()) return res.status(503).json({ error: 'Database not configured. Add DATABASE_URL.' });

  try {
    const match = String(req.body?.match || 'IIM Lucknow').slice(0, 80);
    const imported = await importProgrammes({ match });
    const sql = getSql();
    const existing = Object.fromEntries((await listRows(sql, 'events')).map((e) => [e.id, e]));
    const keepLocal = ['time', 'audience', 'artistId', 'description', 'artForm', 'type', 'venue'];
    const merged = imported.map((e) => {
      const old = existing[e.id];
      if (!old) return e;
      const kept = Object.fromEntries(keepLocal.filter((k) => old[k] !== '' && old[k] != null).map((k) => [k, old[k]]));
      return { ...e, ...kept };
    });
    await upsertRows(sql, 'events', merged);
    const added = merged.filter((e) => !existing[e.id]).length;
    return res.status(200).json({ match, found: merged.length, added, updated: merged.length - added, items: merged });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: `Could not import from spicmacay.org: ${err.message}` });
  }
}
