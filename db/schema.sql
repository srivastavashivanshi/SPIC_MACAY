-- Each record is stored as a JSON document in the same shape as src/data/*.js,
-- so the frontend works identically with bundled data or NeonDB.
create table if not exists chapters    (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists events      (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists artists     (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists art_forms   (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists conventions (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists team        (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists gallery     (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists features    (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists rsvps       (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists subscribers (id text primary key, data jsonb not null, updated_at timestamptz default now());
-- Personal admin accounts (private; never served by the public API).
create table if not exists admins      (id text primary key, data jsonb not null, updated_at timestamptz default now());
