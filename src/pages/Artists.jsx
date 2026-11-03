import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { ArtFormTag, EmptyArt, Initials, PageHeader } from '../components/ui.jsx';
import { Motif, motifFor } from '../components/Art.jsx';
import { categories } from '../data/artForms.js';
import { formatDate } from '../lib/format.js';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { artistSlug } from './ArtistDetail.jsx';

const sortName = (name) => name.replace(/^(Pt\.|Ustad|Vidushi|Dr\.|Guru)\s+/, '');

export default function Artists() {
  const { artists, artForms, artFormById, events } = useData();
  const t = useT();
  const local = useLocal();
  // Everyone who has performed at the chapter, including guests not in the explorer.
  const performers = [...new Map(events.filter((e) => e.artist || e.artistId).map((e) => {
    const known = artists.find((a) => a.id === e.artistId);
    const id = known ? known.id : artistSlug(e.artist);
    return [id, { id, name: known?.name ?? e.artist, form: artFormById[e.artForm], date: e.date }];
  })).values()];
  // Filters live in the URL so links like /artists?form=kathak open pre-filtered.
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const form = params.get('form') || '';
  const setFilter = (changes) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  };

  const formsInCategory = artForms.filter(
    (f) => (!category || f.category === category) && artists.some((a) => a.artForm === f.id),
  );
  const categoriesWithArtists = categories.filter((c) => artists.some((a) => artFormById[a.artForm]?.category === c.id));

  const q = query.trim().toLowerCase();
  const visible = artists
    .filter((a) => {
      const f = artFormById[a.artForm];
      if (category && f?.category !== category) return false;
      if (form && a.artForm !== form) return false;
      if (!q) return true;
      return [a.name, a.instrument, a.lineage, a.region, f?.name].some((s) => s?.toLowerCase().includes(q));
    })
    .sort((a, b) => sortName(a.name).localeCompare(sortName(b.name)));

  return (
    <>
      <PageHeader eyebrow={t('nav.artists')} hindi="गुरु · कलाकार" title={t('artists.title')}>
        {t('explore.artists')}
      </PageHeader>

      {performers.length > 0 && (
        <section className="container">
          <div className="performers has-motif">
            <Motif name="gateway" className="tr sm" />
            <h2 className="card-title">{t('artist.performed')}</h2>
            <ul className="performer-list">
              {performers.map((p) => (
                <li key={p.id}>
                  <Link to={`/artists/${p.id}`}>
                    <Initials name={p.name} size="sm" />
                    <span>
                      <strong>{p.name}</strong>
                      <small>
                        {p.form ? local.formName(p.form) : ''} · {formatDate(p.date)}
                      </small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="container">
        <div className="filter-bar">
          <input
            type="search"
            placeholder={t('artists.search')}
            value={query}
            onChange={(e) => setFilter({ q: e.target.value })}
            aria-label="Search artists"
          />
          <select value={category} onChange={(e) => setFilter({ category: e.target.value, form: '' })} aria-label="Filter by category">
            <option value="">{t('artists.allCats')}</option>
            {categoriesWithArtists.map((c) => (
              <option key={c.id} value={c.id}>
                {local.category(c)}
              </option>
            ))}
          </select>
          <select value={form} onChange={(e) => setFilter({ form: e.target.value })} aria-label="Filter by art form">
            <option value="">{t('artists.allForms')}</option>
            {formsInCategory.map((f) => (
              <option key={f.id} value={f.id}>
                {local.formName(f)}
              </option>
            ))}
          </select>
          <span className="result-count" aria-live="polite">
            {visible.length} of {artists.length}
          </span>
        </div>

        <div className="artist-grid">
          {visible.map((a, i) => {
            const performed = events.filter((e) => e.artistId === a.id);
            return (
              <article key={a.id} className="artist-card has-motif">
                <Motif name={motifFor(artFormById[a.artForm]?.category, i)} />
                <header>
                  <Initials name={a.name} />
                  <div>
                    <h3>
                      <Link className="card-link-title" to={`/artists/${a.id}`}>
                        {a.name}
                      </Link>
                    </h3>
                    <p className="artist-sub">
                      {a.instrument}
                      {a.born && (
                        <>
                          {' · '}
                          {a.born}–{a.died ?? 'present'}
                        </>
                      )}
                    </p>
                  </div>
                </header>
                <p className="artist-bio">{local.bio(a)}</p>
                <dl className="facts">
                  <dt>Lineage</dt>
                  <dd>{a.lineage}</dd>
                  <dt>Region</dt>
                  <dd>{a.region}</dd>
                </dl>
                {a.honours.length > 0 && (
                  <ul className="honours">
                    {a.honours.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                {performed.length > 0 && (
                  <p className="performed">
                    At our chapter:{' '}
                    {performed.map((e, j) => (
                      <span key={e.id}>
                        {j > 0 && ', '}
                        <Link to={`/programmes/${e.id}`}>{formatDate(e.date)}</Link>
                      </span>
                    ))}
                  </p>
                )}
                <footer>
                  <ArtFormTag id={a.artForm} />
                  {a.source && (
                    <a className="source-link" href={a.source} target="_blank" rel="noreferrer">
                      Source ↗
                    </a>
                  )}
                </footer>
              </article>
            );
          })}
        </div>
        {!visible.length && (
          <EmptyArt motif="sitar">
            <p>{t('artists.none')}</p>
            <button className="btn btn-maroon" onClick={() => setParams({}, { replace: true })}>
              {t('common.clear')}
            </button>
          </EmptyArt>
        )}
      </section>
    </>
  );
}
