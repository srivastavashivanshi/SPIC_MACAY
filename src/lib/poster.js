// Draws a 1080×1350 programme poster in the site's style and returns it as a PNG blob.
// Loaded on demand from the programme page, so react-dom/server stays out of the main bundle.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Mandala, WarliBand } from '../components/Art.jsx';

const W = 1080;
const H = 1350;
const GOLD = '#e8c766';
const CREAM = '#fdf3e3';

const svgImage = (element, color, width, height) =>
  new Promise((resolve, reject) => {
    const markup = renderToStaticMarkup(element).replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="color:${color}"`);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function wrap(ctx, text, maxWidth, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, '')}…`;
  }
  return lines;
}

const longDate = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export async function makePoster({ event, formName, chapterName, url }) {
  await Promise.all([
    document.fonts.load('700 80px "Cormorant Garamond"'),
    document.fonts.load('italic 500 48px "Cormorant Garamond"'),
    document.fonts.load('600 28px Inter'),
  ]).catch(() => {});

  const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const ctx = canvas.getContext('2d');

  // Ground: deep maroon with a warm glow, as on the site's hero.
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, '#6d1129');
  bg.addColorStop(0.5, '#5c0f24');
  bg.addColorStop(1, '#2a0a12');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.18, 10, W * 0.85, H * 0.18, 700);
  glow.addColorStop(0, 'rgba(196,38,28,0.45)');
  glow.addColorStop(1, 'rgba(196,38,28,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const [mandala, band, logo] = await Promise.all([
    svgImage(createElement(Mandala, { size: 900 }), GOLD, 900, 900),
    svgImage(createElement(WarliBand, { count: 26 }), GOLD, 1080, 170),
    loadImage('/spicmacay-logo.svg').catch(() => null),
  ]);
  ctx.globalAlpha = 0.22;
  ctx.drawImage(mandala, W - 560, -300, 900, 900);
  ctx.globalAlpha = 1;

  // Toran garland along the top.
  const toran = ctx.createLinearGradient(0, 0, W, 0);
  ['#5c0f24', '#c4261c', '#f98f07', '#c4261c', '#5c0f24'].forEach((c, i) => toran.addColorStop(i / 4, c));
  ctx.fillStyle = toran;
  ctx.fillRect(0, 0, W, 10);
  for (let x = 0; x < W; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.quadraticCurveTo(x + 27, 46, x + 54, 10);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 27, 44, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Logo on a cream tablet.
  let y = 110;
  if (logo) {
    ctx.fillStyle = CREAM;
    ctx.beginPath();
    ctx.roundRect(80, y, 300, 124, 18);
    ctx.fill();
    ctx.drawImage(logo, 100, y + 12, 260, 100);
  }
  ctx.fillStyle = GOLD;
  ctx.font = '600 26px Inter';
  ctx.fillText(`${chapterName.toUpperCase()} CHAPTER PRESENTS`, 80, y + 180);

  // Programme type and title.
  y += 250;
  ctx.fillStyle = 'rgba(253,243,227,0.75)';
  ctx.font = '600 28px Inter';
  ctx.fillText([event.type, formName].filter(Boolean).join('  ·  ').toUpperCase(), 80, y);
  y += 30;
  ctx.fillStyle = '#fff8ec';
  ctx.font = '700 92px "Cormorant Garamond"';
  for (const line of wrap(ctx, event.title, W - 160, 4)) {
    y += 96;
    ctx.fillText(line, 80, y);
  }
  if (event.artist && !event.title.includes(event.artist)) {
    y += 76;
    ctx.fillStyle = GOLD;
    ctx.font = 'italic 500 60px "Cormorant Garamond"';
    ctx.fillText(event.artist, 80, y);
  }

  // When and where, on a thin gold rule.
  y = Math.max(y + 90, 930);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, y);
  ctx.lineTo(W - 80, y);
  ctx.stroke();
  ctx.fillStyle = '#fff8ec';
  ctx.font = '600 40px Inter';
  ctx.fillText(`${longDate.format(new Date(`${event.date}T00:00:00`))}${event.time ? ` · ${event.time}` : ''}`, 80, y + 66);
  ctx.fillStyle = 'rgba(253,243,227,0.8)';
  ctx.font = '500 34px Inter';
  for (const [i, line] of wrap(ctx, event.venue || 'Venue to be announced', W - 160, 2).entries()) ctx.fillText(line, 80, y + 120 + i * 44);

  // Warli frieze and the link.
  ctx.globalAlpha = 0.9;
  ctx.drawImage(band, 0, H - 230, 1080, 170);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(253,243,227,0.7)';
  ctx.font = '500 24px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(url.replace(/^https?:\/\//, ''), W / 2, H - 28);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
