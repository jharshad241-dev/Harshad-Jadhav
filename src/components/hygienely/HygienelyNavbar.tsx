import React, { useState } from 'react';
import {
  Home,
  CheckSquare,
  Calendar,
  Gamepad2,
  Bell,
  TrendingUp,
  BookOpen,
  Award,
  User,
  Menu,
  X,
  Flame,
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AppLogo } from './AppLogo';
import { UserProfile } from '../../types/hygienely';
import { soundEffects } from '../../utils/soundEffects';

interface HygienelyNavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onToggleTheme: () => void;
  onToggleSound: () => void;
}

export const HygienelyNavbar: React.FC<HygienelyNavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  onToggleTheme,
  onToggleSound,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare, emoji: '📋' },
    { id: 'weekly', label: 'Weekly Chart', icon: Calendar, emoji: '📅' },
    { id: 'games', label: 'Games', icon: Gamepad2, emoji: '🎮' },
    { id: 'reminders', label: 'Reminders', icon: Bell, emoji: '⏰' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, emoji: '📈' },
    { id: 'info', label: 'Health Info', icon: BookOpen, emoji: '📚' },
    { id: 'badges', label: 'Rewards', icon: Award, emoji: '🏆' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
  ];

  const handleNavClick = (tabId: string) => {
    soundEffects.playClick();
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer select-none"
          >
            <AppLogo size="sm" showTagline />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Counters & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter Pill */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{profile.streak}d</span>
            </div>

            {/* Points Pill */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile.totalPoints} pts</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              title={profile.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {profile.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              title="Toggle Theme"
            >
              {profile.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-emerald-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-1.5 p-1 rounded-2xl hover:ring-2 hover:ring-emerald-500 transition"
              title="View Profile Settings"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-200 dark:from-emerald-950 dark:to-teal-900 border border-emerald-300 flex items-center justify-center text-xl shadow-sm">
                {profile.avatar}
              </div>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Medium Screen (Tablet) Horizontal Scroll Bar */}
        <div className="hidden md:flex xl:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left transition ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
