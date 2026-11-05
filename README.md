# SPIC MACAY Explorer — IIM Lucknow Chapter

An interactive website about SPIC MACAY (Society for the Promotion of Indian Classical Music And Culture Amongst Youth), built for the SPIC MACAY IIM Lucknow chapter.

Ideated and created by **Shivanshi Srivastava**.

**Running the site?** See **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)**: one-time setup in Vercel (database, photo storage, passwords), signing in, uploading photos, editing content and giving volunteers access.

The design follows SPIC MACAY's visual identity. The maroon, logo red, logo yellow and gold come from spicmacay.org and the official logo, and the type is Cormorant Garamond, the serif spicmacay.org uses. The illustrations (Warli-style musicians and dancers, mandalas, a toran border, instrument icons) are hand-drawn SVG in `src/components/Art.jsx`.

## Features

| Page | Route | What it does |
| --- | --- | --- |
| Home | `/` | Introduction, key numbers and links to each section |
| Reach Map | `/map` | Zoomable map of SPIC MACAY's official reach across 36 states/UTs and about 400 districts. Click a state to zoom in, and a district for its programme and institution counts |
| Artist Explorer | `/artists` | Search and filter artists by category, art form, gharana and region |
| Art Form Guide | `/art-forms` | Music, dance, folk, crafts and other programmes: key elements, instruments, artists, and the chapters where each was presented |
| Conventions | `/conventions` | All 11 International Conventions (2013–2026) on a map and timeline, each with sources, plus the daily schedule |
| IIM Lucknow Dashboard | `/dashboard` | Chapter statistics, charts by art form, format and month, upcoming programmes, team, and a searchable programme log |
| Programme pages | `/programmes/:id` | One shareable page per programme: date, venue, artist, art form, photos, **Add to Google Calendar**, **.ics download**, and a link to spicmacay.org when imported |
| Gallery | `/gallery` | Photos from chapter programmes (stored in Vercel Blob), filterable by programme, with a full-screen viewer |
| Artist pages | `/artists/:id` | Bio, honours, guru lineage, programmes at IIM Lucknow, SPIC MACAY appearances found on spicmacay.org, and a YouTube link. Guests who performed at the chapter get a page too |
| Glossary | `/glossary` | 35 terms (raga, tala, abhinaya…). The same terms are dotted-underlined across the site, with a definition on hover or tap |
| Gharana tree | `/lineages` | Interactive guru–shishya trees for 16 lineages, each link sourced |
| Heritage walk | `/heritage-walk` | Eight Lucknow monuments in walking order on a map, with notes, directions and the chapter's heritage-walk programmes |
| Raga explorer | `/ragas` | Eight ragas (Yaman, Bhairav, Malkauns…) with thaat, traditional hour, mood, vadi/samvadi, and their ascending/descending scales played in the browser over an optional tanpura drone. Pitch of Sa is adjustable. Facts follow each raga's Wikipedia article |
| Tala player | `/talas` | Six talas (Teentaal, Ektaal, Jhaptaal, Rupak, Keherwa, Dadra) on a beat dial with sam and khali marked, the theka in its vibhags, and synthesised tabla at any tempo |
| Instruments | `/instruments` | Eight instruments (sitar, sarod, tabla, Saraswati veena, bansuri, tanpura, mridangam, shehnai) drawn in the site's style, with numbered, labelled parts |
| Concert primer | `/programmes/:id/primer` | A printable one-page guide for each programme: the art form, what to listen for, words you may hear, and concert etiquette |
| Quiz | `/quiz` | "Which art form are you?": six questions, a shareable result linked to the art form guide |
| Volunteer admin | `/admin` | Password-protected: add, edit and delete programmes, artists and team; upload photos; import programmes from spicmacay.org |

Also on the site: an **art form of the week** on the home page (with a performance video volunteers can pin), an **"I'll attend" RSVP** on upcoming programmes, a **newsletter/WhatsApp sign-up**, a **downloadable programme poster**, a **Hindi/English** switch, a **light/dark/device** theme switch, and India's **official Survey of India boundary** drawn on every map.

Selections are stored in the URL, so a link like `/map?state=IN-UP` or `/art-forms?form=odissi` can be shared.

## Tech stack

