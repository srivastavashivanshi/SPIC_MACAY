import { useState } from 'react';
import { useData } from '../lib/DataContext.jsx';
import { Link } from 'react-router-dom';
import { ArtFormTag, EmptyArt, Initials, PageHeader, SampleNote, Stat } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';
import { useT } from '../lib/i18n.jsx';
import { BarList, Columns } from '../components/Charts.jsx';
import { formatDate, formatNumber, isUpcoming } from '../lib/format.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Academic year runs July–June, e.g. "2025-26".
const academicYear = (iso) => {
  const [y, m] = iso.split('-').map(Number);
  const start = m >= 7 ? y : y - 1;
  return `${start}-${String(start + 1).slice(2)}`;
};

const countBy = (items, key) => {
  const counts = {};
  for (const item of items) counts[key(item)] = (counts[key(item)] ?? 0) + 1;
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

export default function Dashboard() {
  const { chapters, events, artFormById, artists, team } = useData();
  const t = useT();
  const [year, setYear] = useState('');
  const [query, setQuery] = useState('');
  const home = chapters.find((c) => c.home) ?? chapters[0];

  if (!home) {
    return (
      <>
        <PageHeader eyebrow="Chapter Dashboard" hindi="लखनऊ" title="Our chapter" art="skyline" />
        <section className="container">
          <EmptyArt motif="gateway">
            <p>No chapter is set up yet. Add one with <code>home: true</code> to the chapters data.</p>
          </EmptyArt>
        </section>
      </>
    );
  }

  const artistById = Object.fromEntries(artists.map((a) => [a.id, a]));
  const artistOf = (e) => artistById[e.artistId]?.name || e.artist;
  const chapterEvents = events.filter((e) => e.chapterId === home.id);
  const years = [...new Set(chapterEvents.map((e) => academicYear(e.date)))].sort().reverse();

  const scoped = chapterEvents.filter((e) => !year || academicYear(e.date) === year);
  const past = scoped.filter((e) => !isUpcoming(e));
  const upcoming = scoped.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  const withAttendance = past.filter((e) => e.audience > 0);
  const audience = withAttendance.reduce((sum, e) => sum + e.audience, 0);
  const formsPresented = new Set(past.map((e) => e.artForm)).size;

  const byForm = countBy(scoped, (e) => artFormById[e.artForm]?.name ?? 'Other');
  const byType = countBy(scoped, (e) => e.type);

  // Audience per month across the July–June academic calendar.
  const monthTotals = Array(12).fill(0);
  for (const e of past) monthTotals[Number(e.date.slice(5, 7)) - 1] += e.audience || 0;
  const byMonth = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5].map((m) => ({ label: MONTHS[m], value: monthTotals[m] }));

  const q = query.trim().toLowerCase();
  const tableRows = past.filter(
    (e) => !q || [e.title, e.venue, e.type, artFormById[e.artForm]?.name].some((s) => s?.toLowerCase().includes(q)),
  );

  return (
    <>
      <PageHeader eyebrow={t('dash.eyebrow')} hindi="लखनऊ" title={`SPIC MACAY ${home.name}`} art="skyline">
        {t('dash.lede')}
      </PageHeader>

      <section className="container">
        {chapterEvents.some((e) => e.sample) && (
          <SampleNote>Some programmes are placeholders. Replace them with the chapter’s real event log.</SampleNote>
        )}
        {chapterEvents.some((e) => e.sourceUrl?.startsWith('https://spicmacay.org')) && (
          <p className="source-note">
            Programmes listed on <a href="https://spicmacay.org/past-programmes" target="_blank" rel="noreferrer">spicmacay.org</a> are
            imported automatically; volunteers add the rest.
          </p>
        )}

        <div className="filter-bar">
          <label className="inline-label">
            Academic year
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="stats-row">
          <Stat value={past.length} label="Programmes held" motif="tabla" />
          <Stat
            value={withAttendance.length ? formatNumber(audience) : '—'}
            label="Total attendance"
            hint={withAttendance.length ? `Recorded for ${withAttendance.length} of ${past.length} programmes` : 'Not recorded yet'}
            motif="gateway"
          />
          <Stat value={formsPresented} label="Art forms presented" motif="peacock" />
          <Stat value={upcoming.length} label="Upcoming programmes" motif="diya" />
        </div>

        <div className="dash-grid">
          <div className="card has-motif">
            <Motif name="sitar" className="tr sm" />
            <h2 className="card-title">Programmes by art form</h2>
            <BarList data={byForm} unit="programmes" />
          </div>
          <div className="card has-motif">
            <Motif name="bansuri" className="tr sm" />
            <h2 className="card-title">Programmes by format</h2>
            <BarList data={byType} unit="programmes" />
          </div>
          <div className="card span-2 has-motif">
            <Motif name="jaali" className="tr sm" />
            <h2 className="card-title">Attendance by month</h2>
            <p className="muted small">July to June academic calendar, past programmes with recorded attendance</p>
            {withAttendance.length ? (
              <Columns data={byMonth} unit="attendees" />
            ) : (
              <EmptyArt motif="tabla">
                <p>Attendance hasn’t been recorded yet. Volunteers can add it on each programme in the admin page.</p>
              </EmptyArt>
            )}
          </div>
        </div>

        <div className="dash-grid">
          <div className="card has-motif">
            <Motif name="diya" />
            <h2 className="card-title">Upcoming</h2>
            {upcoming.length ? (
              <ul className="event-list">
                {upcoming.map((e) => (
                  <li key={e.id} className="event-item">
                    <div className="event-date">
                      <span className="event-day">{e.date.slice(8, 10)}</span>
                      <span className="event-month">{formatDate(e.date).split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div>
                      <Link className="event-title" to={`/programmes/${e.id}`}>
                        {e.title}
                      </Link>
                      {artistOf(e) && <div className="event-artist">{artistOf(e)}</div>}
                      <div className="event-meta">
                        {e.type} · {e.venue}
                      </div>
                      <ArtFormTag id={e.artForm} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyArt motif="diya">
                <p>Nothing scheduled{year ? ` for ${year}` : ''} yet. Watch this space.</p>
              </EmptyArt>
            )}
          </div>
          <div className="card has-motif">
            <Motif name="gateway" />
            <h2 className="card-title">Chapter team</h2>
            <ul className="team-list">
              {team.map((m) => (
                <li key={m.name}>
                  <Initials name={m.name} size="sm" />
                  <span>
                    <strong>{m.name}</strong>
                    <small>{m.role}</small>
                  </span>
                </li>
              ))}
            </ul>
            <p className="muted small">
              Want to volunteer? Find us on campus, or{' '}
              <a href="https://spicmacay.org/get-involved/volunteer" target="_blank" rel="noreferrer">
                sign up with SPIC MACAY
              </a>
              .
            </p>
          </div>
        </div>

        <div className="card section-gap has-motif">
          <Motif name="paisley" className="tr sm" />
          <div className="table-head">
            <h2 className="card-title">Past programmes</h2>
            <input
              type="search"
              placeholder="Search programmes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search past programmes"
            />
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Art form</th>
                  <th>Format</th>
                  <th className="num">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((e) => (
                  <tr key={e.id}>
                    <td className="nowrap">{formatDate(e.date)}</td>
                    <td>
                      <Link className="table-link" to={`/programmes/${e.id}`}>
                        {e.title}
                      </Link>
                      {artistOf(e) && <div className="event-artist">{artistOf(e)}</div>}
                      <div className="muted small">{e.venue}</div>
                    </td>
                    <td>{artFormById[e.artForm]?.name}</td>
                    <td>{e.type}</td>
                    <td className="num">{e.audience > 0 ? formatNumber(e.audience) : '—'}</td>
                  </tr>
                ))}
                {!tableRows.length && (
                  <tr>
                    <td colSpan={5}>
                      <EmptyArt motif="paisley">
                        <p>No programmes found.</p>
                      </EmptyArt>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
