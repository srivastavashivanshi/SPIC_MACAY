import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import IndiaMap from '../components/IndiaMap.jsx';
import { presenceDistricts, presenceStates, presenceSource } from '../data/presence.js';
import { formatDate, formatNumber } from '../lib/format.js';
import { useTitle } from '../lib/useTitle.js';
import { useT } from '../lib/i18n.jsx';
import { Motif } from '../components/Art.jsx';
import { EmptyArt } from '../components/ui.jsx';

// Sequential maroon ramp (light → dark) for programmes per district.
const BINS = [
  { min: 50, color: '#4f0a1f', label: '50+' },
  { min: 20, color: '#8b1538', label: '20–49' },
  { min: 5, color: '#b84a6c', label: '5–19' },
  { min: 1, color: '#dc8aa0', label: '1–4' },
  { min: 0, color: '#efc6cf', label: 'None yet' },
];
const binFor = (programs) => BINS.find((b) => programs >= b.min);

const statesById = Object.fromEntries(presenceStates.map((s) => [s.id, s]));

export default function MapPage() {
  const { chapters } = useData();
  const t = useT();
  useTitle(t('map.eyebrow'));
  const home = chapters.find((c) => c.home);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const stateId = params.get('state') || '';
  const districtId = params.get('district') || '';

  const update = (changes) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  };

  const state = statesById[stateId];
  const lucknow = presenceDistricts.find((d) => d.stateId === 'IN-UP' && d.name.startsWith('Lucknow'));
  const district = presenceDistricts.find((d) => d.id === districtId);
  const stateDistricts = useMemo(
    () => presenceDistricts.filter((d) => d.stateId === stateId).sort((a, b) => b.programs - a.programs || b.institutions - a.institutions),
    [stateId],
  );

  const totals = useMemo(
    () => ({
      states: presenceStates.filter((s) => s.institutions > 0).length,
      institutions: presenceStates.reduce((n, s) => n + s.institutions, 0),
      programs: presenceStates.reduce((n, s) => n + s.programs, 0),
    }),
    [],
  );

  const q = query.trim().toLowerCase();
  const rankedStates = [...presenceStates].sort((a, b) => b.programs - a.programs || b.institutions - a.institutions);
  const maxPrograms = rankedStates[0]?.programs || 1;
  const listStates = rankedStates.filter((s) => !q || s.name.toLowerCase().includes(q));
  const matchedDistricts = q.length > 1 ? presenceDistricts.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 8) : [];

  const points = useMemo(
    () =>
      presenceDistricts.map((d) => ({
        id: d.id,
        lat: d.lat,
        lng: d.lng,
        label: `${d.name}, ${statesById[d.stateId]?.name} · ${formatNumber(d.programs)} programmes`,
        radius: 3 + Math.sqrt(d.institutions) * 1.1,
        color: binFor(d.programs).color,
      })),
    [],
  );

  let focus = null;
  let focusKey = 'india';
  if (district) {
    focus = { lat: district.lat, lng: district.lng, zoom: 8 };
    focusKey = district.id;
  } else if (stateDistricts.length) {
    focus = { bounds: stateDistricts.map((d) => [d.lat, d.lng]), maxZoom: 8 };
    focusKey = stateId;
  } else if (state) {
    focus = undefined; // no pinned districts to zoom to
    focusKey = stateId;
  }

  return (
    <div className="map-layout">
      <aside className="map-panel">
        <div className="map-panel-head has-motif">
          <Motif name="gateway" className="tr" />
          <p className="eyebrow">{t('map.eyebrow')}</p>
          <h1>{t('map.title')}</h1>
          <div className="mini-stats">
            <div>
              <strong>{totals.states}</strong>
              <span>states &amp; UTs</span>
            </div>
            <div>
              <strong>{formatNumber(totals.institutions)}</strong>
              <span>institutions</span>
            </div>
            <div>
              <strong>{formatNumber(totals.programs)}</strong>
              <span>programmes</span>
            </div>
          </div>
          {!state && (
            <input
              type="search"
              placeholder="Search a state or district"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search states and districts"
            />
          )}
        </div>

        <div className="map-panel-body">
          {district ? (
            <div className="map-detail has-motif">
              <Motif name="temple" className="lg" />
              <button className="back-btn" onClick={() => update({ district: '' })}>
                ← {statesById[district.stateId]?.name}
              </button>
              <h2>{district.name}</h2>
              <p className="muted">District · {statesById[district.stateId]?.name}</p>
              <div className="detail-stats">
                <div>
                  <strong>{formatNumber(district.programs)}</strong>
                  <span>programmes</span>
                </div>
                <div>
                  <strong>{formatNumber(district.institutions)}</strong>
                  <span>institutions</span>
                </div>
              </div>
              {district.stateId === 'IN-UP' && district.name.startsWith('Lucknow') && home && (
                <Link to="/dashboard" className="home-callout">
                  Home of the <strong>SPIC MACAY {home.name}</strong> chapter. See our dashboard →
                </Link>
              )}
            </div>
          ) : state ? (
            <div className="map-detail has-motif">
              <Motif name="jaali" className="lg" />
              <button className="back-btn" onClick={() => update({ state: '' })}>
                ← All of India
              </button>
              <h2>{state.name}</h2>
              <div className="detail-stats">
                <div>
                  <strong>{formatNumber(state.programs)}</strong>
                  <span>programmes</span>
                </div>
                <div>
                  <strong>{formatNumber(state.institutions)}</strong>
                  <span>institutions</span>
                </div>
              </div>
              <h3 className="sub">Districts on the map</h3>
              <ul className="rank-list">
                {stateDistricts.map((d) => (
                  <li key={d.id}>
                    <button onClick={() => update({ district: d.id })}>
                      <i className="swatch" style={{ background: binFor(d.programs).color }} />
                      <span className="rank-name">{d.name}</span>
                      <span className="rank-value">{formatNumber(d.programs)}</span>
                    </button>
                  </li>
                ))}
                {!stateDistricts.length && (
                  <li>
                    <EmptyArt motif="lotus">
                      <p>No districts are pinned on the official map for {state.name} yet. The state totals above still count its programmes.</p>
                    </EmptyArt>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <>
              {matchedDistricts.length > 0 && (
                <>
                  <h3 className="sub pad-x">Districts</h3>
                  <ul className="rank-list">
                    {matchedDistricts.map((d) => (
                      <li key={d.id}>
                        <button onClick={() => update({ state: d.stateId, district: d.id })}>
                          <i className="swatch" style={{ background: binFor(d.programs).color }} />
                          <span className="rank-name">
                            {d.name}
                            <small>{statesById[d.stateId]?.name}</small>
                          </span>
                          <span className="rank-value">{formatNumber(d.programs)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <h3 className="sub pad-x">States &amp; UTs by programmes</h3>
              <ul className="rank-list">
                {listStates.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => update({ state: s.id })}>
                      <span className="rank-name">
                        {s.name}
                        <span className="rank-bar">
                          <span style={{ width: `${(s.programs / maxPrograms) * 100}%` }} />
                        </span>
                      </span>
                      <span className="rank-value">{formatNumber(s.programs)}</span>
                    </button>
                  </li>
                ))}
                {!listStates.length && !matchedDistricts.length && (
                  <li>
                    <EmptyArt motif="paisley">
                      <p>Nothing matches “{query}”.</p>
                    </EmptyArt>
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        <div className="map-panel-foot">
          <div className="legend" aria-label="Programmes per district">
            <span className="legend-title">Programmes per district</span>
            {[...BINS].reverse().map((b) => (
              <span key={b.label}>
                <i className="swatch" style={{ background: b.color }} /> {b.label}
              </span>
            ))}
            <span>
              <i className="swatch pin" /> {home?.name}
            </span>
          </div>
          <p className="source-note">
            Dot size shows institutions. Data: <a href={presenceSource.url} target="_blank" rel="noreferrer">spicmacay.org reach map</a>,
            retrieved {formatDate(presenceSource.retrieved)}.
          </p>
        </div>
      </aside>

      <div className="map-wrap">
        <IndiaMap
          points={points}
          home={home && { lat: home.lat, lng: home.lng, label: home.name }}
          selectedId={districtId}
          onSelect={(id) => update({ state: presenceDistricts.find((d) => d.id === id)?.stateId, district: id })}
          onHomeClick={() => lucknow && update({ state: lucknow.stateId, district: lucknow.id })}
          focus={focus}
          focusKey={focusKey}
        />
      </div>
    </div>
  );
}
