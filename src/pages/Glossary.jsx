import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { glossary } from '../data/glossary.js';
import { EmptyArt, PageHeader } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';
import { useT } from '../lib/i18n.jsx';

const groupMotifs = {
  Music: ['sitar', 'tabla', 'bansuri', 'tanpura'],
  Dance: ['peacock', 'ghungroo', 'lotus'],
  Tradition: ['gateway', 'temple'],
  'SPIC MACAY': ['diya', 'jaali', 'paisley'],
};

export default function Glossary() {
  const t = useT();
  const { hash } = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [hash]);

  const q = query.trim().toLowerCase();
  const visible = glossary.filter((g) => !q || [g.term, g.hi, g.def].some((s) => s.toLowerCase().includes(q)));
  const groups = [...new Set(visible.map((g) => g.group))];

  return (
    <>
      <PageHeader eyebrow={t('glossary.eyebrow')} hindi="शब्दकोश" title={t('glossary.title')}>
        {t('glossary.lede')}
      </PageHeader>
      <section className="container">
        <div className="filter-bar">
          <input type="search" placeholder={t('glossary.search')} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t('glossary.search')} />
          <span className="result-count">
            {visible.length} / {glossary.length}
          </span>
        </div>
        {groups.map((group) => (
          <div key={group} className="glossary-group">
            <h2>{group}</h2>
            <dl className="glossary-grid">
              {visible
                .filter((g) => g.group === group)
                .map((g, i) => (
                  <div key={g.id} id={g.id} className={`glossary-card has-motif${hash === `#${g.id}` ? ' active' : ''}`}>
                    <Motif name={(groupMotifs[g.group] ?? ['lotus'])[i % (groupMotifs[g.group]?.length ?? 1)]} className="sm" />
                    <dt>
                      {g.term} <span className="devanagari" lang="hi">{g.hi}</span>
                    </dt>
                    <dd>{g.def}</dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
        {!visible.length && (
          <EmptyArt motif="paisley">
            <p>Nothing matches “{query}”.</p>
          </EmptyArt>
        )}
      </section>
    </>
  );
}
