import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/format.js';

// A grid of photos that opens a full-screen viewer (arrow keys, Escape, swipe-free buttons).
export function PhotoGrid({ photos, eventById = {} }) {
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  const current = photos[open];
  return (
    <>
      <ul className="photo-grid">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button onClick={() => setOpen(i)} aria-label={`Open photo${p.caption ? `: ${p.caption}` : ''}`}>
              <img src={p.url} alt={p.caption || 'Programme photo'} loading="lazy" width={p.width || undefined} height={p.height || undefined} />
              {p.caption && <span className="photo-caption">{p.caption}</span>}
            </button>
          </li>
        ))}
      </ul>
      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={current.url} alt={current.caption || 'Programme photo'} />
            <figcaption>
              {current.caption}
              {eventById[current.eventId] && <span> · {eventById[current.eventId].title}</span>}
              {current.takenOn && <span> · {formatDate(current.takenOn)}</span>}
              <span className="lightbox-count">
                {open + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
          {photos.length > 1 && (
            <>
              <button className="lightbox-nav prev" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous photo">
                ‹
              </button>
              <button className="lightbox-nav next" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next photo">
                ›
              </button>
            </>
          )}
          <button className="lightbox-close" onClick={close} aria-label="Close">
            ×
          </button>
        </div>
      )}
    </>
  );
}

// Slideshow of recent photos. Auto-advances unless the reader prefers reduced motion,
// pauses on hover or focus, and supports arrows, dots, keyboard and swipe.
export function PhotoCarousel({ photos, eventById = {}, interval = 5000, title, moreLink }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState(null);
  const count = photos.length;
  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => go(1), interval);
    return () => clearInterval(t);
  }, [count, paused, interval, go]);
  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  if (!count) return null;
  const current = photos[Math.min(index, count - 1)];
  const event = eventById[current.eventId];

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label={title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${Math.min(index, count - 1) * 100}%)` }}>
        {photos.map((p, i) => (
          <figure key={p.id} className="carousel-slide" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index}>
            <img src={p.url} alt={p.caption || 'Programme photo'} loading={i < 2 ? 'eager' : 'lazy'} />
          </figure>
        ))}
      </div>
      <div className="carousel-caption" aria-live={paused ? 'polite' : 'off'}>
        <span>
          {current.caption && <strong>{current.caption}</strong>}
          {event && (
            <Link to={`/programmes/${event.id}`}>
              {event.title}
              {current.takenOn ? ` · ${formatDate(current.takenOn)}` : ''}
            </Link>
          )}
        </span>
        {moreLink}
      </div>
      {count > 1 && (
        <>
          <button className="carousel-nav prev" onClick={() => go(-1)} aria-label="Previous photo">
            ‹
          </button>
          <button className="carousel-nav next" onClick={() => go(1)} aria-label="Next photo">
            ›
          </button>
          <div className="carousel-dots" role="tablist" aria-label="Choose photo">
            {photos.map((p, i) => (
              <button key={p.id} role="tab" aria-selected={i === index} aria-label={`Photo ${i + 1}`} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
