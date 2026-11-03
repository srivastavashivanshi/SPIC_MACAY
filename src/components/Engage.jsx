import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { useData } from '../lib/DataContext.jsx';
import { Motif, categoryIcon, motifFor } from './Art.jsx';
import GlossaryText from './GlossaryText.jsx';

const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL || '';

async function post(path, body) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

// Newsletter / WhatsApp sign-up. Hidden entirely when there is nowhere to store it.
export function Subscribe() {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', consent: false, website: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '' });

  useEffect(() => {
    fetch('/api/subscribe')
      .then((r) => (r.ok ? r.json() : { open: false }))
      .then((d) => setOpen(Boolean(d.open)))
      .catch(() => setOpen(false));
  }, []);

  if (!open && !WHATSAPP_URL) return null;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email && !form.phone) return setState({ busy: false, done: false, error: t('subscribe.need') });
    setState({ busy: true, done: false, error: '' });
    try {
      await post('/api/subscribe', form);
      setState({ busy: false, done: true, error: '' });
    } catch (err) {
      setState({ busy: false, done: false, error: err.message });
    }
  };

  return (
    <section className="container section">
      <div className="subscribe has-motif">
        <Motif name="bansuri" className="lg gold" />
        <div className="subscribe-copy">
          <p className="eyebrow">{t('footer.explore')}</p>
          <h2>{t('subscribe.title')}</h2>
          <p>{t('subscribe.text')}</p>
          {WHATSAPP_URL && (
            <a className="btn btn-ghost" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              {t('subscribe.whatsapp')} ↗
            </a>
          )}
        </div>
        {open &&
          (state.done ? (
            <p className="subscribe-done" role="status">
              {t('subscribe.done')}
            </p>
          ) : (
            <form className="subscribe-form" onSubmit={submit}>
              <input placeholder={t('subscribe.name')} value={form.name} onChange={set('name')} required maxLength={80} aria-label={t('subscribe.name')} />
              <input type="email" placeholder={t('subscribe.email')} value={form.email} onChange={set('email')} maxLength={200} aria-label={t('subscribe.email')} />
              <input type="tel" placeholder={t('subscribe.phone')} value={form.phone} onChange={set('phone')} maxLength={20} aria-label={t('subscribe.phone')} />
              <input className="hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden="true" />
              <label className="consent">
                <input type="checkbox" checked={form.consent} onChange={set('consent')} required /> {t('subscribe.consent')}
              </label>
              {state.error && <p className="admin-error">{state.error}</p>}
              <button className="btn btn-gold" disabled={state.busy}>
                {t('subscribe.cta')}
              </button>
            </form>
          ))}
      </div>
    </section>
  );
}

// "I'll attend" for upcoming programmes. Hidden when RSVPs can't be stored.
export function Rsvp({ eventId }) {
  const t = useT();
  const [count, setCount] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', website: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '' });
  const key = `rsvp:${eventId}`;

  useEffect(() => {
    fetch(`/api/rsvp?eventId=${encodeURIComponent(eventId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCount(d ? d.count : null))
      .catch(() => setCount(null));
    try {
      if (localStorage.getItem(key)) setState((s) => ({ ...s, done: true }));
    } catch {
      /* ignore */
    }
  }, [eventId, key]);

  if (count === null) return null;
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, done: false, error: '' });
    try {
      const r = await post('/api/rsvp', { ...form, eventId });
      setCount(r.count ?? count + 1);
      setState({ busy: false, done: true, error: '' });
      try {
        localStorage.setItem(key, '1');
      } catch {
        /* ignore */
      }
    } catch (err) {
      setState({ busy: false, done: false, error: err.message });
    }
  };

  return (
    <div className="card has-motif rsvp">
      <Motif name="diya" className="tr sm" />
      <h2 className="card-title">{t('rsvp.title')}</h2>
      {count > 0 && <p className="rsvp-count">{count === 1 ? t('rsvp.countOne') : t('rsvp.count', { n: count })}</p>}
      {state.done ? (
        <p className="subscribe-done" role="status">
          {t('rsvp.done')}
        </p>
      ) : (
        <form onSubmit={submit}>
          <p className="muted">{t('rsvp.text')}</p>
          <div className="rsvp-fields">
            <input placeholder={t('rsvp.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={80} aria-label={t('rsvp.name')} />
            <input type="email" placeholder={t('rsvp.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} aria-label={t('rsvp.email')} />
            <input className="hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} aria-hidden="true" />
            <button className="btn btn-maroon" disabled={state.busy}>
              {t('rsvp.cta')}
            </button>
          </div>
          {state.error && <p className="admin-error">{state.error}</p>}
        </form>
      )}
    </div>
  );
}

// ISO week number, so the feature changes every Monday for everyone.
const isoWeek = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7) + t.getUTCFullYear() * 53;
};

export function WeeklyArtForm() {
  const t = useT();
  const local = useLocal();
  const { artForms, features } = useData();
  const performing = artForms.filter((f) => ['music', 'dance', 'folk'].includes(f.category));
  if (!performing.length) return null;
  const form = performing[isoWeek() % performing.length];
  const video = features.find((v) => v.artForm === form.id);
  const Icon = categoryIcon[form.category] ?? categoryIcon.other;

  return (
    <section className="container section">
      <div className="weekly has-motif">
        <Motif name={motifFor(form.category, 1)} className="lg" />
        <div className="weekly-copy">
          <p className="eyebrow">{t('home.weekEyebrow')}</p>
          <div className="weekly-title">
            <span className="form-detail-icon">
              <Icon size={48} />
            </span>
            <h2>{local.formName(form)}</h2>
          </div>
          <p>
            <GlossaryText>{local.formSummary(form)}</GlossaryText>
          </p>
          <div className="programme-actions">
            <Link className="btn btn-maroon" to={`/art-forms?form=${form.id}`}>
              {t('home.weekGuide')}
            </Link>
            <a className="btn btn-outline" href={`https://www.youtube.com/@spicmacay/search?query=${encodeURIComponent(form.name)}`} target="_blank" rel="noreferrer">
              {t('home.weekWatch')} ↗
            </a>
          </div>
        </div>
        {video ? (
          <figure className="weekly-video">
            <div className="video-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption>
              {video.title} · {video.channel}
            </figcaption>
          </figure>
        ) : (
          <div className="weekly-art" aria-hidden="true">
            <Motif name={motifFor(form.category, 0)} className="inline" />
          </div>
        )}
      </div>
    </section>
  );
}
