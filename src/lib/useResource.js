import { useEffect, useState } from 'react';

// Returns bundled data immediately, then swaps in NeonDB data from /api/<name>
// if the API is configured. Without a database the bundled data stays in place.
// Changing `version` refetches, skipping the CDN cache (used after admin edits).
export function useResource(name, bundled, version = 0) {
  const [state, setState] = useState({ data: bundled, source: 'bundled' });

  useEffect(() => {
    let alive = true;
    fetch(version ? `/api/${name}?v=${version}` : `/api/${name}`, version ? { cache: 'no-store' } : undefined)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows) => {
        if (!alive || !Array.isArray(rows)) return;
        setState(rows.length ? { data: rows, source: 'database' } : { data: bundled, source: 'bundled' });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [name, bundled, version]);

  return state;
}
