import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useData } from '../lib/DataContext.jsx';
import { useLang } from '../lib/i18n.jsx';
import { useTheme } from '../lib/theme.js';
import { WarliBand } from './Art.jsx';

const links = [
  { to: '/map', key: 'nav.map' },
  { to: '/artists', key: 'nav.artists' },
  { to: '/art-forms', key: 'nav.artForms' },
  { to: '/conventions', key: 'nav.conventions' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/dashboard', key: 'nav.chapter' },
];
const learn = [
  { to: '/glossary', key: 'nav.glossary' },
  { to: '/lineages', key: 'nav.lineages' },
  { to: '/heritage-walk', key: 'nav.heritage' },
  { to: '/ragas', key: 'nav.ragas' },
  { to: '/talas', key: 'nav.talas' },
  { to: '/instruments', key: 'nav.instruments' },
  { to: '/quiz', key: 'nav.quiz' },
];

const ThemeIcon = ({ theme }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    {theme === 'dark' ? (
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    ) : theme === 'light' ? (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
      </>
    )}
  </svg>
);

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const learnRef = useRef(null);
  const { pathname, search } = useLocation();
  const { fromDatabase } = useData();
  const { lang, setLang, t } = useLang();
  const { theme, cycle } = useTheme();
  const year = new Date().getFullYear();
  const learnActive = learn.some((l) => pathname.startsWith(l.to));

  useEffect(() => {
    setOpen(false);
    setLearnOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // Lock page scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Swipeable tab rows on phones: bring the selected tab into view.
  useEffect(() => {
    document.querySelectorAll('.tabs').forEach((row) => {
      const on = row.querySelector('[aria-pressed="true"], [aria-selected="true"]');
      if (on && row.scrollWidth > row.clientWidth) row.scrollLeft = on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2;
    });
  }, [pathname, search]);

  useEffect(() => {
    if (!open && !learnOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setLearnOpen(false);
      }
    };
    const onClick = (e) => learnOpen && !learnRef.current?.contains(e.target) && setLearnOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open, learnOpen]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand" aria-label="SPIC MACAY IIM Lucknow chapter, home">
            <img src="/spicmacay-logo.svg" alt="SPIC MACAY" width="97" height="40" />
            <span className="brand-chapter">
              IIM Lucknow
              <small>Chapter</small>
            </span>
          </NavLink>
          <div className="header-tools">
            <button className="tool-btn lang-btn" onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} aria-label={t('lang.label')} title={t('lang.label')}>
              {t('lang.switch')}
            </button>
            <button className="tool-btn" onClick={cycle} aria-label={t(`theme.${theme}`)} title={t(`theme.${theme}`)}>
              <ThemeIcon theme={theme} />
            </button>
            <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" aria-label={t('nav.menu')} onClick={() => setOpen((o) => !o)}>
              <span />
              <span />
              <span />
            </button>
          </div>
          <nav id="site-nav" className={open ? 'nav open' : 'nav'}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to}>
                {t(l.key)}
              </NavLink>
            ))}
            <div className={learnOpen ? 'nav-more open' : 'nav-more'} ref={learnRef}>
              <button className={learnActive ? 'active' : ''} aria-expanded={learnOpen} aria-haspopup="true" onClick={() => setLearnOpen((o) => !o)}>
                {t('nav.learn')} <span aria-hidden="true">▾</span>
              </button>
              <div className="nav-menu" role="menu" data-label={t('nav.learn')}>
                {learn.map((l) => (
                  <NavLink key={l.to} to={l.to} role="menuitem">
                    {t(l.key)}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </div>
        <div className="toran" aria-hidden="true" />
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <WarliBand className="footer-band" count={30} />
        <div className="container footer-grid">
          <div className="footer-brand">
            <p className="footer-title">SPIC MACAY · IIM Lucknow</p>
            <p>{t('footer.society')}</p>
            <p className="devanagari" lang="hi">
              संगीत · नृत्य · संस्कृति
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <p className="footer-head">{t('footer.explore')}</p>
            {[...links, ...learn].map((l) => (
              <Link key={l.to} to={l.to}>
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="footer-links">
            <p className="footer-head">{t('footer.sources')}</p>
            <a href="https://spicmacay.org" target="_blank" rel="noreferrer">spicmacay.org</a>
            <a href="https://spicmacay.org/our-presence" target="_blank" rel="noreferrer">{t('footer.reach')}</a>
            <a href="https://intcon.spicmacay.org/" target="_blank" rel="noreferrer">{t('footer.convention')}</a>
            <a href="https://youtube.com/@spicmacay" target="_blank" rel="noreferrer">YouTube</a>
            <Link to="/admin">{t('footer.login')}</Link>
            {fromDatabase && <span className="muted-on-dark">Chapter data: NeonDB</span>}
          </div>
        </div>
        <div className="container footer-credit">
          <p className="creator">
            {t('footer.created')} <strong>Shivanshi Srivastava</strong>
          </p>
          <p>
            © {year} Shivanshi Srivastava · SPIC MACAY IIM Lucknow Chapter. {t('footer.rights')}
          </p>
          <p className="fineprint">{t('footer.fine')}</p>
        </div>
      </footer>
    </div>
  );
}
