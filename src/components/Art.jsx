import { useId } from 'react';

// Hand-built SVG drawings in a Warli / temple-art idiom. Everything draws with
// currentColor so it takes the colour of its container.

const TAU = Math.PI * 2;
const pt = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
const f = (n) => Math.round(n * 100) / 100;

// ── Mandala ───────────────────────────────────────────────────────────────
export function Mandala({ size = 400, petals = 16, className = '', style }) {
  const ring = (n, r, draw) => Array.from({ length: n }, (_, i) => draw((i / n) * TAU, i));

  const petal = (r0, r1, w) => (a, i) => {
    const [x0, y0] = pt(r0, a);
    const [x1, y1] = pt(r1, a);
    const [c1x, c1y] = pt((r0 + r1) / 2, a - w);
    const [c2x, c2y] = pt((r0 + r1) / 2, a + w);
    return <path key={i} d={`M${f(x0)} ${f(y0)} Q${f(c1x)} ${f(c1y)} ${f(x1)} ${f(y1)} Q${f(c2x)} ${f(c2y)} ${f(x0)} ${f(y0)}Z`} />;
  };
  const dot = (r, s) => (a, i) => {
    const [x, y] = pt(r, a);
    return <circle key={i} cx={f(x)} cy={f(y)} r={s} fill="currentColor" stroke="none" />;
  };
  const arc = (r, depth) => (a, i, n = petals * 2) => {
    const [x0, y0] = pt(r, a);
    const [x1, y1] = pt(r, a + TAU / n);
    const [cx, cy] = pt(r + depth, a + TAU / n / 2);
    return <path key={i} d={`M${f(x0)} ${f(y0)} Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}`} />;
  };

  return (
    <svg viewBox="-200 -200 400 400" width={size} height={size} className={className} style={style} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle r="10" fill="currentColor" stroke="none" />
      <circle r="18" />
      {ring(8, 0, petal(18, 46, 0.32))}
      <circle r="52" />
      {ring(petals, 0, dot(60, 2.2))}
      {ring(petals, 0, petal(66, 112, 0.17))}
      {ring(petals, 0.5, (a, i) => petal(70, 100, 0.12)(a + TAU / petals / 2, i))}
      <circle r="118" />
      {ring(petals * 2, 0, arc(118, 14))}
      <circle r="138" strokeDasharray="1 5" />
      {ring(petals * 2, 0, petal(142, 176, 0.06))}
      {ring(petals * 2, 0, (a, i) => dot(184, 2.6)(a, i))}
      <circle r="192" strokeWidth="0.8" />
    </svg>
  );
}

// ── Warli figures ─────────────────────────────────────────────────────────
// Each figure stands with feet at y=0, ~70 units tall, centred on x=0.
function Body({ skirt = false }) {
  return (
    <>
      <circle cx="0" cy="-60" r="6.5" fill="currentColor" stroke="none" />
      <path d="M-9 -51 L9 -51 L0 -36 Z" fill="currentColor" stroke="none" />
      <path d={skirt ? 'M0 -36 L-12 -18 L12 -18 Z' : 'M0 -36 L-8 -22 L8 -22 Z'} fill="currentColor" stroke="none" />
    </>
  );
}

function Legs({ step = 0 }) {
  return (
    <path d={`M-4 -22 L${-8 - step} -1 L${-12 - step} 0 M4 -22 L${8 + step} -1 L${12 + step} 0`} />
  );
}

