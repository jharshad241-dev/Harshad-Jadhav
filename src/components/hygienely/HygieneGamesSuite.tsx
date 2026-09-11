import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { triggerCelebration } from '../../utils/confetti';
import { UserGroup } from '../../types/hygienely';

interface HygieneGamesSuiteProps {
  userGroup: UserGroup;
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

type ActiveGame =
  | 'menu'
  | 'quiz'
  | 'handwash'
  | 'food_puzzle'
  | 'memory'
  | 'clean_room'
  | 'good_bad';

// QUIZ DATA
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Beginner
  {
    id: 1,
    question: 'How long should you scrub your hands with soap to remove germs?',
    options: ['5 seconds', '10 seconds', 'At least 20 seconds', '1 minute'],
    correctIndex: 2,
    explanation: 'Scrubbing for at least 20 seconds allows soap surfactants to break down viral lipids and lift dirt.',
    level: 'Beginner',
  },
  {
    id: 2,
    question: 'How many times a day should you brush your teeth?',
    options: ['Once a week', 'Once in the morning only', 'At least twice a day', 'Only after candy'],
    correctIndex: 2,
    explanation: 'Brushing morning and before bed protects enamel against acid produced by bacteria overnight.',
    level: 'Beginner',
  },
  {
    id: 3,
    question: 'What is the cleanest way to cough or sneeze when you don’t have a tissue?',
    options: ['Into your bare hands', 'Into your elbow sleeve', 'Into the air', 'Into a friend’s backpack'],
    correctIndex: 1,
    explanation: 'Coughing into your inner elbow prevents droplets from covering your hands and spreading to objects.',
    level: 'Beginner',
  },
  // Intermediate
  {
    id: 4,
    question: 'Why should you never share your personal bath towel or nail clipper?',
    options: ['Towels shrink easily', 'It spreads fungal spores and bacterial skin infections', 'It changes the towel color', 'It blunts the clipper'],
    correctIndex: 1,
    explanation: 'Damp towels and nail clippers easily transfer dermatophyte fungi, warts, and staph bacteria.',
    level: 'Intermediate',
  },
  {
    id: 5,
    question: 'What is the "danger zone" temperature range where food bacteria multiply fastest?',
    options: ['Below 0°C', 'Between 5°C and 60°C', 'Above 100°C', 'Only at 37°C'],
    correctIndex: 1,
    explanation: 'Foodborne pathogens multiply rapidly between 5°C and 60°C. Keep cold food below 5°C and hot food above 60°C.',
    level: 'Intermediate',
  },
  {
    id: 6,
    question: 'How often should you replace your everyday toothbrush?',
    options: ['Once every 5 years', 'Every 3 to 4 months or after illness', 'Only when bristles fall out', 'Every week'],
    correctIndex: 1,
    explanation: 'Bristles fray and accumulate bacterial biofilms after 3-4 months, reducing plaque removal efficiency.',
    level: 'Intermediate',
  },
  // Advanced
  {
    id: 7,
    question: 'Why is lukewarm water preferable over scalding hot water for bathing?',
    options: ['Hot water freezes faster', 'Hot water strips essential ceramides & compromises the skin barrier', 'Cold water makes hair curl', 'Lukewarm water has fewer minerals'],
    correctIndex: 1,
    explanation: 'Scalding water removes intercellular skin lipids, causing dehydration, micro-cracks, and eczema flare-ups.',
    level: 'Advanced',
  },
  {
    id: 8,
    question: 'What is the primary function of soap molecules against lipid-enveloped viruses?',
    options: ['They freeze the virus', 'Their hydrophobic tails insert into the viral membrane and rupture it', 'They acidify the water', 'They produce bleach'],
    correctIndex: 1,
    explanation: 'Soap molecules are amphiphilic; their hydrophobic tails dissolve viral lipid bilayers, disintegrating the pathogen.',
    level: 'Advanced',
  },
];

