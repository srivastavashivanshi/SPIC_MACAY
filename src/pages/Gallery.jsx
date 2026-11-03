import { useSearchParams } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { EmptyArt, PageHeader } from '../components/ui.jsx';
import { PhotoGrid } from '../components/Photos.jsx';
import { useT } from '../lib/i18n.jsx';

export default function Gallery() {
  const { gallery, events } = useData();
  const t = useT();
  const [params, setParams] = useSearchParams();
  const eventId = params.get('programme') || '';
  const eventById = Object.fromEntries(events.map((e) => [e.id, e]));
  const withPhotos = events.filter((e) => gallery.some((p) => p.eventId === e.id));
  const photos = eventId ? gallery.filter((p) => p.eventId === eventId) : gallery;

  return (
    <>
      <PageHeader eyebrow={t('gallery.eyebrow')} hindi="झलकियाँ" title={t('gallery.title')}>
        {t('gallery.lede')}
      </PageHeader>

      <section className="container">
        {withPhotos.length > 0 && (
          <div className="tabs" role="group" aria-label="Filter by programme">
            <button aria-pressed={!eventId} onClick={() => setParams({}, { replace: true })}>
              {t('common.all')} <span className="tab-count">{gallery.length}</span>
            </button>
            {withPhotos.map((e) => (
              <button key={e.id} aria-pressed={eventId === e.id} onClick={() => setParams({ programme: e.id }, { replace: true })}>
                {e.title.length > 40 ? `${e.title.slice(0, 38)}…` : e.title}{' '}
                <span className="tab-count">{gallery.filter((p) => p.eventId === e.id).length}</span>
              </button>
            ))}
          </div>
        )}

        {photos.length ? (
          <PhotoGrid photos={photos} eventById={eventById} />
        ) : (
          <div className="card has-motif">
            <EmptyArt motif="peacock">
              <p>{t('gallery.empty')}</p>
            </EmptyArt>
          </div>
        )}
      </section>
    </>
  );
}
