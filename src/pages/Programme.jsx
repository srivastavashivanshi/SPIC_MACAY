import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { useTitle } from '../lib/useTitle.js';
import { downloadIcs, googleCalendarUrl } from '../lib/calendar.js';
import { formatDate, formatNumber, isUpcoming } from '../lib/format.js';
import { ArtFormTag, EmptyArt } from '../components/ui.jsx';
import { Motif, categoryIcon, motifFor } from '../components/Art.jsx';
import { PhotoGrid } from '../components/Photos.jsx';
import { Rsvp } from '../components/Engage.jsx';
import GlossaryText from '../components/GlossaryText.jsx';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';

const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'long' });

export default function Programme() {
  const { id } = useParams();
  const { events, artists, artFormById, gallery, chapterById } = useData();
  const event = events.find((e) => e.id === id);
  const [copied, setCopied] = useState(false);
  const [making, setMaking] = useState(false);
  const t = useT();
  const local = useLocal();
  useTitle(event?.title ?? 'Programme');

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

  const url = typeof window === 'undefined' ? '' : window.location.href;
  const form = artFormById[event.artForm];
  const Icon = categoryIcon[form?.category] ?? categoryIcon.other;
  const artist = artists.find((a) => a.id === event.artistId);
  const artistName = artist?.name || event.artist;
  const upcoming = isUpcoming(event);
  const photos = gallery.filter((p) => p.eventId === event.id);
  const chapter = chapterById[event.chapterId];
  const date = new Date(`${event.date}T00:00:00`);

  const poster = async () => {
    setMaking(true);
    try {
      const { makePoster } = await import('../lib/poster.js');
      const blob = await makePoster({ event: { ...event, artist: artistName }, formName: form ? form.name : '', chapterName: chapter?.name ?? 'IIM Lucknow', url });
      const file = new File([blob], `spicmacay-${event.id}.png`, { type: 'image/png' });
      // On phones, open the share sheet so the poster can go straight to WhatsApp or Photos.
      if (navigator.canShare?.({ files: [file] }) && window.matchMedia?.('(pointer: coarse)').matches) {
        await navigator.share({ files: [file], title: event.title }).catch(() => {});
        return;
      }
      const href = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href, download: `spicmacay-${event.id}.png` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    } finally {
      setMaking(false);
    }
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.title, text: `${event.title} · SPIC MACAY`, url }).catch(() => {});
    } else {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <section className="programme-hero">
        <Motif name={motifFor(form?.category, 1)} className="lg gold" />
        <div className="container programme-hero-inner">
          <Link className="back-link" to="/dashboard">
            ← {chapter?.name ?? ''} {t('prog.back')}
          </Link>
          <div className="programme-head">
            <div className="programme-date" aria-hidden="true">
              <span className="programme-day">{event.date.slice(8, 10)}</span>
              <span>{formatDate(event.date).split(' ').slice(1).join(' ')}</span>
            </div>
            <div>
              <p className="eyebrow">
                {event.type} · {upcoming ? t('common.upcoming') : t('common.past')}
              </p>
              <h1>{event.title}</h1>
              {artistName && (artist || !event.title.includes(artistName)) && (
                <p className="programme-artist">
                  <Link to={`/artists/${artist ? artist.id : artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}>{artistName}</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container programme-body">
        <div className="programme-main">
          <div className="card has-motif programme-facts">
            <Motif name="gateway" className="tr sm" />
            <dl>
              <dt>{t('prog.when')}</dt>
              <dd>
                {weekday.format(date)}, {formatDate(event.date)}
                {event.time ? ` · ${event.time} IST` : ''}
              </dd>
              <dt>{t('prog.where')}</dt>
              <dd>{event.venue || t('prog.venueTba')}</dd>
              {form && (
                <>
                  <dt>{t('prog.artForm')}</dt>
                  <dd>
                    <ArtFormTag id={event.artForm} />
                  </dd>
                </>
              )}
              {!upcoming && event.audience > 0 && (
                <>
                  <dt>{t('prog.attendance')}</dt>
                  <dd>{formatNumber(event.audience)}</dd>
                </>
              )}
            </dl>
            {event.description && (
              <p className="programme-desc">
                <GlossaryText>{event.description}</GlossaryText>
              </p>
            )}
            <div className="programme-actions">
              {upcoming && (
                <>
                  <a className="btn btn-maroon" href={googleCalendarUrl(event, url)} target="_blank" rel="noreferrer">
                    {t('prog.gcal')}
                  </a>
                  <button className="btn btn-outline" onClick={() => downloadIcs(event, url)}>
                    {t('prog.ics')}
                  </button>
                </>
              )}
              <button className="btn btn-outline" onClick={share}>
                {copied ? t('prog.copied') : t('prog.share')}
              </button>
              <button className="btn btn-outline" onClick={poster} disabled={making}>
                {making ? t('prog.posterMaking') : t('prog.poster')}
              </button>
              {event.sourceUrl && (
                <a className="btn btn-outline" href={event.sourceUrl} target="_blank" rel="noreferrer">
                  {t('prog.onSite')} ↗
                </a>
              )}
            </div>
          </div>

          <Link to={`/programmes/${event.id}/primer`} className="card primer-card has-motif">
            <Motif name="tanpura" className="tr sm" />
            <span>
              <strong>{t('primer.title')}</strong>
              <small>{t('primer.text')}</small>
            </span>
            <span className="text-link">{t('primer.cta')} →</span>
          </Link>

          {upcoming && <Rsvp eventId={event.id} />}

          <div className="programme-photos">
            <h2>{t('prog.photos')}</h2>
            {photos.length ? (
              <PhotoGrid photos={photos} />
            ) : (
              <div className="card has-motif">
                <EmptyArt motif="peacock">
                  <p>{upcoming ? t('prog.photosLater') : t('prog.noPhotos')}</p>
                </EmptyArt>
              </div>
            )}
          </div>
        </div>

        {form && (
          <aside className="card has-motif programme-aside">
            <Motif name={motifFor(form.category, 2)} />
            <span className="form-detail-icon">
              <Icon size={56} />
            </span>
            <h2>{local.formName(form)}</h2>
            <p className="muted">
              <GlossaryText>{local.formSummary(form)}</GlossaryText>
            </p>
            <Link className="text-link" to={`/art-forms?form=${form.id}`}>
              {t('prog.learnAbout')} {local.formName(form)} →
            </Link>
          </aside>
        )}
      </section>
    </>
  );
}
