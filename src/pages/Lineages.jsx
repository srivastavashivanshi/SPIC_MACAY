import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { lineages, relationLabel } from '../data/lineages.js';
import { useData } from '../lib/DataContext.jsx';
import { useT } from '../lib/i18n.jsx';
import { Initials, PageHeader } from '../components/ui.jsx';
import { Motif } from '../components/Art.jsx';

const traditionMotif = (tr) =>
  /dance|kathak|bharat/i.test(tr) ? 'peacock' : /tabla|percussion/i.test(tr) ? 'tabla' : /vocal|dhrupad/i.test(tr) ? 'tanpura' : 'sitar';

function Node({ node, parent, selected, onSelect, artistIds }) {
  const isSelected = selected === node.name;
  const inExplorer = node.artistId && artistIds.has(node.artistId);
  return (
    <li>
      <button className={isSelected ? 'tree-node selected' : 'tree-node'} onClick={() => onSelect(isSelected ? '' : node.name)} aria-expanded={isSelected}>
        <Initials name={node.name} size="sm" />
        <span>
          <strong>{node.name}</strong>
          {node.note && <small>{node.note}</small>}
          {parent && node.relation && <small>{relationLabel[node.relation]} {parent}</small>}
        </span>
      </button>
      {isSelected && (node.source || inExplorer) && (
        <div className="tree-detail">
          {inExplorer && <Link to={`/artists/${node.artistId}`}>View artist →</Link>}
          {node.source && (
            <a href={node.source} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          )}
        </div>
      )}
      {node.children?.length > 0 && (
        <ul>
          {node.children.map((c) => (
            <Node key={c.name} node={c} parent={node.name} selected={selected} onSelect={onSelect} artistIds={artistIds} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Lineages() {
  const t = useT();
  const { artists } = useData();
  const artistIds = new Set(artists.map((a) => a.id));
  const [params, setParams] = useSearchParams();
  const tradition = params.get('tradition') || '';
  const [selected, setSelected] = useState('');
  const traditions = [...new Set(lineages.map((l) => l.tradition))];
  const visible = lineages.filter((l) => !tradition || l.tradition === tradition);

  return (
    <>
      <PageHeader eyebrow={t('lineage.eyebrow')} hindi="गुरु–शिष्य परंपरा" title={t('lineage.title')}>
        {t('lineage.lede')}
      </PageHeader>
      <section className="container">
        <div className="tabs" role="group" aria-label={t('lineage.filter')}>
          <button aria-pressed={!tradition} onClick={() => setParams({}, { replace: true })}>
            {t('common.all')} <span className="tab-count">{lineages.length}</span>
          </button>
          {traditions.map((tr) => (
            <button key={tr} aria-pressed={tradition === tr} onClick={() => setParams({ tradition: tr }, { replace: true })}>
              {tr}
            </button>
          ))}
        </div>
        <div className="lineage-grid">
          {visible.map((l) => (
            <article key={l.id} className="card lineage-card has-motif">
              <Motif name={traditionMotif(l.tradition)} className="sm" />
              <p className="eyebrow">{l.tradition}</p>
              <h2>{l.name}</h2>
              <ul className="tree">
                <Node node={l.tree} selected={selected} onSelect={setSelected} artistIds={artistIds} />
              </ul>
            </article>
          ))}
        </div>
        <p className="source-note">Each link was confirmed in the student’s Wikipedia article on 31 Oct 2026. Tap a name for its source.</p>
      </section>
    </>
  );
}
