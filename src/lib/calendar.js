// Calendar links for a programme. Programmes without a time are all-day events;
// timed ones are read as India Standard Time (UTC+5:30, no daylight saving).

const DEFAULT_HOURS = 2;
const pad = (n) => String(n).padStart(2, '0');
const compact = (iso) => iso.replaceAll('-', '');

const nextDay = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

// "2026-11-14" + "18:30" (IST) → "20261114T130000Z"
const istToUtc = (iso, time, addHours = 0) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMinutes(h * 60 + m - 330 + addHours * 60);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
};

const range = (e) =>
  e.time
    ? { start: istToUtc(e.date, e.time), end: istToUtc(e.date, e.time, DEFAULT_HOURS), allDay: false }
    : { start: compact(e.date), end: compact(nextDay(e.date)), allDay: true };

const details = (e, url) => [e.artist && `With ${e.artist}`, e.description, `SPIC MACAY IIM Lucknow · ${url}`].filter(Boolean).join('\n\n');

export function googleCalendarUrl(e, url) {
  const { start, end } = range(e);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${e.title} · SPIC MACAY`,
    dates: `${start}/${end}`,
    details: details(e, url),
    location: e.venue || '',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

const escapeIcs = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => `\\${c}`);

export function icsFile(e, url) {
  const { start, end, allDay } = range(e);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SPIC MACAY IIM Lucknow//Programmes//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.id}@spicmacay-iiml`,
    `DTSTAMP:${stamp}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${escapeIcs(`${e.title} · SPIC MACAY`)}`,
    `DESCRIPTION:${escapeIcs(details(e, url))}`,
    e.venue && `LOCATION:${escapeIcs(e.venue)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
}

export function downloadIcs(e, url) {
  const href = URL.createObjectURL(icsFile(e, url));
  const a = Object.assign(document.createElement('a'), { href, download: `${e.id}.ics` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