export function WarliDancer({ x = 0, flip = false, skirt = false }) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} 0)`}>
      <Body skirt={skirt} />
      <Legs step={flip ? 2 : 0} />
      {/* arms reach out to the neighbours */}
      <path d={`M-8 -49 L-20 ${-40 + s * 3} M8 -49 L20 ${-40 - s * 3}`} />
    </g>
  );
}

export function WarliDrummer({ x = 0 }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <Body />
      <Legs step={2} />
      <rect x="-15" y="-36" width="30" height="13" rx="6.5" />
      <path d="M-11 -36 L-11 -23 M11 -36 L11 -23 M-8 -49 L-16 -30 M8 -49 L18 -42 L22 -50" />
    </g>
  );
}

export function WarliFlautist({ x = 0 }) {
  // Tarpa: the long gourd horn of Warli dances, held up and out.
  return (
    <g transform={`translate(${x} 0)`}>
      <Body />
      <Legs />
      <path d="M2 -60 L34 -82 M-8 -49 L10 -64 M8 -49 L22 -70" />
      <path d="M30 -84 Q42 -92 44 -78 Q36 -74 30 -84Z" fill="currentColor" stroke="none" />
    </g>
  );
}

export function WarliTree({ x = 0, h = 70 }) {
  const branches = [0.35, 0.5, 0.65, 0.8];
  return (
    <g transform={`translate(${x} 0)`}>
      <path d={`M0 0 L0 ${-h}`} />
      {branches.map((b, i) => (
        <path key={i} d={`M0 ${-h * b} L${i % 2 ? 10 : -10} ${-h * b - 10} M0 ${-h * b + 4} L${i % 2 ? -9 : 9} ${-h * b - 6}`} />
      ))}
      <circle cx="0" cy={-h - 4} r="4" fill="currentColor" stroke="none" />
    </g>
  );
}

function Bird({ x, y }) {
  return <path d={`M${x - 6} ${y} Q${x - 3} ${y - 4} ${x} ${y} Q${x + 3} ${y - 4} ${x + 6} ${y}`} />;
}

// A frieze of musicians and dancers, the way Warli paintings show a celebration.
export function WarliBand({ className = '', count = 22, style, fit = 'xMidYMax meet' }) {
  const gap = 34;
  const items = [];
  let x = 30;
  for (let i = 0; i < count; i++) {
    if (i === 3) items.push(<WarliTree key={`t${i}`} x={x} h={88} />), (x += 30);
    if (i % 9 === 0) items.push(<WarliDrummer key={i} x={x} />);
    else if (i % 9 === 5) items.push(<WarliFlautist key={i} x={x} />);
    else items.push(<WarliDancer key={i} x={x} flip={i % 2 === 1} skirt={i % 3 === 0} />);
    x += gap;
    if (i === count - 4) items.push(<WarliTree key={`t2${i}`} x={x + 4} h={80} />), (x += 32);
  }
  const width = x + 10;
  return (
    <svg viewBox={`0 -124 ${width} 130`} preserveAspectRatio={fit} className={className} style={style}
      aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={width * 0.47} cy="-108" r="8" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const [dx, dy] = pt(12, (i / 8) * TAU);
        const [ex, ey] = pt(16, (i / 8) * TAU);
        return <path key={i} d={`M${f(width * 0.47 + dx)} ${f(-108 + dy)} L${f(width * 0.47 + ex)} ${f(-108 + ey)}`} />;
      })}
      <Bird x={width * 0.2} y={-108} />
      <Bird x={width * 0.235} y={-100} />
      <Bird x={width * 0.8} y={-110} />
      {items}
      <path d={`M0 2 L${width} 2`} strokeDasharray="2 6" />
    </svg>
  );
}

// ── Instrument & motif icons (48×48) ───────────────────────────────────────
const Icon = ({ children, size = 48, className = '' }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Tanpura = (p) => (
  <Icon {...p}>
    <path d="M22 4h4M21 8h6M21 12h6" />
    <path d="M22 4 L21 30 M26 4 L27 30" />
    <circle cx="24" cy="36" r="9" />
    <path d="M22.5 6 L23 44 M25.5 6 L25 44" strokeWidth="0.8" />
    <path d="M18 41 h12" />
  </Icon>
);

export const Tabla = (p) => (
  <Icon {...p}>
    <ellipse cx="15" cy="16" rx="8" ry="3" />
    <path d="M7 16 L9 38 Q15 41 21 38 L23 16" />
    <ellipse cx="15" cy="16" rx="3" ry="1.1" fill="currentColor" />
    <ellipse cx="34" cy="22" rx="9" ry="3.2" />
    <path d="M25 22 Q24 38 34 40 Q44 38 43 22" />
    <ellipse cx="34" cy="22" rx="3.4" ry="1.2" fill="currentColor" />
  </Icon>
);

export const Ghungroo = (p) => (
  <Icon {...p}>
    <path d="M5 16 Q24 30 43 16" />
    {[8, 13.5, 19, 24, 29, 34.5, 40].map((x, i) => {
      const y = 16 + 14 * (1 - ((x - 24) / 19) ** 2) * 0.5 + 3.5;
      return (
        <g key={i}>
          <circle cx={x} cy={y + 3} r="3" />
          <path d={`M${x - 1.5} ${y + 4.5} h3`} strokeWidth="1" />
        </g>
      );
    })}
  </Icon>
);

export const Ektara = (p) => (
  <Icon {...p}>
    <circle cx="24" cy="37" r="7" />
    <path d="M19 31 L22 6 M29 31 L26 6 M22 6 Q24 3 26 6" />
    <path d="M24 5 L24 44" strokeWidth="0.9" />
    <path d="M21 10 h-3" />
  </Icon>
);

export const Matka = (p) => (
  <Icon {...p}>
    <path d="M18 8 h12 M19 8 Q19 12 16 14 Q6 20 8 31 Q11 43 24 43 Q37 43 40 31 Q42 20 32 14 Q29 12 29 8" />
    <path d="M10 24 Q24 29 38 24" />
    <path d="M14 24 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4 l2 4 l2 -4" strokeWidth="1" />
  </Icon>
);

export const Diya = (p) => (
  <Icon {...p}>
    <path d="M24 8 Q30 17 24 26 Q18 17 24 8Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M24 16 Q26 20 24 24 Q22 20 24 16Z" fill="currentColor" stroke="none" />
    <path d="M6 30 Q24 26 42 30 Q38 40 24 40 Q10 40 6 30Z" />
    <path d="M18 40 L16 44 h16 L30 40" />
  </Icon>
);

export const Lotus = (p) => (
  <Icon {...p}>
    <path d="M24 10 Q30 20 24 34 Q18 20 24 10Z" />
    <path d="M24 34 Q12 30 10 18 Q20 20 24 34" />
    <path d="M24 34 Q36 30 38 18 Q28 20 24 34" />
    <path d="M24 34 Q8 34 4 26 Q14 25 22 33" />
    <path d="M24 34 Q40 34 44 26 Q34 25 26 33" />
    <path d="M12 38 Q24 42 36 38" />
  </Icon>
);

export const categoryIcon = { music: Tanpura, dance: Ghungroo, folk: Ektara, craft: Matka, other: Diya };

// Ornamental divider: line — lotus — line.
export function Divider({ className = '' }) {
  return (
    <div className={`divider ${className}`} aria-hidden="true">
      <span />
      <Lotus size={28} />
      <span />
    </div>
  );
}

// ── Motifs: architecture, music and art, drawn on a 120×120 grid ─────────
// Used as faint watermarks on cards so no block is left plain.

// Points along a quadratic curve, for building cusped (multifoil) arches.
const quad = (p0, c, p1, n) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [
      (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
      (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1],
    ];
  });

// An Awadhi multifoil arch: the scalloped opening of Lucknow's gateways.
function cuspedArch(x0, x1, spring, apex, base, cusps = 5) {
  const mid = (x0 + x1) / 2;
  const left = quad([x0, spring], [x0, apex + (spring - apex) * 0.15], [mid, apex], cusps);
  const right = quad([mid, apex], [x1, apex + (spring - apex) * 0.15], [x1, spring], cusps).slice(1);
  const pts = [...left, ...right];
  let d = `M${f(x0)} ${base} L${f(x0)} ${f(spring)}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const r = Math.hypot(bx - ax, by - ay) * 0.62;
    d += ` A${f(r)} ${f(r)} 0 0 1 ${f(bx)} ${f(by)}`;
  }
  return `${d} L${f(x1)} ${base}`;
}

