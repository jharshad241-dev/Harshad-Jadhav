import React from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    playbackTime,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    favorites,
    toggleFavorite,
    setFullScreenPlayerOpen,
    seekTo,
    openSpotifyPlayer,
  } = useAudio();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (playbackTime / duration) * 100 : 0;
  const isFavorited = favorites.includes(currentTrack.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-2xl border-t border-amber-500/30 shadow-2xl shadow-amber-500/10 text-white transition-all">
      {/* Progress Bar Top Border Line */}
      <div
        className="w-full h-1 bg-neutral-800 cursor-pointer relative group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          seekTo(clickPos * duration);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-150 relative"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-white shadow-md border-2 border-amber-400 absolute right-0 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Track Thumbnail & Info */}
        <div
          onClick={() => setFullScreenPlayerOpen(true)}
          className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1 sm:flex-initial"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-amber-500/40 shrink-0 shadow-lg">
            <img
              src={currentTrack.coverArtUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-all" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate font-serif">
                {currentTrack.title}
              </h4>
              {currentTrack.isBhaktiGeet && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shrink-0">
                  🕉️ Bhakti
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 truncate">
              {currentTrack.artist} • <span className="text-amber-400/80">{currentTrack.language}</span>
            </p>
          </div>
        </div>

        {/* Center Player Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={previousTrack}
            className="p-2 rounded-xl text-neutral-400 hover:text-amber-300 transition-all cursor-pointer hidden sm:block"
          >
            <IconRenderer name="SkipBack" className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 cursor-pointer hover:scale-105 transition-all flex items-center justify-center text-neutral-950"
          >
            <IconRenderer
              name={isPlaying ? 'Pause' : 'Play'}
              className="w-5 h-5 fill-neutral-950 text-neutral-950 ml-0.5"
            />
          </button>

          <button
            onClick={nextTrack}
            className="p-2 rounded-xl text-neutral-400 hover:text-amber-300 transition-all cursor-pointer"
          >
            <IconRenderer name="SkipForward" className="w-5 h-5 fill-current" />
          </button>

          <span className="text-[10px] text-neutral-400 font-mono hidden md:inline-block">
            {formatTime(playbackTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => openSpotifyPlayer(currentTrack.spotifyId || currentTrack.spotifyUrl)}
            className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-md shadow-emerald-500/10"
            title="Play on Spotify"
          >
            <IconRenderer name="Music" className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Spotify</span>
          </button>

          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="p-2 rounded-xl text-neutral-400 hover:text-amber-400 transition-all cursor-pointer"
          >
            <IconRenderer
              name="Heart"
              className={`w-5 h-5 ${isFavorited ? 'text-amber-400 fill-amber-400' : ''}`}
            />
          </button>

          <button
            onClick={() => setFullScreenPlayerOpen(true)}
            className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <IconRenderer name="Maximize2" className="w-4 h-4" />
            <span className="hidden sm:inline">Player</span>
          </button>
        </div>
      </div>
    </div>
  );
};
