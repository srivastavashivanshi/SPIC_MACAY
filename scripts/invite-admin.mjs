// Creates (or resets) a personal admin account and prints its one-time invitation link.
// Usage: npm run admin:invite -- <email> [--role admin|owner] [--site https://your-site.vercel.app]
// Reads DATABASE_URL from .env. The link works for 7 days; send it to the person yourself.
import { inviteAccount, isEmail, normaliseEmail } from '../server/auth.js';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const flagValues = new Set([flag('role'), flag('site')]);
const email = normaliseEmail(args.find((a) => !a.startsWith('--') && !flagValues.has(a)));
const role = flag('role') === 'owner' ? 'owner' : 'admin';
const site = (flag('site') || process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

if (!isEmail(email)) {
  console.error('Usage: npm run admin:invite -- <email> [--role admin|owner] [--site https://your-site.vercel.app]');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env (the same Neon database the live site uses).');
  process.exit(1);
}

const token = await inviteAccount(email, role, 'command line');
console.log(`\nInvitation for ${email} (${role}), valid for 7 days:\n`);
console.log(`${site}/admin?invite=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}\n`);
console.log('Send this link to them. They open it, choose a password, then sign in at /admin with their email.');
