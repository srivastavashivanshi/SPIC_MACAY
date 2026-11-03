// Creates the tables and upserts everything in src/data into NeonDB.
// Pass --prune to also delete rows whose id is no longer in the files. Careful: that
// removes records added through /admin too.
// Usage: npm run db:seed   (reads DATABASE_URL from .env)
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import { chapters } from '../src/data/chapters.js';
import { events } from '../src/data/events.js';
import { artists } from '../src/data/artists.js';
import { artForms } from '../src/data/artForms.js';
import { conventions } from '../src/data/conventions.js';
import { team } from '../src/data/team.js';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const prune = process.argv.includes('--prune');

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
for (const statement of schema.split(';').map((s) => s.trim()).filter((s) => s && !s.startsWith('--'))) {
  await sql.query(statement);
}

const datasets = { chapters, events, artists, art_forms: artForms, conventions, team };
for (const [table, rows] of Object.entries(datasets)) {
  for (const row of rows) {
    await sql.query(
      `insert into ${table} (id, data) values ($1, $2)
       on conflict (id) do update set data = excluded.data, updated_at = now()`,
      [row.id, JSON.stringify(row)],
    );
  }
  const removed = prune ? await sql.query(`delete from ${table} where id <> all($1::text[]) returning id`, [rows.map((r) => r.id)]) : [];
  console.log(`${table}: ${rows.length} rows${removed.length ? `, removed ${removed.length} stale` : ''}`);
}
