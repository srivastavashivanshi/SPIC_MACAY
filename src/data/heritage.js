// Lucknow heritage walk. Facts come from each monument's Wikipedia article (`source`);
// coordinates from Wikipedia, cross-checked with OpenStreetMap (Rumi Darwaza and
// Chattar Manzil use OpenStreetMap, where Wikipedia's pin is off or missing). Checked 31 Oct 2026.
// `stop` is the suggested walking order through the old city; the last stops are a short ride away.
export const heritageSites = [
  {
    id: 'chhota-imambara', stop: 1, name: 'Chhota Imambara', aka: 'Imambara Hussainabad Mubarak',
    lat: 26.8738, lng: 80.9044, built: '1838', by: 'Muhammad Ali Shah, Nawab of Awadh',
    note: 'A congregation hall for Shia Muslims, built as a mausoleum for Muhammad Ali Shah and his mother, who is buried beside him.',
    motif: 'jaali', source: 'https://en.wikipedia.org/wiki/Chota_Imambara',
  },
  {
    id: 'clock-tower', stop: 2, name: 'Husainabad Clock Tower', aka: '',
    lat: 26.8746, lng: 80.9068, built: 'Late 19th century', by: '',
    note: 'Built to mark the arrival of Sir George Couper, lieutenant governor of the North-West Provinces. It blends Mughal and Victorian architecture.',
    motif: 'temple', source: 'https://en.wikipedia.org/wiki/Husainabad_Clock_Tower',
  },
  {
    id: 'rumi-darwaza', stop: 3, name: 'Rumi Darwaza', aka: 'Rumi Gate',
    lat: 26.8712, lng: 80.9122, built: '1784', by: 'Nawab Asaf-ud-Daula',
    note: 'A sixty-foot gateway and a landmark of Awadhi architecture, modelled after the Sublime Porte in Istanbul. Its cusped arch inspired the gateway drawings on this site.',
    motif: 'gateway', source: 'https://en.wikipedia.org/wiki/Rumi_Darwaza',
  },
  {
    id: 'bara-imambara', stop: 4, name: 'Bara Imambara', aka: 'Asafi Imambara',
    lat: 26.8692, lng: 80.9128, built: '1784', by: 'Nawab Asaf-ud-Daula',
    note: 'An imambara and mosque complex, described as the world’s second-largest imambara after the Nizamat Imambara.',
    motif: 'gateway', source: 'https://en.wikipedia.org/wiki/Bara_Imambara',
  },
  {
    id: 'residency', stop: 5, name: 'The Residency', aka: 'British Residency',
    lat: 26.8618, lng: 80.9257, built: '', by: '',
    note: 'A complex of buildings that housed the British Resident at the court of the Nawab of Awadh, and a key site of the 1857 Siege of Lucknow.',
    motif: 'temple', source: 'https://en.wikipedia.org/wiki/The_Residency,_Lucknow',
  },
  {
    id: 'chattar-manzil', stop: 6, name: 'Chattar Manzil', aka: 'Umbrella Palace',
    lat: 26.8587, lng: 80.9324, built: '', by: 'Begun by Ghazi-ud-Din Haider, completed by Nasir-ud-Din Haider',
    note: 'A palace of the rulers of Awadh and their wives, beside the Gomti river, named for the umbrella-shaped dome on top.',
    motif: 'paisley', source: 'https://en.wikipedia.org/wiki/Chattar_Manzil',
  },
  {
    id: 'sikandar-bagh', stop: 7, name: 'Sikandar Bagh', aka: '',
    lat: 26.8556, lng: 80.9524, built: '', by: 'Wajid Ali Shah, last Nawab of Awadh',
    note: 'A walled villa and garden built as a summer residence by Wajid Ali Shah, the patron of music and Kathak in whose court the Lucknow gharana flourished.',
    motif: 'peacock', source: 'https://en.wikipedia.org/wiki/Sikandar_Bagh',
  },
  {
    id: 'dilkusha-kothi', stop: 8, name: 'Dilkusha Kothi', aka: '',
    lat: 26.831, lng: 80.954, built: '18th century', by: '',
    note: 'The remains of a house in the English baroque style. It was shelled during the 1857 siege; a few towers and walls stand in its gardens today.',
    motif: 'jaali', source: 'https://en.wikipedia.org/wiki/Dilkusha_Kothi',
  },
];
