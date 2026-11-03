import { Link } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { Divider, Ghungroo, Lotus, LucknowSkyline, Mandala, Motif, Tanpura, Tabla, Diya, WarliBand } from '../components/Art.jsx';
import { useTitle } from '../lib/useTitle.js';
import { presenceStates, presenceSource } from '../data/presence.js';
import { aboutSource, milestones, mission } from '../data/about.js';
import { formatNumber, isUpcoming } from '../lib/format.js';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { Subscribe, WeeklyArtForm } from '../components/Engage.jsx';
import GlossaryText from '../components/GlossaryText.jsx';

const sections = [
  { to: '/map', title: 'nav.map', text: 'explore.map', Icon: Lotus, motif: 'gateway' },
  { to: '/artists', title: 'nav.artists', text: 'explore.artists', Icon: Tanpura, motif: 'sitar' },
  { to: '/art-forms', title: 'nav.artForms', text: 'explore.artForms', Icon: Ghungroo, motif: 'peacock' },
  { to: '/conventions', title: 'nav.conventions', text: 'explore.conventions', Icon: Tabla, motif: 'temple' },
  { to: '/dashboard', title: 'nav.chapter', text: 'explore.chapter', Icon: Diya, motif: 'jaali' },
];

const institutions = presenceStates.reduce((n, s) => n + s.institutions, 0);
const programmes = presenceStates.reduce((n, s) => n + s.programs, 0);
const statesActive = presenceStates.filter((s) => s.institutions > 0).length;

export default function Home() {
  const { events } = useData();
  const t = useT();
  const local = useLocal();
  useTitle(null);
  const upcoming = events.filter(isUpcoming).length;

  return (
    <>
      <section className="hero">
        <Mandala className="hero-mandala" size={720} />
        <div className="container hero-inner">
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <p className="hero-hindi devanagari" lang="hi">
            विरासत
          </p>
          <h1>
            {t('home.title1')} <em>{t('home.title2')}</em>
          </h1>
          <p className="lede">{t('home.lede')}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/map">
              {t('home.ctaMap')}
            </Link>
            <Link className="btn btn-ghost" to="/dashboard">
              {t('home.ctaChapter')}
            </Link>
          </div>
        </div>
        <WarliBand className="hero-band" count={34} />
      </section>

      <section className="container">
        <div className="stat-ribbon">
          <div className="stat has-motif">
            <Motif name="diya" className="sm" />
            <div className="stat-value">1977</div>
            <div className="stat-label">{t('home.statFounded')}</div>
          </div>
          <div className="stat has-motif">
            <Motif name="gateway" className="sm" />
            <div className="stat-value">{statesActive}</div>
            <div className="stat-label">{t('home.statStates')}</div>
          </div>
          <div className="stat has-motif">
            <Motif name="temple" className="sm" />
            <div className="stat-value">{formatNumber(institutions)}</div>
            <div className="stat-label">{t('home.statInstitutions')}</div>
          </div>
          <div className="stat has-motif">
            <Motif name="bansuri" className="sm" />
            <div className="stat-value">{formatNumber(programmes)}</div>
            <div className="stat-label">{t('home.statProgrammes')}</div>
          </div>
        </div>
        <p className="source-note center">
          {t('home.figures')}{' '}
          <a href={presenceSource.url} target="_blank" rel="noreferrer">
            {t('home.officialMap')}
          </a>
        </p>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">{t('home.exploreEyebrow')}</p>
          <h2>{t('home.exploreTitle')}</h2>
        </div>
        <div className="explore-grid">
          {sections.map(({ to, title, text, Icon, motif }) => (
            <Link key={to} to={to} className="explore-card has-motif">
              <Motif name={motif} />
              <span className="explore-icon">
                <Icon size={44} />
              </span>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
              <span className="explore-more">
                {t('common.open')} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <WeeklyArtForm />

      <section className="mission">
        <Motif name="jaali" className="mission-art left" />
        <Motif name="jaali" className="mission-art right" />
        <div className="container mission-inner">
          <Divider className="on-dark" />
          <blockquote>
            <p>“{local.mission(mission)}”</p>
            <footer>
              {t('home.missionBy')} · <a href={aboutSource} target="_blank" rel="noreferrer">spicmacay.org</a>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <p className="eyebrow">{t('home.storyEyebrow')}</p>
          <h2>{t('home.storyTitle')}</h2>
        </div>
        <ol className="milestones">
          {milestones.map((m) => (
            <li key={m.year}>
              <span className="milestone-year">{m.year}</span>
              <p>{local.milestone(m)}</p>
            </li>
          ))}
        </ol>
        <p className="source-note">
          {t('common.source')}: <a href={aboutSource} target="_blank" rel="noreferrer">spicmacay.org/about/story</a>
        </p>
      </section>

      <section className="container section">
        <div className="chapter-feature">
          <div>
            <p className="eyebrow">{t('home.chapterEyebrow')}</p>
            <h2>{t('home.chapterTitle')}</h2>
            <p>
              <GlossaryText>{t('home.chapterText')}</GlossaryText>
            </p>
            <Link to="/dashboard" className="btn btn-maroon">
              {t('home.chapterCta')}
            </Link>
          </div>
          <div className="chapter-feature-art">
            <Mandala size={260} petals={12} />
            <div className="chapter-feature-count">
              <strong>{upcoming}</strong>
              <span>{t('home.upcomingCount')}</span>
            </div>
          </div>
          <LucknowSkyline className="skyline" />
        </div>
      </section>

      <section className="container section">
        <Link to="/quiz" className="quiz-teaser has-motif">
          <Motif name="peacock" className="lg gold" />
          <span>
            <span className="eyebrow">{t('home.quizEyebrow')}</span>
            <strong>{t('home.quizTitle')}</strong>
            <span>{t('home.quizText')}</span>
          </span>
          <span className="btn btn-gold">{t('home.quizCta')} →</span>
        </Link>
      </section>

      <Subscribe />
    </>
  );
}