- **React 18 + Vite**: frontend
- **React Router**: page routing
- **Leaflet / react-leaflet**: zoomable map, using OpenStreetMap tiles (no API key). Set `VITE_TILE_URL` to switch providers (see `.env.example`)
- **Vercel Serverless Functions** (`/api`): optional backend
- **NeonDB (Postgres)**: database for anything edited through `/admin`
- **Vercel Blob**: photo storage for the gallery

## Run locally

```bash
npm install
npm run dev               # http://localhost:5173 (also runs the /api functions, reading .env)
npm run build             # production build in dist/
npm run import:spicmacay  # refresh programmes from spicmacay.org into src/data/importedEvents.js
npm run import:appearances  # refresh each artist's SPIC MACAY appearances into src/data/appearances.js
```

## Environment variables

None are needed for a read-only site. Each one switches on a feature:

| Key | Enables | Where to get it |
| --- | --- | --- |
| `DATABASE_URL` | Editing through `/admin`, and live data | Neon console → Connection Details |
| `ADMIN_PASSWORD` | Volunteer sign-in at `/admin` | Choose a strong password and share it with chapter volunteers |
| `ADMIN_SESSION_SECRET` | Signing sign-in sessions | 32+ random characters, e.g. `openssl rand -base64 48` |
| `BLOB_READ_WRITE_TOKEN` | Photo uploads | Vercel → Storage → create a Blob store → connect it to the project (Vercel adds the key) |
| `VITE_WHATSAPP_URL` | A "join our WhatsApp channel" link beside the sign-up form | Optional |
| `VITE_TILE_URL`, `VITE_TILE_ATTRIBUTION` | A different map tile provider | Optional; see `.env.example` |

Add them in Vercel → Project → Settings → Environment Variables, then redeploy. For local development, put them in `.env` (copy `.env.example`).

## Volunteer workflow

1. Open `/admin` (also linked as "Volunteer login" in the footer) and sign in.
2. **Import**: pull programmes listed on spicmacay.org. Re-running it updates them and keeps any time, attendance, artist link or description added in the admin.
3. **Programmes**: add programmes spicmacay.org doesn't list, and fill in start times and attendance. The dashboard charts and calendar buttons use these.
4. **Photos**: upload pictures and tag them with a programme. Large photos are resized before upload.
5. **Artists / Team**: the first time, click **Copy into database** so edits start from the built-in list.
6. **RSVPs / Subscribers**: see who plans to attend and who signed up; download CSV; remove people who ask to be removed.
7. **Featured video**: pin a YouTube performance to an art form. It plays on the home page in that art form's week. Links are checked with YouTube before saving.

8. **Access** (owners only): give a person their own admin login. Enter their email and role, then send them the one-time invitation link, which is valid for 7 days, by email or WhatsApp. They set their own password and sign in with email + password. **Admins** can edit everything except access; **owners** can also invite, reset and remove people. Removing someone or resetting their password signs them out immediately. Personal accounts need `DATABASE_URL`; passwords are stored as scrypt hashes in the private `admins` table, which the public API never serves.

You can also create an invitation from your computer, without signing in: put the live site's `DATABASE_URL` in `.env` and run

```bash
npm run admin:invite -- name@iiml.ac.in --site https://your-site.vercel.app        # admin
npm run admin:invite -- name@iiml.ac.in --role owner --site https://your-site.vercel.app
```

It prints the one-time link to send.

Uploaded photos appear in a carousel on the home page (newest first, up to 10), in the Gallery, and on the programme they're tagged with. Programme, artist and team edits show up across the site straight away.

The chapter password (`ADMIN_PASSWORD`) always signs in as an owner, so keep it for a small number of people and give everyone else a personal account.

Sessions last 12 hours, in an HttpOnly, SameSite=Strict cookie. Every write is checked on the server, and input is validated and cleaned before it's stored.

## Where the data lives

All content is stored in plain files in `src/data/`. Edit these files, and the site updates:

