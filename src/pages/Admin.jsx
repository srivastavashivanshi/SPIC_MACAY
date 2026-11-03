import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { upload } from '@vercel/blob/client';
import { useData } from '../lib/DataContext.jsx';
import { useTitle } from '../lib/useTitle.js';
import { formatDate } from '../lib/format.js';
import { eventTypes } from '../data/events.js';
import { EmptyArt } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ── Field definitions for each editable dataset ───────────────────────────
function useFieldSets() {
  const { artForms, artists } = useData();
  return useMemo(() => {
    const formOptions = artForms.map((f) => ({ value: f.id, label: f.name }));
    return {
      events: {
        label: 'Programmes',
        title: (r) => r.title,
        meta: (r) => `${formatDate(r.date)}${r.venue ? ` · ${r.venue}` : ''}`,
        sort: (a, b) => b.date.localeCompare(a.date),
        fields: [
          { name: 'title', label: 'Title', required: true, wide: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'time', label: 'Start time (IST)', type: 'time' },
          { name: 'type', label: 'Format', type: 'select', options: eventTypes.map((t) => ({ value: t, label: t })) },
          { name: 'artForm', label: 'Art form', type: 'select', options: formOptions },
          { name: 'venue', label: 'Venue', wide: true },
          { name: 'artistId', label: 'Artist from the explorer', type: 'select', options: artists.map((a) => ({ value: a.id, label: a.name })) },
          { name: 'artist', label: 'Or artist name' },
          { name: 'audience', label: 'Attendance', type: 'number' },
          { name: 'sourceUrl', label: 'Link (https://…)', type: 'url' },
          { name: 'description', label: 'Description', type: 'textarea', wide: true },
        ],
      },
      artists: {
        label: 'Artists',
        title: (r) => r.name,
        meta: (r) => [r.instrument, r.lineage].filter(Boolean).join(' · '),
        sort: (a, b) => a.name.localeCompare(b.name),
        fields: [
          { name: 'name', label: 'Name', required: true, wide: true },
          { name: 'artForm', label: 'Art form', type: 'select', options: formOptions, required: true },
          { name: 'instrument', label: 'Instrument / discipline' },
          { name: 'lineage', label: 'Gharana / lineage' },
          { name: 'region', label: 'Region' },
          { name: 'born', label: 'Born (year)', type: 'number' },
          { name: 'died', label: 'Died (year)', type: 'number' },
          { name: 'honours', label: 'Honours (comma-separated)', wide: true },
          { name: 'bio', label: 'Short bio', type: 'textarea', wide: true },
          { name: 'source', label: 'Source link (https://…)', type: 'url', wide: true },
        ],
      },
      team: {
        label: 'Team',
        title: (r) => r.name,
        meta: (r) => r.role,
        sort: (a, b) => (a.order ?? 99) - (b.order ?? 99),
        fields: [
          { name: 'name', label: 'Name', required: true },
          { name: 'role', label: 'Role', required: true },
          { name: 'order', label: 'Display order', type: 'number' },
        ],
      },
    };
  }, [artForms, artists]);
}

const toForm = (record, fields) =>
  Object.fromEntries(fields.map((f) => [f.name, Array.isArray(record?.[f.name]) ? record[f.name].join(', ') : record?.[f.name] ?? '']));

function Field({ field, value, onChange }) {
  const common = { id: `f-${field.name}`, name: field.name, value, required: field.required, onChange: (e) => onChange(field.name, e.target.value) };
  let input;
  if (field.type === 'select') {
    input = (
      <select {...common}>
        <option value="">—</option>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'textarea') {
    input = <textarea {...common} rows={4} />;
  } else {
    input = <input {...common} type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} />;
  }
  return (
    <label className={field.wide ? 'admin-field wide' : 'admin-field'} htmlFor={common.id}>
      <span>
        {field.label}
        {field.required && ' *'}
      </span>
      {input}
    </label>
  );
}

