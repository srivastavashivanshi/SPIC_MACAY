// Guru–shishya lineages for artists in the explorer. Every link was confirmed in the
// shishya's Wikipedia article (`source`) on 31 Oct 2026. `artistId` links to artists.js.
// relation: 'guru' (teacher), 'parent' (parent and teacher), 'parent-only', 'sibling' (elder sibling
// who taught), 'descendant' (family lineage).
export const lineages = [
  {
    id: 'maihar', name: 'Maihar gharana', tradition: 'Hindustani instrumental',
    tree: { name: 'Allauddin Khan', children: [
      { name: 'Ravi Shankar', artistId: 'ravi-shankar', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Ravi_Shankar', children: [
        { name: 'Vishwa Mohan Bhatt', artistId: 'vishwa-mohan-bhatt', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Vishwa_Mohan_Bhatt' },
      ] },
      { name: 'Annapurna Devi', relation: 'parent', source: 'https://en.wikipedia.org/wiki/Annapurna_Devi', children: [
        { name: 'Hariprasad Chaurasia', artistId: 'hariprasad-chaurasia', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Hariprasad_Chaurasia' },
      ] },
    ] },
  },
  {
    id: 'kirana', name: 'Kirana gharana', tradition: 'Hindustani vocal',
    tree: { name: 'Abdul Karim Khan', note: 'Founder', children: [
      { name: 'Sawai Gandharva', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Sawai_Gandharva', children: [
        { name: 'Bhimsen Joshi', artistId: 'bhimsen-joshi', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Bhimsen_Joshi' },
      ] },
    ] },
  },
  {
    id: 'jaipur-atrauli', name: 'Jaipur-Atrauli gharana', tradition: 'Hindustani vocal',
    tree: { name: 'Alladiya Khan', note: 'Founder', children: [
      { name: 'Mogubai Kurdikar', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Mogubai_Kurdikar', children: [
        { name: 'Kishori Amonkar', artistId: 'kishori-amonkar', relation: 'parent', source: 'https://en.wikipedia.org/wiki/Kishori_Amonkar' },
      ] },
    ] },
  },
  {
    id: 'mewati', name: 'Mewati gharana', tradition: 'Hindustani vocal',
    tree: { name: 'Maniram', children: [
      { name: 'Jasraj', artistId: 'jasraj', relation: 'sibling', source: 'https://en.wikipedia.org/wiki/Jasraj' },
    ] },
  },
  {
    id: 'rampur-sahaswan', name: 'Rampur-Sahaswan gharana', tradition: 'Hindustani vocal',
    tree: { name: 'Inayat Hussain Khan', note: 'Founder', children: [
      { name: 'Rashid Khan', artistId: 'rashid-khan', relation: 'descendant', source: 'https://en.wikipedia.org/wiki/Rashid_Khan_(musician)' },
    ] },
  },
  {
    id: 'banaras', name: 'Banaras gharana', tradition: 'Hindustani vocal',
    tree: { name: 'Sarju Prasad Misra', children: [
      { name: 'Girija Devi', artistId: 'girija-devi', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Girija_Devi' },
    ] },
  },
  {
    id: 'patiala', name: 'Patiala gharana', tradition: 'Hindustani vocal',
    tree: { name: 'Ajoy Chakraborty', children: [
      { name: 'Kaushiki Chakraborty', artistId: 'kaushiki-chakraborty', relation: 'parent-only', source: 'https://en.wikipedia.org/wiki/Kaushiki_Chakraborty' },
    ] },
  },
  {
    id: 'dagar', name: 'Dagar vani', tradition: 'Dhrupad',
    tree: { name: 'Ziauddin Khan Dagar', children: [
      { name: 'Zia Fariduddin Dagar', artistId: 'zia-fariduddin-dagar', relation: 'parent', source: 'https://en.wikipedia.org/wiki/Zia_Fariduddin_Dagar' },
    ] },
  },
  {
    id: 'senia-bangash', name: 'Senia Bangash gharana', tradition: 'Sarod',
    tree: { name: 'Hafiz Ali Khan', children: [
      { name: 'Amjad Ali Khan', artistId: 'amjad-ali-khan', relation: 'parent', source: 'https://en.wikipedia.org/wiki/Amjad_Ali_Khan' },
    ] },
  },
  {
    id: 'punjab', name: 'Punjab gharana', tradition: 'Tabla',
    tree: { name: 'Alla Rakha', children: [
      { name: 'Zakir Hussain', artistId: 'zakir-hussain', relation: 'parent', source: 'https://en.wikipedia.org/wiki/Zakir_Hussain_(musician)' },
    ] },
  },
  {
    id: 'santoor', name: 'Santoor, Jammu', tradition: 'Santoor',
    tree: { name: 'Umadutt Sharma', note: 'Vocalist and tabla player', children: [
      { name: 'Shivkumar Sharma', artistId: 'shivkumar-sharma', relation: 'parent-only', source: 'https://en.wikipedia.org/wiki/Shivkumar_Sharma' },
    ] },
  },
  {
    id: 'lucknow-kathak', name: 'Lucknow (Kalka-Bindadin) gharana', tradition: 'Kathak',
    tree: { name: 'Achchan Maharaj', children: [
      { name: 'Birju Maharaj', artistId: 'birju-maharaj', relation: 'parent', source: 'https://en.wikipedia.org/wiki/Birju_Maharaj' },
    ] },
  },
  {
    id: 'odissi', name: 'Odissi', tradition: 'Classical dance',
    tree: { name: 'Kelucharan Mohapatra', artistId: 'kelucharan-mohapatra', children: [
      { name: 'Sonal Mansingh', artistId: 'sonal-mansingh', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Sonal_Mansingh' },
    ] },
  },
  {
    id: 'kalakshetra', name: 'Kalakshetra', tradition: 'Bharatanatyam',
    tree: { name: 'Rukmini Devi Arundale', note: 'Founder of Kalakshetra', children: [
      { name: 'Leela Samson', artistId: 'leela-samson', relation: 'guru', source: 'https://en.wikipedia.org/wiki/Leela_Samson' },
    ] },
  },
  {
    id: 'carnatic-vocal', name: 'Carnatic vocal', tradition: 'Carnatic',
    tree: { name: 'Semmangudi Srinivasa Iyer', children: [
      { name: 'T. M. Krishna', artistId: 'tm-krishna', relation: 'guru', source: 'https://en.wikipedia.org/wiki/T._M._Krishna' },
    ] },
  },
  {
    id: 'carnatic-violin', name: 'Carnatic violin', tradition: 'Carnatic',
    tree: { name: 'V. Lakshminarayana', children: [
      { name: 'L. Subramaniam', artistId: 'l-subramaniam', relation: 'parent', source: 'https://en.wikipedia.org/wiki/L._Subramaniam' },
    ] },
  },
];

export const relationLabel = {
  guru: 'Disciple of',
  parent: 'Child and disciple of',
  'parent-only': 'Child of',
  sibling: 'Taught by elder brother',
  descendant: 'Descendant of',
};
