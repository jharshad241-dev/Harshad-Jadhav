import { Track, Playlist, BhaktiScheduleConfig } from '../types';

// High-quality public domain / royalty-free audio streams for seamless background playback
const AUDIO_SAMPLES = [
  'https://actions.google.com/sounds/v1/music/calm_meditation.ogg',
  'https://actions.google.com/sounds/v1/music/acoustic_guitar_soft.ogg',
  'https://actions.google.com/sounds/v1/music/festive_percussion.ogg',
  'https://actions.google.com/sounds/v1/music/classical_piano.ogg',
  'https://actions.google.com/sounds/v1/ambiences/outdoor_cultural_festival.ogg',
  'https://actions.google.com/sounds/v1/music/uplifting_pad.ogg'
];

// Helper utilities for Spotify integration
export function extractSpotifyId(input: string): string | null {
  if (!input) return null;
  const match = input.match(/(?:track\/|track:)([a-zA-Z0-9]{22})/);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9]{22}$/.test(input.trim())) return input.trim();
  return null;
}

export function getSpotifyEmbedUrl(spotifyId: string): string {
  return `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`;
}

export const TRACKS_DATA: Track[] = [
  // --- MARATHI BHAKTI & DEVOTIONAL (Vitthal, Abhang, Ganpati) ---
  {
    id: 'm-bhakti-1',
    title: 'Maajhe Vitthal Maajhe Ry',
    artist: 'Prahlad Shinde & Lata Mangeshkar',
    album: 'Vitthal Bhakti Sanjeevani',
    language: 'Marathi',
    category: 'Marathi Devotional',
    bhaktiCategory: 'Vitthal Songs',
    durationSeconds: 285,
    coverArtUrl: 'https://images.unsplash.com/photo-1609102026400-3d026932e652?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[1],
    spotifyId: '3n3Pp32S33G2p0X0Y8Z1aB',
    spotifyUrl: 'https://open.spotify.com/track/3n3Pp32S33G2p0X0Y8Z1aB',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/3n3Pp32S33G2p0X0Y8Z1aB?utm_source=generator&theme=0',
    isBhaktiGeet: true,
    scheduledTime: 'Morning 9 AM',
    isPopular: true,
    lyrics: `माझे विठ्ठल माझे सखे | पांडुरंग दयाळा |
विठू माऊली तुझी सावली | पांडुरंग कृपाळू ||

तालात टाळ, मृदुंगाचा गजर |
पंढरीच्या वारीत आनंदाचा तुषार ||`,
    spiritualMeaning: 'A timeless Marathi Abhang celebrating infinite devotion to Lord Vitthal of Pandharpur.'
  },
  {
    id: 'm-bhakti-2',
    title: 'Khel Mandala - Vitthal Abhang',
    artist: 'Ajay Gogavale (Ajay-Atul)',
    album: 'Natarang Bhakti Special',
    language: 'Marathi',
    category: 'Marathi Devotional',
    bhaktiCategory: 'Abhang & Traditional Geet',
    durationSeconds: 320,
    coverArtUrl: 'https://images.unsplash.com/photo-1545232979-fbf4203715d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[2],
    spotifyId: '5cXq6R8s4M3K1A0Z9B2cC3',
    spotifyUrl: 'https://open.spotify.com/track/5cXq6R8s4M3K1A0Z9B2cC3',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/5cXq6R8s4M3K1A0Z9B2cC3?utm_source=generator&theme=0',
    isBhaktiGeet: true,
    scheduledTime: 'Evening 7 PM',
    isTrending: true,
    lyrics: `हे खेळ मांडला, खेळ मांडला |
देवा तुझ्याच या दारात खेळ मांडला ||
पांडुरंगाच्या दर्शनाने मन शांत झाले |`,
    spiritualMeaning: 'A deeply soulful Marathi spiritual composition reflecting on life\'s karma and divine alignment.'
  },
  {
    id: 'm-bhakti-3',
    title: 'Sukhkarta Dukhharta (Ganesh Aarti)',
    artist: 'Lata Mangeshkar & Chorus',
    album: 'Ganpati Bappa Morya Classics',
    language: 'Marathi',
    category: 'Marathi Devotional',
    bhaktiCategory: 'Ganpati Bappa',
    durationSeconds: 240,
    coverArtUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[0],
    spotifyId: '1a2b3c4d5e6f7g8h9i0j1k',
    spotifyUrl: 'https://open.spotify.com/track/1a2b3c4d5e6f7g8h9i0j1k',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/1a2b3c4d5e6f7g8h9i0j1k?utm_source=generator&theme=0',
    isBhaktiGeet: true,
    scheduledTime: 'Morning 9 AM',
    isPopular: true,
    lyrics: `सुखकर्ता दुखहर्ता वार्ता विघ्नाची |
नुरवी पुरवी प्रेम कृपा जयाची ||
सर्वांगी सुंदर उटी शेंदुराची |
कंठी झळके माळ मुक्ताफळांची ||`,
    spiritualMeaning: 'The essential traditional Maharashtrian Ganesh Aarti offered during morning and evening prayers.'
  },
  {
    id: 'm-bhakti-4',
    title: 'Aai Bhavani Tujhyakrupene',
    artist: 'Anuradha Paudwal',
    album: 'Devi Bhakti Pushpa',
    language: 'Marathi',
    category: 'Marathi Devotional',
    bhaktiCategory: 'Devi Stuti & Aarti',
    durationSeconds: 290,
    coverArtUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[1],
    isBhaktiGeet: true,
    scheduledTime: 'Evening 7 PM',
    lyrics: `आई भवानी तुझ्या कृपेने |
तुळजापूरची भवानी माता |
आशिर्वाद तुझा सदैव पाठीशी असू दे ||`
  },

  // --- MARATHI LAVANI SPECIAL ---
  {
    id: 'lavani-1',
    title: 'Apsara Aali (Royal Lavani)',
    artist: 'Bela Shende & Ajay-Atul',
    album: 'Natarang Lavani Gold',
    language: 'Marathi',
    category: 'Lavani Special',
    durationSeconds: 215,
    coverArtUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[3],
    spotifyId: '303I22R7lR1A1XN9N8Ue5q',
    spotifyUrl: 'https://open.spotify.com/track/303I22R7lR1A1XN9N8Ue5q',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/303I22R7lR1A1XN9N8Ue5q?utm_source=generator&theme=0',
    isLavaniSpecial: true,
    isPopular: true,
    isTrending: true,
    lyrics: `अप्सरा आली, इंद्रपुरीतून आली |
नटली थटली जशी ही चांदणी फुलली ||
रूपाची खाण ही, नटखट लावणीची राणी ||`
  },
  {
    id: 'lavani-2',
    title: 'Bugadi Majhi Sandli Ga',
    artist: 'Sulochana Chavan',
    album: 'Golden Era Marathi Lavani',
    language: 'Marathi',
    category: 'Lavani Special',
    durationSeconds: 260,
    coverArtUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[4],
    isLavaniSpecial: true,
    isPopular: true,
    lyrics: `बुगडी माझी सांडली ग, सांडली ग तांबड्या मातीत |
नका सांगू माझ्या सासऱ्याला, नका सांगू माझ्या भावाला ||`
  },
  {
    id: 'lavani-3',
    title: 'Khel Majha Challa',
    artist: 'Vaishali Samant',
    album: 'Modern Electro Lavani Hits',
    language: 'Marathi',
    category: 'Lavani Special',
    durationSeconds: 205,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[2],
    isLavaniSpecial: true,
    isTrending: true,
    lyrics: `नाचते मी नृत्यात, तालाच्या लयीत |
लावणीची जादू ही रसिक मनात संकरित ||`
  },

  // --- MARATHI CLASSICS & ROMANTIC ---
  {
    id: 'm-classic-1',
    title: 'Ashi Hi Banwa Banwi (Title Track)',
    artist: 'Sachin Pilgaonkar & Suresh Wadkar',
    album: 'Evergreen Marathi Comedy Hits',
    language: 'Marathi',
    category: 'Marathi Classics',
    durationSeconds: 250,
    coverArtUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[5],
    isPopular: true,
    lyrics: `धनंजय माने, शंतनू... अशी ही बनवा बनवी!
हास्याची लकीर, आनंदाची नवी पहाट!`
  },
  {
    id: 'm-romantic-1',
    title: 'Sairat Zaala Ji',
    artist: 'Ajay Gogavale & Shreya Ghoshal',
    album: 'Sairat Soundtrack',
    language: 'Marathi',
    category: 'Marathi Romantic',
    durationSeconds: 325,
    coverArtUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[0],
    isPopular: true,
    isTrending: true,
    lyrics: `याडला लागलं ग, याडला लागलं ग |
पिरतीचा रंग हा उधळला जिवापार ||`
  },
  {
    id: 'm-romantic-2',
    title: 'Jeev Bhulala',
    artist: 'Sonu Nigam & Shreya Ghoshal',
    album: 'Lai Bhaari Love Harmonies',
    language: 'Marathi',
    category: 'Marathi Romantic',
    durationSeconds: 275,
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[1],
    lyrics: `जीव भुलाला तुझ्याच प्रीतीत |
सख्या रे मनाची ही स्पंदने तुझ्या सोबतीत ||`
  },

  // --- HINDI BHAKTI & DEVOTIONAL ---
  {
    id: 'h-bhakti-1',
    title: 'Hanuman Chalisa (Golden Edition)',
    artist: 'Gulshan Kumar & Hariharan',
    album: 'Shree Hanuman Bhakti Mala',
    language: 'Hindi',
    category: 'Hindi Devotional',
    bhaktiCategory: 'Hanuman Chalisa & Bhajan',
    durationSeconds: 580,
    coverArtUrl: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[2],
    isBhaktiGeet: true,
    scheduledTime: 'Morning 9 AM',
    isPopular: true,
    lyrics: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि |
बरनऊँ रघुबर बिमल जसु जो दायकु फल चारि ||
बुद्धिहीन तनु जानिके सुमिरौ पवन-कुमार |
बल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार ||`
  },
  {
    id: 'h-bhakti-2',
    title: 'Shiv Tandav Stotram',
    artist: 'Shankar Mahadevan',
    album: 'Mahadev Shiv Aradhana',
    language: 'Hindi',
    category: 'Hindi Devotional',
    bhaktiCategory: 'Shiv Bhajan',
    durationSeconds: 380,
    coverArtUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[3],
    isBhaktiGeet: true,
    scheduledTime: 'Evening 7 PM',
    isTrending: true,
    lyrics: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजंगतुंगमालिकाम् |
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चंडतांडवं तनोतु नः शिवः शिवम् ||`
  },
  {
    id: 'h-bhakti-3',
    title: 'Achyutam Keshavam Krishna Damodaram',
    artist: 'Vikram Hazra & Anup Jalota',
    album: 'Krishna Divine Chants',
    language: 'Hindi',
    category: 'Hindi Devotional',
    bhaktiCategory: 'Krishna & Balaji',
    durationSeconds: 310,
    coverArtUrl: 'https://images.unsplash.com/photo-1609102026400-3d026932e652?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[1],
    isBhaktiGeet: true,
    lyrics: `अच्युतम केशवम कृष्ण दामोदरम |
राम नारायणम जानकी वल्लभम ||
कौन कहता है भगवान आते नहीं |
तुम मीरा के जैसे बुलाते नहीं ||`
  },

  // --- HINDI EVERGREEN & BOLLYWOOD ---
  {
    id: 'h-classic-1',
    title: 'Tere Bina Zindagi Se Koi Shikwa To Nahin',
    artist: 'Kishore Kumar & Lata Mangeshkar',
    album: 'Aandhi Evergreen Gold',
    language: 'Hindi',
    category: 'Old Hindi Classics',
    durationSeconds: 340,
    coverArtUrl: 'https://images.unsplash.com/photo-1445985543468-b42169e54ef0?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[4],
    isPopular: true,
    lyrics: `तेरे बिना जिंदगी से कोई शिकवा तो नहीं |
तेरे बिना जिंदगी भी लेकिन जिंदगी तो नहीं ||`
  },
  {
    id: 'h-romantic-1',
    title: 'Kesariya (Brahmastra)',
    artist: 'Arijit Singh & Pritam',
    album: 'Bollywood Love Melodies 2026',
    language: 'Hindi',
    category: 'Latest Hindi',
    durationSeconds: 268,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[0],
    isTrending: true,
    isPopular: true,
    lyrics: `केसरिया तेरा इश्क है पिया |
रंग जाऊं जो मैं हाथ लगाऊं ||
दिन बीते सारा तेरी फिक्र में |
रैन सारी तेरी खैर मनाऊं ||`
  },
  {
    id: 'h-classic-2',
    title: 'Pal Pal Dil Ke Pass',
    artist: 'Kishore Kumar',
    album: 'Black & Gold Retro Classics',
    language: 'Hindi',
    category: 'Evergreen',
    durationSeconds: 312,
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: AUDIO_SAMPLES[5],
    isPopular: true,
    lyrics: `पल पल दिल के पास तुम रहती हो |
जीवन मीठी प्यास तुम कहती हो ||`
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-morning-bhakti',
    name: '🕉️ Morning 9 AM Bhakti Station',
    description: 'Automatic daily morning Marathi & Hindi Ganpati, Vitthal & Hanuman Bhakti Geets.',
    coverArtUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
    trackIds: ['m-bhakti-3', 'h-bhakti-1', 'm-bhakti-1', 'h-bhakti-3'],
    createdDate: '2026-08-11',
    isDefault: true
  },
  {
    id: 'pl-evening-bhakti',
    name: '🕉️ Evening 7 PM Marathi Bhakti',
    description: 'Calming evening Vitthal Abhangs, Shiv Tandav, & Devi Stutis for peace.',
    coverArtUrl: 'https://images.unsplash.com/photo-1609102026400-3d026932e652?w=600&auto=format&fit=crop&q=80',
    trackIds: ['m-bhakti-2', 'm-bhakti-4', 'h-bhakti-2'],
    createdDate: '2026-08-11',
    isDefault: true
  },
  {
    id: 'pl-lavani-gold',
    name: '💃 Royal Lavani Special',
    description: 'Traditional and high-energy Maharashtrian Lavani hits curated by Vaibhav Jadhav.',
    coverArtUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    trackIds: ['lavani-1', 'lavani-2', 'lavani-3'],
    createdDate: '2026-08-11',
    isDefault: true
  },
  {
    id: 'pl-marathi-classics',
    name: '❤️ Marathi Legends & Classics',
    description: 'Timeless Marathi melodies, romantic tracks, and cinematic gold.',
    coverArtUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80',
    trackIds: ['m-romantic-1', 'm-classic-1', 'm-romantic-2'],
    createdDate: '2026-08-11',
    isDefault: true
  }
];

export const INITIAL_BHAKTI_SCHEDULE: BhaktiScheduleConfig = {
  enabled: true,
  morningTime: '09:00',
  eveningTime: '19:00',
  morningPlaylistId: 'pl-morning-bhakti',
  eveningPlaylistId: 'pl-evening-bhakti',
  autoPlayOnTime: true,
  notificationsEnabled: true,
  lastTriggeredSlot: null
};
