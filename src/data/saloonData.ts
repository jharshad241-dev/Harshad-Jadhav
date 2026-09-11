import {
  Hairstyle,
  BeardStyle,
  SalonService,
  BarberStylist,
  ReviewItem,
  ProductRecommendation,
  UserProfile,
  OwnerPaymentSettings,
} from '../types';

export const INITIAL_PAYMENT_SETTINGS: OwnerPaymentSettings = {
  ownerName: "Vaibhav Jadhav",
  upiId: "vaibhav.jadhav@okaxis",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=vaibhav.jadhav@okaxis&pn=Vaibhav%20Jadhav%20Salon&cu=INR",
  bankName: "HDFC Bank Ltd.",
  accountNumber: "50100234567890",
  ifscCode: "HDFC0001234",
  gstTaxRate: 5,
  serviceFee: 25,
  qrType: 'upi',
  customCharges: [
    { id: 'ch-1', name: 'VIP Luxury Hygiene & Sanitization', amount: 30, type: 'fixed', enabled: true },
  ]
};


export const HAIRSTYLES_DATA: Hairstyle[] = [
  {
    id: 'hs-1',
    name: 'Vaibhav Signature Volume Quiff & Mid Fade',
    category: 'Modern',
    description: 'The exact signature haircut worn by Founder Vaibhav Jadhav. Dense voluminous quiff styled upwards paired with a sharp mid taper fade.',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    matchScore: 99,
    difficulty: 'Medium',
    stylingTime: '5 mins',
    maintenanceLevel: 'Medium',
    suitableHairTypes: ['Straight', 'Wavy'],
    suitableFaceShapes: ['Oval', 'Round', 'Square'],
    recommendedProducts: ['Vaibhav Royal Matte Clay Wax', 'Volumizing Sea Salt Spray'],
    stylingInstructions: [
      'Blow-dry hair upwards using a round brush for crest volume.',
      'Scoop Vaibhav Matte Clay Wax and warm between palms.',
      'Work thoroughly from roots to top crest, defining the signature sweep.'
    ],
    pros: ['Founder Vaibhav Jadhav\'s iconic personal haircut', 'Maximizes height & stature', 'Sharp executive look'],
    cons: ['Needs daily styling with matte wax'],
    isTrending: true
  },
  {
    id: 'hs-2',
    name: 'Textured French Crop',
    category: 'Crop',
    description: 'Short textured top with blunt fringe cut and sharp low drop skin fade.',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    matchScore: 95,
    difficulty: 'Easy',
    stylingTime: '3 mins',
    maintenanceLevel: 'Low',
    suitableHairTypes: ['Straight', 'Wavy', 'Curly'],
    suitableFaceShapes: ['Oval', 'Rectangle', 'Heart', 'Oblong'],
    recommendedProducts: ['Matte Styling Powder', 'Texturizing Clay'],
    stylingInstructions: [
      'Towel dry hair until slightly damp.',
      'Dust a sprinkle of styling powder into roots.',
      'Rake fingers forward to define choppy texture and forward fringe.'
    ],
    pros: ['Ultra fast low-maintenance styling', 'Conceals high or receding hairlines', 'Modern athletic look'],
    cons: ['Frequent side fade touchups required'],
    isTrending: true
  },
  {
    id: 'hs-3',
    name: 'Slick Back Low Taper',
    category: 'Classic',
    description: 'Sophisticated slicked back style with clean low taper around ears and neckline.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    matchScore: 92,
    difficulty: 'Easy',
    stylingTime: '5 mins',
    maintenanceLevel: 'Medium',
    suitableHairTypes: ['Straight', 'Wavy'],
    suitableFaceShapes: ['Oval', 'Square', 'Diamond'],
    recommendedProducts: ['Natural Shine Pomade', 'Fine Tooth Styling Comb'],
    stylingInstructions: [
      'Apply pomade to damp hair evenly.',
      'Comb hair straight back starting from the hairline.',
      'Smooth down flyaways along temples.'
    ],
    pros: ['Chic Red-Carpet appearance', 'Works great with formal attire', 'Showcases strong jawlines'],
    cons: ['Shows full forehead and face symmetry'],
    isTrending: false
  },
  {
    id: 'hs-4',
    name: 'Messy Textured Quiff',
    category: 'Textured',
    description: 'Casual effortless quiff with natural movement and medium skin fade.',
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80',
    matchScore: 94,
    difficulty: 'Medium',
    stylingTime: '6 mins',
    maintenanceLevel: 'Medium',
    suitableHairTypes: ['Wavy', 'Straight'],
    suitableFaceShapes: ['Round', 'Square', 'Oval'],
    recommendedProducts: ['Matte Paste', 'Pre-styling Cream'],
    stylingInstructions: [
      'Blow dry upwards and backwards with fingers.',
      'Rub matte paste into hands and sweep front up and diagonally.',
      'Pinch hair ends for separated messy texture.'
    ],
    pros: ['Flattering for round face shapes', 'Youthful energetic style'],
    cons: ['Requires thick hair density'],
    isTrending: true
  },
  {
    id: 'hs-5',
    name: 'Buzz Cut with Line-Up',
    category: 'Fade',
    description: 'Precision ultra-short buzz cut with sharp razor edge line-up and skin fade.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    matchScore: 90,
    difficulty: 'Easy',
    stylingTime: '0 mins',
    maintenanceLevel: 'Low',
    suitableHairTypes: ['Straight', 'Wavy', 'Curly', 'Coily'],
    suitableFaceShapes: ['Oval', 'Square', 'Diamond'],
    recommendedProducts: ['Scalp Moisturizing Serum', 'Sunscreen Spray'],
    stylingInstructions: ['No daily styling required. Keep scalp hydrated and protected.'],
    pros: ['Zero morning styling hassle', 'Maximizes head structure and jawline'],
    cons: ['Requires skull symmetry', 'Bi-weekly trims required'],
    isTrending: false
  },
  {
    id: 'hs-6',
    name: 'Modern Wolf Cut & Curtains',
    category: 'Long',
    description: 'Layered shag wolf cut featuring curtain bangs that frame cheekbones perfectly.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    matchScore: 96,
    difficulty: 'Medium',
    stylingTime: '7 mins',
    maintenanceLevel: 'Medium',
    suitableHairTypes: ['Wavy', 'Straight'],
    suitableFaceShapes: ['Heart', 'Oval', 'Diamond', 'Triangle'],
    recommendedProducts: ['Nourishing Hair Serum', 'Lightweight Styling Cream'],
    stylingInstructions: [
      'Apply hair serum to damp hair.',
      'Part hair down middle and blow dry bangs outward.',
      'Scrunch ends for wavy volume.'
    ],
    pros: ['Softens prominent cheekbones', 'Trendy artistic aesthetic'],
    cons: ['Needs length to start'],
    isTrending: true
  }
];

