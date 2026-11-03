// Imports a chapter's programmes from SPIC MACAY's public programme feeds
// (the same data spicmacay.org/past-programmes and /upcoming-programmes show).

const API = 'https://api.spicmacay.org/api/public/section';
export const FEEDS = ['ps-national-past-programmes-feed', 'ps-national-events-upcoming'];
const PAGE = 100;

export async function fetchFeed(feed) {
  const items = [];
  for (let offset = 0; offset < 20000; offset += PAGE) {
    const res = await fetch(`${API}/${feed}/data?tenant=main-website&offset=${offset}&limit=${PAGE}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'spicmacay-iiml-importer/1.0' },
    });
    if (!res.ok) throw new Error(`spicmacay.org feed ${feed} returned ${res.status}`);
    const { resolvedData } = await res.json();
    const page = resolvedData?.events ?? [];
    items.push(...page);
    if (!resolvedData?.pageInfo?.hasMore || page.length === 0) break;
  }
  return items;
}

// Feed category / artform → this site's art form ids.
const ART_FORM_KEYWORDS = [
  [/dhrupad|rudra veena/, 'dhrupad'],
  [/carnatic.*(vocal|music)|carnatic$/, 'carnatic-vocal'],
  [/veena|nadaswaram|mandolin|carnatic/, 'carnatic-instrumental'],
  [/tabla|pakhawaj|mridangam|ghatam|kanjira|percussion/, 'percussion'],
  [/sitar|sarod|santoor|bansuri|flute|shehnai|sarangi|violin|instrumental|mohan veena|surbahar/, 'hindustani-instrumental'],
  [/khayal|thumri|hindustani|vocal|ghazal/, 'hindustani-vocal'],
  [/bharatanatyam/, 'bharatanatyam'],
  [/kathakali/, 'kathakali'],
  [/kathak/, 'kathak'],
  [/odissi/, 'odissi'],
  [/kuchipudi/, 'kuchipudi'],
  [/mohiniyattam|mohiniattam/, 'mohiniyattam'],
  [/manipuri/, 'manipuri'],
  [/sattriya/, 'sattriya'],
  [/chhau/, 'chhau'],
  [/baul/, 'baul'],
  [/manganiyar|langa|rajasthani/, 'rajasthani-folk'],
  [/yakshagana/, 'yakshagana'],
  [/koodiyattam|kutiyattam/, 'koodiyattam'],
  [/madhubani|mithila/, 'madhubani'],
  [/warli/, 'warli'],
  [/pattachitra/, 'pattachitra'],
  [/pottery|clay/, 'pottery'],
  [/yoga|meditation/, 'yoga'],
  [/film|cinema|screening/, 'classic-cinema'],
  [/walk|heritage|talk/, 'heritage-walk'],
];

const artFormFor = (item) => {
  const text = [item.category, item.type, ...(item.topArtists ?? []).map((a) => a.artform), item.title].join(' ').toLowerCase();
  return ART_FORM_KEYWORDS.find(([re]) => re.test(text))?.[1] ?? '';
};

const typeFor = (title) => {
  const t = title.toLowerCase();
  if (t.includes('lecture demonstration') || t.includes('lec-dem')) return 'Lecture-Demonstration';
  if (t.includes('workshop')) return 'Workshop';
  if (t.includes('intensive')) return 'Intensive';
  if (t.includes('walk')) return 'Heritage Walk';
  if (t.includes('baithak') || t.includes('concert') || t.includes('recital')) return 'Baithak';
  if (t.includes('film') || t.includes('screening')) return 'Screening';
  if (t.includes('talk')) return 'Talk';
  return 'Programme';
};

// "Lecture Demonstration at IIM Lucknow Noida Campus by Malti Shyam" → "IIM Lucknow Noida Campus"
const venueFor = (item) => item.title.match(/ at (.+?)(?: by .+)?$/i)?.[1] ?? item.venue ?? '';

export function toEvent(item, chapterId) {
  const artist = item.topArtists?.[0]?.name ?? item.performer?.name ?? '';
  return {
    id: `sm-${item.id.slice(0, 8)}`,
    chapterId,
    title: item.title,
    date: item.startDate.slice(0, 10),
    time: '',
    artForm: artFormFor(item),
    type: typeFor(item.title),
    venue: venueFor(item),
    artist,
    artistId: '',
    audience: null,
    description: item.description || '',
    sourceUrl: item.ctaHref ? `https://spicmacay.org${item.ctaHref}` : '',
  };
}

// match: text that identifies the chapter's programmes in titles and venues.
export async function importProgrammes({ match = 'IIM Lucknow', chapterId = 'iim-lucknow' } = {}) {
  const needle = match.toLowerCase();
  const seen = new Set();
  const events = [];
  for (const feed of FEEDS) {
    for (const item of await fetchFeed(feed)) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      if ([item.title, item.venue, item.location].join(' ').toLowerCase().includes(needle)) events.push(toEvent(item, chapterId));
    }
  }
  return events.sort((a, b) => b.date.localeCompare(a.date));
}
