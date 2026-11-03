import { useMemo } from 'react';
import { useLang } from './i18n.jsx';
import { hi } from '../data/hi.js';
import { categories } from '../data/artForms.js';

// Content in the reader's language, falling back to English.
export function useLocal() {
  const { lang } = useLang();
  return useMemo(() => {
    const h = lang === 'hi';
    return {
      formName: (f) => (h && hi.artForms[f?.id]?.name) || f?.name || '',
      formSummary: (f) => (h && hi.artForms[f?.id]?.summary) || f?.summary || '',
      category: (c) => {
        const id = typeof c === 'string' ? c : c?.id;
        return (h && hi.categories[id]) || categories.find((x) => x.id === id)?.label || '';
      },
      bio: (a) => (h && hi.artists[a?.id]) || a?.bio || '',
      milestone: (m) => (h && hi.milestones[m.year]) || m.text,
      mission: (text) => (h && hi.mission) || text,
      day: (d) => (h && hi.conventionDay[d.title]) || d,
      site: (s) => ({ name: (h && hi.heritage[s.id]?.name) || s.name, note: (h && hi.heritage[s.id]?.note) || s.note }),
    };
  }, [lang]);
}