export const BEARD_STYLES_DATA: BeardStyle[] = [
  {
    id: 'bs-1',
    name: 'Executive Full Beard',
    category: 'Full Beard',
    description: 'Neatly trimmed dense beard with crisp razor cheeks line and tapered neckline.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    suitabilityScore: 97,
    trimmingGuide: [
      'Define top cheek line using precision trimmer.',
      'Trim neckline 1 inch above Adam\'s apple in a curved U-shape.',
      'Maintain length at 15mm with beard guard #4.'
    ],
    maintenanceTips: ['Apply 4 drops of argan beard oil daily.', 'Brush down with boar bristle brush.'],
    growthAdvice: 'Let grow naturally for 4 weeks before first line sculpting.',
    suitableFaceShapes: ['Oval', 'Round', 'Rectangle', 'Triangle'],
    isTrending: true
  },
  {
    id: 'bs-2',
    name: 'Heavy Designer Stubble',
    category: 'Stubble',
    description: '3-day to 5-day rugged heavy stubble highlighting jawline contours.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    suitabilityScore: 95,
    trimmingGuide: [
      'Set beard trimmer to 3mm - 4mm length.',
      'Shave lower neck area clean.',
      'Keep mustache slightly shorter for balance.'
    ],
    maintenanceTips: ['Exfoliate skin underneath to prevent ingrown hairs.', 'Use hydrating beard balm.'],
    growthAdvice: 'Requires 4-5 days of consistent growth from clean shave.',
    suitableFaceShapes: ['Square', 'Oval', 'Round', 'Diamond'],
    isTrending: true
  },
  {
    id: 'bs-3',
    name: 'Royal Anchor & Balbo',
    category: 'Designed',
    description: 'Distinctive detached mustache paired with pointed chin beard following jawline.',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    suitabilityScore: 91,
    trimmingGuide: [
      'Shave sides of cheeks clean.',
      'Shape chin beard into sharp inverted anchor pyramid.',
      'Keep mustache trimmed and separated from chin beard.'
    ],
    maintenanceTips: ['Detail with wet razor every 2 days.'],
    growthAdvice: 'Focus on dense chin and mustache growth.',
    suitableFaceShapes: ['Round', 'Square', 'Oblong'],
    isTrending: false
  },
  {
    id: 'bs-4',
    name: 'Sculpted Boxed Beard',
    category: 'Corporate',
    description: 'Short square-cut boxed beard ideal for corporate executive presentation.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    suitabilityScore: 94,
    trimmingGuide: [
      'Square off bottom edges at jaw corner.',
      'Keep length around 8mm - 10mm.',
      'Maintain crisp straight cheek lines.'
    ],
    maintenanceTips: ['Wash with sulfate-free beard shampoo 3x a week.'],
    growthAdvice: '3 weeks growth needed for solid density.',
    suitableFaceShapes: ['Oval', 'Round', 'Heart'],
    isTrending: true
  }
];

