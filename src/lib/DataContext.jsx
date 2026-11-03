import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useResource } from './useResource.js';
import { chapters } from '../data/chapters.js';
import { events } from '../data/events.js';
import { artists } from '../data/artists.js';
import { artForms } from '../data/artForms.js';
import { conventions } from '../data/conventions.js';
import { team } from '../data/team.js';

const DataContext = createContext(null);
const noPhotos = []; // photos only ever come from NeonDB
const noFeatures = []; // featured videos are set in /admin

// Rows edited by hand in NeonDB may omit list fields; default them so pages never crash.
const withLists = (rows, keys) => rows.map((r) => Object.fromEntries([...Object.entries(r), ...keys.filter((k) => !Array.isArray(r[k])).map((k) => [k, []])]));

export function DataProvider({ children }) {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(Date.now()), []);
  const c = useResource('chapters', chapters, version);
  const e = useResource('events', events, version);
  const a = useResource('artists', artists, version);
  const f = useResource('art-forms', artForms, version);
  const v = useResource('conventions', conventions, version);
  const t = useResource('team', team, version);
  const g = useResource('gallery', noPhotos, version);
  const fv = useResource('features', noFeatures, version);

  const value = useMemo(() => {
    const artFormById = Object.fromEntries(withLists(f.data, ['keyElements', 'instruments']).map((x) => [x.id, x]));
    const chapterById = Object.fromEntries(c.data.map((x) => [x.id, x]));
    return {
      chapters: c.data,
      events: e.data.filter((x) => x.date).sort((x, y) => y.date.localeCompare(x.date)),
      artists: withLists(a.data, ['honours']),
      artForms: withLists(f.data, ['keyElements', 'instruments']),
      conventions: withLists(v.data, ['highlights', 'sources']).sort((x, y) => y.year - x.year),
      team: [...t.data].sort((x, y) => (x.order ?? 99) - (y.order ?? 99)),
      gallery: [...g.data].sort((x, y) => (y.takenOn || y.id).localeCompare(x.takenOn || x.id)),
      features: fv.data,
      sources: { events: e.source, artists: a.source, team: t.source, gallery: g.source },
      refresh,
      artFormById,
      chapterById,
      fromDatabase: [c, e, a, f, v, t].some((r) => r.source === 'database'),
    };
  }, [c, e, a, f, v, t, g, fv, refresh]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
