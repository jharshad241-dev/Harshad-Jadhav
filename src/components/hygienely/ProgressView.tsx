import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { UserProfile, BadgeItem, HygieneTask } from '../../types/hygienely';
import { HygieneIcon } from './HygieneIcon';

interface ProgressViewProps {
  profile: UserProfile;
  badges: BadgeItem[];
  tasks: HygieneTask[];
  completedTodayCount: number;
  weeklyHistory: Record<string, boolean[]>;
  onOpenReport: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  badges,
  tasks,
  completedTodayCount,
  weeklyHistory,
  onOpenReport,
}) => {
  const dailyPercentage = Math.min(
    100,
    Math.round((completedTodayCount / Math.max(1, profile.dailyGoal)) * 100)
  );

  // Weekly counts
  let weeklyDone = 0;
  let weeklyTotal = tasks.length * 7;
  tasks.forEach((t) => {
    const hist = weeklyHistory[t.id] || [];
    weeklyDone += hist.filter(Boolean).length;
  });
  const weeklyPercentage = Math.round((weeklyDone / Math.max(1, weeklyTotal)) * 100);

  // Unlocked badges
  const unlockedBadges = badges.filter((b) => b.unlocked);

  // Categories breakdown
  const categoryStats: Record<string, { total: number; done: number }> = {};
  tasks.forEach((t) => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { total: 0, done: 0 };
    }
    categoryStats[t.category].total += 1;
    if (t.completed) {
      categoryStats[t.category].done += 1;
    }
  });

  return (
    <div id="progress-view-container" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner with Summary & Button for Full Weekly Report */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/50 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📈</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Hygiene Growth & Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg">
            Track daily momentum, weekly consistency, and category health mastery.
          </p>
        </div>

        <button
          id="generate-weekly-report-btn"
          onClick={onOpenReport}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 shrink-0"
        >
          <Trophy className="w-4 h-4" />
          <span>View Weekly Report Card</span>
        </button>
      </div>

      {/* 4 Quick Stat Hero Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Today's Goal */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Daily Goal</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {completedTodayCount}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {profile.dailyGoal}</span>
          </div>
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${dailyPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-orange-500">
              {profile.streak}
            </span>
            <span className="text-xs font-bold text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">
            Best: {profile.longestStreak} Days
          </p>
        </div>

        {/* Total Points */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Total Points</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {profile.totalPoints}
            </span>
            <span className="text-xs font-bold text-slate-400">pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">
            Rank: Level {profile.level}
          </p>
        </div>

        {/* Badges Earned */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Badges Won</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              {unlockedBadges.length}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {badges.length}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">
            {badges.length - unlockedBadges.length} remaining
          </p>
        </div>
      </div>

      {/* Progress Bars & Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly & Monthly Momentum */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Habit Rhythm & Momentum
            </h3>
          </div>

          {/* Daily Goal */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>Today’s Target ({completedTodayCount}/{profile.dailyGoal})</span>
              <span className="text-emerald-600 font-extrabold">{dailyPercentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${dailyPercentage}%` }}
              />
            </div>
          </div>

          {/* Weekly Consistency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>7-Day Consistency ({weeklyDone}/{weeklyTotal})</span>
              <span className="text-teal-600 font-extrabold">{weeklyPercentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${weeklyPercentage}%` }}
              />
            </div>
          </div>

          {/* Monthly Estimation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>Estimated 30-Day Shield</span>
              <span className="text-blue-600 font-extrabold">
                {Math.min(100, Math.round((profile.streak / 30) * 100))}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((profile.streak / 30) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Habit Focus by Category
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, stat]) => {
              const catPercent = Math.round((stat.done / Math.max(1, stat.total)) * 100);
              const label = cat.replace('_', ' ');

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                    <span>{label}</span>
                    <span className="text-slate-400 font-normal">
                      {stat.done}/{stat.total} Done
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
