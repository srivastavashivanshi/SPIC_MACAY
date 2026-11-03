import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Interface text in English and Hindi. Content translations (art forms, artists,
// milestones…) live in src/data/hi.js. Missing Hindi falls back to English.
const dict = {
  en: {
    'nav.map': 'Reach Map', 'nav.artists': 'Artists', 'nav.artForms': 'Art Forms', 'nav.conventions': 'Conventions',
    'nav.gallery': 'Gallery', 'nav.chapter': 'Our Chapter', 'nav.learn': 'Learn', 'nav.glossary': 'Glossary',
    'nav.lineages': 'Gharana tree', 'nav.heritage': 'Heritage walk', 'nav.quiz': 'Quiz', 'nav.menu': 'Menu',
    'theme.auto': 'Theme: device', 'theme.light': 'Theme: light', 'theme.dark': 'Theme: dark',
    'lang.switch': 'हिन्दी', 'lang.label': 'Switch to Hindi',
    'footer.explore': 'Explore', 'footer.sources': 'Sources', 'footer.reach': 'Reach map data', 'footer.convention': 'International Convention',
    'footer.login': 'Volunteer login', 'footer.created': 'Conceived & created by', 'footer.rights': 'All rights reserved.',
    'footer.fine': 'The SPIC MACAY name and logo belong to SPIC MACAY. Artist and convention facts link to their sources.',
    'footer.society': 'Society for the Promotion of Indian Classical Music And Culture Amongst Youth',
    'common.source': 'Source', 'common.open': 'Open', 'common.search': 'Search', 'common.all': 'All', 'common.clear': 'Clear filters',
    'common.upcoming': 'Upcoming', 'common.past': 'Past programme', 'common.learnMore': 'Learn more', 'common.back': 'Back',
    'home.eyebrow': 'SPIC MACAY · IIM Lucknow Chapter', 'home.title1': 'India’s living heritage,', 'home.title2': 'one chapter at a time.',
    'home.lede': 'Since 1977, SPIC MACAY has brought Indian classical music, dance and crafts to students for free. Explore its reach, its artists, its art forms and its conventions, as seen from our chapter at IIM Lucknow.',
    'home.ctaMap': 'Explore the map', 'home.ctaChapter': 'Our chapter',
    'home.statFounded': 'founded at IIT Delhi', 'home.statStates': 'states & UTs reached', 'home.statInstitutions': 'institutions on the reach map', 'home.statProgrammes': 'programmes recorded',
    'home.figures': 'Figures from the', 'home.officialMap': 'official reach map',
    'home.exploreEyebrow': 'Explore', 'home.exploreTitle': 'Five ways into the movement',
    'home.weekEyebrow': 'Art form of the week', 'home.weekWatch': 'Watch on SPIC MACAY’s YouTube', 'home.weekGuide': 'Read the guide',
    'home.missionBy': 'The SPIC MACAY mission', 'home.storyEyebrow': 'The story', 'home.storyTitle': 'From one concert to a movement',
    'home.chapterEyebrow': 'Our chapter', 'home.chapterTitle': 'SPIC MACAY at IIM Lucknow',
    'home.chapterText': 'Lucknow has a special place in India’s culture. It gives its name to the Lucknow gharana of Kathak and has a long tradition of thumri, ghazal and courtly music. Our chapter brings that heritage, and the rest of India’s, to campus through concerts, lecture-demonstrations, workshops and heritage walks.',
    'home.chapterCta': 'Chapter dashboard', 'home.upcomingCount': 'upcoming programmes',
    'home.quizEyebrow': 'Quiz', 'home.quizTitle': 'Which art form are you?', 'home.quizText': 'Six quick questions, one art form that matches your spirit.', 'home.quizCta': 'Take the quiz',
    'explore.map': 'Zoom across India to see where SPIC MACAY is active, state by state.',
    'explore.artists': 'Explore maestros by art form, gharana and region.',
    'explore.artForms': 'A guide to the music, dance, folk arts and crafts SPIC MACAY presents.',
    'explore.conventions': 'Every International Convention since 2013, on a map and timeline.',
    'explore.chapter': 'IIM Lucknow’s programmes, reach and what’s coming next.',
    'subscribe.title': 'Hear about our next programme', 'subscribe.text': 'Get a note by email or WhatsApp when the chapter announces a programme. No spam, and you can ask us to remove you any time.',
    'subscribe.name': 'Your name', 'subscribe.email': 'Email', 'subscribe.phone': 'WhatsApp number', 'subscribe.consent': 'I agree to receive programme announcements from SPIC MACAY IIM Lucknow.',
    'subscribe.cta': 'Keep me posted', 'subscribe.done': 'Thank you! We’ll be in touch before the next programme.', 'subscribe.need': 'Add an email or a WhatsApp number.',
    'subscribe.whatsapp': 'Or join our WhatsApp channel',
    'rsvp.title': 'Coming along?', 'rsvp.text': 'Tell us you’ll attend so volunteers can plan seating.', 'rsvp.name': 'Your name', 'rsvp.email': 'Email (optional)',
    'rsvp.cta': 'I’ll attend', 'rsvp.done': 'See you there! Thanks for letting us know.', 'rsvp.count': '{n} people plan to attend', 'rsvp.countOne': '1 person plans to attend',
    'prog.when': 'When', 'prog.where': 'Where', 'prog.artForm': 'Art form', 'prog.attendance': 'Attendance', 'prog.venueTba': 'Venue to be announced',
    'prog.gcal': 'Add to Google Calendar', 'prog.ics': 'Download .ics', 'prog.share': 'Share', 'prog.copied': 'Link copied', 'prog.onSite': 'On spicmacay.org',
    'prog.poster': 'Download poster', 'prog.posterMaking': 'Making poster…', 'prog.photos': 'Photos', 'prog.noPhotos': 'No photos from this programme yet.',
    'prog.photosLater': 'Photos will appear here after the programme.', 'prog.back': 'programmes', 'prog.notFound': 'We couldn’t find that programme. It may have been renamed or removed.',
    'prog.all': 'All programmes', 'prog.learnAbout': 'Learn about',
    'glossary.eyebrow': 'Glossary', 'glossary.title': 'Words of the tradition', 'glossary.lede': 'Raga, tala, abhinaya and more. Look for dotted underlines across the site: hover or tap them for a definition.',
    'glossary.search': 'Search a term',
    'lineage.eyebrow': 'Gharana tree', 'lineage.title': 'Guru to shishya', 'lineage.lede': 'Indian classical arts pass from teacher to student, often within a family. Explore the lineages behind artists in our explorer. Every link is sourced.',
    'lineage.filter': 'Tradition', 'lineage.inExplorer': 'In the explorer',
    'heritage.eyebrow': 'Lucknow heritage walk', 'heritage.title': 'Walk with the Nawabs', 'heritage.lede': 'The monuments of old Lucknow, in walking order, for the chapter’s heritage walks. Tap a stop to see it on the map.',
    'heritage.stop': 'Stop', 'heritage.built': 'Built', 'heritage.by': 'By', 'heritage.directions': 'Directions', 'heritage.walks': 'Our heritage walks',
    'heritage.noWalks': 'Heritage walks the chapter runs will appear here.',
    'quiz.eyebrow': 'Quiz', 'quiz.title': 'Which art form are you?', 'quiz.lede': 'Six quick questions. Answer with your heart, not your head.',
    'quiz.question': 'Question {n} of {total}', 'quiz.result': 'You are', 'quiz.again': 'Take it again', 'quiz.share': 'Share my result', 'quiz.read': 'Read about',
    'quiz.copied': 'Result copied to share',
    'artist.notFound': 'We couldn’t find that artist.', 'artist.lineage': 'Lineage', 'artist.region': 'Region', 'artist.honours': 'Honours',
    'artist.atChapter': 'At IIM Lucknow', 'artist.gurus': 'Learned from', 'artist.listen': 'Listen on YouTube', 'artist.allArtists': 'All artists',
    'artist.related': 'More in', 'artist.performed': 'Artists who performed at IIM Lucknow',
    'artists.title': 'The maestros', 'artists.search': 'Search name, instrument, gharana, region', 'artists.allCats': 'All categories', 'artists.allForms': 'All art forms', 'artists.none': 'No artists match these filters.',
    'forms.eyebrow': 'Art Form Guide', 'forms.title': 'The arts of SPIC MACAY', 'forms.lede': 'Classical music and dance, folk traditions, crafts, yoga and cinema: the art forms you will meet at SPIC MACAY programmes. Pick one to learn more.',
    'forms.key': 'Key elements', 'forms.instruments': 'Instruments', 'forms.artists': 'Artists', 'forms.at': 'At', 'forms.none': 'Our chapter hasn’t listed a programme in this art form yet.', 'forms.dashboard': 'See the chapter dashboard', 'forms.inExplorer': 'artists in the explorer',
    'conv.eyebrow': 'International Convention', 'conv.title': 'A week with the masters', 'conv.lede': 'Every year thousands of students, volunteers and artists live together on one campus for a week of music, dance, yoga, shramdaan and simple living.',
    'conv.rhythm': 'Daily rhythm', 'conv.day': 'A day at the convention', 'conv.every': 'Every International Convention', 'conv.edition': 'edition',
    'dash.eyebrow': 'Chapter Dashboard', 'dash.lede': 'Our chapter’s programmes, reach and what’s coming up next.',
    'gallery.eyebrow': 'Gallery', 'gallery.title': 'Moments from our programmes', 'gallery.lede': 'Concerts, lecture-demonstrations, workshops and walks with SPIC MACAY at IIM Lucknow.', 'gallery.empty': 'Photos from our programmes will appear here soon.',
    'map.eyebrow': 'Reach Map', 'map.title': 'SPIC MACAY across India',
    'nav.ragas': 'Raga explorer', 'nav.talas': 'Tala player', 'nav.instruments': 'Instruments',
    'ragas.title': 'Listen to a raga', 'ragas.lede': 'Eight well-loved ragas: their notes, their hour and their mood. Press play to hear each scale on a harmonium-like tone, over a tanpura drone if you like.',
    'ragas.mood': 'Mood', 'ragas.when': 'Traditional hour', 'ragas.droneOn': 'Tanpura drone: off', 'ragas.droneOff': 'Tanpura drone: on', 'ragas.hear': 'Hear it performed',
    'ragas.caveat': 'These are the bare ascending and descending scales, tuned in just intonation. A real raga lives in its characteristic phrases, glides and ornaments, which only a musician can bring. Facts follow each raga’s Wikipedia article.',
    'talas.title': 'Feel the cycle', 'talas.lede': 'A tala is a cycle of beats. Choose one, press play, and follow the tabla around the circle: X marks sam, the first beat; 0 marks khali, where the bass drops away.',
    'talas.beats': 'beats', 'talas.play': 'Play', 'talas.stop': 'Stop', 'talas.tempo': 'Tempo',
    'talas.caveat': 'Synthesised tabla playing the standard theka (basic pattern) as commonly taught; teachers and gharanas vary the strokes.',
    'inst.title': 'Meet the instruments', 'inst.lede': 'Eight instruments you will hear at SPIC MACAY programmes. Tap a number to learn what each part does.', 'inst.hint': 'Tap or hover over a number to learn about that part.',
    'primer.title': 'Before the concert', 'primer.print': 'Print this page', 'primer.about': 'About', 'primer.listen': 'What to listen for', 'primer.words': 'Words you may hear', 'primer.etiquette': 'Concert etiquette',
    'primer.cta': 'Read the one-page primer', 'primer.text': 'What to listen for, words you may hear, and concert etiquette.',
    'map.boundary': 'Official boundary of India: Survey of India, via DataMeet (CC BY 4.0)',
  },
  hi: {
    'nav.map': 'पहुँच मानचित्र', 'nav.artists': 'कलाकार', 'nav.artForms': 'कला रूप', 'nav.conventions': 'अधिवेशन',
    'nav.gallery': 'चित्र दीर्घा', 'nav.chapter': 'हमारा अध्याय', 'nav.learn': 'सीखें', 'nav.glossary': 'शब्दावली',
    'nav.lineages': 'घराना वृक्ष', 'nav.heritage': 'विरासत यात्रा', 'nav.quiz': 'प्रश्नोत्तरी', 'nav.menu': 'मेन्यू',
    'theme.auto': 'थीम: डिवाइस', 'theme.light': 'थीम: हल्की', 'theme.dark': 'थीम: गहरी',
    'lang.switch': 'English', 'lang.label': 'Switch to English',
    'footer.explore': 'देखें', 'footer.sources': 'स्रोत', 'footer.reach': 'पहुँच मानचित्र डेटा', 'footer.convention': 'अंतरराष्ट्रीय अधिवेशन',
    'footer.login': 'स्वयंसेवक लॉगिन', 'footer.created': 'परिकल्पना एवं निर्माण', 'footer.rights': 'सर्वाधिकार सुरक्षित।',
    'footer.fine': 'SPIC MACAY का नाम और लोगो SPIC MACAY के हैं। कलाकारों और अधिवेशनों के तथ्य अपने स्रोतों से जुड़े हैं।',
    'footer.society': 'युवाओं में भारतीय शास्त्रीय संगीत और संस्कृति के प्रचार हेतु संस्था',
    'common.source': 'स्रोत', 'common.open': 'खोलें', 'common.search': 'खोजें', 'common.all': 'सभी', 'common.clear': 'फ़िल्टर हटाएँ',
    'common.upcoming': 'आगामी', 'common.past': 'पिछला कार्यक्रम', 'common.learnMore': 'और जानें', 'common.back': 'वापस',
    'home.eyebrow': 'SPIC MACAY · आईआईएम लखनऊ अध्याय', 'home.title1': 'भारत की जीवंत विरासत,', 'home.title2': 'एक‑एक अध्याय में।',
    'home.lede': '1977 से SPIC MACAY विद्यार्थियों तक भारतीय शास्त्रीय संगीत, नृत्य और शिल्प निःशुल्क पहुँचा रहा है। आईआईएम लखनऊ अध्याय की नज़र से इसकी पहुँच, कलाकार, कला रूप और अधिवेशन देखें।',
    'home.ctaMap': 'मानचित्र देखें', 'home.ctaChapter': 'हमारा अध्याय',
    'home.statFounded': 'आईआईटी दिल्ली में स्थापना', 'home.statStates': 'राज्य और केंद्रशासित प्रदेश', 'home.statInstitutions': 'संस्थान पहुँच मानचित्र पर', 'home.statProgrammes': 'दर्ज कार्यक्रम',
    'home.figures': 'आँकड़े स्रोत:', 'home.officialMap': 'आधिकारिक पहुँच मानचित्र',
    'home.exploreEyebrow': 'देखें', 'home.exploreTitle': 'आंदोलन को जानने के पाँच रास्ते',
    'home.weekEyebrow': 'इस सप्ताह का कला रूप', 'home.weekWatch': 'SPIC MACAY के YouTube पर देखें', 'home.weekGuide': 'परिचय पढ़ें',
    'home.missionBy': 'SPIC MACAY का ध्येय', 'home.storyEyebrow': 'कहानी', 'home.storyTitle': 'एक संगीत संध्या से एक आंदोलन तक',
    'home.chapterEyebrow': 'हमारा अध्याय', 'home.chapterTitle': 'आईआईएम लखनऊ में SPIC MACAY',
    'home.chapterText': 'भारत की संस्कृति में लखनऊ का विशेष स्थान है। कथक का लखनऊ घराना इसी शहर के नाम से जाना जाता है, और यहाँ ठुमरी, ग़ज़ल और दरबारी संगीत की लंबी परंपरा रही है। हमारा अध्याय संगीत संध्याओं, व्याख्यान-प्रदर्शनों, कार्यशालाओं और विरासत यात्राओं के ज़रिए यह विरासत परिसर तक लाता है।',
    'home.chapterCta': 'अध्याय डैशबोर्ड', 'home.upcomingCount': 'आगामी कार्यक्रम',
    'home.quizEyebrow': 'प्रश्नोत्तरी', 'home.quizTitle': 'आप कौन-सा कला रूप हैं?', 'home.quizText': 'छह छोटे प्रश्न, और एक कला रूप जो आपके स्वभाव से मेल खाता है।', 'home.quizCta': 'प्रश्नोत्तरी शुरू करें',
    'explore.map': 'पूरे भारत में देखें कि SPIC MACAY कहाँ-कहाँ सक्रिय है।',
    'explore.artists': 'कला रूप, घराने और क्षेत्र के अनुसार उस्तादों को जानें।',
    'explore.artForms': 'SPIC MACAY द्वारा प्रस्तुत संगीत, नृत्य, लोक कला और शिल्प का परिचय।',
    'explore.conventions': '2013 से अब तक हर अंतरराष्ट्रीय अधिवेशन, मानचित्र और समयरेखा पर।',
    'explore.chapter': 'आईआईएम लखनऊ के कार्यक्रम, पहुँच और आगे क्या है।',
    'subscribe.title': 'अगले कार्यक्रम की सूचना पाएँ', 'subscribe.text': 'अध्याय जब भी कोई कार्यक्रम घोषित करे, ईमेल या WhatsApp पर सूचना पाएँ। कोई स्पैम नहीं, और आप कभी भी हटने को कह सकते हैं।',
    'subscribe.name': 'आपका नाम', 'subscribe.email': 'ईमेल', 'subscribe.phone': 'WhatsApp नंबर', 'subscribe.consent': 'मैं SPIC MACAY आईआईएम लखनऊ से कार्यक्रमों की सूचना पाने के लिए सहमत हूँ।',
    'subscribe.cta': 'मुझे सूचित करें', 'subscribe.done': 'धन्यवाद! अगले कार्यक्रम से पहले हम संपर्क करेंगे।', 'subscribe.need': 'ईमेल या WhatsApp नंबर में से एक दें।',
    'subscribe.whatsapp': 'या हमारे WhatsApp चैनल से जुड़ें',
    'rsvp.title': 'क्या आप आएँगे?', 'rsvp.text': 'बताइए कि आप आ रहे हैं, ताकि स्वयंसेवक बैठने की व्यवस्था कर सकें।', 'rsvp.name': 'आपका नाम', 'rsvp.email': 'ईमेल (वैकल्पिक)',
    'rsvp.cta': 'मैं आऊँगा/आऊँगी', 'rsvp.done': 'वहाँ मिलते हैं! बताने के लिए धन्यवाद।', 'rsvp.count': '{n} लोग आने वाले हैं', 'rsvp.countOne': '1 व्यक्ति आने वाला है',
    'prog.when': 'कब', 'prog.where': 'कहाँ', 'prog.artForm': 'कला रूप', 'prog.attendance': 'उपस्थिति', 'prog.venueTba': 'स्थान की घोषणा बाद में',
    'prog.gcal': 'Google Calendar में जोड़ें', 'prog.ics': '.ics डाउनलोड करें', 'prog.share': 'साझा करें', 'prog.copied': 'लिंक कॉपी हुआ', 'prog.onSite': 'spicmacay.org पर',
    'prog.poster': 'पोस्टर डाउनलोड करें', 'prog.posterMaking': 'पोस्टर बन रहा है…', 'prog.photos': 'चित्र', 'prog.noPhotos': 'इस कार्यक्रम के चित्र अभी नहीं हैं।',
    'prog.photosLater': 'कार्यक्रम के बाद चित्र यहाँ दिखेंगे।', 'prog.back': 'कार्यक्रम', 'prog.notFound': 'यह कार्यक्रम नहीं मिला। हो सकता है इसका नाम बदला गया हो या हटा दिया गया हो।',
    'prog.all': 'सभी कार्यक्रम', 'prog.learnAbout': 'जानें:',
    'glossary.eyebrow': 'शब्दावली', 'glossary.title': 'परंपरा के शब्द', 'glossary.lede': 'राग, ताल, अभिनय और भी बहुत कुछ। पूरी साइट पर बिंदुदार रेखांकित शब्दों पर माउस ले जाएँ या टैप करें, अर्थ दिखेगा।',
    'glossary.search': 'शब्द खोजें',
    'lineage.eyebrow': 'घराना वृक्ष', 'lineage.title': 'गुरु से शिष्य तक', 'lineage.lede': 'भारतीय शास्त्रीय कलाएँ गुरु से शिष्य तक, अक्सर परिवार के भीतर, आगे बढ़ती हैं। हमारे कलाकारों की परंपराएँ देखें। हर संबंध स्रोत से जुड़ा है।',
    'lineage.filter': 'परंपरा', 'lineage.inExplorer': 'कलाकार सूची में',
    'heritage.eyebrow': 'लखनऊ विरासत यात्रा', 'heritage.title': 'नवाबों के शहर में', 'heritage.lede': 'पुराने लखनऊ के स्मारक, पैदल यात्रा के क्रम में, अध्याय की विरासत यात्राओं के लिए। किसी पड़ाव पर टैप करें, मानचित्र पर दिखेगा।',
    'heritage.stop': 'पड़ाव', 'heritage.built': 'निर्माण', 'heritage.by': 'द्वारा', 'heritage.directions': 'रास्ता देखें', 'heritage.walks': 'हमारी विरासत यात्राएँ',
    'heritage.noWalks': 'अध्याय की विरासत यात्राएँ यहाँ दिखेंगी।',
    'quiz.eyebrow': 'प्रश्नोत्तरी', 'quiz.title': 'आप कौन-सा कला रूप हैं?', 'quiz.lede': 'छह छोटे प्रश्न। दिमाग़ से नहीं, दिल से जवाब दें।',
    'quiz.question': 'प्रश्न {n} / {total}', 'quiz.result': 'आप हैं', 'quiz.again': 'फिर से खेलें', 'quiz.share': 'अपना परिणाम साझा करें', 'quiz.read': 'पढ़ें:',
    'quiz.copied': 'परिणाम कॉपी हुआ',
    'artist.notFound': 'यह कलाकार नहीं मिला।', 'artist.lineage': 'घराना / परंपरा', 'artist.region': 'क्षेत्र', 'artist.honours': 'सम्मान',
    'artist.atChapter': 'आईआईएम लखनऊ में', 'artist.gurus': 'गुरु', 'artist.listen': 'YouTube पर सुनें', 'artist.allArtists': 'सभी कलाकार',
    'artist.related': 'और कलाकार:', 'artist.performed': 'आईआईएम लखनऊ में प्रस्तुति देने वाले कलाकार',
    'artists.title': 'उस्ताद और गुरु', 'artists.search': 'नाम, वाद्य, घराना या क्षेत्र खोजें', 'artists.allCats': 'सभी श्रेणियाँ', 'artists.allForms': 'सभी कला रूप', 'artists.none': 'इन फ़िल्टरों से कोई कलाकार नहीं मिला।',
    'forms.eyebrow': 'कला रूप परिचय', 'forms.title': 'SPIC MACAY की कलाएँ', 'forms.lede': 'शास्त्रीय संगीत और नृत्य, लोक परंपराएँ, शिल्प, योग और सिनेमा: वे कला रूप जो आपको SPIC MACAY कार्यक्रमों में मिलेंगे। किसी एक को चुनें और जानें।',
    'forms.key': 'मुख्य तत्व', 'forms.instruments': 'वाद्य', 'forms.artists': 'कलाकार', 'forms.at': 'स्थान:', 'forms.none': 'हमारे अध्याय ने इस कला रूप का कोई कार्यक्रम अभी दर्ज नहीं किया है।', 'forms.dashboard': 'अध्याय डैशबोर्ड देखें', 'forms.inExplorer': 'कलाकार सूची में देखें',
    'conv.eyebrow': 'अंतरराष्ट्रीय अधिवेशन', 'conv.title': 'उस्तादों के साथ एक सप्ताह', 'conv.lede': 'हर साल हज़ारों विद्यार्थी, स्वयंसेवक और कलाकार एक परिसर में एक सप्ताह साथ रहते हैं — संगीत, नृत्य, योग, श्रमदान और सादे जीवन के साथ।',
    'conv.rhythm': 'दिनचर्या', 'conv.day': 'अधिवेशन का एक दिन', 'conv.every': 'हर अंतरराष्ट्रीय अधिवेशन', 'conv.edition': 'संस्करण',
    'dash.eyebrow': 'अध्याय डैशबोर्ड', 'dash.lede': 'हमारे अध्याय के कार्यक्रम, पहुँच और आगे क्या है।',
    'gallery.eyebrow': 'चित्र दीर्घा', 'gallery.title': 'हमारे कार्यक्रमों की झलकियाँ', 'gallery.lede': 'आईआईएम लखनऊ में SPIC MACAY के संगीत, व्याख्यान-प्रदर्शन, कार्यशालाएँ और यात्राएँ।', 'gallery.empty': 'हमारे कार्यक्रमों के चित्र जल्द ही यहाँ दिखेंगे।',
    'map.eyebrow': 'पहुँच मानचित्र', 'map.title': 'पूरे भारत में SPIC MACAY',
    'nav.ragas': 'राग परिचय', 'nav.talas': 'ताल वादक', 'nav.instruments': 'वाद्य',
    'ragas.title': 'राग सुनें', 'ragas.lede': 'आठ प्रिय राग: उनके स्वर, उनका समय और उनका भाव। हर स्केल हारमोनियम जैसी ध्वनि में सुनें, चाहें तो तानपुरे के साथ।',
    'ragas.mood': 'भाव', 'ragas.when': 'पारंपरिक समय', 'ragas.droneOn': 'तानपुरा: बंद', 'ragas.droneOff': 'तानपुरा: चालू', 'ragas.hear': 'प्रस्तुति सुनें',
    'ragas.caveat': 'ये केवल आरोह और अवरोह के स्वर हैं। असली राग अपने विशिष्ट वाक्यांशों, मींड और अलंकारों में बसता है, जिन्हें केवल संगीतकार ही ला सकता है। तथ्य हर राग के विकिपीडिया लेख से हैं।',
    'talas.title': 'ताल का चक्र', 'talas.lede': 'ताल मात्राओं का एक चक्र है। कोई ताल चुनें, चलाएँ और तबले के साथ चक्र में घूमें: X सम है, पहली मात्रा; 0 ख़ाली है, जहाँ बायाँ शांत हो जाता है।',
    'talas.beats': 'मात्राएँ', 'talas.play': 'चलाएँ', 'talas.stop': 'रोकें', 'talas.tempo': 'लय',
    'talas.caveat': 'संश्लेषित तबला, जो सामान्यतः सिखाया जाने वाला ठेका बजाता है; गुरुओं और घरानों के अनुसार बोल बदलते हैं।',
    'inst.title': 'वाद्यों से मिलें', 'inst.lede': 'आठ वाद्य जो आप SPIC MACAY कार्यक्रमों में सुनेंगे। किसी अंक पर टैप करें और जानें कि वह भाग क्या करता है।', 'inst.hint': 'किसी अंक पर टैप करें या माउस ले जाएँ।',
    'primer.title': 'संगीत संध्या से पहले', 'primer.print': 'यह पृष्ठ प्रिंट करें', 'primer.about': 'परिचय:', 'primer.listen': 'क्या सुनें', 'primer.words': 'शब्द जो आप सुन सकते हैं', 'primer.etiquette': 'श्रोता शिष्टाचार',
    'primer.cta': 'एक पृष्ठ की परिचय पुस्तिका पढ़ें', 'primer.text': 'क्या सुनें, कौन-से शब्द सुनेंगे, और श्रोता शिष्टाचार।',
    'map.boundary': 'भारत की आधिकारिक सीमा: भारतीय सर्वेक्षण विभाग, DataMeet के माध्यम से (CC BY 4.0)',
  },
};

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

const stored = () => {
  try {
    return localStorage.getItem('lang') === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(stored);
  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* private mode: keep the choice for this visit only */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const t = useCallback(
    (key, vars) => {
      const text = dict[lang][key] ?? dict.en[key] ?? key;
      return vars ? text.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '') : text;
    },
    [lang],
  );
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const useT = () => useContext(LangContext).t;
