import React from 'react';
import { motion } from 'motion/react';
import {
  Sun,
  Moon,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  ArrowRight,
  Gamepad2,
  Bell,
  CheckSquare,
  BookOpen,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, HygieneTask, BadgeItem } from '../../types/hygienely';
import { HygieneIcon } from './HygieneIcon';
import { soundEffects } from '../../utils/soundEffects';

interface HomeDashboardViewProps {
  profile: UserProfile;
  tasks: HygieneTask[];
  badges: BadgeItem[];
  completedCount: number;
  onNavigate: (tab: string) => void;
  onToggleTask: (taskId: string) => void;
  onOpenReport: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  profile,
  tasks,
  badges,
  completedCount,
  onNavigate,
  onToggleTask,
  onOpenReport,
}) => {
  // Current time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good Morning! 🌞'
      : hour < 17
      ? 'Good Afternoon! ☀️'
      : 'Good Evening! 🌙';

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dailyPercentage = Math.min(
    100,
    Math.round((completedCount / Math.max(1, profile.dailyGoal)) * 100)
  );

  const remainingToGoal = Math.max(0, profile.dailyGoal - completedCount);

  // Motivational quote selection
  const motivationalMessage =
    remainingToGoal === 0
      ? '🎉 Phenomenal! You achieved your daily hygiene goal today!'
      : remainingToGoal <= 2
      ? `🔥 You’re only ${remainingToGoal} habit away from today’s goal! Keep the fire burning.`
      : 'Small habits, big changes! One clean ritual protects your immune system today.';

  // Top 3 next incomplete tasks
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <div id="home-dashboard-view" className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. HERO GREETING & PROGRESS CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/20">
        {/* Subtle Decorative Background Bubbles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.avatar}</span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-100">
                {profile.userGroup} Edition
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {greeting} <span className="underline decoration-emerald-300">{profile.name}</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Today is <span className="font-bold text-white">{todayStr}</span> • “Be Clean • Be Healthy • Be Happy”
            </p>

            <div className="pt-2">
              <p className="text-xs sm:text-sm font-bold bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl inline-block text-white border border-white/20">
                {motivationalMessage}
              </p>
            </div>
          </div>

          {/* Circular Progress Gauge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex flex-col items-center justify-center text-center min-w-[200px] shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white transition-all duration-700 ease-out"
                  strokeDasharray={`${dailyPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black">{dailyPercentage}%</span>
                <span className="text-[10px] font-bold text-emerald-100">GOAL</span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-50 mt-2">
              Today's Progress: {completedCount}/{profile.dailyGoal}
            </span>
          </div>
        </div>
      </div>

      {/* 2. THREE QUICK ACTION HERO BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Quick Button 1: Tasks */}
        <button
          id="home-quick-tasks-btn"
          onClick={() => {
            soundEffects.playClick();
            onNavigate('tasks');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-slate-700 hover:border-emerald-400 shadow-sm hover:shadow-md transition text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              📋
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                Daily Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pendingTasks.length} pending habits
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Quick Button 2: Games */}
        <button
          id="home-quick-games-btn"
          onClick={() => {
            soundEffects.playClick();
            onNavigate('games');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-cyan-100 dark:border-slate-700 hover:border-cyan-400 shadow-sm hover:shadow-md transition text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🎮
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                Hygiene Arcade
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                6 educational games
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Quick Button 3: Reminders */}
        <button
          id="home-quick-reminders-btn"
          onClick={() => {
            soundEffects.playClick();
            onNavigate('reminders');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-slate-700 hover:border-purple-400 shadow-sm hover:shadow-md transition text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              ⏰
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">
                Smart Reminders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audio chimes & timers
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. TODAY'S PENDING HABITS QUICK LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Up Next for Today
            </h3>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="text-center py-6 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              🎉 All priority tasks completed for today! Check out the Arcade or Weekly Chart.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/70 dark:border-slate-600 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm shrink-0">
                    <HygieneIcon name={t.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-amber-500 font-bold">
                      +{t.points} pts • {t.timeOfDay}
                    </span>
                  </div>
                </div>

                <button
                  id={`home-toggle-task-${t.id}`}
                  onClick={() => {
                    soundEffects.playTaskComplete();
                    onToggleTask(t.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-sm transition"
                >
                  Done
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECENT BADGES TEASER & MOTIVATION */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 rounded-3xl p-6 border border-emerald-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Hygiene Rewards & Level
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You have unlocked {badges.filter((b) => b.unlocked).length} badges and earned {profile.totalPoints} points!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('badges')}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            Show Badges
          </button>
          <button
            onClick={onOpenReport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition"
          >
            Weekly Report
          </button>
        </div>
      </div>
    </div>
  );
};
