import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ragas, swaras, swaraOf, octaveOf } from '../data/ragas.js';
import { useT, useLang } from '../lib/i18n.jsx';
import { audio, playNote, startDrone } from '../lib/audio.js';
import { PageHeader } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';
import { Term } from '../components/GlossaryText.jsx';
import { glossary } from '../data/glossary.js';

// Sa can be pitched to suit a voice; C# is a common male-vocal Sa, G#/A for female voices.
const PITCHES = [
  ['C', 261.63], ['C#', 277.18], ['D', 293.66], ['D#', 311.13], ['E', 329.63], ['F', 349.23], ['F#', 369.99], ['G', 196.0], ['G#', 207.65], ['A', 220.0], ['A#', 233.08], ['B', 246.94],
];
const term = (id) => glossary.find((g) => g.id === id);

function NoteChip({ token, active, lang }) {
  const s = swaraOf(token);
  const oct = octaveOf(token);
  return (
    <span className={active ? 'swara active' : 'swara'} title={s.name}>
      {oct < 1 && <i className="dot below" />}
      {lang === 'hi' ? s.hi : s.name.split(' ')[0]}
      {/[rgdn]/.test(s.id) && <i className="komal" aria-label="komal" />}
      {s.id === 'M#' && <i className="tivra" aria-label="tivra" />}
      {oct > 1 && <i className="dot above" />}
    </span>
  );
}

const isIOS = () => typeof navigator !== 'undefined' && (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export default function Ragas() {
  const t = useT();
  const { lang } = useLang();
  const [params, setParams] = useSearchParams();
  const raga = ragas.find((r) => r.id === params.get('raga')) ?? ragas[0];
  const [pitch, setPitch] = useState('C#');
  const [drone, setDrone] = useState(false);
  const [playing, setPlaying] = useState(null); // { list: 'aroha'|'avaroha', index }
  const stopDrone = useRef(null);
  const timers = useRef([]);
  const sa = Object.fromEntries(PITCHES)[pitch];

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => {
    clearTimers();
    stopDrone.current?.();
  }, []);
  useEffect(() => {
    stopDrone.current?.();
    stopDrone.current = drone ? startDrone(sa) : null;
  }, [drone, sa]);
  useEffect(() => {
    clearTimers();
    setPlaying(null);
  }, [raga.id]);

  const play = (list) => {
    clearTimers();
    const ac = audio();
    const notes = raga[list];
    const step = 0.55;
    const start = ac.currentTime + 0.08;
    notes.forEach((token, i) => {
      playNote(sa * swaraOf(token).ratio * octaveOf(token), start + i * step, step * 0.95);
      timers.current.push(setTimeout(() => setPlaying({ list, index: i }), (i * step + 0.08) * 1000));
    });
    timers.current.push(setTimeout(() => setPlaying(null), (notes.length * step + 0.3) * 1000));
  };

  const used = new Set([...raga.aroha, ...raga.avaroha].map((tk) => swaraOf(tk).id));

  return (
    <>
      <PageHeader eyebrow={t('nav.ragas')} hindi="राग" title={t('ragas.title')}>
        {t('ragas.lede')}
      </PageHeader>
      <section className="container">
        <div className="tabs" role="group" aria-label={t('nav.ragas')}>
          {ragas.map((r) => (
            <button key={r.id} aria-pressed={r.id === raga.id} onClick={() => setParams({ raga: r.id }, { replace: true })}>
              {lang === 'hi' ? r.hi : r.name}
            </button>
          ))}
        </div>

        {isIOS() && <p className="ios-note">{t('audio.ios')}</p>}
        <article className="card raga-card has-motif">
          <Motif name="tanpura" className="lg" />
          <div className="raga-head">
            <div>
              <p className="eyebrow">
                <span>
                  <Term entry={term('thaat')}>Thaat</Term>: {raga.thaat} · {raga.time}
                </span>
              </p>
              <h2>
                {raga.name} <span className="devanagari">{raga.hi}</span>
              </h2>
              <p className="lede">{raga.note}</p>
              <p className="muted">
                {t('ragas.mood')}: {raga.mood}
              </p>
            </div>
            <div className="raga-clock" aria-label={raga.time}>
              <svg viewBox="-60 -60 120 120" width="120" height="120" aria-hidden="true">
                <circle r="52" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
                {Array.from({ length: 24 }, (_, h) => {
                  const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
                  return <line key={h} x1={Math.cos(a) * 46} y1={Math.sin(a) * 46} x2={Math.cos(a) * (h % 6 ? 49 : 42)} y2={Math.sin(a) * (h % 6 ? 49 : 42)} stroke="currentColor" opacity="0.5" />;
                })}
                {(() => {
                  const a = (raga.hour / 24) * Math.PI * 2 - Math.PI / 2;
                  return <circle cx={Math.cos(a) * 46} cy={Math.sin(a) * 46} r="7" fill="var(--red)" stroke="var(--yellow)" strokeWidth="2.5" />;
                })()}
                <text y="-22" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">0:00</text>
                <text y="30" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">12:00</text>
              </svg>
              <small>{t('ragas.when')}</small>
            </div>
          </div>

          <div className="swara-row" aria-label="Notes used">
            {swaras.map((s) => (
              <span key={s.id} className={used.has(s.id) ? 'swara-key on' : 'swara-key'} title={s.name}>
                {lang === 'hi' ? s.hi : s.name.split(' ')[0]}
                {/[rgdn]/.test(s.id) && <i className="komal" />}
                {s.id === 'M#' && <i className="tivra" />}
              </span>
            ))}
          </div>

          {['aroha', 'avaroha'].map((list) => (
            <div key={list} className="scale-line">
              <button className="btn btn-maroon" onClick={() => play(list)}>
                ▶ <Term entry={term(list)}>{list === 'aroha' ? 'Aroha' : 'Avaroha'}</Term>
              </button>
              <div className="scale-notes">
                {raga[list].map((tk, i) => (
                  <NoteChip key={`${tk}-${i}`} token={tk} lang={lang} active={playing?.list === list && playing.index === i} />
                ))}
              </div>
            </div>
          ))}

          <dl className="raga-facts">
            <dt>
              <Term entry={term('vadi')}>Vadi</Term>
            </dt>
            <dd>
              <NoteChip token={raga.vadi} lang={lang} />
            </dd>
            <dt>
              <Term entry={term('samvadi')}>Samvadi</Term>
            </dt>
            <dd>
              <NoteChip token={raga.samvadi} lang={lang} />
            </dd>
          </dl>

          <div className="raga-controls">
            <label className="inline-label">
              Sa
              <select value={pitch} onChange={(e) => setPitch(e.target.value)}>
                {PITCHES.map(([p]) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <button className={drone ? 'btn btn-gold' : 'btn btn-outline'} aria-pressed={drone} onClick={() => setDrone((d) => !d)}>
              {drone ? t('ragas.droneOff') : t('ragas.droneOn')}
            </button>
            <a className="text-link" href={`https://www.youtube.com/@spicmacay/search?query=${encodeURIComponent(`raga ${raga.name}`)}`} target="_blank" rel="noreferrer">
              {t('ragas.hear')} ↗
            </a>
            <a className="source-link" href={raga.source} target="_blank" rel="noreferrer">
              {t('common.source')} ↗
            </a>
          </div>
        </article>
        <p className="source-note">{t('ragas.caveat')}</p>
      </section>
    </>
  );
}
