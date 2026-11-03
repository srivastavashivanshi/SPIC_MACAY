import { useState } from 'react';
import { Link } from 'react-router-dom';
import { heritageSites } from '../data/heritage.js';
import { useData } from '../lib/DataContext.jsx';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { formatDate } from '../lib/format.js';
import { EmptyArt, PageHeader } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';
import IndiaMap from '../components/IndiaMap.jsx';

const sites = [...heritageSites].sort((a, b) => a.stop - b.stop);
const bounds = sites.map((s) => [s.lat, s.lng]);

export default function HeritageWalk() {
  const t = useT();
  const local = useLocal();
  const { events } = useData();
  const [selectedId, setSelectedId] = useState('');
  const selected = sites.find((s) => s.id === selectedId);
  const walks = events.filter((e) => e.artForm === 'heritage-walk' || e.type === 'Heritage Walk');

  const points = sites.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: `${s.stop}. ${local.site(s).name}`, radius: 9, color: '#8b1538' }));
  const select = (id) => {
    setSelectedId(id);
    document.getElementById(`site-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <>
      <PageHeader eyebrow={t('heritage.eyebrow')} hindi="लखनऊ" title={t('heritage.title')} art="skyline">
        {t('heritage.lede')}
      </PageHeader>
      <section className="container">
        <div className="conv-layout">
          <div className="conv-map">
            <IndiaMap
              points={points}
              selectedId={selectedId}
              onSelect={select}
              route={bounds.slice(0, 6)}
              focus={selected ? { lat: selected.lat, lng: selected.lng, zoom: 16 } : { bounds }}
              focusKey={selectedId || 'all'}
            />
          </div>
          <ol className="heritage-list">
            {sites.map((s) => {
              const { name, note } = local.site(s);
              return (
                <li key={s.id} id={`site-${s.id}`} className={selectedId === s.id ? 'heritage-stop has-motif active' : 'heritage-stop has-motif'}>
                  <Motif name={s.motif} className="sm" />
                  <button className="heritage-num" onClick={() => setSelectedId(selectedId === s.id ? '' : s.id)} aria-label={`${t('heritage.stop')} ${s.stop}: ${name}`}>
                    {s.stop}
                  </button>
                  <div>
                    <h3>{name}</h3>
                    {s.aka && <p className="muted small">{s.aka}</p>}
                    <p>{note}</p>
                    <p className="heritage-meta">
                      {s.built && (
                        <span>
                          {t('heritage.built')}: {s.built}
                        </span>
                      )}
                      {s.by && (
                        <span>
                          {t('heritage.by')}: {s.by}
                        </span>
                      )}
                    </p>
                    <p className="conv-sources">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noreferrer">
                        {t('heritage.directions')} ↗
                      </a>
                      {' · '}
                      <a href={s.source} target="_blank" rel="noreferrer">
                        {t('common.source')} ↗
                      </a>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="section">
          <div className="section-head">
            <p className="eyebrow">{t('heritage.walks')}</p>
          </div>
          {walks.length ? (
            <ul className="admin-list">
              {walks.map((e) => (
                <li key={e.id}>
                  <span>
                    <Link className="table-link" to={`/programmes/${e.id}`}>
                      {e.title}
                    </Link>
                    <small>
                      {formatDate(e.date)} · {e.venue}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card has-motif">
              <EmptyArt motif="gateway">
                <p>{t('heritage.noWalks')}</p>
              </EmptyArt>
            </div>
          )}
        </div>
        <p className="source-note">Facts from each monument’s Wikipedia article; locations from Wikipedia and OpenStreetMap.</p>
      </section>
    </>
  );
}
