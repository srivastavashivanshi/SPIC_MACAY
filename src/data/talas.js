// Common talas with their standard thekas (the basic tabla pattern). Thekas vary a little
// between teachers and gharanas; these are the forms most often taught.
// vibhags: beats per section; marks: X = sam (first beat, clap), 0 = khali (wave), numbers = claps.
export const talas = [
  {
    id: 'teentaal', name: 'Teentaal', hi: 'तीनताल', beats: 16, vibhags: [4, 4, 4, 4], marks: ['X', '2', '0', '3'],
    theka: ['Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Ta', 'Dhin', 'Dhin', 'Dha'],
    note: 'The most common tala in Hindustani music, used at every speed. The khali section (beats 9–12) drops the bass.',
  },
  {
    id: 'ektaal', name: 'Ektaal', hi: 'एकताल', beats: 12, vibhags: [2, 2, 2, 2, 2, 2], marks: ['X', '0', '2', '0', '3', '4'],
    theka: ['Dhin', 'Dhin', 'DhaGe', 'TiRaKiTa', 'Tu', 'Na', 'Kat', 'Ta', 'DhaGe', 'TiRaKiTa', 'Dhi', 'Na'],
    note: 'Twelve beats in six sections; often used for slow (vilambit) khayal.',
  },
  {
    id: 'jhaptaal', name: 'Jhaptaal', hi: 'झपताल', beats: 10, vibhags: [2, 3, 2, 3], marks: ['X', '2', '0', '3'],
    theka: ['Dhi', 'Na', 'Dhi', 'Dhi', 'Na', 'Ti', 'Na', 'Dhi', 'Dhi', 'Na'],
    note: 'Ten beats in an uneven 2 + 3 + 2 + 3 pattern, which gives it a lilting feel.',
  },
  {
    id: 'rupak', name: 'Rupak', hi: 'रूपक', beats: 7, vibhags: [3, 2, 2], marks: ['0', '1', '2'],
    theka: ['Tin', 'Tin', 'Na', 'Dhi', 'Na', 'Dhi', 'Na'],
    note: 'Unusually, the first beat of Rupak is khali (a wave), not a clap.',
  },
  {
    id: 'keherwa', name: 'Keherwa', hi: 'कहरवा', beats: 8, vibhags: [4, 4], marks: ['X', '0'],
    theka: ['Dha', 'Ge', 'Na', 'Ti', 'Na', 'Ka', 'Dhi', 'Na'],
    note: 'An eight-beat tala of lighter music: bhajans, ghazals and folk songs.',
  },
  {
    id: 'dadra', name: 'Dadra', hi: 'दादरा', beats: 6, vibhags: [3, 3], marks: ['X', '0'],
    theka: ['Dha', 'Dhi', 'Na', 'Dha', 'Ti', 'Na'],
    note: 'Six beats; common in thumri, dadra and light classical songs.',
  },
];
