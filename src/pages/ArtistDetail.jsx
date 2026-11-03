import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { useTitle } from '../lib/useTitle.js';
import { formatDate } from '../lib/format.js';
import { lineages, relationLabel } from '../data/lineages.js';
import { appearances } from '../data/appearances.js';
import { ArtFormTag, EmptyArt, Initials } from '../components/ui.jsx';
import { Motif, motifFor } from '../components/Art.jsx';
import GlossaryText from '../components/GlossaryText.jsx';

export const artistSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// The chain of teachers above an artist, nearest first.
function teachersOf(artistId) {
  for (const l of lineages) {
    const path = [];
    const walk = (node, parents) => {
      if (node.artistId === artistId) return path.push(...parents), true;
      return (node.children ?? []).some((c) => walk(c, [{ node, relation: c.relation, source: c.source }, ...parents]));
    };
    if (walk(l.tree, [])) return { lineage: l, chain: path };
  }
  return null;
}

export default function ArtistDetail() {
  const { id } = useParams();
  const t = useT();
  const local = useLocal();
  const { artists, events, artFormById } = useData();

  // Explorer artists, or guests known only from the chapter's programmes.
  const known = artists.find((a) => a.id === id);
  const guestEvents = events.filter((e) => !e.artistId && e.artist && artistSlug(e.artist) === id);
  const artist = known ?? (guestEvents[0] && { id, name: guestEvents[0].artist, artForm: guestEvents[0].artForm, guest: true, honours: [] });
  useTitle(artist?.name ?? 'Artist');

  if (!artist) {
    return (
      <section className="container section">
        <EmptyArt motif="sitar">
          <p>{t('artist.notFound')}</p>
          <Link className="btn btn-maroon" to="/artists">
            {t('artist.allArtists')}
          </Link>
        </EmptyArt>
      </section>
    );
  }

  const form = artFormById[artist.artForm];
  const atChapter = known ? events.filter((e) => e.artistId === id || (e.artist && e.artist === artist.name.replace(/^(Pt\.|Ustad|Vidushi|Dr\.|Guru)\s+/, ''))) : guestEvents;
  const seen = appearances[id];
  const teachers = known && teachersOf(id);
  const related = artists.filter((a) => a.artForm === artist.artForm && a.id !== id).slice(0, 4);
  const bare = artist.name.replace(/^(Pt\.|Ustad|Vidushi|Dr\.|Guru)\s+/, '');

  return (
    <>
      <section className="programme-hero">
        <Motif name={motifFor(form?.category, 0)} className="lg gold" />
        <div className="container programme-hero-inner">
          <Link className="back-link" to="/artists">
            ← {t('artist.allArtists')}
          </Link>
          <div className="programme-head">
            <span className="artist-medallion">
              <Initials name={artist.name} />
            </span>
            <div>
              <p className="eyebrow">
                {[artist.instrument, form && local.formName(form)].filter(Boolean).join(' · ')}
                {artist.born ? ` · ${artist.born}–${artist.died ?? ''}` : ''}
              </p>
              <h1>{artist.name}</h1>
              {artist.lineage && <p className="programme-artist">{artist.lineage}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="container programme-body">
        <div className="programme-main">
          <div className="card has-motif programme-facts">
            <Motif name="gateway" className="tr sm" />
            {known ? <p className="lede">{local.bio(artist)}</p> : <p className="lede">Performed for SPIC MACAY at IIM Lucknow.</p>}
            <dl>
              {artist.region && (
                <>
                  <dt>{t('artist.region')}</dt>
                  <dd>{artist.region}</dd>
                </>
              )}
              {artist.honours.length > 0 && (
                <>
                  <dt>{t('artist.honours')}</dt>
                  <dd>
                    <ul className="honours">
                      {artist.honours.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}
              {form && (
                <>
                  <dt>{t('prog.artForm')}</dt>
                  <dd>
                    <ArtFormTag id={form.id} />
                  </dd>
                </>
              )}
            </dl>
            <div className="programme-actions">
              <a className="btn btn-maroon" href={`https://www.youtube.com/@spicmacay/search?query=${encodeURIComponent(bare)}`} target="_blank" rel="noreferrer">
                {t('artist.listen')} ↗
              </a>
              {artist.source && (
                <a className="btn btn-outline" href={artist.source} target="_blank" rel="noreferrer">
                  {t('common.source')} ↗
                </a>
              )}
            </div>
          </div>

          {teachers?.chain.length > 0 && (
            <div className="card has-motif">
              <Motif name="tanpura" className="tr sm" />
              <h2 className="card-title">{t('artist.gurus')}</h2>
              <ol className="guru-chain">
                {teachers.chain.map(({ node, relation, source }, i) => (
                  <li key={node.name}>
                    <Initials name={node.name} size="sm" />
                    <span>
                      <strong>{node.artistId ? <Link to={`/artists/${node.artistId}`}>{node.name}</Link> : node.name}</strong>
                      <small>
                        {i === 0 ? `${relationLabel[relation]} ${node.name}` : node.note || ''}{' '}
                        {i === 0 && source && (
                          <a href={source} target="_blank" rel="noreferrer">
                            ↗
                          </a>
                        )}
                      </small>
                    </span>
                  </li>
                ))}
              </ol>
              <Link className="text-link" to={`/lineages?tradition=${encodeURIComponent(teachers.lineage.tradition)}`}>
                {teachers.lineage.name} →
              </Link>
            </div>
          )}

          <div className="card has-motif">
            <Motif name="diya" className="tr sm" />
            <h2 className="card-title">{t('artist.atChapter')}</h2>
            {atChapter.length ? (
              <ul className="mini-events">
                {atChapter.map((e) => (
                  <li key={e.id}>
                    <span>{formatDate(e.date)}</span> <Link to={`/programmes/${e.id}`}>{e.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Not yet. Maybe soon!</p>
            )}
          </div>

          {seen && (
            <div className="card has-motif">
              <Motif name="temple" className="tr sm" />
              <h2 className="card-title">SPIC MACAY appearances</h2>
              <p className="muted small">
                {seen.total} programme{seen.total > 1 ? 's' : ''} listed on spicmacay.org. Most recent:
              </p>
              <ul className="mini-events">
                {seen.recent.map((h) => (
                  <li key={h.url || h.title}>
                    <span>{formatDate(h.date)}</span>{' '}
                    {h.url ? (
                      <a href={h.url} target="_blank" rel="noreferrer">
                        {h.title}
                      </a>
                    ) : (
                      h.title
                    )}
                    {h.place && <span> · {h.place}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="programme-aside-stack">
          {form && (
            <div className="card has-motif programme-aside">
              <Motif name={motifFor(form.category, 2)} />
              <h2>{local.formName(form)}</h2>
              <p className="muted">
                <GlossaryText>{local.formSummary(form)}</GlossaryText>
              </p>
              <Link className="text-link" to={`/art-forms?form=${form.id}`}>
                {t('prog.learnAbout')} {local.formName(form)} →
              </Link>
            </div>
          )}
          {related.length > 0 && (
            <div className="card has-motif">
              <Motif name="paisley" className="tr sm" />
              <h3 className="sub">
                {t('artist.related')} {local.formName(form)}
              </h3>
              <ul className="mini-artists">
                {related.map((a) => (
                  <li key={a.id}>
                    <Initials name={a.name} size="sm" />
                    <Link to={`/artists/${a.id}`}>{a.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
