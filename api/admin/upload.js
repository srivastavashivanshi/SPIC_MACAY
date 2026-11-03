import { handleUpload } from '@vercel/blob/client';
import { isAdmin } from '../../server/auth.js';

// Issues short-lived upload tokens so the admin page can send photos straight to Vercel Blob.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Photo storage is not set up. Connect a Vercel Blob store.' });

  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin(req))) throw new Error('Please sign in again.');
        if (!pathname.startsWith('gallery/')) throw new Error('Uploads must go to the gallery folder.');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return res.status(200).json(json);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