| File | Contents | Status |
| --- | --- | --- |
| `presence.js` | Reach map (states and districts) | **Official.** Extracted from [spicmacay.org/our-presence](https://spicmacay.org/our-presence) on 30 Oct 2026. State totals are complete; the district list includes only districts pinned on that map |
| `conventions.js` | International Conventions 2013–2026 | **Verified.** Each entry lists its sources (host institutes, PMO, IGNCA, news). The daily schedule and facts come from spicmacay.org |
| `about.js` | Milestones and mission | **Official.** From [spicmacay.org/about/story](https://spicmacay.org/about/story) |
| `artists.js` | Artist explorer | **Verified.** Each artist links to their Wikipedia article (`source`). Years and honours were cross-checked on 30 Oct 2026 |
| `artForms.js` | Art form guide | General reference content |
| `chapters.js` | This site's chapter (IIM Lucknow) | Real |
| `importedEvents.js` | IIM Lucknow programmes from spicmacay.org | **Official.** Generated by `npm run import:spicmacay`. As of 30 Oct 2026, spicmacay.org lists 3, all at the IIM Lucknow Noida campus |
| `events.js` | Combines imported programmes with `manualEvents` | Add programmes here, or through `/admin` |
| `team.js` | Chapter team on the dashboard | Add the chapter's volunteers (`order` sets display order) |
| `appearances.js` | Each artist's programmes on spicmacay.org | **Official.** Generated by `npm run import:appearances` |
| `lineages.js` | Guru–shishya trees | **Verified.** Every link confirmed in the student's Wikipedia article, 31 Oct 2026 |
| `heritage.js` | Lucknow heritage walk | **Verified.** Facts from Wikipedia; coordinates from Wikipedia and OpenStreetMap |
| `glossary.js`, `quiz.js` | Glossary terms; quiz questions | Written for this site |
| `ragas.js` | Raga explorer | **Verified.** Thaat, time, scales and vadi/samvadi from each raga's Wikipedia article, 31 Oct 2026 |
| `talas.js` | Tala player | Standard thekas as commonly taught |
| `instruments.js` | Instrument guide | Part names and descriptions written for this site |
| `concert.js` | Primer: what to listen for, etiquette (English and Hindi) | Written for this site |
| `hi.js` | Hindi translations of content (art forms, bios, milestones, walk notes) | Translated for this site; interface text lives in `src/lib/i18n.jsx` |
| `public/india-boundary.geojson` | India's official outline on the maps | Survey of India boundary via [DataMeet](https://github.com/datameet/maps) (CC BY 4.0), simplified |

Corrections made during the fact check: Kishori Amonkar's birth year is 1931, not 1932. Birju Maharaj was born in Handia, though he represents the Lucknow gharana. Bhimsen Joshi's Bharat Ratna is dated 2009, the year it was conferred. Vishwa Mohan Bhatt's birth year was removed because it has no citation.

## Using NeonDB (optional)

The site works with no database. To manage data in NeonDB:

1. Create a project at [neon.tech](https://neon.tech) and copy the connection string.
2. `cp .env.example .env` and paste the string as `DATABASE_URL`.
3. `npm run db:seed`: this creates the tables (`db/schema.sql`) and upserts everything in `src/data/`, including the team. Add `-- --prune` to also delete rows that are no longer in the files. Careful: that also removes records added through `/admin`.
4. In Vercel → Project → Settings → Environment Variables, add `DATABASE_URL`.

When `/api/<resource>` returns data, the site uses it instead of the bundled files, one dataset at a time. The footer shows "Chapter data: NeonDB".

Each table stores records as JSON in the same shape as `src/data/*.js`. You can edit rows in the Neon SQL editor, or edit the files and run `npm run db:seed` again.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repository. The Vite preset is detected automatically.
3. Click **Deploy**. `vercel.json` already routes all page URLs to the React app, while `/api/*` goes to the serverless function.

## Project structure

```
api/[resource].js      Public read-only API → NeonDB
api/admin/             Sign-in, record editing, import, seed and photo-upload endpoints
server/                Shared server code: auth, database, validation, spicmacay.org importer
db/schema.sql          Database tables
scripts/seed.mjs       Loads src/data into NeonDB
scripts/import-spicmacay.mjs  Refreshes src/data/importedEvents.js from spicmacay.org
src/
  data/                Content files (edit these)
  lib/                 Data loading (bundled → NeonDB) and formatting
  components/          Layout, map, charts, small UI pieces
  pages/               One file per page
  styles.css           Theme (light & dark) and layout
```

## Ideas for later

- A scheduled Vercel cron job that runs the spicmacay.org imports nightly
- Hindi for the volunteer admin page (it is English-only today)

## Note on the map

The base map uses OpenStreetMap's standard tiles, which are free for light use under the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/). If traffic grows, switch to a keyed provider with `VITE_TILE_URL`. Their international boundaries may not match India's official map, so every map also draws India's official boundary (Survey of India, via DataMeet, CC BY 4.0) on top.
