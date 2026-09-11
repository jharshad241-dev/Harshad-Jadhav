import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';
import { EqualizerPreset } from '../types';

export const FullScreenPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    playbackTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    favorites,
    equalizerPreset,
    isFullScreenPlayerOpen,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleFavorite,
    setFullScreenPlayerOpen,
    setEqualizerPreset,
    playTrack,
    openSpotifyPlayer,
  } = useAudio();

  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue' | 'equalizer'>('player');

  if (!isFullScreenPlayerOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (playbackTime / duration) * 100 : 0;
  const isFavorited = favorites.includes(currentTrack.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const equalizerOptions: EqualizerPreset[] = [
    'Devotional Pure',
    'Bass Boost',
    'Vocal Boost',
    'Gold Acoustic',
    'Treble Boost',
    'Normal',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-2xl flex flex-col justify-between text-white overflow-hidden animate-fadeIn">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 border-b border-amber-500/20 flex items-center justify-between bg-neutral-950">
        <button
          onClick={() => setFullScreenPlayerOpen(false)}
          className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <IconRenderer name="ChevronDown" className="w-5 h-5" />
          <span>Minimize</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest block">
            VAIBHAV JADHAV MUSIC PLAYER
          </span>
          <h2 className="text-xs sm:text-sm font-extrabold text-white font-serif">
            {currentTrack.language} • {currentTrack.category}
          </h2>
        </div>

        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 cursor-pointer"
        >
          <IconRenderer
            name="Heart"
            className={`w-5 h-5 ${isFavorited ? 'text-amber-400 fill-amber-400' : ''}`}
          />
        </button>
      </div>

      {/* Main Player Tab Switcher Bar */}
      <div className="flex border-b border-neutral-800/80 bg-neutral-950/50 px-4 justify-center gap-2">
        {[
          { id: 'player', label: 'Now Playing', icon: 'Disc' },
          { id: 'lyrics', label: 'Lyrics & Meaning', icon: 'FileText' },
          { id: 'queue', label: 'Up Next Queue', icon: 'ListMusic' },
          { id: 'equalizer', label: 'Gold Sound EQ', icon: 'Sliders' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-300 bg-neutral-900/60'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <IconRenderer name={tab.icon} className="w-4 h-4 text-amber-400" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full flex flex-col justify-center items-center">
        {/* TAB 1: Now Playing View */}
        {activeTab === 'player' && (
          <div className="w-full flex flex-col items-center justify-center space-y-6">
            {/* Spinning Vinyl Cover Art */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2">
              <div
                className={`w-full h-full rounded-full border-4 border-amber-400/80 p-2 bg-gradient-to-br from-amber-500/30 via-neutral-900 to-amber-900/40 shadow-2xl shadow-amber-500/25 relative overflow-hidden ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '20s' }}
              >
                <img
                  src={currentTrack.coverArtUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded-full shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full border-8 border-neutral-950/30 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-neutral-950 border-2 border-amber-400 flex items-center justify-center shadow-2xl">
                  <div className="w-4 h-4 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Song Meta Info */}
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">
                {currentTrack.title}
              </h1>
              <p className="text-sm font-medium text-neutral-300">
                {currentTrack.artist}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  {currentTrack.language}
                </span>
                {currentTrack.isBhaktiGeet && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                    🕉️ Bhakti
                  </span>
                )}
                {currentTrack.isLavaniSpecial && (
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-mono font-bold">
                    💃 Lavani
                  </span>
                )}
                <button
                  onClick={() => openSpotifyPlayer(currentTrack.spotifyId || currentTrack.spotifyUrl)}
                  className="px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  <IconRenderer name="Music" className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Play on Spotify Embed</span>
                </button>
              </div>
            </div>

            {/* Visualizer Wave Bar Animation */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[40, 70, 30, 90, 50, 100, 60, 80, 45, 95, 35, 75].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-400/80 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.sin(playbackTime * 5 + i) * 15 + 18}px` : '6px',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Lyrics & Spiritual Meaning View */}
        {activeTab === 'lyrics' && (
          <div className="w-full space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/30 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h3 className="font-extrabold text-amber-300 font-serif text-sm">
                  📜 Lyrics & Verse Details
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">{currentTrack.language}</span>
              </div>

              {currentTrack.lyrics ? (
                <p className="whitespace-pre-line text-sm text-neutral-200 font-serif leading-relaxed">
                  {currentTrack.lyrics}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 italic">
                  Lyrics preview loading for {currentTrack.title}...
                </p>
              )}

              {currentTrack.spiritualMeaning && (
                <div className="pt-3 border-t border-neutral-800 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono block mb-1">
                    ✨ Spiritual Meaning / Cultural Context
                  </span>
                  <p className="text-xs text-amber-100">
                    {currentTrack.spiritualMeaning}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Up Next Queue Drawer */}
        {activeTab === 'queue' && (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 font-mono border-b border-neutral-800 pb-2">
              <span>UP NEXT QUEUE ({queue.length} TRACKS)</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {queue.map((track, idx) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold text-neutral-500 w-4">
                        {idx + 1}
                      </span>
                      <img
                        src={track.coverArtUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                        <p className="text-[10px] text-neutral-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-black text-[9px] uppercase">
                        NOW PLAYING
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Sound Equalizer Presets */}
        {activeTab === 'equalizer' && (
          <div className="w-full space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-extrabold text-amber-300 font-serif">
                🎛️ Gold Acoustic Sound Equalizer
              </h3>
              <p className="text-[11px] text-neutral-400">
                Enhance vocal clarity for Bhakti Abhangs or boost bass for Lavani tracks.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {equalizerOptions.map((preset) => {
                const isCurrent = equalizerPreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => setEqualizerPreset(preset)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-center font-bold text-xs ${
                      isCurrent
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-xl shadow-amber-500/25'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/40'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Seekbar & Controls Container */}
      <div className="p-6 border-t border-amber-500/20 bg-neutral-950 max-w-3xl mx-auto w-full space-y-4">
        {/* Seekbar Slider */}
        <div className="space-y-1">
          <div
            className="w-full h-2 bg-neutral-800 rounded-full cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              seekTo(clickPos * duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-lg border-2 border-amber-400 absolute right-0 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>{formatTime(playbackTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Controls Row */}
        <div className="flex items-center justify-between">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isShuffle ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
            title="Shuffle Queue"
          >
            <IconRenderer name="Shuffle" className="w-5 h-5" />
          </button>

          {/* Previous Track */}
          <button
            onClick={previousTrack}
            className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white hover:text-amber-300 cursor-pointer transition-all"
          >
            <IconRenderer name="SkipBack" className="w-6 h-6 fill-current" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/30 cursor-pointer hover:scale-105 transition-all flex items-center justify-center text-neutral-950"
          >
            <IconRenderer
              name={isPlaying ? 'Pause' : 'Play'}
              className="w-8 h-8 fill-neutral-950 text-neutral-950 ml-0.5"
            />
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white hover:text-amber-300 cursor-pointer transition-all"
          >
            <IconRenderer name="SkipForward" className="w-6 h-6 fill-current" />
          </button>

          {/* Repeat Mode Cycle */}
          <button
            onClick={cycleRepeatMode}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
              repeatMode !== 'off'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
            title={`Repeat Mode: ${repeatMode}`}
          >
            <IconRenderer name="Repeat" className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-amber-400 text-neutral-950 rounded-full w-4 h-4 flex items-center justify-center font-mono">
                1
              </span>
            )}
          </button>
        </div>

        {/* Volume Control Row */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={toggleMute} className="text-neutral-400 hover:text-amber-300 cursor-pointer">
            <IconRenderer name={isMuted ? 'VolumeX' : 'Volume2'} className="w-5 h-5" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
