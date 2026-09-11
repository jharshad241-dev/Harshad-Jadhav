import React from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenSettings: () => void;
  onOpenAiLyrics: () => void;
  onOpenAddMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenSettings,
  onOpenAiLyrics,
  onOpenAddMusic,
}) => {
  const { bhaktiSchedule, simulateBhaktiSchedule, openSpotifyPlayer } = useAudio();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveCategory('All')}>
            {/* Crown Logo Badge */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <IconRenderer name="Crown" className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black font-serif tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  VAIBHAV JADHAV
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  MUSIC
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                Marathi & Hindi Bhakti Geet Station • 2026 Edition
              </p>
            </div>
          </div>

          {/* Quick Mobile Action Buttons */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setActiveCategory('Health & Hygiene')}
              title="Health & Hygiene Game & Notifications"
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                activeCategory === 'Health & Hygiene'
                  ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <IconRenderer name="ShieldCheck" className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onOpenAiLyrics}
              title="AI Song Meaning & Lyrics"
              className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1"
            >
              <IconRenderer name="Sparkles" className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-neutral-900 text-neutral-300 border border-neutral-800"
            >
              <IconRenderer name="Settings" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-md relative">
          <div className="relative flex items-center">
            <IconRenderer name="Search" className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Marathi, Hindi, Vitthal Abhang, Lavani, Singers..."
              className="w-full pl-10 pr-9 py-2 rounded-2xl bg-neutral-900 border border-amber-500/30 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-neutral-400 hover:text-white"
              >
                <IconRenderer name="X" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Controls & Schedule Shortcuts */}
        <div className="hidden md:flex items-center gap-2">
          {/* Bhakti Schedule Quick Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>9AM & 7PM Bhakti Auto</span>
          </div>

          <button
            onClick={() => simulateBhaktiSchedule('morning')}
            title="Preview 9 AM Bhakti Schedule"
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>🕉️ 9 AM</span>
          </button>

          <button
            onClick={() => simulateBhaktiSchedule('evening')}
            title="Preview 7 PM Bhakti Schedule"
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>🕉️ 7 PM</span>
          </button>

          <button
            onClick={() => setActiveCategory('Health & Hygiene')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
              activeCategory === 'Health & Hygiene'
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-emerald-500/20'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
            }`}
            title="Health & Hygiene Game & Notifications"
          >
            <IconRenderer name="ShieldCheck" className="w-3.5 h-3.5 text-emerald-400" />
            <span>Health & Hygiene</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => openSpotifyPlayer()}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
            title="Launch Spotify Embed Station"
          >
            <IconRenderer name="Music" className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spotify Player</span>
          </button>

          <button
            onClick={onOpenAiLyrics}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 hover:from-amber-500/30 hover:to-amber-700/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <IconRenderer name="Sparkles" className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Lyrics Meaning</span>
          </button>

          <button
            onClick={onOpenAddMusic}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 cursor-pointer transition-all"
            title="Add Custom Song / Upload Stream"
          >
            <IconRenderer name="Plus" className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 cursor-pointer transition-all"
            title="Music Settings"
          >
            <IconRenderer name="Settings" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