export const SALON_SERVICES_DATA: SalonService[] = [
  {
    id: 'srv-1',
    title: 'Vaibhav Signature Royal Haircut',
    category: 'Haircut',
    price: 499,
    originalPrice: 699,
    durationMins: 45,
    description: 'AI face scan consultation, custom scissor & fade haircut, scalp massage, hot towel treatment, and styling with premium matte clay.',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    popularBadge: 'MOST POPULAR'
  },
  {
    id: 'srv-2',
    title: 'Executive Beard Sculpting & Razor Line-Up',
    category: 'Beard Styling',
    price: 349,
    originalPrice: 450,
    durationMins: 30,
    description: 'Precision beard trimming, straight-razor cheek line contouring, steam towel, and deep conditioning argan oil treatment.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    popularBadge: 'TRENDING'
  },
  {
    id: 'srv-3',
    title: 'Royal Gold Detox Facial & Skin Rejuvenation',
    category: 'Facial',
    price: 999,
    originalPrice: 1499,
    durationMins: 60,
    description: 'Deep pore cleansing, 24K gold foil scrub, ultrasonic blackhead extraction, cooling collagen mask & revitalizing face massage.',
    imageUrl: 'https://images.unsplash.com/photo-1512290900673-70024421193d?auto=format&fit=crop&w=600&q=80',
    popularBadge: 'LUXURY CARE'
  },
  {
    id: 'srv-4',
    title: 'Keratin Hair Spa & Scalp Therapy',
    category: 'Hair Spa',
    price: 899,
    originalPrice: 1200,
    durationMins: 50,
    description: 'Intense keratin nourish treatment, micro-steam hydration, high-frequency anti-dandruff scalp stimulation, and blowout styling.',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-5',
    title: 'Vaibhav Ultimate Groom Grooming Package',
    category: 'Groom Package',
    price: 2499,
    originalPrice: 3500,
    durationMins: 120,
    description: 'Complete royal transformation: Haircut + Beard Design + Gold Facial + Keratin Spa + Hand & Nail Grooming + Free Styling Product.',
    imageUrl: 'https://images.unsplash.com/photo-1517832606589-715069675377?auto=format&fit=crop&w=600&q=80',
    popularBadge: 'VIP PACKAGE'
  },
  {
    id: 'srv-6',
    title: 'Subtle Grey Coverage / Premium Hair Color',
    category: 'Hair Coloring',
    price: 799,
    originalPrice: 1100,
    durationMins: 45,
    description: 'Ammonia-free organic color blend providing natural youthful coverage and vibrant gloss finish.',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80'
  }
];

export const SALON_CONTACT_INFO = {
  salonName: 'VAIBHAV SALOON',
  subtitle: 'THE ART OF HAIRCUTS & GROOMING',
  tagline: 'Your style, Our passion',
  founderName: 'Vaibhav Jadhav',
  founderTitle: 'Founder & Professional Barber',
  phone: '9405339197',
  whatsapp: '9405339197',
  instagram: '@vaibhav_saloon',
  instagramUrl: 'https://instagram.com/vaibhav_saloon',
  facebook: 'Vaibhav Saloon',
  facebookUrl: 'https://facebook.com/vaibhavsaloon',
  location: 'Vaibhav Saloon, Main Market Road, City Center',
  firstEditionYear: '2026',
};

