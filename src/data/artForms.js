// Art forms presented at SPIC MACAY programmes.
// category is one of: music, dance, folk, craft, other
export const artForms = [
  // ── Music ────────────────────────────────────────────────
  {
    id: 'hindustani-vocal',
    name: 'Hindustani Vocal',
    category: 'music',
    tradition: 'Hindustani (North Indian)',
    region: 'North, Central & East India',
    summary:
      'The vocal music of North India, built on raga (melodic framework) and tala (rhythmic cycle). Khayal is its most widely performed form, alongside lighter genres like thumri, dadra and tappa.',
    keyElements: ['Raga & tala', 'Alaap, bandish, taan', 'Gharanas (stylistic lineages)', 'Improvisation within structure'],
    instruments: ['Tanpura', 'Tabla', 'Harmonium', 'Sarangi'],
  },
  {
    id: 'dhrupad',
    name: 'Dhrupad',
    category: 'music',
    tradition: 'Hindustani (North Indian)',
    region: 'North & Central India',
    summary:
      'The oldest surviving form of Hindustani classical music — austere, meditative and spiritual. A long, unmetered alaap is followed by compositions accompanied by the pakhawaj. The Dagar family carried it through the 20th century.',
    keyElements: ['Nom-tom alaap', 'Four-part composition', 'Pakhawaj accompaniment', 'Rudra veena tradition'],
    instruments: ['Tanpura', 'Pakhawaj', 'Rudra veena'],
  },
  {
    id: 'carnatic-vocal',
    name: 'Carnatic Vocal',
    category: 'music',
    tradition: 'Carnatic (South Indian)',
    region: 'Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana',
    summary:
      'South Indian classical music, centred on compositions (kritis) by composers such as Tyagaraja, Muthuswami Dikshitar and Syama Sastri, with improvised sections like alapana, niraval and kalpanaswaram.',
    keyElements: ['Kriti', 'Ragam-Tanam-Pallavi', 'Melakarta raga system', 'Trinity of Carnatic music'],
    instruments: ['Tanpura', 'Mridangam', 'Violin', 'Ghatam', 'Kanjira'],
  },
  {
    id: 'hindustani-instrumental',
    name: 'Hindustani Instrumental',
    category: 'music',
    tradition: 'Hindustani (North Indian)',
    region: 'North & East India',
    summary:
      'Raga music on strings and winds — sitar, sarod, santoor, bansuri, shehnai, sarangi and more — following the arc of alaap, jod and jhala before compositions with tabla.',
    keyElements: ['Alaap-jod-jhala', 'Gat (composition)', 'Gayaki ang (vocal style on instrument)'],
    instruments: ['Sitar', 'Sarod', 'Santoor', 'Bansuri', 'Shehnai', 'Sarangi', 'Mohan veena'],
  },
  {
    id: 'carnatic-instrumental',
    name: 'Carnatic Instrumental',
    category: 'music',
    tradition: 'Carnatic (South Indian)',
    region: 'South India',
    summary:
      'Instruments in Carnatic music largely follow the vocal idiom, rendering kritis and improvisations on the veena, violin, flute, nadaswaram and mandolin.',
    keyElements: ['Gayaki (vocal) idiom', 'Kriti rendering', 'Tani avartanam (percussion solo)'],
    instruments: ['Saraswati veena', 'Violin', 'Venu (flute)', 'Nadaswaram', 'Mandolin'],
  },
  {
    id: 'percussion',
    name: 'Percussion',
    category: 'music',
    tradition: 'Hindustani & Carnatic',
    region: 'Across India',
    summary:
      'The rhythmic backbone of Indian music. Tabla and pakhawaj in the North, mridangam, ghatam and kanjira in the South — each with its own syllables (bols / sollukattu) and solo repertoire.',
    keyElements: ['Tala cycles', 'Bols & sollukattu', 'Theka', 'Tihai'],
    instruments: ['Tabla', 'Pakhawaj', 'Mridangam', 'Ghatam', 'Kanjira'],
  },

  // ── Classical dance ──────────────────────────────────────
  {
    id: 'bharatanatyam',
    name: 'Bharatanatyam',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Tamil Nadu',
    summary:
      'Known for geometric lines, the half-seated araimandi posture and intricate footwork. A traditional margam moves from pure dance (nritta) to expressive storytelling (abhinaya).',
    keyElements: ['Araimandi', 'Adavus', 'Margam repertoire', 'Nritta, nritya, natya'],
    instruments: ['Mridangam', 'Nattuvangam', 'Violin', 'Flute', 'Vocal'],
  },
  {
    id: 'kathak',
    name: 'Kathak',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Uttar Pradesh & Rajasthan (North India)',
    summary:
      'From the kathakars, or storytellers. Famous for rapid footwork, spins (chakkars) and expressive storytelling. Lucknow, Jaipur and Banaras are its major gharanas; the Lucknow gharana flourished at the court of Nawab Wajid Ali Shah of Awadh.',
    keyElements: ['Tatkar (footwork)', 'Chakkar', 'Thaat, tukda, paran', 'Lucknow, Jaipur & Banaras gharanas'],
    instruments: ['Tabla', 'Pakhawaj', 'Sarangi', 'Harmonium', 'Ghungroo'],
  },
  {
    id: 'odissi',
    name: 'Odissi',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Odisha',
    summary:
      'Rooted in Odisha’s temple traditions, Odissi is known for the tribhangi (three-bend) posture and the chowk stance, with sculptural, fluid movement and Jayadeva’s Gita Govinda at the heart of its repertoire.',
    keyElements: ['Tribhangi', 'Chowk', 'Mangalacharan to Moksha', 'Gita Govinda'],
    instruments: ['Mardala', 'Flute', 'Sitar', 'Violin', 'Vocal'],
  },
  {
    id: 'kuchipudi',
    name: 'Kuchipudi',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Andhra Pradesh',
    summary:
      'Named after the village of Kuchipudi, it blends dance with drama. The tarangam, danced on the rim of a brass plate, is one of its best-known pieces.',
    keyElements: ['Dance-drama roots', 'Tarangam', 'Quick, buoyant movement'],
    instruments: ['Mridangam', 'Violin', 'Flute', 'Vocal'],
  },
  {
    id: 'kathakali',
    name: 'Kathakali',
    category: 'dance',
    tradition: 'Classical dance-drama',
    region: 'Kerala',
    summary:
      'A spectacular dance-drama with elaborate make-up, costumes and headgear. Stories from the epics are told through codified hand gestures and intense facial expression.',
    keyElements: ['Vesham (character make-up)', 'Mudras', 'Navarasa', 'All-night performances'],
    instruments: ['Chenda', 'Maddalam', 'Chengila', 'Ilathalam'],
  },
  {
    id: 'mohiniyattam',
    name: 'Mohiniyattam',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Kerala',
    summary:
      'The “dance of the enchantress” — graceful, swaying movements and gentle expression, traditionally performed solo by women in a white-and-gold costume.',
    keyElements: ['Swaying (andolika) movement', 'Lasya (grace)', 'Sopana music'],
    instruments: ['Mridangam', 'Edakka', 'Veena', 'Flute', 'Vocal'],
  },
  {
    id: 'manipuri',
    name: 'Manipuri',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Manipur',
    summary:
      'Gentle and devotional, Manipuri is linked to the Vaishnav Ras Leela. Dancers move with soft, rounded steps, and the energetic Pung Cholom drum dance is part of the tradition.',
    keyElements: ['Ras Leela', 'Pung Cholom', 'Soft, circular movement'],
    instruments: ['Pung', 'Cymbals', 'Flute', 'Vocal'],
  },
  {
    id: 'sattriya',
    name: 'Sattriya',
    category: 'dance',
    tradition: 'Classical dance',
    region: 'Assam',
    summary:
      'Created in the 15th century by the saint Srimanta Sankardev and preserved in Assam’s monasteries (sattras). It was recognised as a classical dance form in 2000.',
    keyElements: ['Sattra tradition', 'Ankiya Naat', 'Borgeet'],
    instruments: ['Khol', 'Cymbals (taal)', 'Flute', 'Vocal'],
  },
  {
    id: 'chhau',
    name: 'Chhau',
    category: 'dance',
    tradition: 'Semi-classical / martial dance',
    region: 'Odisha, Jharkhand, West Bengal',
    summary:
      'A vigorous dance with martial and folk roots, performed in three styles — Seraikella, Purulia and Mayurbhanj — the first two masked. It is on UNESCO’s Intangible Cultural Heritage list.',
    keyElements: ['Seraikella, Purulia & Mayurbhanj styles', 'Masks', 'Martial movement'],
    instruments: ['Dhol', 'Dhumsa', 'Shehnai'],
  },

  // ── Folk & theatre ───────────────────────────────────────
  {
    id: 'baul',
    name: 'Baul',
    category: 'folk',
    tradition: 'Folk music',
    region: 'West Bengal & Bangladesh',
    summary:
      'The mystic minstrels of Bengal, singing of the divine within. Bauls play the single-stringed ektara and are inscribed on UNESCO’s Intangible Cultural Heritage list.',
    keyElements: ['Mystic poetry', 'Wandering minstrel tradition'],
    instruments: ['Ektara', 'Dotara', 'Khamak', 'Dubki'],
  },
  {
    id: 'rajasthani-folk',
    name: 'Rajasthani Folk (Manganiyar & Langa)',
    category: 'folk',
    tradition: 'Folk music',
    region: 'Western Rajasthan',
    summary:
      'Hereditary musician communities of the Thar desert who have sung for their patrons for generations, with powerful voices and instruments like the kamaicha and sindhi sarangi.',
    keyElements: ['Hereditary patronage', 'Desert ballads', 'Sufi & devotional songs'],
    instruments: ['Kamaicha', 'Sindhi sarangi', 'Khartal', 'Dholak', 'Morchang'],
  },
  {
    id: 'yakshagana',
    name: 'Yakshagana',
    category: 'folk',
    tradition: 'Traditional theatre',
    region: 'Coastal Karnataka',
    summary:
      'A vibrant dance-theatre combining music, dance, dialogue and grand costumes. Stories from the epics are performed, often through the night.',
    keyElements: ['Bhagavata (narrator-singer)', 'Improvised dialogue', 'Elaborate costumes'],
    instruments: ['Chende', 'Maddale', 'Tala'],
  },
  {
    id: 'koodiyattam',
    name: 'Koodiyattam',
    category: 'folk',
    tradition: 'Sanskrit theatre',
    region: 'Kerala',
    summary:
      'One of the oldest living theatre traditions in the world, performing Sanskrit drama in temple theatres (koothambalams). It was among the first forms recognised by UNESCO as intangible heritage.',
    keyElements: ['Sanskrit drama', 'Koothambalam', 'Eye & facial expression'],
    instruments: ['Mizhavu', 'Edakka', 'Kuzhal'],
  },

  // ── Crafts ───────────────────────────────────────────────
  {
    id: 'madhubani',
    name: 'Madhubani Painting',
    category: 'craft',
    tradition: 'Folk painting',
    region: 'Mithila, Bihar',
    summary:
      'Also called Mithila painting, made with natural colours and fine line work, showing nature, deities and rituals. It is a regular feature of SPIC MACAY craft workshops.',
    keyElements: ['Bharni, Kachni & Godna styles', 'Natural pigments', 'Double-line borders'],
    instruments: [],
  },
  {
    id: 'warli',
    name: 'Warli Painting',
    category: 'craft',
    tradition: 'Tribal painting',
    region: 'Maharashtra',
    summary:
      'A tribal art of the Warli community — white figures of circles, triangles and lines on a mud-brown base, showing everyday life, harvests and dances.',
    keyElements: ['Geometric figures', 'Rice-paste white', 'Tarpa dance motif'],
    instruments: [],
  },
  {
    id: 'pattachitra',
    name: 'Pattachitra',
    category: 'craft',
    tradition: 'Scroll painting',
    region: 'Odisha & West Bengal',
    summary:
      'Cloth-based scroll painting with mythological stories, especially of Lord Jagannath, made with natural colours and bold outlines.',
    keyElements: ['Cloth canvas (patta)', 'Mythological narrative', 'Natural colours'],
    instruments: [],
  },
  {
    id: 'pottery',
    name: 'Pottery & Clay Craft',
    category: 'craft',
    tradition: 'Craft',
    region: 'Across India',
    summary:
      'Hands-on wheel-throwing and clay work led by traditional potters, one of the most popular SPIC MACAY workshop formats.',
    keyElements: ['Wheel-throwing', 'Terracotta', 'Regional styles'],
    instruments: [],
  },

  // ── Other programmes ─────────────────────────────────────
  {
    id: 'yoga',
    name: 'Yoga & Meditation',
    category: 'other',
    tradition: 'Holistic practice',
    region: 'Across India',
    summary:
      'Early-morning yoga and meditation are part of SPIC MACAY conventions and intensives, along with the discipline of simple living.',
    keyElements: ['Asana', 'Pranayama', 'Dhyana'],
    instruments: [],
  },
  {
    id: 'classic-cinema',
    name: 'Classic Cinema',
    category: 'other',
    tradition: 'Film appreciation',
    region: 'India & world',
    summary:
      'Screenings of acclaimed Indian and world cinema, by directors such as Satyajit Ray, followed by discussion.',
    keyElements: ['Screening + discussion', 'Indian parallel cinema', 'World classics'],
    instruments: [],
  },
  {
    id: 'heritage-walk',
    name: 'Heritage Walks & Talks',
    category: 'other',
    tradition: 'Heritage & ideas',
    region: 'Across India',
    summary:
      'Guided walks through historic monuments and talks by eminent thinkers, to build awareness of India’s built and intellectual heritage.',
    keyElements: ['Monument walks', 'Talks by eminent speakers'],
    instruments: [],
  },
];

export const categories = [
  { id: 'music', label: 'Music' },
  { id: 'dance', label: 'Dance' },
  { id: 'folk', label: 'Folk & Theatre' },
  { id: 'craft', label: 'Crafts' },
  { id: 'other', label: 'Yoga, Cinema & Heritage' },
];
