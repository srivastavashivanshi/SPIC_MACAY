import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary.js';

// Longest spellings first, so "tala cycles" wins over "tala".
const entries = glossary.flatMap((g) => g.match.map((m) => [m, g])).sort((a, b) => b[0].length - a[0].length);
const byWord = new Map(entries.map(([m, g]) => [m.toLowerCase(), g]));
const pattern = new RegExp(`(?<![\\p{L}-])(${entries.map(([m]) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}-])`, 'giu');

// A term with its definition on hover, focus or tap.
export function Term({ entry, children }) {
  return (
    <dfn className="term" tabIndex={0} aria-describedby={`def-${entry.id}`}>
      {children}
      <span className="term-tip" role="tooltip" id={`def-${entry.id}`}>
        <strong>
          {entry.term} <span lang="hi">{entry.hi}</span>
        </strong>
        {entry.def}
        <Link to={`/glossary#${entry.id}`}>Glossary →</Link>
      </span>
    </dfn>
  );
}

// Marks the first use of each glossary term in a piece of text.
export default function GlossaryText({ children }) {
  if (typeof children !== 'string') return children;
  const seen = new Set();
  const parts = children.split(pattern);
  return parts.map((part, i) => {
    const entry = i % 2 ? byWord.get(part.toLowerCase()) : null;
    if (!entry || seen.has(entry.id)) return <Fragment key={i}>{part}</Fragment>;
    seen.add(entry.id);
    return (
      <Term key={i} entry={entry}>
        {part}
      </Term>
    );
  });
}
