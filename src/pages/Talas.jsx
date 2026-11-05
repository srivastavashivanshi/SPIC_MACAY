import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { talas } from '../data/talas.js';
import { glossary } from '../data/glossary.js';
import { useT, useLang } from '../lib/i18n.jsx';
import { audio, playBol } from '../lib/audio.js';
import { PageHeader } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';
import GlossaryText, { Term } from '../components/GlossaryText.jsx';

const term = (id) => glossary.find((g) => g.id === id);

// Which vibhag mark (X, 0, 2…) starts at each beat, if any.
function marksByBeat(tala) {
  const m = {};
  let beat = 0;
  tala.vibhags.forEach((len, i) => {
    m[beat] = tala.marks[i];
    beat += len;
  });
  return m;
}

const isIOS = () => typeof navigator !== 'undefined' && (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export default function Talas() {
  const t = useT();
  const { lang } = useLang();
  const [params, setParams] = useSearchParams();
  const tala = talas.find((x) => x.id === params.get('tala')) ?? talas[0];
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const sched = useRef({ timer: null, next: 0, i: 0, ui: [] });
  const marks = marksByBeat(tala);

  const stop = () => {
    clearInterval(sched.current.timer);
    sched.current.ui.forEach(clearTimeout);
    sched.current = { timer: null, next: 0, i: 0, ui: [] };
    setPlaying(false);
    setBeat(-1);
  };

  // Look-ahead scheduler: queue strokes ~0.2s ahead so timing stays steady.
  useEffect(() => {
    if (!playing) return undefined;
    const ac = audio();
    const s = sched.current;
    s.next = ac.currentTime + 0.1;
    s.i = 0;
    s.timer = setInterval(() => {
      const len = 60 / bpm;
      while (s.next < ac.currentTime + 0.2) {
        const i = s.i % tala.beats;
        playBol(tala.theka[i], s.next, len, i === 0);
        s.ui.push(setTimeout(() => setBeat(i), Math.max(0, (s.next - ac.currentTime) * 1000)));
        if (s.ui.length > 64) s.ui.splice(0, 32);
        s.next += len;
        s.i += 1;
      }
    }, 25);
    return () => {
      clearInterval(s.timer);
      s.ui.forEach(clearTimeout);
      s.ui = [];
    };
  }, [playing, bpm, tala]);

  useEffect(() => stop, []);
  useEffect(() => {
    setBeat(-1);
  }, [tala.id]);

  const R = 110;
  return (
    <>
      <PageHeader eyebrow={t('nav.talas')} hindi="ताल" title={t('talas.title')}>
        {t('talas.lede')}
      </PageHeader>
      <section className="container">
        <div className="tabs" role="group" aria-label={t('nav.talas')}>
          {talas.map((x) => (
            <button key={x.id} aria-pressed={x.id === tala.id} onClick={() => setParams({ tala: x.id }, { replace: true })}>
              {lang === 'hi' ? x.hi : x.name} <span className="tab-count">{x.beats}</span>
            </button>
          ))}
        </div>

        {isIOS() && <p className="ios-note">{t('audio.ios')}</p>}
        <article className="card tala-card has-motif">
          <Motif name="tabla" className="lg" />
          <div className="tala-layout">
            <div className="tala-wheel">
              <svg viewBox="-140 -140 280 280" aria-label={`${tala.name}, ${tala.beats} beats`}>
                <circle r={R} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                {tala.theka.map((bol, i) => {
                  const a = (i / tala.beats) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(a) * R;
                  const y = Math.sin(a) * R;
                  const mark = marks[i];
                  const active = i === beat;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={active ? 17 : 13} className={`beat${active ? ' on' : ''}${i === 0 ? ' sam' : ''}${mark === '0' ? ' khali' : ''}`} />
                      <text x={x} y={y + 4} textAnchor="middle" className="beat-num">
                        {i + 1}
                      </text>
                      {mark && (
                        <text x={Math.cos(a) * (R + 26)} y={Math.sin(a) * (R + 26) + 5} textAnchor="middle" className="beat-mark">
                          {mark}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text y="-6" textAnchor="middle" className="wheel-bol">
                  {beat >= 0 ? tala.theka[beat] : lang === 'hi' ? tala.hi : tala.name}
                </text>
                <text y="18" textAnchor="middle" className="wheel-sub">
                  {beat >= 0 ? `${beat + 1} / ${tala.beats}` : `${tala.beats} ${t('talas.beats')}`}
                </text>
              </svg>
            </div>

            <div>
              <h2>
                {tala.name} <span className="devanagari">{tala.hi}</span>
              </h2>
              <p className="lede">
                <GlossaryText>{tala.note}</GlossaryText>
              </p>
              <p className="muted small">
                <Term entry={term('vibhag')}>Vibhags</Term>: {tala.vibhags.join(' + ')} · X = <Term entry={term('sam')}>sam</Term> · 0 ={' '}
                <Term entry={term('khali')}>khali</Term>
              </p>
              <div className="raga-controls">
                <button className="btn btn-maroon" onClick={() => (playing ? stop() : setPlaying(true))}>
                  {playing ? `■ ${t('talas.stop')}` : `▶ ${t('talas.play')}`}
                </button>
                <label className="inline-label tempo">
                  {t('talas.tempo')}
                  <input type="range" min="40" max="240" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
                  <span>{bpm} BPM</span>
                </label>
              </div>
              <div className="theka-grid">
                {tala.vibhags.map((len, vi) => {
                  const start = tala.vibhags.slice(0, vi).reduce((a, b) => a + b, 0);
                  return (
                    <div key={vi} className={tala.marks[vi] === '0' ? 'vibhag khali' : 'vibhag'}>
                      <span className="vibhag-mark">{tala.marks[vi]}</span>
                      {tala.theka.slice(start, start + len).map((bol, j) => (
                        <span key={j} className={start + j === beat ? 'bol on' : 'bol'}>
                          {bol}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
        <p className="source-note">{t('talas.caveat')}</p>
      </section>
    </>
  );
}
