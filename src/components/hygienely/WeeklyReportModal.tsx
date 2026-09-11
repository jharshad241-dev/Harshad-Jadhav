import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Sparkles,
  Flame,
  Download,
  Share2,
  X,
} from 'lucide-react';
import { HygieneTask, UserProfile } from '../../types/hygienely';
import { soundEffects } from '../../utils/soundEffects';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  tasks: HygieneTask[];
  weeklyHistory: Record<string, boolean[]>;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  tasks,
  weeklyHistory,
}) => {
  if (!isOpen) return null;

  // Calculate statistics
  let totalLogs = 0;
  let completedLogs = 0;
  let bestHabitName = 'Brush Teeth & Clean Tongue';
  let bestHabitCount = -1;
  let missedHabitName = 'Keep Living Space Tidy';
  let leastHabitCount = 999;

  tasks.forEach((t) => {
    const hist = weeklyHistory[t.id] || [false, false, false, false, false, false, false];
    const doneCount = hist.filter(Boolean).length;
    totalLogs += 7;
    completedLogs += doneCount;

    if (doneCount > bestHabitCount) {
      bestHabitCount = doneCount;
      bestHabitName = t.name;
    }

    if (doneCount < leastHabitCount) {
      leastHabitCount = doneCount;
      missedHabitName = t.name;
    }
  });

  const completionRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;
  const missedLogs = Math.max(0, totalLogs - completedLogs);

  // Motivational suggestions based on user group & rate
  const getSuggestions = () => {
    if (completionRate >= 80) {
      return 'Outstanding discipline! Your immunity barrier is at peak protection. Challenge yourself to a perfect 7-day water hydration and sleep streak next week!';
    } else if (completionRate >= 50) {
      return `Solid consistency! You did great with "${bestHabitName}". To hit 80% next week, set dedicated reminders for "${missedHabitName}".`;
    } else {
      return `Every journey begins with small steps! Focus on 3 foundational pillars this upcoming week: 2x daily brushing, 20-second handwashing, and safe water intake.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Report Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/25">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Weekly Hygiene Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official summary for {profile.name} ({profile.userGroup.toUpperCase()})
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {completionRate}% Completed
          </span>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 font-bold mt-1">
            {completionRate >= 80
              ? '🌟 Stellar hygiene discipline! You earned the Weekly Champion bonus.'
              : completionRate >= 50
              ? '👏 Great job! You completed more than half of your hygiene habits.'
              : '🌱 Building healthy foundations! Keep showing up every single day.'}
          </p>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/70 dark:border-slate-600">
            <span className="text-xs text-slate-400 font-bold block">Tasks Done</span>
            <span className="text-xl font-black text-slate-800 dark:text-white">
              {completedLogs}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/70 dark:border-slate-600">
            <span className="text-xs text-slate-400 font-bold block">Tasks Missed</span>
            <span className="text-xl font-black text-rose-500">{missedLogs}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/70 dark:border-slate-600">
            <span className="text-xs text-slate-400 font-bold block">Active Streak</span>
            <span className="text-xl font-black text-orange-500 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              {profile.streak} Days
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/70 dark:border-slate-600">
            <span className="text-xs text-slate-400 font-bold block">Points Earned</span>
            <span className="text-xl font-black text-emerald-600">{profile.totalPoints} pts</span>
          </div>
        </div>

        {/* Best Performing Habit */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">
                🌟 Best Performing Habit
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                {bestHabitName}
              </p>
            </div>
            <span className="text-xs font-black text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-xl bg-teal-100 dark:bg-teal-900">
              {bestHabitCount}/7 Days
            </span>
          </div>

          {/* Improvement Suggestion */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600">
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              💡 Coach's Hygiene Advice
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {getSuggestions()}
            </p>
          </div>
        </div>

        {/* Done / Close Button */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-500/25 transition"
          >
            Keep Crushing Habits!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