function Gateway() {
  // Inspired by the Rumi Darwaza and Bara Imambara gateways of Lucknow.
  return (
    <>
      <path d="M8 114 H112" />
      <path d="M18 114 V42 H102 V114" />
      <path d={cuspedArch(36, 84, 78, 52, 114, 4)} />
      <path d="M31 114 V76 Q31 50 60 47 Q89 50 89 76 V114" strokeWidth="0.9" />
      {[22, 30, 38, 46, 54, 62, 70, 78, 86, 94].map((x) => (
        <path key={x} d={`M${x} 42 V37 H${x + 4} V42`} strokeWidth="1" />
      ))}
      <path d="M14 42 Q24 20 34 42" />
      <path d="M86 42 Q96 20 106 42" />
      <path d="M24 26 V16 M96 26 V16" />
      <circle cx="24" cy="14" r="2" fill="currentColor" stroke="none" />
      <circle cx="96" cy="14" r="2" fill="currentColor" stroke="none" />
      <path d="M18 56 H30 M90 56 H102 M18 84 H30 M90 84 H102" strokeWidth="0.9" />
      <circle cx="60" cy="64" r="3" />
    </>
  );
}

function Temple() {
  // A Nagara temple: curved shikhara, amalaka, kalash and flag.
  const tiers = [62, 52, 42, 32];
  return (
    <>
      <path d="M8 114 H112 M16 114 V106 H104 V114 M24 106 V98 H96 V106" />
      <path d="M34 98 V70 H86 V98" />
      <path d="M52 98 V84 Q60 74 68 84 V98" />
      <path d="M36 70 C36 44 50 26 60 20 C70 26 84 44 84 70" />
      {tiers.map((y) => {
        const w = 24 * ((y - 18) / 52) + 2;
        return <path key={y} d={`M${60 - w} ${y} H${60 + w}`} strokeWidth="0.9" />;
      })}
      <path d="M60 20 V70" strokeWidth="0.9" />
      <ellipse cx="60" cy="17" rx="8" ry="3" />
      <path d="M57 14 Q60 8 63 14 M60 9 V2 L70 5 L60 8" />
      <path d="M16 98 V82 Q24 70 32 82 V98 M88 98 V82 Q96 70 104 82 V98" strokeWidth="1" />
    </>
  );
}

