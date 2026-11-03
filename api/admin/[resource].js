import { del } from '@vercel/blob';
import { requireAdmin } from '../../server/auth.js';
import { TABLES, dbConfigured, deleteRow, getSql, upsertRows } from '../../server/db.js';
import { InvalidInput, editable, validate } from '../../server/validate.js';

// POST: create or update one record. DELETE ?id=: remove it.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const resource = req.query.resource;
  if (!editable.includes(resource)) return res.status(404).json({ error: 'Unknown resource' });
  if (!(await requireAdmin(req, res))) return;
  if (!dbConfigured()) return res.status(503).json({ error: 'Database not configured. Add DATABASE_URL.' });
  const sql = getSql();

  try {
    if (req.method === 'POST') {
      const record = await validate(resource, req.body);
      await upsertRows(sql, TABLES[resource], [record]);
      return res.status(200).json(record);
    }
    if (req.method === 'DELETE') {
      const removed = await deleteRow(sql, TABLES[resource], String(req.query.id || ''));
      if (!removed) return res.status(404).json({ error: 'Not found' });
      // Photos also live in Vercel Blob; remove the file too.
      if (resource === 'gallery' && removed.url && process.env.BLOB_READ_WRITE_TOKEN) {
        await del(removed.url).catch((err) => console.error('Blob delete failed', err));
      }
      return res.status(200).json({ deleted: removed.id });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof InvalidInput) return res.status(400).json({ error: err.message });
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
