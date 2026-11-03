import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { instruments } from '../data/instruments.js';
import { useData } from '../lib/DataContext.jsx';
import { useT, useLang } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { PageHeader } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';
import InstrumentArt from '../components/InstrumentArt.jsx';
import GlossaryText from '../components/GlossaryText.jsx';

export default function Instruments() {
  const t = useT();
  const { lang } = useLang();
  const local = useLocal();
  const { artFormById } = useData();
  const [params, setParams] = useSearchParams();
  const inst = instruments.find((i) => i.id === params.get('instrument')) ?? instruments[0];
  const [active, setActive] = useState('');
  const part = inst.parts.find((p) => p.id === active);
  const form = artFormById[inst.artForm];

  return (
    <>
      <PageHeader eyebrow={t('nav.instruments')} hindi="वाद्य" title={t('inst.title')}>
        {t('inst.lede')}
      </PageHeader>
      <section className="container">
        <div className="tabs" role="group" aria-label={t('nav.instruments')}>
          {instruments.map((i) => (
            <button
              key={i.id}
              aria-pressed={i.id === inst.id}
              onClick={() => {
                setParams({ instrument: i.id }, { replace: true });
                setActive('');
              }}
            >
              {lang === 'hi' ? i.hi : i.name}
            </button>
          ))}
        </div>

        <article className="card instrument-card has-motif">
          <Motif name="paisley" className="tr sm" />
          <div className="instrument-head">
            <div>
              <p className="eyebrow">{inst.family}</p>
              <h2>
                {inst.name} <span className="devanagari">{inst.hi}</span>
              </h2>
              <p className="lede">
                <GlossaryText>{inst.summary}</GlossaryText>
              </p>
            </div>
          </div>
          <div className="instrument-layout">
            <div className="instrument-stage">
              <InstrumentArt id={inst.id} parts={inst.parts} active={active} onPick={setActive} />
              <p className="instrument-caption" aria-live="polite">
                {part ? (
                  <>
                    <strong>{part.name}</strong> <GlossaryText>{part.desc}</GlossaryText>
                  </>
                ) : (
                  t('inst.hint')
                )}
              </p>
            </div>
            <ol className="part-list">
              {inst.parts.map((p, i) => (
                <li key={p.id}>
                  <button className={active === p.id ? 'on' : ''} onClick={() => setActive(p.id)} onMouseEnter={() => setActive(p.id)}>
                    <span className="part-num">{i + 1}</span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.desc}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          {form && (
            <p>
              <Link className="text-link" to={`/art-forms?form=${form.id}`}>
                {t('prog.learnAbout')} {local.formName(form)} →
              </Link>
            </p>
          )}
        </article>
      </section>
    </>
  );
}
