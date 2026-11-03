// "Which art form are you?" Each answer adds points to art forms (ids from artForms.js).
export const quiz = [
  {
    q: 'It’s a free evening. You’d rather…',
    a: [
      { text: 'Sit quietly with a cup of tea and a long, slow song', score: { dhrupad: 2, 'hindustani-vocal': 1 } },
      { text: 'Dance until you’re out of breath', score: { kathak: 2, chhau: 1 } },
      { text: 'Make something with your hands', score: { madhubani: 2, pottery: 2 } },
      { text: 'Tell a story to a room full of friends', score: { kathakali: 2, yakshagana: 1, bharatanatyam: 1 } },
    ],
  },
  {
    q: 'Pick a sound.',
    a: [
      { text: 'A single, steady drone', score: { dhrupad: 2, 'carnatic-vocal': 1 } },
      { text: 'The ring of ankle bells', score: { kathak: 2, bharatanatyam: 1 } },
      { text: 'A bamboo flute at dawn', score: { 'hindustani-instrumental': 2, manipuri: 1 } },
      { text: 'Drums that make the floor shake', score: { percussion: 2, chhau: 1, kathakali: 1 } },
    ],
  },
  {
    q: 'Which place calls you?',
    a: [
      { text: 'A temple courtyard in the south', score: { bharatanatyam: 2, 'carnatic-vocal': 1, kuchipudi: 1 } },
      { text: 'A Lucknow haveli at night', score: { kathak: 2, 'hindustani-vocal': 1 } },
      { text: 'A desert camp under the stars', score: { 'rajasthani-folk': 2, baul: 1 } },
      { text: 'A green riverbank in Kerala', score: { mohiniyattam: 2, koodiyattam: 1, kathakali: 1 } },
    ],
  },
  {
    q: 'In a group project you are the one who…',
    a: [
      { text: 'Keeps everyone on time', score: { percussion: 2, 'carnatic-instrumental': 1 } },
      { text: 'Brings the colour and ideas', score: { madhubani: 2, pattachitra: 1, warli: 1 } },
      { text: 'Holds the whole thing together, calmly', score: { yoga: 2, dhrupad: 1 } },
      { text: 'Presents it with flair', score: { kuchipudi: 2, odissi: 1 } },
    ],
  },
  {
    q: 'Your ideal kind of grace is…',
    a: [
      { text: 'Sculptural, like a temple carving', score: { odissi: 2, bharatanatyam: 1 } },
      { text: 'Soft and swaying', score: { mohiniyattam: 2, manipuri: 2 } },
      { text: 'Strong and athletic', score: { chhau: 2, kathakali: 1 } },
      { text: 'Fast and precise', score: { kathak: 1, 'hindustani-instrumental': 1, percussion: 1 } },
    ],
  },
  {
    q: 'Choose a souvenir.',
    a: [
      { text: 'A painted scroll', score: { pattachitra: 2, madhubani: 1 } },
      { text: 'A hand-thrown clay cup', score: { pottery: 2, warli: 1 } },
      { text: 'A recording of a night-long concert', score: { 'hindustani-vocal': 2, 'carnatic-vocal': 1 } },
      { text: 'A single-string ektara', score: { baul: 2, 'rajasthani-folk': 1 } },
    ],
  },
];
