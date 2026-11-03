import { formatNumber } from '../lib/format.js';

// Horizontal bars for one series: [{ label, value }].
export function BarList({ data, unit = '' }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="barlist">
      {data.map((d) => (
        <li key={d.label} className="barlist-row" tabIndex={0}>
          <span className="barlist-label">{d.label}</span>
          <span className="barlist-track">
            <span className="barlist-bar" style={{ width: `${(d.value / max) * 100}%` }} />
          </span>
          <span className="barlist-value">{formatNumber(d.value)}</span>
          <span className="chart-tip" role="tooltip">
            {d.label}: <strong>{formatNumber(d.value)}</strong>
            {unit && ` ${unit}`}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Vertical columns for one series over time: [{ label, value, title }].
export function Columns({ data, unit = '' }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="columns" role="list">
      {data.map((d) => (
        <div key={d.label} className="column" role="listitem" tabIndex={0}>
          <div className="column-plot">
            <div className="column-bar" style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="column-label">{d.label}</span>
          <span className="chart-tip" role="tooltip">
            {d.title || d.label}: <strong>{formatNumber(d.value)}</strong>
            {unit && ` ${unit}`}
          </span>
        </div>
      ))}
    </div>
  );
}
