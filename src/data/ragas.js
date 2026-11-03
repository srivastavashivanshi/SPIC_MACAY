// Eight common Hindustani ragas. Thaat, time, aroha/avaroha and vadi/samvadi follow each raga's
// Wikipedia article (`source`), checked 31 Oct 2026. `mood` is the traditional description.
// Notation: S r R g G M M# P d D n N — lowercase is komal (flat), M# is tivra (sharp) Ma;
// a trailing ' is the upper octave, a leading . the lower octave.
export const ragas = [
  {
    id: 'yaman', name: 'Yaman', hi: 'यमन', thaat: 'Kalyan', time: 'First part of the night', hour: 19, mood: 'Serene and devotional',
    aroha: ['S', 'R', 'G', 'M#', 'P', 'D', 'N', "S'"], avaroha: ["S'", 'N', 'D', 'P', 'M#', 'G', 'R', 'S'], vadi: 'G', samvadi: 'N',
    note: 'Often the first raga students learn. Its sharp (tivra) Ma gives it a bright, open sound.',
    source: 'https://en.wikipedia.org/wiki/Yaman_(raga)',
  },
  {
    id: 'bhairav', name: 'Bhairav', hi: 'भैरव', thaat: 'Bhairav', time: 'Daybreak', hour: 6, mood: 'Solemn and devotional',
    aroha: ['S', 'r', 'G', 'M', 'P', 'd', 'N', "S'"], avaroha: ["S'", 'N', 'd', 'P', 'M', 'G', 'r', 'S'], vadi: 'd', samvadi: 'r',
    note: 'A dawn raga, traditionally used to begin a morning concert. Flat Re and flat Dha give it its gravity.',
    source: 'https://en.wikipedia.org/wiki/Bhairav_(raga)',
  },
  {
    id: 'bhupali', name: 'Bhupali', hi: 'भूपाली', thaat: 'Kalyan', time: 'Early night, 7–9 PM', hour: 20, mood: 'Peaceful',
    aroha: ['S', 'R', 'G', 'P', 'D', "S'"], avaroha: ["S'", 'D', 'P', 'G', 'R', 'S'], vadi: 'G', samvadi: 'D',
    note: 'A five-note (pentatonic) raga with no Ma or Ni.',
    source: 'https://en.wikipedia.org/wiki/Bhupali',
  },
  {
    id: 'bhimpalasi', name: 'Bhimpalasi', hi: 'भीमपलासी', thaat: 'Kafi', time: 'Early afternoon, 12–3 PM', hour: 14, mood: 'Longing',
    aroha: ['.n', 'S', 'g', 'M', 'P', 'n', "S'"], avaroha: ["S'", 'n', 'D', 'P', 'M', 'g', 'R', 'S'], vadi: 'M', samvadi: 'S',
    note: 'Skips Re and Dha going up, and uses all seven notes coming down.',
    source: 'https://en.wikipedia.org/wiki/Bhimpalasi',
  },
  {
    id: 'desh', name: 'Desh', hi: 'देस', thaat: 'Khamaj', time: 'Late night, 12–3 AM', hour: 23, mood: 'Romantic; linked with the monsoon',
    aroha: ['.N', 'S', 'R', 'M', 'P', 'N', "S'"], avaroha: ["S'", 'n', 'D', 'P', 'D', 'M', 'G', 'R', 'P', 'M', 'G', 'R', 'G', '.N', 'S'], vadi: 'R', samvadi: 'P',
    note: 'Uses natural Ni going up and flat Ni coming down, with a winding descent.',
    source: 'https://en.wikipedia.org/wiki/Desh_(raga)',
  },
  {
    id: 'bageshri', name: 'Bageshri', hi: 'बागेश्री', thaat: 'Kafi', time: '9 PM – midnight', hour: 22, mood: 'Longing and romantic',
    aroha: ['S', 'g', 'M', 'D', 'n', "S'"], avaroha: ["S'", 'n', 'D', 'M', 'g', 'R', 'S'], vadi: 'M', samvadi: 'S',
    note: 'A late-evening raga centred on Ma.',
    source: 'https://en.wikipedia.org/wiki/Bageshree',
  },
  {
    id: 'darbari', name: 'Darbari Kanada', hi: 'दरबारी कान्हड़ा', thaat: 'Asavari', time: 'Midnight', hour: 0, mood: 'Grave and majestic',
    aroha: ['S', 'R', 'g', 'M', 'P', 'd', 'n', "S'"], avaroha: ["S'", 'd', 'n', 'P', 'M', 'P', 'g', 'M', 'R', 'S'], vadi: 'R', samvadi: 'P',
    note: 'Known for the slow oscillation (andolan) on flat Ga and flat Dha, which this simple scale can’t show.',
    source: 'https://en.wikipedia.org/wiki/Darbari_Kanada',
  },
  {
    id: 'malkauns', name: 'Malkauns', hi: 'मालकौंस', thaat: 'Bhairavi', time: 'Late night, 12–3 AM', hour: 1, mood: 'Meditative and grave',
    aroha: ['.n', 'S', 'g', 'M', 'd', 'n', "S'"], avaroha: ["S'", 'n', 'd', 'M', 'g', 'M', 'g', 'S'], vadi: 'M', samvadi: 'S',
    note: 'A five-note raga with no Re or Pa, among the oldest in the tradition.',
    source: 'https://en.wikipedia.org/wiki/Malkauns',
  },
];

// Just-intonation ratios for the twelve swaras, relative to Sa.
export const swaras = [
  { id: 'S', name: 'Sa', hi: 'सा', ratio: 1 },
  { id: 'r', name: 'Re (komal)', hi: 'रे॒', ratio: 16 / 15 },
  { id: 'R', name: 'Re', hi: 'रे', ratio: 9 / 8 },
  { id: 'g', name: 'Ga (komal)', hi: 'ग॒', ratio: 6 / 5 },
  { id: 'G', name: 'Ga', hi: 'ग', ratio: 5 / 4 },
  { id: 'M', name: 'Ma', hi: 'म', ratio: 4 / 3 },
  { id: 'M#', name: 'Ma (tivra)', hi: 'म॑', ratio: 45 / 32 },
  { id: 'P', name: 'Pa', hi: 'प', ratio: 3 / 2 },
  { id: 'd', name: 'Dha (komal)', hi: 'ध॒', ratio: 8 / 5 },
  { id: 'D', name: 'Dha', hi: 'ध', ratio: 5 / 3 },
  { id: 'n', name: 'Ni (komal)', hi: 'नि॒', ratio: 9 / 5 },
  { id: 'N', name: 'Ni', hi: 'नि', ratio: 15 / 8 },
];

export const swaraOf = (token) => swaras.find((s) => s.id === token.replace(/^\.|'$/g, ''));
export const octaveOf = (token) => (token.endsWith("'") ? 2 : token.startsWith('.') ? 0.5 : 1);
