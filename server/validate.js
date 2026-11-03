// Cleans admin input into the record shapes the site reads. Unknown fields are dropped.

const str = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Math.max(0, Math.round(Number(v))));
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime = (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
const isUrl = (v) => /^https:\/\/[^\s]+$/.test(v);
export const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 60);

class InvalidInput extends Error {}
export { InvalidInput };
const need = (cond, msg) => {
  if (!cond) throw new InvalidInput(msg);
};

const validators = {
  events(b) {
    const title = str(b.title, 160);
    const date = str(b.date, 10);
    need(title, 'Title is required.');
    need(isDate(date), 'Date must be YYYY-MM-DD.');
    const time = str(b.time, 5);
    need(!time || isTime(time), 'Time must be HH:MM (24-hour).');
    const sourceUrl = str(b.sourceUrl, 400);
    need(!sourceUrl || isUrl(sourceUrl), 'Source link must start with https://');
    return {
      id: str(b.id, 80) || `iiml-${date}-${slugify(title)}`,
      chapterId: str(b.chapterId, 60) || 'iim-lucknow',
      title,
      date,
      time,
      artForm: str(b.artForm, 60),
      type: str(b.type, 60) || 'Programme',
      venue: str(b.venue, 160),
      artist: str(b.artist, 120),
      artistId: str(b.artistId, 80),
      audience: int(b.audience),
      description: str(b.description, 2000),
      sourceUrl,
    };
  },
  artists(b) {
    const name = str(b.name, 120);
    need(name, 'Name is required.');
    need(str(b.artForm, 60), 'Art form is required.');
    const source = str(b.source, 400);
    need(!source || isUrl(source), 'Source link must start with https://');
    const honours = Array.isArray(b.honours) ? b.honours : str(b.honours, 600).split(',');
    return {
      id: str(b.id, 80) || slugify(name),
      name,
      artForm: str(b.artForm, 60),
      instrument: str(b.instrument, 80),
      lineage: str(b.lineage, 120),
      region: str(b.region, 120),
      born: int(b.born),
      died: int(b.died),
      honours: honours.map((h) => str(h, 80)).filter(Boolean).slice(0, 12),
      bio: str(b.bio, 600),
      source,
    };
  },
  team(b) {
    const name = str(b.name, 120);
    need(name, 'Name is required.');
    return { id: str(b.id, 80) || slugify(name), name, role: str(b.role, 120), order: int(b.order) ?? 50 };
  },
  gallery(b) {
    const url = str(b.url, 600);
    need(isUrl(url), 'A photo URL is required.');
    return {
      id: str(b.id, 80) || `photo-${Date.now().toString(36)}`,
      url,
      caption: str(b.caption, 200),
      eventId: str(b.eventId, 80),
      takenOn: isDate(str(b.takenOn, 10)) ? str(b.takenOn, 10) : '',
      width: int(b.width),
      height: int(b.height),
    };
  },
};

// Accepts a YouTube link or id, and confirms the video exists and can be embedded.
async function youtubeFeature(b) {
  const artForm = str(b.artForm ?? b.id, 60);
  need(artForm, 'Pick an art form.');
  const raw = str(b.youtube ?? b.youtubeId, 300);
  const youtubeId = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? (/^[\w-]{11}$/.test(raw) ? raw : '');
  need(youtubeId, 'Paste a YouTube link.');
  const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${youtubeId}`)}`);
  need(res.ok, 'YouTube says that video doesn’t exist or can’t be embedded.');
  const meta = await res.json();
  return { id: artForm, artForm, youtubeId, title: str(meta.title, 200), channel: str(meta.author_name, 120) };
}

export const editable = [...Object.keys(validators), 'features'];
export const validate = async (resource, body) => (resource === 'features' ? youtubeFeature(body ?? {}) : validators[resource](body ?? {}));