function DatasetEditor({ resource, set, canWrite, notify }) {
  const data = useData();
  const rows = [...(data[resource] ?? [])].sort(set.sort);
  const fromFiles = data.sources[resource] === 'bundled';
  const [editing, setEditing] = useState(null); // null = closed, {} = new, record = edit
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);

  const open = (record) => {
    setEditing(record);
    setValues(toForm(record, set.fields));
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { ...values, id: editing?.id };
      if (resource === 'events' && body.artistId && !body.artist) body.artist = data.artists.find((a) => a.id === body.artistId)?.name ?? '';
      if (resource === 'events' && editing?.chapterId) body.chapterId = editing.chapterId;
      await api(`/api/admin/${resource}`, { method: 'POST', body });
      notify(`Saved “${set.title(body)}”.`);
      setEditing(null);
      data.refresh();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (record) => {
    if (!window.confirm(`Delete “${set.title(record)}”? This can’t be undone.`)) return;
    try {
      await api(`/api/admin/${resource}?id=${encodeURIComponent(record.id)}`, { method: 'DELETE' });
      notify(`Deleted “${set.title(record)}”.`);
      data.refresh();
    } catch (err) {
      notify(err.message, true);
    }
  };

  const copyIn = async () => {
    setBusy(true);
    try {
      const { copied } = await api('/api/admin/seed', { method: 'POST', body: { resource } });
      notify(`Copied ${copied} records into the database.`);
      data.refresh();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {fromFiles && rows.length > 0 && (
        <div className="admin-banner">
          <p>
            These {set.label.toLowerCase()} come from the site’s built-in files. Copy them into the database first, so your
            edits add to the list instead of replacing it.
          </p>
          <button className="btn btn-maroon" onClick={copyIn} disabled={!canWrite || busy}>
            Copy into database
          </button>
        </div>
      )}

      <div className="admin-toolbar">
        <h2>
          {set.label} <span className="tab-count">{rows.length}</span>
        </h2>
        <button className="btn btn-maroon" onClick={() => open({})} disabled={!canWrite || (fromFiles && rows.length > 0)}>
          + Add
        </button>
      </div>

      {editing && (
        <form className="card admin-form has-motif" onSubmit={save}>
          <Motif name="jaali" className="tr sm" />
          <h3>{editing.id ? `Edit ${set.title(editing)}` : `New ${set.label.replace(/s$/, '').toLowerCase()}`}</h3>
          <div className="admin-grid">
            {set.fields.map((f) => (
              <Field key={f.name} field={f} value={values[f.name]} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
            ))}
          </div>
          <div className="admin-actions">
            <button className="btn btn-maroon" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="admin-list">
        {rows.map((r) => (
          <li key={r.id}>
            <span>
              <strong>{set.title(r)}</strong>
              <small>{set.meta(r)}</small>
            </span>
            <span className="admin-row-actions">
              {resource === 'events' && <Link to={`/programmes/${r.id}`}>View</Link>}
              <button onClick={() => open(r)} disabled={!canWrite || fromFiles}>
                Edit
              </button>
              <button className="danger" onClick={() => remove(r)} disabled={!canWrite || fromFiles}>
                Delete
              </button>
            </span>
          </li>
        ))}
        {!rows.length && (
          <li>
            <EmptyArt motif="lotus">
              <p>Nothing here yet. Use “+ Add” to create the first one.</p>
            </EmptyArt>
          </li>
        )}
      </ul>
    </div>
  );
}

// Shrinks large photos before upload: longest side 2000px, JPEG.
async function preparePhoto(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  if (scale === 1 && file.size < 2.5 * 1024 * 1024) return { blob: file, width, height };
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
  return { blob, width, height };
}

function PhotosEditor({ canWrite, blobReady, notify }) {
  const { gallery, events, refresh } = useData();
  const [files, setFiles] = useState([]);
  const [meta, setMeta] = useState({ caption: '', eventId: '', takenOn: '' });
  const [progress, setProgress] = useState('');

  const send = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    try {
      for (const [i, file] of files.entries()) {
        setProgress(`Uploading ${i + 1} of ${files.length}…`);
        const { blob, width, height } = await preparePhoto(file);
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-').slice(0, 40) || 'photo';
        const stored = await upload(`gallery/${name}.${blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'}`, blob, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
          contentType: blob.type || 'image/jpeg',
        });
        const event = events.find((ev) => ev.id === meta.eventId);
        await api('/api/admin/gallery', {
          method: 'POST',
          body: { url: stored.url, caption: meta.caption, eventId: meta.eventId, takenOn: meta.takenOn || event?.date || '', width, height },
        });
      }
      notify(`Uploaded ${files.length} photo${files.length > 1 ? 's' : ''}.`);
      setFiles([]);
      e.target.reset();
      refresh();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setProgress('');
    }
  };

  const remove = async (p) => {
    if (!window.confirm('Delete this photo? This can’t be undone.')) return;
    try {
      await api(`/api/admin/gallery?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
      notify('Photo deleted.');
      refresh();
    } catch (err) {
      notify(err.message, true);
    }
  };

  return (
    <div>
      {!blobReady && (
        <div className="admin-banner">
          <p>
            Photo storage isn’t set up yet. In Vercel, open Storage, create a Blob store and connect it to this project. That
            adds <code>BLOB_READ_WRITE_TOKEN</code>.
          </p>
        </div>
      )}
      <form className="card admin-form has-motif" onSubmit={send}>
        <Motif name="peacock" className="tr sm" />
        <h3>Upload photos</h3>
        <div className="admin-grid">
          <label className="admin-field wide">
            <span>Photos (JPEG, PNG or WebP, up to 8 MB each) *</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple required onChange={(e) => setFiles([...e.target.files])} />
          </label>
          <label className="admin-field">
            <span>Programme</span>
            <select value={meta.eventId} onChange={(e) => setMeta((m) => ({ ...m, eventId: e.target.value }))}>
              <option value="">—</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {formatDate(ev.date)} · {ev.title}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Date taken</span>
            <input type="date" value={meta.takenOn} onChange={(e) => setMeta((m) => ({ ...m, takenOn: e.target.value }))} />
          </label>
          <label className="admin-field wide">
            <span>Caption</span>
            <input value={meta.caption} maxLength={200} onChange={(e) => setMeta((m) => ({ ...m, caption: e.target.value }))} />
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-maroon" disabled={!canWrite || !blobReady || Boolean(progress)}>
            {progress || 'Upload'}
          </button>
        </div>
      </form>

      <div className="admin-toolbar">
        <h2>
          Photos <span className="tab-count">{gallery.length}</span>
        </h2>
      </div>
      {gallery.length ? (
        <ul className="admin-photos">
          {gallery.map((p) => (
            <li key={p.id}>
              <img src={p.url} alt={p.caption || 'Programme photo'} loading="lazy" />
              <span>{p.caption || 'No caption'}</span>
              <button className="danger" onClick={() => remove(p)} disabled={!canWrite}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyArt motif="peacock">
          <p>No photos yet.</p>
        </EmptyArt>
      )}
    </div>
  );
}

function ImportPanel({ canWrite, notify }) {
  const { refresh } = useData();
  const [match, setMatch] = useState('IIM Lucknow');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const run = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api('/api/admin/import', { method: 'POST', body: { match } });
      setResult(r);
      notify(`Found ${r.found} programmes: ${r.added} new, ${r.updated} updated.`);
      refresh();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <form className="card admin-form has-motif" onSubmit={run}>
        <Motif name="gateway" className="tr sm" />
        <h3>Import from spicmacay.org</h3>
        <p className="muted">
          Searches SPIC MACAY’s public past and upcoming programme listings for titles or venues containing this text, and
          saves the matches as programmes. Running it again updates them and keeps any time, attendance, artist link or
          description you’ve added here.
        </p>
        <div className="admin-grid">
          <label className="admin-field wide">
            <span>Match text</span>
            <input value={match} onChange={(e) => setMatch(e.target.value)} required maxLength={80} />
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-maroon" disabled={!canWrite || busy}>
            {busy ? 'Searching 3,000+ programmes…' : 'Import programmes'}
          </button>
        </div>
      </form>
      {result && (
        <ul className="admin-list">
          {result.items.map((e) => (
            <li key={e.id}>
              <span>
                <strong>{e.title}</strong>
                <small>
                  {formatDate(e.date)} · {e.venue}
                </small>
              </span>
              <Link to={`/programmes/${e.id}`}>View</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const toCsv = (rows, cols) =>
  [cols.join(','), ...rows.map((r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');

function downloadCsv(name, rows, cols) {
  const href = URL.createObjectURL(new Blob([toCsv(rows, cols)], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

// RSVPs and sign-ups: private lists, readable only here.
function ResponsesPanel({ type, canWrite, notify }) {
  const { events } = useData();
  const [rows, setRows] = useState(null);
  const load = () =>
    api(`/api/admin/responses?type=${type}`)
      .then(setRows)
      .catch((err) => {
        setRows([]);
        notify(err.message, true);
      });
  useEffect(() => {
    if (canWrite) load();
    else setRows([]);
  }, [type, canWrite]);

  const remove = async (r) => {
    if (!window.confirm(`Remove ${r.name}? Use this for removal requests.`)) return;
    try {
      await api(`/api/admin/responses?type=${type}&id=${encodeURIComponent(r.id)}`, { method: 'DELETE' });
      notify(`Removed ${r.name}.`);
      load();
    } catch (err) {
      notify(err.message, true);
    }
  };

  const eventTitle = Object.fromEntries(events.map((e) => [e.id, `${formatDate(e.date)} · ${e.title}`]));
  const list = (rows ?? []).sort((a, b) => (b.createdAt || b.consentAt || '').localeCompare(a.createdAt || a.consentAt || ''));
  const isRsvp = type === 'rsvps';
  const counts = isRsvp ? Object.entries(list.reduce((m, r) => ({ ...m, [r.eventId]: (m[r.eventId] ?? 0) + 1 }), {})) : [];
  const cols = isRsvp ? ['name', 'email', 'eventId', 'createdAt'] : ['name', 'email', 'phone', 'consentAt'];

  return (
    <div>
      <div className="admin-toolbar">
        <h2>
          {isRsvp ? 'RSVPs' : 'Subscribers'} <span className="tab-count">{list.length}</span>
        </h2>
        <button className="btn btn-outline" disabled={!list.length} onClick={() => downloadCsv(`${type}.csv`, list, cols)}>
          Download CSV
        </button>
      </div>
      {isRsvp && counts.length > 0 && (
        <ul className="admin-checks">
          {counts.map(([id, n]) => (
            <li key={id} className="ok">
              {eventTitle[id] ?? id}: {n}
            </li>
          ))}
        </ul>
      )}
      <ul className="admin-list">
        {list.map((r) => (
          <li key={r.id}>
            <span>
              <strong>{r.name}</strong>
              <small>
                {[r.email, r.phone, isRsvp && (eventTitle[r.eventId] ?? r.eventId)].filter(Boolean).join(' · ')} ·{' '}
                {formatDate((r.createdAt || r.consentAt || '').slice(0, 10) || '1970-01-01')}
              </small>
            </span>
            <span className="admin-row-actions">
              <button className="danger" onClick={() => remove(r)} disabled={!canWrite}>
                Remove
              </button>
            </span>
          </li>
        ))}
        {rows && !list.length && (
          <li>
            <EmptyArt motif={isRsvp ? 'diya' : 'bansuri'}>
              <p>{isRsvp ? 'No RSVPs yet. They appear when visitors tap “I’ll attend” on an upcoming programme.' : 'No sign-ups yet. The form is on the home page.'}</p>
            </EmptyArt>
          </li>
        )}
      </ul>
    </div>
  );
}

// A YouTube performance shown with an art form when it is "art form of the week".
function FeaturedPanel({ canWrite, notify }) {
  const { artForms, features, refresh } = useData();
  const [form, setForm] = useState({ artForm: '', youtube: '' });
  const [busy, setBusy] = useState(false);
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api('/api/admin/features', { method: 'POST', body: form });
      notify(`Featured “${r.title}”.`);
      setForm({ artForm: '', youtube: '' });
      refresh();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (f) => {
    try {
      await api(`/api/admin/features?id=${encodeURIComponent(f.id)}`, { method: 'DELETE' });
      notify('Video removed.');
      refresh();
    } catch (err) {
      notify(err.message, true);
    }
  };
  const nameOf = Object.fromEntries(artForms.map((f) => [f.id, f.name]));
  return (
    <div>
      <form className="card admin-form has-motif" onSubmit={save}>
        <Motif name="sitar" className="tr sm" />
        <h3>Feature a performance</h3>
        <p className="muted">
          When an art form is the home page’s “art form of the week”, its video plays there. Paste a public YouTube link, ideally from{' '}
          <a href="https://youtube.com/@spicmacay" target="_blank" rel="noreferrer">SPIC MACAY’s channel</a>. The link is checked with YouTube before it’s saved.
        </p>
        <div className="admin-grid">
          <label className="admin-field">
            <span>Art form *</span>
            <select value={form.artForm} onChange={(e) => setForm({ ...form, artForm: e.target.value })} required>
              <option value="">—</option>
              {artForms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>YouTube link *</span>
            <input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" required />
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-maroon" disabled={!canWrite || busy}>
            {busy ? 'Checking with YouTube…' : 'Save'}
          </button>
        </div>
      </form>
      <ul className="admin-list">
        {features.map((f) => (
          <li key={f.id}>
            <span>
              <strong>{nameOf[f.artForm] ?? f.artForm}</strong>
              <small>
                {f.title} · {f.channel}
              </small>
            </span>
            <span className="admin-row-actions">
              <a href={`https://www.youtube.com/watch?v=${f.youtubeId}`} target="_blank" rel="noreferrer">
                Watch
              </a>
              <button className="danger" onClick={() => remove(f)} disabled={!canWrite}>
                Remove
              </button>
            </span>
          </li>
        ))}
        {!features.length && (
          <li>
            <EmptyArt motif="sitar">
              <p>No featured videos yet. Without one, the home page links to SPIC MACAY’s YouTube channel instead.</p>
            </EmptyArt>
          </li>
        )}
      </ul>
    </div>
  );
}

