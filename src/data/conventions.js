// SPIC MACAY International Conventions, cross-checked against host-institution
// pages, government listings and news reports (see `sources`) on 30 Oct 2026.
// The 2023 convention was reported as the first since 2019.
export const conventions = [
  {
    id: 'ic-11', edition: 11, year: 2026, dates: '25–31 May 2026',
    host: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal', lat: 22.3149, lng: 87.3105,
    highlights: ['IIT Kharagpur’s second time as host, after 2018'],
    sources: [
      { label: 'Convention website', url: 'https://intcon.spicmacay.org/' },
      { label: 'News on AIR', url: 'https://newsonair.gov.in/manipur-governor-flags-off-spic-macay-delegation-for-international-convention/' },
    ],
  },
  {
    id: 'ic-10', edition: 10, year: 2025, dates: '26 May – 1 June 2025',
    host: 'IIT Hyderabad', city: 'Sangareddy', state: 'Telangana', lat: 17.5937, lng: 78.123,
    highlights: [],
    sources: [{ label: 'IIT Hyderabad', url: 'https://www.iith.ac.in/events/2025/05/26/SPICMACAY-10th-International-Convention/' }],
  },
  {
    id: 'ic-9', edition: 9, year: 2024, dates: '20–26 May 2024',
    host: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9916, lng: 80.2336,
    highlights: ['IIT Madras’s second time as host, after 2014'],
    sources: [{ label: 'IIT Madras', url: 'https://www.iitm.ac.in/happenings/press-releases-and-coverages/iit-madras-host-spic-macay-9th-international-convention' }],
  },
  {
    id: 'ic-8', edition: 8, year: 2023, dates: '29 May – 4 June 2023',
    host: 'VNIT Nagpur', city: 'Nagpur', state: 'Maharashtra', lat: 21.125, lng: 79.0515,
    highlights: ['The first convention since 2019'],
    sources: [{ label: 'The Hitavada', url: 'https://thehitavada.com/Encyc/2023/5/29/8th-Annual-International-Convention-of-SPIC-MACAY-begins-in-city-today.html' }],
  },
  {
    id: 'ic-7', edition: 7, year: 2019, dates: '3–9 June 2019',
    host: 'Jawaharlal Nehru University', city: 'New Delhi', state: 'Delhi', lat: 28.5402, lng: 77.1662,
    highlights: ['Held as part of JNU’s Golden Jubilee celebrations'],
    sources: [{ label: 'JNU', url: 'https://jnu.ac.in/node/159892789' }],
  },
  {
    id: 'ic-6', edition: 6, year: 2018, dates: '3–9 June 2018',
    host: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal', lat: 22.3149, lng: 87.3105,
    highlights: [],
    sources: [{ label: 'KGP Chronicle', url: 'https://kgpchronicle.iitkgp.ac.in/?p=807' }],
  },
  {
    id: 'ic-5', edition: 5, year: 2017, dates: '5–11 June 2017',
    host: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.545, lng: 77.1926,
    highlights: ['Held in SPIC MACAY’s 40th year, at the campus where it began', 'The Prime Minister addressed the convention by video conference'],
    sources: [
      { label: 'PMO India', url: 'https://www.pmindia.gov.in/?p=2390401' },
      { label: 'Millennium Post', url: 'https://www.millenniumpost.in/features/features-240328' },
    ],
  },
  {
    id: 'ic-4', edition: 4, year: 2016, dates: '9–15 May 2016',
    host: 'IIT Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.1878, lng: 91.6916,
    highlights: ['Nearly 1,300 students took part', 'Closed with heritage walks around Guwahati'],
    sources: [
      { label: 'IIT Guwahati', url: 'https://www.iitg.ac.in/spicmacay' },
      { label: 'College Dekho', url: 'https://collegedekho.com/news/international-convention-spic-macay-concludes-4852' },
    ],
  },
  {
    id: 'ic-3', edition: 3, year: 2015, dates: '31 May – 6 June 2015',
    host: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', lat: 19.1334, lng: 72.9133,
    highlights: [],
    sources: [{ label: 'InsIghT, IIT Bombay', url: 'https://insightiitb.org/?p=46805' }],
  },
  {
    id: 'ic-2', edition: 2, year: 2014, dates: '8–14 June 2014',
    host: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9916, lng: 80.2336,
    highlights: [],
    sources: [{ label: 'IGNCA', url: 'https://ignca.gov.in/?p=69652' }],
  },
  {
    id: 'ic-1', edition: 1, year: 2013, dates: '20–26 May 2013',
    host: 'IIM Calcutta', city: 'Kolkata', state: 'West Bengal', lat: 22.4457, lng: 88.306,
    highlights: ['SPIC MACAY’s first International Convention', 'Over 1,800 delegates were expected'],
    sources: [
      { label: 'Narthaki', url: 'https://narthaki.com/info/gtsk/gtsk79.html' },
      { label: 'Business Standard', url: 'https://business-standard.com/article/news-ians/spic-macay-s-first-globalal-convention-begins-may-20-in-kolkata-113051501191_1.html' },
    ],
  },
];

// A convention day, from the published schedule on spicmacay.org.
export const conventionDay = [
  { time: '4:00 – 7:00 AM', title: 'Hatha yog, naad yog & meditation', text: 'Each day begins before dawn with yoga and meditation.' },
  { time: 'Morning', title: 'Shramdaan', text: 'Volunteer service, such as cleaning and helping in the kitchen, done together by everyone.' },
  { time: 'Midday', title: 'Yog nidra', text: 'A guided rest after the community meal.' },
  { time: '2:00 – 5:00 PM', title: 'Afternoon sessions', text: 'Afternoon sessions with artists and speakers.' },
  { time: '6:00 – 8:30 PM', title: 'Evening concerts', text: 'Performances by leading musicians and dancers.' },
];

export const conventionFacts = [
  { value: '3,000–5,000', label: 'students, volunteers & artists each year' },
  { value: '50+', label: 'artists per edition' },
  { value: '20+', label: 'countries send delegates' },
];
export const conventionFactsSource = 'https://spicmacay.org/what-we-do/international-convention';
