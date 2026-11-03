import { useCallback, useEffect, useState } from 'react';
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
