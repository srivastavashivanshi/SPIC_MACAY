import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { Initials, PageHeader } from '../components/ui.jsx';
import { categoryIcon, Motif, motifFor } from '../components/Art.jsx';
import { categories } from '../data/artForms.js';
import { formatDate } from '../lib/format.js';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import GlossaryText from '../components/GlossaryText.jsx';

export default function ArtForms() {
  const { artForms, artists, events, chapters, artFormById } = useData();
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const selected = artFormById[params.get('form')];
  const detailRef = useRef(null);
  const t = useT();
  const local = useLocal();
  const home = chapters.find((c) => c.home);

  useEffect(() => {
    if (selected) detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected]);

  const set = (next) => setParams(next, { replace: true });
  const visible = artForms.filter((f) => !category || f.category === category);

  const formArtists = selected ? artists.filter((a) => a.artForm === selected.id) : [];
  const formEvents = selected ? events.filter((e) => e.artForm === selected.id && e.chapterId === home?.id) : [];
  const SelectedIcon = selected && categoryIcon[selected.category];

  return (
    <>
      <PageHeader eyebrow={t('forms.eyebrow')} hindi="कला" title={t('forms.title')}>
        {t('forms.lede')}
      </PageHeader>

      <section className="container">
        <div className="tabs" role="group" aria-label="Filter by category">
          <button aria-pressed={!category} onClick={() => set({})}>
            {t('common.all')} <span className="tab-count">{artForms.length}</span>
          </button>
          {categories.map((c) => (
            <button key={c.id} aria-pressed={category === c.id} onClick={() => set({ category: c.id })}>
              {local.category(c)} <span className="tab-count">{artForms.filter((f) => f.category === c.id).length}</span>
            </button>
          ))}
        </div>

        {selected && (
          <article className={`form-detail has-motif cat-${selected.category}`} ref={detailRef} aria-labelledby="form-title">
            <Motif name={motifFor(selected.category, 1)} className="lg" />
            <button className="close-btn" onClick={() => set(category ? { category } : {})} aria-label="Close">
              ×
            </button>
            <div className="form-detail-head">
              <span className="form-detail-icon">
                <SelectedIcon size={64} />
              </span>
              <div>
                <p className="eyebrow">
                  {selected.tradition} · {selected.region}
                </p>
                <h2 id="form-title">{local.formName(selected)}</h2>
              </div>
            </div>
            <p className="lede">
              <GlossaryText>{local.formSummary(selected)}</GlossaryText>
            </p>

            <div className="detail-cols">
              <div>
                <h3 className="sub">{t('forms.key')}</h3>
                <ul className="chips">
                  {selected.keyElements.map((k) => (
                    <li key={k}>
                      <GlossaryText>{k}</GlossaryText>
                    </li>
                  ))}
                </ul>
              </div>
              {selected.instruments.length > 0 && (
                <div>
                  <h3 className="sub">{t('forms.instruments')}</h3>
                  <ul className="chips">
                    {selected.instruments.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {formArtists.length > 0 && (
              <>
                <h3 className="sub">{t('forms.artists')}</h3>
                <ul className="mini-artists">
                  {formArtists.map((a) => (
                    <li key={a.id}>
                      <Initials name={a.name} size="sm" />
                      <span>
                        <strong>
                          <Link to={`/artists/${a.id}`}>{a.name}</Link>
                        </strong>
                        <small>{a.instrument}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link className="text-link" to={`/artists?form=${selected.id}`}>
                  {local.formName(selected)}: {t('forms.inExplorer')} →
                </Link>
              </>
            )}

            {home && (
              <>
                <h3 className="sub">
                  {t('forms.at')} {home.name}
                </h3>
                {formEvents.length ? (
                  <>
                    <ul className="mini-events">
                      {formEvents.map((e) => (
                        <li key={e.id}>
                          <span>{formatDate(e.date)}</span> <Link to={`/programmes/${e.id}`}>{e.title}</Link>
                        </li>
                      ))}
                    </ul>
                    <Link className="text-link" to="/dashboard">
                      {t('forms.dashboard')} →
                    </Link>
                  </>
                ) : (
                  <p className="muted">{t('forms.none')}</p>
                )}
              </>
            )}
          </article>
        )}

        <div className="form-grid">
          {visible.map((f, i) => {
            const Icon = categoryIcon[f.category];
            return (
              <button
                key={f.id}
                className={`form-card has-motif cat-${f.category}${selected?.id === f.id ? ' active' : ''}`}
                aria-pressed={selected?.id === f.id}
                onClick={() => set({ ...(category && { category }), form: f.id })}
              >
                <Motif name={motifFor(f.category, i + 2)} className="sm" />
                <span className="form-icon">
                  <Icon size={38} />
                </span>
                <span className="form-cat">{local.category(f.category)}</span>
                <span className="form-name">{local.formName(f)}</span>
                <span className="form-region">{f.region}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