// MEMORY MATCH DATA
interface MemoryCard {
  id: number;
  pairId: number;
  name: string;
  icon: string;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

const MEMORY_PAIRS = [
  { pairId: 1, name: 'Toothbrush', icon: 'Sparkles', emoji: '🪥' },
  { pairId: 2, name: 'Soap Bar', icon: 'Droplets', emoji: '🧼' },
  { pairId: 3, name: 'Safe Water', icon: 'CupSoda', emoji: '💧' },
  { pairId: 4, name: 'Fresh Apple', icon: 'Apple', emoji: '🍎' },
  { pairId: 5, name: 'Clean Towel', icon: 'Shirt', emoji: '🧖' },
  { pairId: 6, name: 'Nail Clipper', icon: 'Scissors', emoji: '✂️' },
];

export const HygieneGamesSuite: React.FC<HygieneGamesSuiteProps> = ({
  userGroup,
  onAwardPoints,
  onUnlockBadge,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [soundOn, setSoundOn] = useState(true);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEffects.setMuted(!next);
  };

  return (
    <div id="hygiene-games-suite" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 dark:from-teal-950/40 dark:to-emerald-950/40 p-5 rounded-3xl border border-teal-200/50 dark:border-teal-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Hygiene Arcade & Learning Arena
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Play educational games, master healthy habits, and earn bonus hygiene stars & badges!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-game-sound-btn"
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:bg-slate-50 transition"
            title={soundOn ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundOn ? 'Sound On' : 'Muted'}</span>
          </button>

          {activeGame !== 'menu' && (
            <button
              id="back-to-games-menu-btn"
              onClick={() => {
                soundEffects.playClick();
                setActiveGame('menu');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>All Games</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Game Selector Menu */}
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Game 1: Quiz */}
          <div
            id="card-game-quiz"
            onClick={() => {
              soundEffects.playClick();
              setActiveGame('quiz');
            }}
            className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  Trivia & Science
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ +50 pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Hygiene Quiz Master
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Test your health science knowledge across Beginner, Intermediate, and Advanced levels.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Play Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 2: Handwashing Simulator */}
          <div
            id="card-game-handwash"
            onClick={() => {
              soundEffects.playClick();
              setActiveGame('handwash');
            }}
            className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border-2 border-cyan-100 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🧼
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300">
                  Interactive 20s Scrub
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ +40 pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Handwashing Germ Buster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Rub soap, target finger webs and thumbs, and blast germs away in 6 WHO-guided steps!
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <span>Start Scrubbing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 3: Healthy Food Puzzle */}
          <div
            id="card-game-food"
            onClick={() => {
              soundEffects.playClick();
              setActiveGame('food_puzzle');
            }}
            className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border-2 border-green-100 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🥗
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300">
                  Nutrition Sorter
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ +35 pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Healthy Food & Safety Puzzle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Sort washed fruits, boiled water, and fresh veggies away from contaminated junk food!
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
              <span>Sort Foods</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 4: Hygiene Memory Match */}
          <div
            id="card-game-memory"
            onClick={() => {
              soundEffects.playClick();
              setActiveGame('memory');
            }}
            className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🃏
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  Brain Memory
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ +40 pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Hygiene Memory Match
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Match pairs of essential hygiene tools (toothbrush, soap, water, towel, nail clipper).
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Flip Cards</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 5: Clean-the-Room Game */}
          <div
            id="card-game-room"
            onClick={() => {
              soundEffects.playClick();
              setActiveGame('clean_room');
            }}
            className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border-2 border-amber-100 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🧹
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                  Tidy Up Action
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ +45 pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Clean-the-Room Challenge
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Spot mess and germs! Bin garbage, fold clothes, open windows, and make the room sparkle!
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Tidy Room</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Game 6: Good Habit / Bad Habit */}
          <div
            id="card-game-goodbad"
            onClick={() => {
              soundEffects.playClick();
              setActiveGame('good_bad');
            }}
            className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                  Reflex Challenge
                </span>
                <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                  ⭐ +50 pts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Good Habit or Bad Habit?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Rapid-fire reflex test! Identify hygienic practices and bust unhealthy myths on the spot.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Take Challenge</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* GAME 1: QUIZ */}
      {activeGame === 'quiz' && (
        <QuizGame
          onAwardPoints={onAwardPoints}
          onUnlockBadge={onUnlockBadge}
          onBack={() => setActiveGame('menu')}
        />
      )}

      {/* GAME 2: HANDWASHING */}
      {activeGame === 'handwash' && (
        <HandwashingGame
          onAwardPoints={onAwardPoints}
          onUnlockBadge={onUnlockBadge}
          onBack={() => setActiveGame('menu')}
        />
      )}

      {/* GAME 3: FOOD PUZZLE */}
      {activeGame === 'food_puzzle' && (
        <HealthyFoodPuzzleGame
          onAwardPoints={onAwardPoints}
          onUnlockBadge={onUnlockBadge}
          onBack={() => setActiveGame('menu')}
        />
      )}

      {/* GAME 4: MEMORY MATCH */}
      {activeGame === 'memory' && (
        <MemoryMatchGame
          onAwardPoints={onAwardPoints}
          onUnlockBadge={onUnlockBadge}
          onBack={() => setActiveGame('menu')}
        />
      )}

      {/* GAME 5: CLEAN THE ROOM */}
      {activeGame === 'clean_room' && (
        <CleanRoomGame
          userGroup={userGroup}
          onAwardPoints={onAwardPoints}
          onUnlockBadge={onUnlockBadge}
          onBack={() => setActiveGame('menu')}
        />
      )}

      {/* GAME 6: GOOD HABIT / BAD HABIT */}
      {activeGame === 'good_bad' && (
        <GoodBadHabitGame
          onAwardPoints={onAwardPoints}
          onUnlockBadge={onUnlockBadge}
          onBack={() => setActiveGame('menu')}
        />
      )}
    </div>
  );
};

