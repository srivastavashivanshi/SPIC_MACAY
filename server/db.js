import { neon } from '@neondatabase/serverless';

// URL segment → table. Only these tables are reachable through the API.
export const TABLES = {
  chapters: 'chapters',
  events: 'events',
  artists: 'artists',
  'art-forms': 'art_forms',
  conventions: 'conventions',
  team: 'team',
  gallery: 'gallery',
  features: 'features',
};

// Private tables: written by the public forms, readable only by admins.
export const PRIVATE_TABLES = { rsvps: 'rsvps', subscribers: 'subscribers' };

export const dbConfigured = () => Boolean(process.env.DATABASE_URL);
export const getSql = () => neon(process.env.DATABASE_URL);

export async function ensureTable(sql, table) {
  await sql.query(`create table if not exists ${table} (id text primary key, data jsonb not null, updated_at timestamptz default now())`);
}

export async function listRows(sql, table) {
  await ensureTable(sql, table);
  const rows = await sql.query(`select data from ${table} order by id`);
  return rows.map((r) => r.data);
}

export async function upsertRows(sql, table, rows) {
  await ensureTable(sql, table);
  for (const row of rows) {
    await sql.query(
      `insert into ${table} (id, data) values ($1, $2)
       on conflict (id) do update set data = excluded.data, updated_at = now()`,
      [row.id, JSON.stringify(row)],
    );
  }
}

export async function deleteRow(sql, table, id) {
  await ensureTable(sql, table);
  const rows = await sql.query(`delete from ${table} where id = $1 returning data`, [id]);
  return rows[0]?.data ?? null;
}
