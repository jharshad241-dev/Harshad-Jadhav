import { HygieneReminder, HygieneQuizQuestion } from '../types';

export const DEFAULT_HYGIENE_REMINDERS: HygieneReminder[] = [
  {
    id: 'rem-water',
    title: 'Hydrate Skin & Body (1 Glass Water)',
    description: 'Drinking fresh water keeps skin supple, prevents scalp dryness, and flushes toxins.',
    icon: 'Droplets',
    category: 'hydration',
    recommendedInterval: 'Every 60 mins',
    points: 30,
  },
  {
    id: 'rem-hands',
    title: 'Hand Cleansing & Sanitization',
    description: 'Wash hands for 20 seconds with soap or apply 70% alcohol sanitizing gel.',
    icon: 'Sparkles',
    category: 'sanitization',
    recommendedInterval: 'Every 90 mins',
    points: 40,
  },
  {
    id: 'rem-spf',
    title: 'Sunscreen & UV Shield Check',
    description: 'Reapply broad-spectrum SPF 30+ to protect your skin barrier against premature aging & sun damage.',
    icon: 'Sun',
    category: 'skin',
    recommendedInterval: 'Every 3 hours',
    points: 50,
  },
  {
    id: 'rem-scalp',
    title: '2-Min Scalp Blood Flow Massage',
    description: 'Use fingertips in circular motion to boost nutrient delivery to hair roots and release tension.',
    icon: 'HeartPulse',
    category: 'scalp',
    recommendedInterval: 'Twice daily',
    points: 45,
  },
  {
    id: 'rem-facewash',
    title: 'Gentle Facial Wash & Mist',
    description: 'Cleanse away accumulated dirt, airborne pollutants, and excess sebum with lukewarm water.',
    icon: 'Smile',
    category: 'skin',
    recommendedInterval: 'Midday & Evening',
    points: 35,
  },
  {
    id: 'rem-posture',
    title: '20-20-20 Eye & Posture Reset',
    description: 'Look 20 feet away for 20 seconds, roll shoulders back, and breathe deeply.',
    icon: 'Eye',
    category: 'wellness',
    recommendedInterval: 'Every 45 mins',
    points: 25,
  },
  {
    id: 'rem-beard',
    title: 'Night Beard & Scalp Elixir Ritual',
    description: 'Apply 3 drops of nourishing oil before bed to lock in moisture overnight.',
    icon: 'Moon',
    category: 'scalp',
    recommendedInterval: 'Nightly',
    points: 50,
  },
];

export const HYGIENE_QUIZ_QUESTIONS: HygieneQuizQuestion[] = [
  {
    id: 1,
    question: 'What is the scientifically recommended minimum time for thorough hand washing with soap?',
    options: ['5 seconds', '10 seconds', '20 seconds', '60 seconds'],
    correctIndex: 2,
    explanation: 'Scrubbing hands with soap for at least 20 seconds breaks down lipid membranes of viruses and removes dirt effectively.',
    tip: 'Sing the Happy Birthday song twice to time 20 seconds perfectly!'
  },
  {
    id: 2,
    question: 'Why should you avoid washing your face and scalp with boiling hot water?',
    options: [
      'It freezes pores shut',
      'It strips natural protective sebum, triggering rebound oiliness & irritation',
      'It bleaches your hair pigments instantly',
      'It has no effect at all'
    ],
    correctIndex: 1,
    explanation: 'Hot water damages your skin barrier and causes excessive dryness, leading to flaky scalp or overproduction of compensatory oil.',
    tip: 'Always use lukewarm or cool water for facial and hair washing.'
  },
  {
    id: 3,
    question: 'How often should broad-spectrum SPF sunscreen be reapplied during daylight?',
    options: ['Once every morning is enough', 'Every 2 to 3 hours', 'Only when swimming', 'Once a week'],
    correctIndex: 1,
    explanation: 'Sunscreen filters break down upon exposure to UV rays and sweat, so dermatologists advise reapplication every 2–3 hours.',
    tip: 'Even on cloudy days or near windows, UVA rays penetrate and affect collagen.'
  },
  {
    id: 4,
    question: 'How does daily scalp massage support hair follicular health?',
    options: [
      'It mechanically pulls hairs out',
      'It stimulates dermal papilla microcirculation and relaxes tension',
      'It changes hair straightness permanently',
      'It eliminates the need for shampoo'
    ],
    correctIndex: 1,
    explanation: 'Gentle pressure and fingertip kneading enhances vascular blood flow, delivering vital oxygen and nutrients directly to hair roots.',
    tip: 'Dedicate 2 minutes before bed to massage your crown and temples.'
  },
  {
    id: 5,
    question: 'Why is washing your pillowcases and face towels weekly crucial for skin hygiene?',
    options: [
      'To prevent dust, bacteria, and residual hair products from clogging facial pores',
      'It makes them look brighter',
      'It stops your hair from turning grey',
      'It reduces room humidity'
    ],
    correctIndex: 0,
    explanation: 'Pillowcases accumulate dead skin cells, perspiration, and sebum, becoming a breeding ground for acne-causing Cutibacterium acnes.',
    tip: 'Switch to a silk or satin pillowcase to also minimize hair friction and frizz!'
  },
  {
    id: 6,
    question: 'What is the "20-20-20 rule" for digital eye hygiene and screen fatigue prevention?',
    options: [
      'Blink 20 times every 20 minutes with 20% brightness',
      'Every 20 minutes, gaze at an object 20 feet away for at least 20 seconds',
      'Drink 20ml water every 20 minutes for 20 hours',
      'Take 20 deep breaths every 20 hours'
    ],
    correctIndex: 1,
    explanation: 'Looking into the distance relaxes the ciliary muscles in your eyes, reducing digital strain and dry eye symptoms.',
    tip: 'Combine your 20-20-20 break with a sip of clean water.'
  }
];
