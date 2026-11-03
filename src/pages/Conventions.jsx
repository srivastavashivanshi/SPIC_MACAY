import { useState } from 'react';
import { useData } from '../lib/DataContext.jsx';
import IndiaMap from '../components/IndiaMap.jsx';
import { PageHeader } from '../components/ui.jsx';
import { Diya, Motif } from '../components/Art.jsx';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import GlossaryText from '../components/GlossaryText.jsx';

const factMotifs = ['gateway', 'sitar', 'temple'];
const dayMotifs = ['lotus', 'matka', 'diya', 'tanpura', 'tabla'];
const conventionMotifs = ['gateway', 'temple', 'jaali', 'peacock', 'paisley'];
import { conventionDay, conventionFacts, conventionFactsSource } from '../data/conventions.js';

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function Conventions() {
  const { conventions } = useData();
  const [selectedId, setSelectedId] = useState('');
  const t = useT();
  const local = useLocal();
  const selected = conventions.find((c) => c.id === selectedId);

  // Group editions that share a campus into one map pin.
  const venues = {};
  for (const c of conventions) {
    const key = `${c.lat},${c.lng}`;
    (venues[key] ||= { ...c, years: [] }).years.push(c.year);
  }
  const points = Object.values(venues).map((v) => ({
    id: v.id,
    lat: v.lat,
    lng: v.lng,
    label: `${v.host} · ${v.years.sort().join(', ')}`,
    radius: 7 + v.years.length * 2,
    color: '#8b1538',
  }));
  const pinFor = (c) => Object.values(venues).find((v) => v.lat === c.lat && v.lng === c.lng)?.id;

  const select = (id) => {
    setSelectedId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <>
      <PageHeader eyebrow={t('conv.eyebrow')} hindi="संगम" title={t('conv.title')}>
        {t('conv.lede')}
      </PageHeader>

      <section className="container">
        <div className="fact-row">
          {conventionFacts.map((f, i) => (
            <div key={f.label} className="fact has-motif">
              <Motif name={factMotifs[i % factMotifs.length]} className="sm" />
              <strong>{f.value}</strong>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
        <p className="source-note center">
          Source: <a href={conventionFactsSource} target="_blank" rel="noreferrer">spicmacay.org</a>
        </p>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">{t('conv.rhythm')}</p>
          <h2>{t('conv.day')}</h2>
        </div>
        <ol className="day-timeline">
          {conventionDay.map((d, i) => (
            <li key={d.title} className="has-motif">
              <Motif name={dayMotifs[i % dayMotifs.length]} className="sm" />
              <span className="day-time">{d.time}</span>
              <strong>{local.day(d).title}</strong>
              <p>
                <GlossaryText>{local.day(d).text}</GlossaryText>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">2013 – {conventions[0]?.year}</p>
          <h2>{t('conv.every')}</h2>
        </div>
        <div className="conv-layout">
          <div className="conv-map">
            <IndiaMap
              points={points}
              selectedId={selected && pinFor(selected)}
              onSelect={select}
              focus={selected ? { lat: selected.lat, lng: selected.lng, zoom: 6 } : null}
              focusKey={selectedId}
            />
          </div>
          <ol className="conv-list">
            {conventions.map((c, i) => (
              <li key={c.id} id={c.id} className={selectedId === c.id ? 'conv-item active' : 'conv-item'}>
                <button className="conv-marker" onClick={() => setSelectedId(selectedId === c.id ? '' : c.id)} aria-label={`Show ${c.year} on map`}>
                  <Diya size={26} />
                </button>
                <div className="conv-body has-motif">
                  <Motif name={conventionMotifs[i % conventionMotifs.length]} className="sm" />
                  <p className="conv-meta">
                    <span className="conv-year">{c.year}</span>
                    <span className="conv-edition">{ordinal(c.edition)} {t('conv.edition')}</span>
                  </p>
                  <h3>{c.host}</h3>
                  <p className="muted">
                    {c.city}, {c.state} · {c.dates}
                  </p>
                  {c.highlights.length > 0 && (
                    <ul className="highlights">
                      {c.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <p className="conv-sources">
                    {c.sources.map((s, i) => (
                      <span key={s.url}>
                        {i > 0 && ' · '}
                        <a href={s.url} target="_blank" rel="noreferrer">
                          {s.label} ↗
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="source-note">The 2023 convention was reported as the first since 2019.</p>
      </section>
    </>
  );
}
