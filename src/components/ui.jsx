import { Link } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { LucknowSkyline, Mandala, Motif } from './Art.jsx';
import { useTitle } from '../lib/useTitle.js';

// art: 'mandala' (default) or 'skyline' (Lucknow's skyline along the bottom).
export function PageHeader({ eyebrow, title, hindi, art = 'mandala', children }) {
  useTitle(title);
  return (
    <section className="page-header">
      <Mandala className="page-header-mandala" size={420} />
      {art === 'skyline' && <LucknowSkyline className="skyline" />}
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {hindi && (
          <p className="page-hindi devanagari" lang="hi">
            {hindi}
          </p>
        )}
        <h1>{title}</h1>
        {children && <p className="lede">{children}</p>}
      </div>
    </section>
  );
}

export function SampleNote({ children }) {
  return (
    <div className="sample-note" role="note">
      <strong>Sample data</strong>
      <span>{children}</span>
    </div>
  );
}

export function Stat({ value, label, hint, motif }) {
  return (
    <div className={motif ? 'stat has-motif' : 'stat'}>
      {motif && <Motif name={motif} className="sm" />}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

export function ArtFormTag({ id }) {
  const { artFormById } = useData();
  const form = artFormById[id];
  if (!form) return null;
  return (
    <Link className={`tag tag-${form.category}`} to={`/art-forms?form=${id}`}>
      {form.name}
    </Link>
  );
}

export function Initials({ name, size }) {
  const letters = name
    .replace(/^(Pt\.|Ustad|Vidushi|Dr\.|Guru)\s+/, '')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span className={size === 'sm' ? 'initials sm' : 'initials'} aria-hidden="true">
      {letters}
    </span>
  );
}

// An empty state that still carries a drawing.
export function EmptyArt({ motif = 'diya', children }) {
  return (
    <div className="empty-art">
      <Motif name={motif} className="inline" />
      {children}
    </div>
  );
}
