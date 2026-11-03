import { createHash } from 'node:crypto';

// Shared checks for the public forms (RSVP, sign-up).
export const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const isEmail = (v) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v);
export const isPhone = (v) => /^\+?[0-9 ()-]{8,18}$/.test(v);
export const hashId = (...parts) => createHash('sha256').update(parts.join('|').toLowerCase()).digest('hex').slice(0, 24);

// Bots fill every field; people never see the `website` field.
export const isBot = (body) => Boolean(body?.website);
