// IIM Lucknow chapter programmes.
// - importedEvents: pulled from spicmacay.org by `npm run import:spicmacay` (don't edit by hand).
// - manualEvents: anything spicmacay.org doesn't list. Add them here, or through /admin once NeonDB is set up.
// Fields: id, chapterId, title, date (YYYY-MM-DD), time (HH:MM, optional), artForm (id from artForms.js),
// type, venue, artist (name), artistId (optional id from artists.js), audience (number or null),
// description, sourceUrl.
import { importedEvents } from './importedEvents.js';

const manualEvents = [];

export const events = [...importedEvents, ...manualEvents];

export const eventTypes = ['Lecture-Demonstration', 'Baithak', 'Workshop', 'Intensive', 'Heritage Walk', 'Screening', 'Talk', 'Programme'];