function Jaali({ uid }) {
  // A carved lattice window: eight-pointed stars inside a pointed arch.
  const arch = 'M24 114 V60 Q24 18 60 12 Q96 18 96 60 V114 Z';
  const stars = [];
  for (let y = 22; y <= 110; y += 14) {
    for (let x = 24 + ((y / 14) % 2 ? 7 : 0); x <= 96; x += 14) {
      stars.push(<path key={`${x}-${y}`} d={`M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z M${x - 3.5} ${y - 3.5} H${x + 3.5} V${y + 3.5} H${x - 3.5} Z`} strokeWidth="0.8" />);
    }
  }
  return (
    <>
      <defs>
        <clipPath id={uid}>
          <path d={arch} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid})`}>{stars}</g>
      <path d={arch} />
      <path d="M18 114 V58 Q18 12 60 6 Q102 12 102 58 V114" strokeWidth="0.9" />
      <path d="M10 114 H110" />
    </>
  );
}

function Paisley() {
  // The buta, the paisley of Indian textiles.
  return (
    <>
      <path d="M58 110 C28 106 20 72 38 52 C54 34 80 32 84 10 C98 40 96 82 76 102 C70 108 64 110 58 110 Z" />
      <path d="M58 98 C38 95 34 74 46 61 C58 49 76 48 80 34 C86 56 82 80 70 92 C66 96 62 98 58 98 Z" strokeWidth="0.9" />
      <circle cx="58" cy="78" r="9" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const [x, y] = pt(14, (i / 8) * TAU);
        return <circle key={i} cx={f(58 + x)} cy={f(78 + y)} r="1.6" fill="currentColor" stroke="none" />;
      })}
      <circle cx="58" cy="78" r="3" fill="currentColor" stroke="none" />
      <path d="M84 10 C78 20 70 26 62 30" strokeWidth="0.9" />
    </>
  );
}

function PeacockFeather() {
  const barbs = [];
  for (let y = 40; y <= 104; y += 6) {
    const s = (y - 40) / 64;
    barbs.push(<path key={y} d={`M${f(60 + s * 2)} ${y} q-16 -6 -24 -14 M${f(60 + s * 2)} ${y} q16 -6 24 -14`} strokeWidth="0.8" />);
  }
  return (
    <>
      <path d="M62 116 Q60 70 60 14" />
      {barbs}
      <ellipse cx="60" cy="32" rx="20" ry="25" />
      <ellipse cx="60" cy="35" rx="12" ry="16" />
      <ellipse cx="60" cy="38" rx="6" ry="8" fill="currentColor" stroke="none" />
    </>
  );
}

function Sitar() {
  const frets = [16, 24, 32, 40, 48, 56, 64];
  return (
    <>
      <circle cx="60" cy="94" r="20" />
      <path d="M44 106 Q60 112 76 106" strokeWidth="0.9" />
      <path d="M56 6 V76 M64 6 V76" />
      {frets.map((y) => (
        <path key={y} d={`M54 ${y} Q60 ${y + 2} 66 ${y}`} strokeWidth="1" />
      ))}
      <circle cx="60" cy="22" r="7" />
      <path d="M50 10 H56 M64 14 H70 M50 30 H56 M64 34 H70" />
      <path d="M58 6 L59 108 M62 6 L61 108" strokeWidth="0.6" />
    </>
  );
}

function Bansuri() {
  const holes = [30, 40, 50, 60, 70, 80];
  return (
    <g>
      <g transform="rotate(-28 60 60)">
        <rect x="4" y="56" width="112" height="8" rx="4" />
        <path d="M16 56 V64 M104 56 V64" strokeWidth="0.9" />
        {holes.map((x) => (
          <circle key={x} cx={x + 12} cy="60" r="1.8" fill="currentColor" stroke="none" />
        ))}
      </g>
      <path d="M20 22 V8 L30 6 V20" />
      <ellipse cx="17" cy="23" rx="4" ry="3" fill="currentColor" stroke="none" />
      <ellipse cx="27" cy="21" rx="4" ry="3" fill="currentColor" stroke="none" />
      <path d="M92 96 V82 Q98 84 100 90" />
      <ellipse cx="89" cy="97" rx="4" ry="3" fill="currentColor" stroke="none" />
    </g>
  );
}

const motifs = {
  gateway: Gateway,
  temple: Temple,
  jaali: Jaali,
  paisley: Paisley,
  peacock: PeacockFeather,
  sitar: Sitar,
  bansuri: Bansuri,
};

// A faint drawing tucked into the corner of a card. Cards that use it need
// `position: relative; isolation: isolate` (the .has-motif class).
export function Motif({ name, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const Draw = motifs[name];
  const Other = { lotus: Lotus, diya: Diya, tabla: Tabla, ghungroo: Ghungroo, tanpura: Tanpura, matka: Matka, ektara: Ektara }[name];
  const art = (
    <span className={`motif ${className}`} aria-hidden="true">
      {Draw ? (
        <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <Draw uid={`jaali-${uid}`} />
        </svg>
      ) : Other ? (
        <Other size={120} />
      ) : (
        <Mandala size={120} />
      )}
    </span>
  );
  // The clip box trims the drawing to the card's rounded edge, so the card itself
  // needn't hide overflow (which would cut off tooltips inside it).
  if (/\b(inline|mission-art)\b/.test(className)) return art;
  return (
    <span className="motif-clip" aria-hidden="true">
      {art}
    </span>
  );
}

// Motifs by art-form category, cycled so neighbouring cards differ.
const categoryMotifs = {
  music: ['sitar', 'bansuri', 'tabla', 'tanpura'],
  dance: ['peacock', 'ghungroo', 'lotus'],
  folk: ['paisley', 'ektara', 'jaali'],
  craft: ['matka', 'paisley', 'jaali'],
  other: ['gateway', 'temple', 'diya'],
};
export const motifFor = (category, i = 0) => {
  const list = categoryMotifs[category] ?? ['mandala'];
  return list[i % list.length];
};

// Lucknow's skyline: Bara Imambara, Rumi Darwaza and a three-domed mosque.
export function LucknowSkyline({ className = '' }) {
  const minaret = (x, h) => (
    <g key={x}>
      <path d={`M${x - 3} 140 V${140 - h} H${x + 3} V140`} />
      <path d={`M${x - 5} ${140 - h} Q${x} ${140 - h - 12} ${x + 5} ${140 - h} Z`} />
      <path d={`M${x} ${140 - h - 10} V${140 - h - 16}`} />
      <path d={`M${x - 5} ${140 - h * 0.55} H${x + 5}`} strokeWidth="1" />
    </g>
  );
  const dome = (x, w, y) => (
    <g key={`d${x}`}>
      <path d={`M${x - w} ${y} C${x - w} ${y - w * 1.2} ${x + w} ${y - w * 1.2} ${x + w} ${y}`} />
      <path d={`M${x} ${y - w * 0.9} V${y - w * 0.9 - 8}`} />
      <circle cx={x} cy={y - w * 0.9 - 10} r="1.8" fill="currentColor" stroke="none" />
    </g>
  );
  const arcade = (x0, n, w, y, h) =>
    Array.from({ length: n }, (_, i) => {
      const x = x0 + i * w;
      return <path key={`a${x0}-${i}`} d={`M${x + 2} ${y + h} V${y + h * 0.45} Q${x + w / 2} ${y} ${x + w - 2} ${y + h * 0.45} V${y + h}`} strokeWidth="1" />;
    });
  return (
    <svg viewBox="0 -10 640 152" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax meet"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 140 H640" />
      {/* Bara Imambara */}
      <path d="M40 140 V92 H220 V140" />
      <path d="M40 92 H220" />
      {arcade(48, 8, 21, 104, 36)}
      {dome(130, 26, 92)}
      {minaret(46, 70)}
      {minaret(214, 70)}
      {[60, 80, 180, 200].map((x) => dome(x, 7, 92))}
      {/* Rumi Darwaza */}
      <path d={cuspedArch(282, 358, 74, 30, 140, 6)} />
      <path d="M262 140 V60 Q320 4 378 60 V140" />
      <path d="M262 60 H252 V140 M378 60 H388 V140" />
      <path d="M306 20 Q320 2 334 20 Z M320 6 V-4" />
      {[256, 384].map((x) => (
        <path key={x} d={`M${x - 6} 60 Q${x} 46 ${x + 6} 60`} />
      ))}
      {/* Three-domed mosque */}
      <path d="M430 140 V96 H600 V140" />
      {arcade(440, 7, 22, 108, 32)}
      {dome(470, 14, 96)}
      {dome(515, 20, 96)}
      {dome(560, 14, 96)}
      {minaret(424, 80)}
      {minaret(606, 80)}
      {/* trees */}
      <g transform="translate(0 140)">
        <WarliTree x={10} h={44} />
        <WarliTree x={240} h={34} />
        <WarliTree x={408} h={40} />
        <WarliTree x={628} h={46} />
      </g>
    </svg>
  );
}
