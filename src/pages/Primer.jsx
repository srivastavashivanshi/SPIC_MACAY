import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { useLang } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { useTitle } from '../lib/useTitle.js';
import { formatDate } from '../lib/format.js';
import { glossary } from '../data/glossary.js';
import { etiquette, listenFor } from '../data/concert.js';
import { EmptyArt } from '../components/ui.jsx';
import { Motif, categoryIcon } from '../components/Art.jsx';
import GlossaryText from '../components/GlossaryText.jsx';

// Glossary entries whose spellings appear in a piece of text.
const termsIn = (text) => {
  const lower = ` ${text.toLowerCase()} `;
  return glossary.filter((g) => g.match.some((m) => new RegExp(`(^|[^\\p{L}])${m.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u').test(lower)));
};

export default function Primer() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const local = useLocal();
  const { events, artFormById, artists } = useData();
  const event = events.find((e) => e.id === id);
  useTitle(event ? `${t('primer.title')}: ${event.title}` : t('primer.title'));

  if (!event) {
    return (
      <section className="container section">
        <EmptyArt motif="gateway">
          <p>{t('prog.notFound')}</p>
          <Link className="btn btn-maroon" to="/dashboard">
            {t('prog.all')}
          </Link>
        </EmptyArt>
      </section>
    );
  }

  const form = artFormById[event.artForm];
  const listen = listenFor[event.artForm] ?? listenFor[form?.category] ?? listenFor.other;
  const artistName = artists.find((a) => a.id === event.artistId)?.name || event.artist;
  const words = termsIn([form?.summary, ...(form?.keyElements ?? []), ...listen, event.type].filter(Boolean).join(' ')).slice(0, 10);
  const Icon = categoryIcon[form?.category] ?? categoryIcon.other;

  return (
    <section className="container section primer">
      <div className="primer-actions no-print">
        <Link className="back-link dark" to={`/programmes/${event.id}`}>
          ← {event.title}
        </Link>
        <button className="btn btn-maroon" onClick={() => window.print()}>
          {t('primer.print')}
        </button>
      </div>

      <article className="primer-sheet has-motif">
        <Motif name="gateway" className="lg" />
        <header className="primer-head">
          <span className="form-detail-icon">
            <Icon size={56} />
          </span>
          <div>
            <p className="eyebrow">{t('primer.title')}</p>
            <h1>{event.title}</h1>
            <p className="muted">
              {formatDate(event.date)}
              {event.time && ` · ${event.time}`}
              {event.venue && ` · ${event.venue}`}
              {artistName && !event.title.includes(artistName) && ` · ${artistName}`}
            </p>
          </div>
        </header>

        {form && (
          <section>
            <h2>
              {t('primer.about')} {local.formName(form)}
            </h2>
            <p>
              <GlossaryText>{local.formSummary(form)}</GlossaryText>
            </p>
          </section>
        )}

        <section>
          <h2>{t('primer.listen')}</h2>
          <ul className="primer-list">
            {listen.map((l) => (
              <li key={l}>
                <GlossaryText>{l}</GlossaryText>
              </li>
            ))}
          </ul>
        </section>

        {words.length > 0 && (
          <section>
            <h2>{t('primer.words')}</h2>
            <dl className="primer-words">
              {words.map((g) => (
                <div key={g.id}>
                  <dt>
                    {g.term} <span className="devanagari">{g.hi}</span>
                  </dt>
                  <dd>{g.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section>
          <h2>{t('primer.etiquette')}</h2>
          <ul className="primer-list">
            {etiquette[lang === 'hi' ? 'hi' : 'en'].map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>

        <footer className="primer-foot">SPIC MACAY · IIM Lucknow Chapter</footer>
      </article>
    </section>
  );
}
