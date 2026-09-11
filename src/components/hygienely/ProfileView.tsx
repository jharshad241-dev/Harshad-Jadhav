import React from 'react';
import {
  User,
  ShieldCheck,
  Settings,
  Bell,
  Sun,
  Moon,
  Eye,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Award,
  Flame,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserGroup } from '../../types/hygienely';
import { soundEffects } from '../../utils/soundEffects';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenOnboarding: () => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenOnboarding,
  onResetData,
}) => {
  const handleToggleTheme = () => {
    soundEffects.playClick();
    const next = profile.theme === 'light' ? 'dark' : 'light';
    onUpdateProfile({ theme: next });
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div id="hygiene-profile-view" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-950 dark:to-teal-900 border-4 border-white dark:border-slate-700 shadow-lg flex items-center justify-center text-5xl">
            {profile.avatar}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {profile.name}
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase">
                {profile.userGroup}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Age: {profile.age} years
              {profile.studentClass ? ` • ${profile.studentClass}` : ''} • Level {profile.level} Hygiene Champion
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-black">
              <span className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-xl">
                <Flame className="w-4 h-4 fill-orange-500" />
                {profile.streak} Day Streak
              </span>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl">
                <Sparkles className="w-4 h-4" />
                {profile.totalPoints} Points
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenOnboarding();
          }}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition shrink-0"
        >
          Switch Path / Edit
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Accessibility */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Eye className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Accessibility & Theme
            </h3>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-white block">
                  Dark Mode
                </span>
                <span className="text-xs text-slate-400">
                  Gentle on the eyes during evening routines
                </span>
              </div>
              <button
                id="theme-toggle-btn"
                onClick={handleToggleTheme}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
              >
                {profile.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </button>
            </div>

            {/* Large Text Mode for Kids & Seniors */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-white block">
                  Large Readable Text Mode
                </span>
                <span className="text-xs text-slate-400">
                  Enlarges fonts for young children & senior citizens
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.largeText}
                onChange={(e) => {
                  soundEffects.playClick();
                  onUpdateProfile({ largeText: e.target.checked });
                }}
                className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-white block">
                  High Contrast Borders
                </span>
                <span className="text-xs text-slate-400">
                  Enhances visibility of buttons and cards
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.highContrast}
                onChange={(e) => {
                  soundEffects.playClick();
                  onUpdateProfile({ highContrast: e.target.checked });
                }}
                className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-white block">
                  Audio Feedback & Chimes
                </span>
                <span className="text-xs text-slate-400">
                  Plays cheerful ding when completing habits
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.soundEnabled}
                onChange={(e) => {
                  soundEffects.setMuted(!e.target.checked);
                  onUpdateProfile({ soundEnabled: e.target.checked });
                }}
                className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Habits & Daily Targets */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Habit Target & Category
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Active Lifestyle Path
              </label>
              <select
                value={profile.userGroup}
                onChange={(e) => {
                  soundEffects.playClick();
                  onUpdateProfile({ userGroup: e.target.value as UserGroup });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="student">Student (School, Study, Play)</option>
                <option value="homemaker">Homemaker (Kitchen, Home, Rest)</option>
                <option value="senior">Senior Citizen (Gentle, Meds, Fall-Safe)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Daily Goal (Completed Habits)
              </label>
              <select
                value={profile.dailyGoal}
                onChange={(e) => {
                  soundEffects.playClick();
                  onUpdateProfile({ dailyGoal: Number(e.target.value) });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={5}>5 Tasks / Day (Gentle pace)</option>
                <option value={8}>8 Tasks / Day (Balanced gold standard)</option>
                <option value={10}>10 Tasks / Day (Hygiene master)</option>
              </select>
            </div>

            {/* Reset App Data */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                id="reset-hygiene-data-btn"
                onClick={() => {
                  if (confirm('Are you sure you want to reset tasks and completion history?')) {
                    onResetData();
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Habits & History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
