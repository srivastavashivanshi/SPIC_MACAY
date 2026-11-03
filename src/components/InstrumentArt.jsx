// Line drawings of instruments on a 480×240 grid, in the site's Warli/temple-art style.
const range = (from, to, step) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

const pegs = (x) => (
  <>
    <path d={`M${x} 112 l-4 -16 M${x + 14} 112 l-4 -16 M${x + 7} 130 l-4 16 M${x + 21} 130 l-4 16`} strokeWidth="3" />
    <path d={`M${x - 8} 112 H${x + 26} V130 H${x - 8}`} />
  </>
);

const drawings = {
  sitar: () => (
    <>
      <circle cx="95" cy="130" r="62" />
      <ellipse cx="100" cy="128" rx="46" ry="50" fill="currentColor" fillOpacity="0.06" />
      <rect x="92" y="118" width="22" height="8" rx="2" fill="currentColor" fillOpacity="0.3" />
      <rect x="150" y="112" width="290" height="18" rx="4" />
      {range(175, 415, 24).map((x) => (
        <path key={x} d={`M${x} 112 q6 -8 12 0`} strokeWidth="1.4" />
      ))}
      {range(200, 380, 20).map((x) => (
        <circle key={x} cx={x} cy="134" r="1.6" fill="currentColor" stroke="none" />
      ))}
      <path d="M395 130 V134" />
      <circle cx="395" cy="152" r="20" />
      <path d="M60 119 L446 117 M60 123 L446 121 M60 127 L446 125" strokeWidth="0.7" />
      {pegs(442)}
    </>
  ),
  sarod: () => (
    <>
      <path d="M30 130 C30 66 165 66 178 108 L178 152 C165 194 30 194 30 130 Z" />
      <circle cx="95" cy="130" r="42" fill="currentColor" fillOpacity="0.06" />
      <rect x="90" y="122" width="16" height="6" rx="2" fill="currentColor" fillOpacity="0.3" />
      <path d="M178 112 L400 118 L400 130 L178 148 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M190 120 L395 123" strokeWidth="0.8" strokeDasharray="10 6" />
      <rect x="400" y="110" width="55" height="28" rx="6" />
      <path d="M410 110 l-3 -12 M425 110 l-3 -12 M440 110 l-3 -12 M410 138 l-3 12 M425 138 l-3 12 M440 138 l-3 12" strokeWidth="3" />
      <circle cx="470" cy="124" r="12" />
      <path d="M118 160 l14 0 l-7 14 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M70 123 L455 121 M70 127 L455 125" strokeWidth="0.7" />
    </>
  ),
  tabla: () => (
    <>
      <path d="M60 110 C60 205 220 205 220 110" />
      <ellipse cx="140" cy="110" rx="80" ry="18" />
      <ellipse cx="140" cy="110" rx="72" ry="15" strokeWidth="0.8" />
      <ellipse cx="118" cy="110" rx="22" ry="6" fill="currentColor" />
      {range(72, 208, 17).map((x) => (
        <path key={x} d={`M${x} 118 Q${x + (x - 140) * 0.05} 150 ${140 + (x - 140) * 0.5} ${178 - Math.abs(x - 140) * 0.12}`} strokeWidth="0.8" />
      ))}
      <path d="M275 78 L285 205 L365 205 L375 78" />
      <ellipse cx="325" cy="78" rx="50" ry="12" strokeDasharray="3 2" strokeWidth="2.2" />
      <ellipse cx="325" cy="78" rx="44" ry="10" />
      <ellipse cx="325" cy="78" rx="36" ry="8" strokeWidth="0.7" />
      <ellipse cx="325" cy="78" rx="16" ry="4.5" fill="currentColor" />
      {range(282, 368, 12).map((x) => (
        <path key={x} d={`M${x} 88 L${x + (x - 325) * 0.05} 200`} strokeWidth="0.8" />
      ))}
      {range(288, 360, 24).map((x) => (
        <rect key={x} x={x - 4} y="156" width="10" height="18" rx="2" fill="currentColor" fillOpacity="0.25" />
      ))}
    </>
  ),
  veena: () => (
    <>
      <ellipse cx="95" cy="130" rx="72" ry="58" />
      <ellipse cx="98" cy="128" rx="50" ry="44" fill="currentColor" fillOpacity="0.06" />
      <rect x="92" y="118" width="18" height="8" rx="2" fill="currentColor" fillOpacity="0.3" />
      <rect x="160" y="110" width="240" height="22" rx="5" />
      {range(180, 390, 13).map((x) => (
        <path key={x} d={`M${x} 108 V112`} strokeWidth="2" />
      ))}
      <path d="M400 112 C430 100 440 80 460 78 C472 82 470 96 458 99 C446 103 440 120 430 132 L400 132 Z" />
      <circle cx="456" cy="86" r="2.5" fill="currentColor" stroke="none" />
      <path d="M370 132 V146" />
      <circle cx="370" cy="170" r="24" />
      <path d="M70 116 L432 116 M70 120 L432 119 M70 124 L432 122" strokeWidth="0.7" />
    </>
  ),
  bansuri: () => (
    <>
      <rect x="20" y="105" width="440" height="20" rx="10" />
      <rect x="20" y="105" width="10" height="20" rx="5" fill="currentColor" fillOpacity="0.35" />
      <path d="M120 105 V125 M300 105 V125" strokeWidth="0.8" />
      {range(34, 46, 3).map((x) => (
        <path key={x} d={`M${x} 105 V125`} strokeWidth="1" />
      ))}
      {range(436, 448, 3).map((x) => (
        <path key={x} d={`M${x} 105 V125`} strokeWidth="1" />
      ))}
      <ellipse cx="75" cy="115" rx="6" ry="4" fill="currentColor" />
      {[250, 275, 300, 335, 360, 385].map((x) => (
        <circle key={x} cx={x} cy="115" r="4.5" fill="currentColor" stroke="none" />
      ))}
    </>
  ),
  tanpura: () => (
    <>
      <circle cx="95" cy="130" r="65" />
      <ellipse cx="100" cy="128" rx="50" ry="54" fill="currentColor" fillOpacity="0.06" />
      <rect x="92" y="117" width="24" height="9" rx="2" fill="currentColor" fillOpacity="0.3" />
      <path d="M116 117 l4 14 M116 121 l4 12" strokeWidth="0.8" />
      {[116, 119.5, 123, 126.5].map((y) => (
        <circle key={y} cx="52" cy={y} r="2.4" fill="currentColor" stroke="none" />
      ))}
      <rect x="155" y="112" width="290" height="18" rx="4" />
      <path d="M40 116 L446 116 M40 119.5 L446 119 M40 123 L446 122 M40 126.5 L446 125" strokeWidth="0.7" />
      {pegs(442)}
    </>
  ),
  mridangam: () => (
    <>
      <path d="M80 75 C180 50 300 50 400 82 L400 168 C300 200 180 200 80 175 Z" />
      {range(85, 165, 10).map((y) => (
        <path key={y} d={`M80 ${y} Q240 ${125 + (y - 125) * 1.45} 400 ${125 + (y - 125) * 0.86}`} strokeWidth="0.8" />
      ))}
      <ellipse cx="80" cy="125" rx="18" ry="50" fill="currentColor" fillOpacity="0.08" />
      <ellipse cx="400" cy="125" rx="15" ry="43" fill="currentColor" fillOpacity="0.08" />
      <ellipse cx="400" cy="125" rx="6" ry="17" fill="currentColor" />
    </>
  ),
  shehnai: () => (
    <>
      <path d="M22 116 L48 112 L48 120 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M48 110 L360 100 L360 132 L48 122 Z" />
      {range(120, 330, 30).map((x) => (
        <circle key={x} cx={x} cy="116" r="3.2" fill="currentColor" stroke="none" />
      ))}
      <path d="M360 96 C400 92 430 70 455 62 L455 170 C430 162 400 140 360 136 Z" fill="currentColor" fillOpacity="0.06" />
      <path d="M370 102 C400 100 425 86 445 78 M370 130 C400 132 425 146 445 154" strokeWidth="0.8" />
    </>
  ),
};

export default function InstrumentArt({ id, parts = [], active, onPick }) {
  const Draw = drawings[id];
  if (!Draw) return null;
  return (
    <svg viewBox="0 0 480 240" className="instrument-svg" role="img" aria-label={id}>
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <Draw />
      </g>
      {parts.map((p, i) => (
        <g
          key={p.id}
          className={active === p.id ? 'hotspot on' : 'hotspot'}
          tabIndex={0}
          role="button"
          aria-label={p.name}
          onClick={() => onPick?.(p.id)}
          onMouseEnter={() => onPick?.(p.id)}
          onFocus={() => onPick?.(p.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick?.(p.id)}
        >
          <circle cx={p.x} cy={p.y} r="11" />
          <text x={p.x} y={p.y + 4} textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