export const BARBERS_DATA: BarberStylist[] = [
  {
    id: 'barber-1',
    name: 'Vaibhav Jadhav',
    role: 'Founder & Professional Barber',
    experienceYears: 10,
    rating: 4.98,
    reviewsCount: 520,
    avatarUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    specialties: ['Signature Mid Fade Quiff', 'Razor Beard Sculpting', 'AI Face Styling'],
    bio: 'Founder & Professional Barber at Vaibhav Saloon. Passionate about precision haircuts, beard artistry, and empowering gentlemen with confidence.',
    available: true
  },
  {
    id: 'barber-2',
    name: 'Rahul Verma',
    role: 'Senior Fade & Texture Specialist',
    experienceYears: 8,
    rating: 4.85,
    reviewsCount: 240,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    specialties: ['Skin Fades', 'French Crops', 'Hairline Line-up'],
    bio: 'Expert in modern low, mid, and high fades, French crops, and precision lineup symmetry.',
    available: true
  },
  {
    id: 'barber-3',
    name: 'Alex D\'Souza',
    role: 'Beard Master & Straight Razor Artist',
    experienceYears: 9,
    rating: 4.9,
    reviewsCount: 195,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    specialties: ['Royal Beard Sculpting', 'Hot Towel Shaves', 'Beard Spa'],
    bio: 'Specialist in full beard sculpting, Balbo anchors, and traditional hot towel straight-razor pampering.',
    available: true
  }
];

export const PRODUCTS_DATA: ProductRecommendation[] = [
  {
    id: 'prod-1',
    name: 'Vaibhav Royal Matte Clay Wax',
    brand: 'Vaibhav Luxury Lab',
    category: 'Styling',
    price: 599,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    purpose: 'Provides strong pliable hold with a clean matte natural finish for quiffs and crops.',
    howToUse: 'Warm a dime-sized amount in palms and rake through dry or damp hair.'
  },
  {
    id: 'prod-2',
    name: 'Gold Infused Argan Beard Elixir',
    brand: 'Vaibhav Luxury Lab',
    category: 'Beard Oil',
    price: 499,
    rating: 4.88,
    imageUrl: 'https://images.unsplash.com/photo-1608248597261-833244709139?auto=format&fit=crop&w=400&q=80',
    purpose: 'Deeply softens wirey beard hair, prevents skin itchiness, and promotes healthy density.',
    howToUse: 'Massage 3-5 drops into beard roots and comb through gently.'
  },
  {
    id: 'prod-3',
    name: 'Anti-Hairfall Caffeine Serum',
    brand: 'Trichology Pro',
    category: 'Hair Care',
    price: 899,
    rating: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80',
    purpose: 'Stimulates hair follicle roots, reduces hair shedding, and boosts scalp circulation.',
    howToUse: 'Apply 1ml directly onto scalp before bedtime and massage for 2 mins.'
  }
];

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    customerName: 'Vikramaditya Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'Yesterday',
    comment: 'The AI face scan suggested a Mid Fade Pompadour and it turned out PERFECT! Vaibhav Sharma is a master at his craft. Royal vibes all around.',
    serviceName: 'Vaibhav Signature Royal Haircut',
    verified: true
  },
  {
    id: 'rev-2',
    customerName: 'Anand Kulkarni',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 days ago',
    comment: 'Loved the virtual try-on feature in the app. Showed Alex exactly what I wanted for my beard sculpting. Unmatched luxury experience!',
    serviceName: 'Executive Beard Sculpting',
    verified: true
  },
  {
    id: 'rev-3',
    customerName: 'Karan Johar S.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 week ago',
    comment: 'The Gold Detox Facial gave my skin an unbelievable glow. 10/10 recommend Vaibhav AI Saloon to anyone who appreciates luxury grooming.',
    serviceName: 'Royal Gold Detox Facial',
    verified: true
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-8821',
  name: 'Harshad Jadhav',
  email: 'harshadjadhav1211@gmail.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  membershipTier: 'Black Elite',
  rewardPoints: 1250,
  referralCode: 'VAIBHAV99',
  savedScansCount: 4
};
