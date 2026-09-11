export type MusicLanguage = 'Marathi' | 'Hindi';

export type MusicCategory = 
  | 'Marathi Classics'
  | 'Latest Marathi'
  | 'Marathi Romantic'
  | 'Marathi Devotional'
  | 'Lavani Special'
  | 'Folk & Traditional'
  | 'Old Hindi Classics'
  | 'Latest Hindi'
  | 'Hindi Romantic'
  | 'Bollywood'
  | 'Hindi Devotional'
  | 'Evergreen';

export type BhaktiCategory =
  | 'Vitthal Songs'
  | 'Ganpati Bappa'
  | 'Devi Stuti & Aarti'
  | 'Shiv Bhajan'
  | 'Hanuman Chalisa & Bhajan'
  | 'Krishna & Balaji'
  | 'Abhang & Traditional Geet';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  language: MusicLanguage;
  category: MusicCategory;
  bhaktiCategory?: BhaktiCategory;
  durationSeconds: number;
  coverArtUrl: string;
  audioUrl: string;
  spotifyId?: string;
  spotifyUrl?: string;
  spotifyEmbedUrl?: string;
  lyrics?: string;
  spiritualMeaning?: string;
  releaseYear?: number;
  isPopular?: boolean;
  isTrending?: boolean;
  isLavaniSpecial?: boolean;
  isBhaktiGeet?: boolean;
  scheduledTime?: 'Morning 9 AM' | 'Evening 7 PM' | 'All Day';
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverArtUrl: string;
  trackIds: string[];
  createdDate: string;
  isDefault?: boolean;
}

export interface BhaktiScheduleConfig {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  morningPlaylistId: string;
  eveningPlaylistId: string;
  autoPlayOnTime: boolean;
  notificationsEnabled: boolean;
  lastTriggeredSlot?: 'morning' | 'evening' | null;
}

export type EqualizerPreset = 'Normal' | 'Bass Boost' | 'Devotional Pure' | 'Vocal Boost' | 'Gold Acoustic' | 'Treble Boost';

export interface UserMusicSettings {
  bhaktiSchedule: BhaktiScheduleConfig;
  audioQuality: 'Normal (128kbps)' | 'HD Studio (320kbps)' | 'Lossless Pure';
  equalizerPreset: EqualizerPreset;
  darkGoldTheme: boolean;
  backgroundPlaybackNoticeDismissed: boolean;
  autoPlayNext: boolean;
}

export interface AiLyricsResponse {
  lyrics: string;
  meaningSummary: string;
  culturalContext: string;
  language: string;
}

// Salon Types for Compatibility
export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Rectangle' | 'Diamond' | 'Heart' | 'Triangle' | 'Oblong';
export type HairTexture = 'Straight' | 'Wavy' | 'Curly' | 'Coily';
export type HairDensity = 'Thick' | 'Medium' | 'Fine' | 'Thinning';
export type HairlineType = 'Normal' | 'Widow\'s Peak' | 'Receding' | 'High';
export type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Sensitive';

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  jawline: string;
  chinShape: string;
  foreheadWidth: string;
  cheekboneWidth: string;
  hairline: HairlineType;
  hairDensity: HairDensity;
  hairTexture: HairTexture;
  beardDensity: string;
  beardGrowthPattern: string;
  skinTone: string;
  symmetry: number;
  ageGroup: string;
  groomingScore: number;
  aiInsights: string[];
  keyStrengths: string[];
  recommendedHairStyleIds: string[];
  recommendedBeardStyleIds: string[];
  scannedImageUrl?: string;
  timestamp: string;
}

export interface Hairstyle {
  id: string;
  name: string;
  category: 'Fade' | 'Crop' | 'Classic' | 'Long' | 'Textured' | 'Modern';
  description: string;
  imageUrl: string;
  matchScore: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  stylingTime: string;
  maintenanceLevel: 'Low' | 'Medium' | 'High';
  suitableHairTypes: HairTexture[];
  suitableFaceShapes: FaceShape[];
  recommendedProducts: string[];
  stylingInstructions: string[];
  pros: string[];
  cons: string[];
  isTrending?: boolean;
}

export interface BeardStyle {
  id: string;
  name: string;
  category: 'Stubble' | 'Full Beard' | 'Goatee' | 'Designed' | 'Corporate';
  description: string;
  imageUrl: string;
  suitabilityScore: number;
  trimmingGuide: string[];
  maintenanceTips: string[];
  growthAdvice: string;
  suitableFaceShapes: FaceShape[];
  isTrending?: boolean;
}

export interface SalonService {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  durationMins: number;
  description: string;
  imageUrl: string;
  popularBadge?: string;
}

export interface BarberStylist {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  specialties: string[];
  bio: string;
  available: boolean;
}

export interface BookingAppointment {
  id: string;
  serviceIds: string[];
  serviceNames: string[];
  hairstyleName?: string;
  beardStyleName?: string;
  barberId: string;
  barberName: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  paymentMethod: string;
  bookingQr: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  avatarUrl: string;
  rating: number;
  date: string;
  comment: string;
  serviceName: string;
  photos?: string[];
  verified: boolean;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  purpose: string;
  howToUse: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  membershipTier: 'Gold VIP' | 'Black Elite' | 'Platinum';
  rewardPoints: number;
  referralCode: string;
  savedScansCount: number;
}

export interface CustomCharge {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  enabled: boolean;
}

export interface OwnerPaymentSettings {
  ownerName: string;
  upiId: string;
  qrCodeUrl: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  gstTaxRate: number;
  serviceFee: number;
  qrType: 'upi' | 'custom_image';
  customCharges: CustomCharge[];
}

// Health & Hygiene Types
export interface HygieneReminder {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'hydration' | 'skin' | 'scalp' | 'sanitization' | 'wellness';
  recommendedInterval: string;
  points: number;
}

export interface HygieneNotificationConfig {
  enabled: boolean;
  intervalMinutes: number;
  soundEnabled: boolean;
  browserPushEnabled: boolean;
  selectedReminders: string[];
}

export interface HygieneNotificationLog {
  id: string;
  reminderId: string;
  title: string;
  description: string;
  icon: string;
  timestamp: string;
  completed: boolean;
}

export interface HygieneQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip: string;
}

