// Sound for the raga explorer and tala player, synthesised with the Web Audio API.
// No recordings: a reed-like tone for notes, a plucked tanpura drone, and two-drum tabla strokes.

let ctx;
export function audio() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function out(ac, level) {
  const g = ac.createGain();
  g.gain.value = level;
  g.connect(ac.destination);
  return g;
}

// A harmonium-like note: two slightly detuned sawtooths through a soft low-pass filter.
export function playNote(freq, when, duration, level = 0.16) {
  const ac = audio();
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = Math.min(4000, freq * 6);
  const env = ac.createGain();
  env.gain.setValueAtTime(0, when);
  env.gain.linearRampToValueAtTime(level, when + 0.04);
  env.gain.setValueAtTime(level, when + duration - 0.08);
  env.gain.linearRampToValueAtTime(0, when + duration);
  filter.connect(env).connect(ac.destination);
  for (const detune of [-6, 6]) {
    const osc = ac.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(filter);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }
}

// One plucked tanpura string: bright attack, long shimmering decay.
function pluck(ac, freq, when, dest) {
  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = freq;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq * 8, when);
  filter.frequency.exponentialRampToValueAtTime(freq * 3, when + 2.5);
  filter.Q.value = 0.8;
  const env = ac.createGain();
  env.gain.setValueAtTime(0, when);
  env.gain.linearRampToValueAtTime(0.5, when + 0.02);
  env.gain.exponentialRampToValueAtTime(0.001, when + 3.2);
  osc.connect(filter).connect(env).connect(dest);
  osc.start(when);
  osc.stop(when + 3.3);
}

// Tanpura drone, plucked Pa (lower) – Sa – Sa – Sa (lower) in a cycle. Returns a stop function.
export function startDrone(sa) {
  const ac = audio();
  const dest = out(ac, 0.09);
  const strings = [(sa * 3) / 4, sa, sa, sa / 2];
  const gap = 0.55;
  let next = ac.currentTime + 0.05;
  let i = 0;
  const timer = setInterval(() => {
    while (next < ac.currentTime + 0.3) {
      pluck(ac, strings[i % 4], next, dest);
      next += i % 4 === 3 ? gap * 2 : gap;
      i += 1;
    }
  }, 60);
  return () => {
    clearInterval(timer);
    dest.gain.setTargetAtTime(0, ac.currentTime, 0.3);
    setTimeout(() => dest.disconnect(), 1500);
  };
}

// Tabla: dayan (right, pitched ring) and bayan (left, gliding bass). Bols with "Dh" or "Ge"
// use both drums; the khali bols (Ta, Tin, Na, Ti…) use the dayan alone.
const BASS = /^(dh|ge|ghe)/i;

function dayan(ac, when, level, dest, bright) {
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(bright ? 520 : 440, when);
  const env = ac.createGain();
  env.gain.setValueAtTime(level, when);
  env.gain.exponentialRampToValueAtTime(0.001, when + (bright ? 0.18 : 0.45));
  osc.connect(env).connect(dest);
  osc.start(when);
  osc.stop(when + 0.5);
  // A short noise tick for the strike.
  const noise = ac.createBufferSource();
  const buf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  noise.buffer = buf;
  const hp = ac.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;
  const ng = ac.createGain();
  ng.gain.value = level * 0.5;
  noise.connect(hp).connect(ng).connect(dest);
  noise.start(when);
}

function bayan(ac, when, level, dest) {
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(110, when);
  osc.frequency.exponentialRampToValueAtTime(70, when + 0.35);
  const env = ac.createGain();
  env.gain.setValueAtTime(level, when);
  env.gain.exponentialRampToValueAtTime(0.001, when + 0.6);
  osc.connect(env).connect(dest);
  osc.start(when);
  osc.stop(when + 0.65);
}

// A multi-syllable bol (TiRaKiTa, DhaGe) is split evenly across the beat.
export function playBol(bol, when, beatLength, accent = false) {
  const ac = audio();
  const dest = out(ac, accent ? 0.9 : 0.6);
  const parts = bol.match(/[A-Z][a-z]*/g) ?? [bol];
  parts.forEach((p, i) => {
    const t = when + (i * beatLength) / parts.length;
    const bright = /^(ti|ta|ra|ki|na|kat|tu)/i.test(p);
    dayan(ac, t, 0.5, dest, bright);
    if (BASS.test(p)) bayan(ac, t, 0.8, dest);
  });
  setTimeout(() => dest.disconnect(), (when - ac.currentTime + beatLength + 1) * 1000);
}