// Owners invite people by email; the invite link is sent by hand (email, WhatsApp).
function AccessPanel({ me, canWrite, notify }) {
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState({ email: '', role: 'admin' });
  const [invite, setInvite] = useState(null); // { email, link }
  const [busy, setBusy] = useState(false);
  const load = () =>
    api('/api/admin/access')
      .then(setRows)
      .catch((err) => {
        setRows([]);
        notify(err.message, true);
      });
  useEffect(() => {
    if (canWrite) load();
    else setRows([]);
  }, [canWrite]);

  const send = async (email, role) => {
    setBusy(true);
    try {
      const r = await api('/api/admin/access', { method: 'POST', body: { email, role } });
      const link = `${window.location.origin}/admin?invite=${encodeURIComponent(r.invite)}&email=${encodeURIComponent(r.email)}`;
      setInvite({ email: r.email, link });
      setForm({ email: '', role: 'admin' });
      load();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (a) => {
    if (!window.confirm(`Remove admin access for ${a.email}? They will be signed out straight away.`)) return;
    try {
      await api(`/api/admin/access?email=${encodeURIComponent(a.email)}`, { method: 'DELETE' });
      notify(`Removed ${a.email}.`);
      load();
    } catch (err) {
      notify(err.message, true);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(invite.link);
      notify('Invitation link copied.');
    } catch {
      notify('Copy failed; select the link and copy it.', true);
    }
  };

  const mail = invite
    ? `mailto:${invite.email}?subject=${encodeURIComponent('Admin access: SPIC MACAY IIM Lucknow website')}&body=${encodeURIComponent(
        `You have been given admin access to the SPIC MACAY IIM Lucknow chapter website.\n\nOpen this link within 7 days to set your password:\n${invite.link}\n\nAfterwards, sign in at ${window.location.origin}/admin with this email and your password.`,
      )}`
    : '';

  return (
    <div>
      <form
        className="card admin-form has-motif"
        onSubmit={(e) => {
          e.preventDefault();
          send(form.email, form.role);
        }}
      >
        <Motif name="gateway" className="tr sm" />
        <h3>Give someone admin access</h3>
        <p className="muted">
          They get a one-time link, valid for 7 days, to set their own password. Then they sign in here with their email and password.
          Admins can edit everything except who has access; owners can also manage access.
        </p>
        <div className="admin-grid">
          <label className="admin-field">
            <span>Email *</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@iiml.ac.in" required />
          </label>
          <label className="admin-field">
            <span>Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="owner">Owner (can also manage access)</option>
            </select>
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-maroon" disabled={!canWrite || busy}>
            Create invitation
          </button>
        </div>
      </form>

      {invite && (
        <div className="admin-banner invite-banner" role="status">
          <p>
            <strong>Invitation for {invite.email}.</strong> Send them this link; it is shown only once and works for 7 days.
          </p>
          <input className="invite-link" readOnly value={invite.link} onFocus={(e) => e.target.select()} aria-label="Invitation link" />
          <div className="admin-actions">
            <button className="btn btn-maroon" onClick={copy}>
              Copy link
            </button>
            <a className="btn btn-outline" href={mail}>
              Email it
            </a>
          </div>
        </div>
      )}

      <ul className="admin-list">
        {(rows ?? []).map((a) => (
          <li key={a.email}>
            <span>
              <strong>
                {a.email} <span className="tab-count">{a.role}</span>
              </strong>
              <small>
                {a.status === 'active'
                  ? `Active${a.lastLogin ? ` · last signed in ${formatDate(a.lastLogin.slice(0, 10))}` : ''}`
                  : a.status === 'invited'
                    ? `Invitation pending · expires ${formatDate(new Date(a.inviteExpires).toISOString().slice(0, 10))}`
                    : 'Invitation expired'}
                {a.invitedBy ? ` · invited by ${a.invitedBy}` : ''}
              </small>
            </span>
            <span className="admin-row-actions">
              <button onClick={() => send(a.email, a.role)} disabled={!canWrite || busy}>
                {a.status === 'active' ? 'Reset password' : 'New link'}
              </button>
              <button className="danger" onClick={() => revoke(a)} disabled={!canWrite || a.email === me.email}>
                Remove
              </button>
            </span>
          </li>
        ))}
        {rows && !rows.length && (
          <li>
            <EmptyArt motif="gateway">
              <p>Only the chapter password has access so far. Invite people above.</p>
            </EmptyArt>
          </li>
        )}
      </ul>
    </div>
  );
}

const TABS = [
  { id: 'events', label: 'Programmes' },
  { id: 'photos', label: 'Photos' },
  { id: 'import', label: 'Import' },
  { id: 'rsvps', label: 'RSVPs' },
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'featured', label: 'Featured video' },
  { id: 'access', label: 'Access' },
  { id: 'artists', label: 'Artists' },
  { id: 'team', label: 'Team' },
];

export default function Admin() {
  useTitle('Volunteer admin');
  const sets = useFieldSets();
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  // Arriving from an invitation link: /admin?invite=…&email=…
  const [invite] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('invite') ? { token: p.get('invite'), email: p.get('email') || '' } : null;
  });
  const [error, setError] = useState('');
  const [tab, setTab] = useState('events');
  const [toast, setToast] = useState(null);

  const load = () => api('/api/admin/session').then(setSession).catch(() => setSession({ unavailable: true }));
  useEffect(() => {
    load();
  }, []);

  const notify = (text, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const signIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = invite ? { email: invite.email, invite: invite.token, password } : { email, password };
      await api('/api/admin/session', { method: 'POST', body });
      setPassword('');
      if (invite) window.history.replaceState(null, '', '/admin');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const signOut = async () => {
    await api('/api/admin/session', { method: 'DELETE' }).catch(() => {});
    load();
  };

  if (!session) return <section className="container section admin-page" />;

  const configured = session.configured ?? {};
  const canWrite = session.authenticated && configured.db;

  return (
    <section className="container section admin-page">
      <div className="section-head admin-head">
        <div>
          <p className="eyebrow">Volunteers only</p>
          <h1>Chapter admin</h1>
        </div>
        {session.authenticated && (
          <div className="admin-who">
            <span className="muted small">
              Signed in as <strong>{session.user?.label}</strong> ({session.user?.role})
            </span>
            <button className="btn btn-outline" onClick={signOut}>
              Sign out
            </button>
          </div>
        )}
      </div>

      {session.unavailable && (
        <div className="card has-motif">
          <EmptyArt motif="gateway">
            <p>The admin service isn’t reachable. It runs as a Vercel function; on your computer use <code>npm run dev</code>.</p>
          </EmptyArt>
        </div>
      )}

      {!session.unavailable && !session.authenticated && (
        <div className="admin-login-wrap">
          <form className="card admin-login has-motif" onSubmit={signIn}>
            <Motif name="jaali" />
            <h2>{invite ? 'Set your password' : 'Sign in'}</h2>
            {configured.auth && invite ? (
              <>
                <p className="muted">
                  You’ve been invited as an admin for <strong>{invite.email}</strong>. Choose a password of at least 10 characters.
                </p>
                <input type="email" value={invite.email} autoComplete="username" readOnly hidden />
                <label className="admin-field wide">
                  <span>New password</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={10} required />
                </label>
                {error && <p className="admin-error">{error}</p>}
                <button className="btn btn-maroon">Set password and sign in</button>
              </>
            ) : configured.auth ? (
              <>
                <label className="admin-field wide">
                  <span>Email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="Leave blank to use the chapter password" />
                </label>
                <label className="admin-field wide">
                  <span>{email ? 'Your password' : 'Chapter admin password'}</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                </label>
                {error && <p className="admin-error">{error}</p>}
                <button className="btn btn-maroon">Sign in</button>
              </>
            ) : (
              <p>
                Sign-in isn’t set up yet. Add <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> (32+ random
                characters) to the environment, then redeploy.
              </p>
            )}
          </form>
        </div>
      )}

      {session.authenticated && (
        <>
          <ul className="admin-checks">
            <li className={configured.db ? 'ok' : 'todo'}>Database (NeonDB) {configured.db ? 'connected' : '— add DATABASE_URL'}</li>
            <li className={configured.blob ? 'ok' : 'todo'}>Photo storage (Vercel Blob) {configured.blob ? 'connected' : '— connect a Blob store'}</li>
          </ul>

          <div className="tabs" role="tablist">
            {TABS.filter((t) => t.id !== 'access' || session.user?.role === 'owner').map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {sets[tab] && <DatasetEditor key={tab} resource={tab} set={sets[tab]} canWrite={canWrite} notify={notify} />}
          {tab === 'photos' && <PhotosEditor canWrite={canWrite} blobReady={configured.blob} notify={notify} />}
          {tab === 'import' && <ImportPanel canWrite={canWrite} notify={notify} />}
          {(tab === 'rsvps' || tab === 'subscribers') && <ResponsesPanel key={tab} type={tab} canWrite={canWrite} notify={notify} />}
          {tab === 'featured' && <FeaturedPanel canWrite={canWrite} notify={notify} />}
          {tab === 'access' && session.user?.role === 'owner' && <AccessPanel me={session.user} canWrite={canWrite} notify={notify} />}
        </>
      )}

      {toast && (
        <div className={toast.isError ? 'toast error' : 'toast'} role="status">
          {toast.text}
        </div>
      )}
    </section>
  );
}