// ==========================================
// SUB-GAME 1: QUIZ GAME COMPONENT
// ==========================================
const QuizGame: React.FC<{
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onBack: () => void;
}> = ({ onAwardPoints, onUnlockBadge, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const filteredQuestions =
    selectedLevel === 'All'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.level === selectedLevel);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      soundEffects.playTaskComplete();
      setScore((prev) => prev + 15);
    } else {
      soundEffects.playBuzz();
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundEffects.playSuccessFanfare();
      triggerCelebration();
      const earned = Math.max(score, 30);
      onAwardPoints(earned, 'Hygiene Quiz Mastery');
      if (onUnlockBadge && score >= 45) {
        onUnlockBadge('badge-game-champion');
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div id="quiz-game-container" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
      {/* Level Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            Hygiene Science Quiz
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setScore(0);
                setIsFinished(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                selectedLevel === lvl
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Score: {score} pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold mb-2">
              Level: {currentQ.level}
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              const isCorrect = i === currentQ.correctIndex;
              const isChosen = i === selectedOption;

              let btnStyle =
                'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 border-emerald-500 text-white font-bold';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-500 border-rose-500 text-white font-bold';
                } else {
                  btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-700/30 border-transparent';
                }
              }

              return (
                <button
                  key={i}
                  id={`quiz-option-${i}`}
                  onClick={() => handleSelectOption(i)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />}
                  {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {selectedOption === currentQ.correctIndex ? '🎉 Excellent! That is correct:' : '💡 Learning Insight:'}
              </div>
              <p>{currentQ.explanation}</p>
            </motion.div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                id="quiz-next-question-btn"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/30 flex items-center gap-2 transition"
              >
                <span>{currentIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="text-center py-8 space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-900/50 text-amber-500 mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
            🏆
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              Quiz Completed!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              You scored <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{score} points</span> in the hygiene challenge!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-sm font-bold transition"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-500/25 transition"
            >
              Return to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-GAME 2: 20-SECOND HANDWASHING SIMULATOR
// ==========================================
const HandwashingGame: React.FC<{
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onBack: () => void;
}> = ({ onAwardPoints, onUnlockBadge, onBack }) => {
  const steps = [
    { title: 'Step 1: Wet Hands & Pump Soap', desc: 'Cover both hands completely with rich soapy lather.', icon: '🧴', goalScrubs: 5 },
    { title: 'Step 2: Palm to Palm Rubbing', desc: 'Rub palms firmly together in circular motions.', icon: '🤲', goalScrubs: 6 },
    { title: 'Step 3: Back of Hands & Webbing', desc: 'Lace fingers together and scrub over the backs of each hand.', icon: '🖐️', goalScrubs: 6 },
    { title: 'Step 4: Thumbs & Knuckles', desc: 'Clasp and twist thumbs inside opposite palms.', icon: '👍', goalScrubs: 6 },
    { title: 'Step 5: Fingertip & Nail Bed Scrub', desc: 'Rotate fingertips against opposite palms to clean under nails.', icon: '💅', goalScrubs: 6 },
    { title: 'Step 6: Rinse with Clean Water & Dry', desc: 'Wash all suds away completely and pat dry with personal towel.', icon: '💧', goalScrubs: 5 },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [scrubCount, setScrubCount] = useState(0);
  const [timer, setTimer] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => Math.max(0, t - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const handleStart = () => {
    setIsPlaying(true);
    setTimer(20);
    setCurrentStep(0);
    setScrubCount(0);
    setIsCompleted(false);
    soundEffects.playTaskComplete();
  };

  const handleScrubAction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying || isCompleted) return;

    soundEffects.playBubble();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setBubbles((prev) => [...prev.slice(-12), { id: Date.now() + Math.random(), x, y }]);
    const newCount = scrubCount + 1;
    setScrubCount(newCount);

    const stepObj = steps[currentStep];
    if (newCount >= stepObj.goalScrubs) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((s) => s + 1);
        setScrubCount(0);
        soundEffects.playTaskComplete();
      } else {
        // Finished all steps
        setIsPlaying(false);
        setIsCompleted(true);
        soundEffects.playSuccessFanfare();
        triggerCelebration();
        onAwardPoints(40, '20-Second Handwashing Master');
        if (onUnlockBadge) {
          onUnlockBadge('badge-clean-hands');
        }
      }
    }
  };

  const activeStepData = steps[currentStep];

  return (
    <div id="handwashing-game-container" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧼</span>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              20-Second WHO Handwashing Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scrub, lather, and banish 99.9% of harmful bacteria across 6 medical steps!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-sm font-black border border-cyan-200 dark:border-cyan-800">
            <Clock className="w-4 h-4" />
            <span>{timer}s</span>
          </div>
        </div>
      </div>

      {!isPlaying && !isCompleted ? (
        <div className="text-center py-10 space-y-5">
          <div className="w-24 h-24 rounded-3xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 flex items-center justify-center text-5xl mx-auto shadow-inner">
            🤲
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-xl font-black text-slate-800 dark:text-white">
              Ready to Wash Away Germs?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-2">
              Click or tap rapidly inside the handwashing basin to scrub and generate protective soap foam through all 6 WHO steps before the 20s timer ends!
            </p>
          </div>
          <button
            id="start-handwash-game-btn"
            onClick={handleStart}
            className="px-8 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm shadow-lg shadow-cyan-500/25 transition transform hover:scale-105"
          >
            Start 20s Clean Challenge
          </button>
        </div>
      ) : isCompleted ? (
        <div className="text-center py-10 space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-inner animate-bounce">
            ✨
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              Hands Squeaky Clean!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              You completed all 6 clinical handwashing steps and earned <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+40 points</span>!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-sm font-bold transition"
            >
              Scrub Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-500/25 transition"
            >
              Return to Arcade
            </button>
          </div>
        </div>
      ) : (
        /* Active Scrubbing Arena */
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Step {currentStep + 1} of {steps.length}: {activeStepData.title}</span>
            <span className="text-cyan-600 dark:text-cyan-400">
              Scrub Progress: {scrubCount}/{activeStepData.goalScrubs}
            </span>
          </div>

          {/* Interactive Basin */}
          <div
            id="handwash-scrub-basin"
            onClick={handleScrubAction}
            className="relative h-64 rounded-3xl bg-gradient-to-b from-cyan-100/70 via-sky-50/60 to-teal-100/80 dark:from-cyan-950/40 dark:via-slate-800 dark:to-teal-950/40 border-4 border-cyan-300 dark:border-cyan-800 overflow-hidden cursor-pointer flex flex-col items-center justify-center select-none shadow-inner group"
          >
            {/* Animated Soap Foam Bubbles */}
            {bubbles.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                style={{ left: b.x, top: b.y }}
                className="absolute pointer-events-none w-8 h-8 rounded-full bg-white/80 border border-cyan-200 shadow-sm flex items-center justify-center text-xs"
              >
                🫧
              </motion.div>
            ))}

            {/* Step Avatar Graphic */}
            <div className="text-6xl animate-pulse transform group-hover:scale-110 transition-transform">
              {activeStepData.icon}
            </div>

            <div className="mt-3 text-center px-4">
              <h5 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">
                {activeStepData.title}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-300 max-w-sm mt-0.5">
                {activeStepData.desc}
              </p>
            </div>

            <div className="absolute bottom-4 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-bold shadow-md animate-bounce">
              👆 Tap or Click Rapidly to Scrub!
            </div>
          </div>

          {/* Step Progress Pills */}
          <div className="grid grid-cols-6 gap-2">
            {steps.map((st, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-emerald-500'
                    : i === currentStep
                    ? 'bg-cyan-500 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-GAME 3: HEALTHY FOOD PUZZLE GAME
// ==========================================
interface FoodItem {
  id: number;
  name: string;
  emoji: string;
  isHealthy: boolean;
  reason: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { id: 1, name: 'Fresh Washed Apple', emoji: '🍎', isHealthy: true, reason: 'Rich in fiber and vitamins; washed skin removes pesticide residue.' },
  { id: 2, name: 'Sugary Fizzy Soda', emoji: '🥤', isHealthy: false, reason: 'Acidic sugar weakens tooth enamel and spikes blood glucose.' },
  { id: 3, name: 'Steamed Broccoli', emoji: '🥦', isHealthy: true, reason: 'Packed with vitamin C and calcium to strengthen bones.' },
  { id: 4, name: 'Greasy Street Samosa in Open Air', emoji: '🥟', isHealthy: false, reason: 'Uncovered street food attracts airborne dust and flies transmitting bacteria.' },
  { id: 5, name: 'Boiled Safe Water', emoji: '💧', isHealthy: true, reason: 'Boiling destroys waterborne amoebae, bacteria, and virus cysts.' },
  { id: 6, name: 'Moldy Bread Slice', emoji: '🍞', isHealthy: false, reason: 'Mold spores produce harmful mycotoxins that cause tummy upset.' },
  { id: 7, name: 'Crisp Carrot Sticks', emoji: '🥕', isHealthy: true, reason: 'Natural crunch cleanses teeth surfaces and provides beta-carotene.' },
  { id: 8, name: 'Day-Old Unrefrigerated Rice', emoji: '🍚', isHealthy: false, reason: 'Room temp rice can breed Bacillus cereus spores causing severe food poisoning.' },
];

const HealthyFoodPuzzleGame: React.FC<{
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onBack: () => void;
}> = ({ onAwardPoints, onUnlockBadge, onBack }) => {
  const [items, setItems] = useState<FoodItem[]>(FOOD_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = items[currentIndex];

  const handleClassify = (choice: boolean) => {
    if (!currentItem) return;
    const isCorrect = choice === currentItem.isHealthy;

    if (isCorrect) {
      soundEffects.playTaskComplete();
      setScore((s) => s + 10);
      setFeedback(`✅ Correct! ${currentItem.reason}`);
    } else {
      soundEffects.playBuzz();
      setFeedback(`❌ Oops! ${currentItem.reason}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < items.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsFinished(true);
        soundEffects.playSuccessFanfare();
        triggerCelebration();
        onAwardPoints(35, 'Healthy Nutrition Puzzle');
        if (onUnlockBadge) {
          onUnlockBadge('badge-healthy-food');
        }
      }
    }, 1800);
  };

  return (
    <div id="food-puzzle-game-container" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥗</span>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              Healthy Food & Safety Sorter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identify fresh, hygienic nutrients vs contaminated and harmful junk items!
            </p>
          </div>
        </div>
        <div className="text-xs font-black px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
          Score: {score} pts
        </div>
      </div>

      {!isFinished && currentItem ? (
        <div className="space-y-6 max-w-md mx-auto text-center">
          <div className="text-xs font-bold text-slate-400">
            Item {currentIndex + 1} of {items.length}
          </div>

          {/* Current Food Card */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 shadow-md">
            <div className="text-6xl mb-3 animate-pulse">{currentItem.emoji}</div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white">
              {currentItem.name}
            </h4>
          </div>

          {/* Feedback banner */}
          <div className="h-14 flex items-center justify-center">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
              >
                {feedback}
              </motion.div>
            )}
          </div>

          {/* Decision Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              id="food-choice-healthy-btn"
              onClick={() => handleClassify(true)}
              disabled={!!feedback}
              className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Healthy & Safe 👍</span>
            </button>
            <button
              id="food-choice-unhealthy-btn"
              onClick={() => handleClassify(false)}
              disabled={!!feedback}
              className="py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md shadow-rose-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Harmful / Risky 🚫</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 space-y-4">
          <div className="text-5xl animate-bounce">🍎</div>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white">
            Food Safety Master!
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You achieved <span className="font-extrabold text-emerald-600">{score} points</span> in food classification!
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setIsFinished(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md"
            >
              Back to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-GAME 4: HYGIENE MEMORY MATCH
// ==========================================
const MemoryMatchGame: React.FC<{
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onBack: () => void;
}> = ({ onAwardPoints, onBack }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const deck: MemoryCard[] = [];
    let idCounter = 1;
    [...MEMORY_PAIRS, ...MEMORY_PAIRS].forEach((p) => {
      deck.push({
        id: idCounter++,
        pairId: p.pairId,
        name: p.name,
        icon: p.icon,
        emoji: p.emoji,
        matched: false,
        flipped: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.flipped || card.matched || flippedCards.length === 2) return;

    soundEffects.playClick();

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.pairId === second.pairId) {
        // Matched!
        setTimeout(() => {
          soundEffects.playTaskComplete();
          const updated = [...newCards];
          updated[newFlipped[0]].matched = true;
          updated[newFlipped[1]].matched = true;
          setCards(updated);
          setFlippedCards([]);
          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);

          if (newMatched === MEMORY_PAIRS.length) {
            setIsWon(true);
            soundEffects.playSuccessFanfare();
            triggerCelebration();
            onAwardPoints(40, 'Hygiene Memory Match');
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          const reverted = [...newCards];
          reverted[newFlipped[0]].flipped = false;
          reverted[newFlipped[1]].flipped = false;
          setCards(reverted);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div id="memory-game-container" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🃏</span>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              Hygiene Memory Match
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Flip and pair up essential cleanliness tools!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="text-slate-500">Moves: {moves}</span>
          <span className="text-emerald-600">Matched: {matchedPairs}/{MEMORY_PAIRS.length}</span>
        </div>
      </div>

      {!isWon ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {cards.map((c, i) => (
            <div
              key={c.id}
              onClick={() => handleCardClick(i)}
              className={`h-24 sm:h-28 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-2 text-center transition-all duration-300 border-2 select-none ${
                c.flipped || c.matched
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700 shadow-md scale-100'
                  : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {c.flipped || c.matched ? (
                <>
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-1 line-clamp-1">
                    {c.name}
                  </span>
                </>
              ) : (
                <div className="text-slate-400 dark:text-slate-500 font-black text-xl">
                  ❓
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 space-y-4">
          <div className="text-5xl animate-bounce">🎉</div>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white">
            Brilliant Memory!
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You matched all cards in only {moves} moves and won <span className="font-extrabold text-emerald-600">+40 points</span>!
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={initGame}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md"
            >
              Back to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-GAME 5: CLEAN-THE-ROOM GAME
// ==========================================
interface ClutterItem {
  id: string;
  name: string;
  emoji: string;
  actionText: string;
  cleaned: boolean;
}

const CleanRoomGame: React.FC<{
  userGroup: UserGroup;
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onBack: () => void;
}> = ({ onAwardPoints, onBack }) => {
  const initialClutter: ClutterItem[] = [
    { id: '1', name: 'Dirty gym socks on floor', emoji: '🧦', actionText: 'Move to laundry basket', cleaned: false },
    { id: '2', name: 'Sticky candy wrapper under bed', emoji: '🍬', actionText: 'Drop into covered trash bin', cleaned: false },
    { id: '3', name: 'Dusty desk surface', emoji: '🪶', actionText: 'Wipe down with damp cloth', cleaned: false },
    { id: '4', name: 'Closed stale window', emoji: '🪟', actionText: 'Open window for fresh cross-ventilation', cleaned: false },
    { id: '5', name: 'Unmade messy bed', emoji: '🛏️', actionText: 'Straighten pillows & fold sheets', cleaned: false },
    { id: '6', name: 'Empty water bottle without lid', emoji: '🧴', actionText: 'Wash bottle & screw cap on', cleaned: false },
  ];

  const [clutter, setClutter] = useState<ClutterItem[]>(initialClutter);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [isSparkling, setIsSparkling] = useState(false);

  const handleCleanItem = (id: string) => {
    soundEffects.playTaskComplete();
    const updated = clutter.map((item) =>
      item.id === id ? { ...item, cleaned: true } : item
    );
    setClutter(updated);
    const count = updated.filter((i) => i.cleaned).length;
    setCleanedCount(count);

    if (count === initialClutter.length) {
      setIsSparkling(true);
      soundEffects.playSuccessFanfare();
      triggerCelebration();
      onAwardPoints(45, 'Clean Room Champ');
    }
  };

  const handleReset = () => {
    setClutter(initialClutter);
    setCleanedCount(0);
    setIsSparkling(false);
  };

  const cleanlinessPercentage = Math.round((cleanedCount / initialClutter.length) * 100);

  return (
    <div id="clean-room-game-container" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧹</span>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              Clean-the-Room Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear mess, dust surfaces, and make your space shine with 100% sparkle!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Sparkle Meter:</span>
          <span className="text-xs font-black text-amber-500 px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950">
            {cleanlinessPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${cleanlinessPercentage}%` }}
        />
      </div>

      {!isSparkling ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {clutter.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.cleaned && handleCleanItem(item.id)}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 cursor-pointer ${
                item.cleaned
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 opacity-70'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-amber-400 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h5 className={`text-sm font-bold ${item.cleaned ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                    {item.name}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.actionText}
                  </p>
                </div>
              </div>

              {item.cleaned ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <button className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0">
                  Clean
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl animate-bounce">✨🛏️✨</div>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white">
            100% Room Sparkle Achieved!
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A clean living space keeps allergens low and minds relaxed. You earned <span className="font-extrabold text-emerald-600">+45 points</span>!
          </p>
          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold"
            >
              Reset Room
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md"
            >
              Back to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-GAME 6: GOOD HABIT / BAD HABIT CHALLENGE
// ==========================================
interface HabitChallengeItem {
  id: number;
  statement: string;
  isGood: boolean;
  explanation: string;
}

const HABIT_SCENARIOS: HabitChallengeItem[] = [
  { id: 1, statement: 'Biting fingernails when feeling nervous or bored', isGood: false, explanation: 'Nail biting transfers pinworm eggs and bacteria from under nails directly into your mouth.' },
  { id: 2, statement: 'Rinsing thoroughly after applying soap for 20 seconds', isGood: true, explanation: 'Proper rinsing washes away dissolved grease, dead cells, and microbial residue.' },
  { id: 3, statement: 'Leaving wet bath towels in a dark heap on the bed', isGood: false, explanation: 'Dark, damp towels grow mold and mildew within hours, causing musty odor and skin rashes.' },
  { id: 4, statement: 'Drinking a fresh glass of water right after waking up', isGood: true, explanation: 'Rehydrates the body after overnight fluid loss and jumpstarts kidney filtration.' },
  { id: 5, statement: 'Using cotton ear buds deep inside your ear canal', isGood: false, explanation: 'Pushes cerumen wax deeper against the eardrum, risking impaction and ear perforation.' },
  { id: 6, statement: 'Washing cutting boards with soap between raw meat and vegetables', isGood: true, explanation: 'Stops deadly Salmonella and Campylobacter cross-contamination into raw salad.' },
  { id: 7, statement: 'Looking at bright smartphone screens in bed pitch dark', isGood: false, explanation: 'High-energy blue light suppresses natural melatonin and causes severe eye strain.' },
  { id: 8, statement: 'Clipping toenails straight across rather than deeply curved', isGood: true, explanation: 'Straight cutting stops sharp nail corners from digging into skin as ingrown toenails.' },
];

const GoodBadHabitGame: React.FC<{
  onAwardPoints: (points: number, reason: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onBack: () => void;
}> = ({ onAwardPoints, onBack }) => {
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const current = HABIT_SCENARIOS[index];

  const handleAnswer = (userChoice: boolean) => {
    if (!current) return;
    const isCorrect = userChoice === current.isGood;

    if (isCorrect) {
      soundEffects.playTaskComplete();
      setStreak((s) => s + 1);
      setScore((sc) => sc + 15);
      setFeedback(`🌟 Spot on! ${current.explanation}`);
    } else {
      soundEffects.playBuzz();
      setStreak(0);
      setFeedback(`⚠️ Warning! ${current.explanation}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (index < HABIT_SCENARIOS.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setIsFinished(true);
        soundEffects.playSuccessFanfare();
        triggerCelebration();
        onAwardPoints(50, 'Habit Challenge Reflex');
      }
    }, 1800);
  };

  return (
    <div id="good-bad-game-container" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              Good Habit or Bad Habit?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test your hygiene instincts in this rapid-fire habit trial!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-orange-500 px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40">
            <Flame className="w-3.5 h-3.5" />
            <span>Streak: {streak}</span>
          </div>
          <div className="text-xs font-bold text-emerald-600 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
            {score} pts
          </div>
        </div>
      </div>

      {!isFinished && current ? (
        <div className="space-y-6 max-w-lg mx-auto text-center">
          <div className="text-xs font-bold text-slate-400">
            Scenario {index + 1} of {HABIT_SCENARIOS.length}
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 shadow-sm min-h-[140px] flex items-center justify-center">
            <h4 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-snug">
              “{current.statement}”
            </h4>
          </div>

          {/* Feedback */}
          <div className="h-16 flex items-center justify-center">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 max-w-md"
              >
                {feedback}
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              id="habit-btn-good"
              onClick={() => handleAnswer(true)}
              disabled={!!feedback}
              className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-500/25 transition disabled:opacity-50"
            >
              Good Habit ✅
            </button>
            <button
              id="habit-btn-bad"
              onClick={() => handleAnswer(false)}
              disabled={!!feedback}
              className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md shadow-rose-500/25 transition disabled:opacity-50"
            >
              Bad Habit ❌
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 space-y-4">
          <div className="text-5xl animate-bounce">🏆</div>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white">
            Challenge Completed!
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You scored <span className="font-extrabold text-emerald-600">{score} points</span> with keen hygiene reflexes!
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setIndex(0);
                setScore(0);
                setStreak(0);
                setIsFinished(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md"
            >
              Back to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
