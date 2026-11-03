import { existsSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Runs the Vercel functions in /api during `npm run dev`, with the same req.query,
// req.body and res.status().json() helpers Vercel provides, so the admin page,
// NeonDB and photo uploads work locally without the Vercel CLI.
function vercelApiInDev() {
  const resolveRoute = (pathname) => {
    const parts = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
    const dir = parts.slice(0, -1).join('/');
    const last = parts.at(-1);
    const base = `api${dir ? `/${dir}` : ''}`;
    if (last && existsSync(`${base}/${last}.js`)) return { file: `/${base}/${last}.js`, params: {} };
    if (last && existsSync(`${base}/[resource].js`)) return { file: `/${base}/[resource].js`, params: { resource: last } };
    return null;
  };

  const readBody = (req) =>
    new Promise((resolve) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        try {
          resolve(raw ? JSON.parse(raw) : undefined);
        } catch {
          resolve(raw);
        }
      });
    });

  return {
    name: 'vercel-api-in-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.startsWith('/api/')) return next();
        const route = resolveRoute(url.pathname);
        if (!route) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Not found' }));
        }
        req.query = { ...Object.fromEntries(url.searchParams), ...route.params };
        req.body = await readBody(req);
        res.status = (code) => ((res.statusCode = code), res);
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        try {
          const { default: handler } = await server.ssrLoadModule(route.file);
          await handler(req, res);
        } catch (err) {
          console.error(err);
          if (!res.headersSent) res.status(500).json({ error: err.message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make .env values (DATABASE_URL, ADMIN_*, BLOB_*) visible to the API functions in dev.
  for (const [k, v] of Object.entries(loadEnv(mode, process.cwd(), ''))) process.env[k] ??= v;
  return { plugins: [react(), vercelApiInDev()] };
});
