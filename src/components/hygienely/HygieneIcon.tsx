import React from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  ShowerHead,
  Droplets,
  Scissors,
  CheckSquare,
  Shirt,
  CupSoda,
  Apple,
  Smile,
  HeartPulse,
  BedDouble,
  Home,
  GraduationCap,
  Footprints,
  ShieldCheck,
  Flame,
  Pill,
  Award,
  Trophy,
  BrainCircuit,
  Heart,
  Calendar,
  CheckCircle2,
  Circle,
  Bell,
  Clock,
  Settings,
  User,
  BookOpen,
  Gamepad2,
  Flame as FireIcon,
  ChevronRight,
  TrendingUp,
  Info,
  Plus,
  Trash2,
  Edit2,
  Volume2,
  VolumeX,
  RefreshCw,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface HygieneIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const HygieneIcon: React.FC<HygieneIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Sparkles':
      return <Sparkles {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'ShowerHead':
      return <ShowerHead {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Scissors':
      return <Scissors {...iconProps} />;
    case 'CheckSquare':
      return <CheckSquare {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    case 'CupSoda':
      return <CupSoda {...iconProps} />;
    case 'Apple':
      return <Apple {...iconProps} />;
    case 'Smile':
      return <Smile {...iconProps} />;
    case 'HeartPulse':
      return <HeartPulse {...iconProps} />;
    case 'BedDouble':
      return <BedDouble {...iconProps} />;
    case 'Home':
      return <Home {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'Footprints':
      return <Footprints {...iconProps} />;
    case 'ShieldCheck':
      return <ShieldCheck {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'Pill':
      return <Pill {...iconProps} />;
    case 'Award':
      return <Award {...iconProps} />;
    case 'Trophy':
      return <Trophy {...iconProps} />;
    case 'BrainCircuit':
      return <BrainCircuit {...iconProps} />;
    case 'Heart':
      return <Heart {...iconProps} />;
    case 'Calendar':
      return <Calendar {...iconProps} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...iconProps} />;
    case 'Circle':
      return <Circle {...iconProps} />;
    case 'Bell':
      return <Bell {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'Settings':
      return <Settings {...iconProps} />;
    case 'User':
      return <User {...iconProps} />;
    case 'BookOpen':
      return <BookOpen {...iconProps} />;
    case 'Gamepad2':
      return <Gamepad2 {...iconProps} />;
    case 'TrendingUp':
      return <TrendingUp {...iconProps} />;
    case 'Info':
      return <Info {...iconProps} />;
    case 'Plus':
      return <Plus {...iconProps} />;
    case 'Trash2':
      return <Trash2 {...iconProps} />;
    case 'Edit2':
      return <Edit2 {...iconProps} />;
    case 'Volume2':
      return <Volume2 {...iconProps} />;
    case 'VolumeX':
      return <VolumeX {...iconProps} />;
    case 'RefreshCw':
      return <RefreshCw {...iconProps} />;
    case 'HelpCircle':
      return <HelpCircle {...iconProps} />;
    case 'Play':
      return <Play {...iconProps} />;
    case 'RotateCcw':
      return <RotateCcw {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};
