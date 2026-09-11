import React from 'react';
import { IconRenderer } from './IconRenderer';
import { Track } from '../types';
import { useAudio } from '../context/AudioContext';

interface SongCardProps {
  track: Track;
  layout?: 'grid' | 'horizontal' | 'compact';
}

export const SongCard: React.FC<SongCardProps> = ({ track, layout = 'grid' }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, favorites, toggleFavorite } = useAudio();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isFavorited = favorites.includes(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (layout === 'horizontal') {
    return (
      <div
        onClick={() => playTrack(track)}
        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
          isCurrentTrack
            ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
            : 'bg-neutral-900/90 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-800">
            <img
              src={track.coverArtUrl}
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div
              onClick={handlePlayClick}
              className={`absolute inset-0 flex items-center justify-center transition-all ${
                isCurrentTrack ? 'bg-amber-500/40 opacity-100' : 'bg-neutral-950/60 opacity-0 group-hover:opacity-100'
              }`}
            >
              <IconRenderer
                name={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
                className="w-5 h-5 text-amber-300 fill-amber-300"
              />
            </div>
          </div>

          <div className="min-w-0">
            <h4 className={`text-xs font-bold truncate ${isCurrentTrack ? 'text-amber-300 font-serif' : 'text-white'}`}>
              {track.title}
            </h4>
            <p className="text-[10px] text-neutral-400 truncate mt-0.5">
              {track.artist}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-neutral-800 text-amber-400 border border-neutral-700">
                {track.language}
              </span>
              {track.isBhaktiGeet && (
                <span className="text-[9px] text-amber-300 font-bold font-mono">🕉️ Bhakti</span>
              )}
              {track.isLavaniSpecial && (
                <span className="text-[9px] text-pink-400 font-bold font-mono">💃 Lavani</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-neutral-400">
            {formatDuration(track.durationSeconds)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(track.id);
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 cursor-pointer"
          >
            <IconRenderer
              name="Heart"
              className={`w-4 h-4 ${isFavorited ? 'text-amber-400 fill-amber-400' : 'text-neutral-500'}`}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group relative rounded-3xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between ${
        isCurrentTrack
          ? 'bg-neutral-900 border-amber-400 shadow-xl shadow-amber-500/15'
          : 'bg-neutral-900/80 border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-900'
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800/80 mb-3 bg-neutral-950">
        <img
          src={track.coverArtUrl}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {track.isBhaktiGeet && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-300 text-[9px] font-extrabold border border-amber-400/40">
              🕉️ Bhakti
            </span>
          )}
          {track.isLavaniSpecial && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-pink-300 text-[9px] font-extrabold border border-pink-400/40">
              💃 Lavani
            </span>
          )}
          {track.isPopular && !track.isBhaktiGeet && !track.isLavaniSpecial && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-400 text-[9px] font-bold border border-amber-400/40">
              ⭐ Gold Hit
            </span>
          )}
        </div>

        {/* Favorite Icon Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-neutral-950/70 backdrop-blur-md hover:scale-110 text-white transition-all cursor-pointer"
        >
          <IconRenderer
            name="Heart"
            className={`w-3.5 h-3.5 ${isFavorited ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`}
          />
        </button>

        {/* Center Play Button Overlay */}
        <div
          onClick={handlePlayClick}
          className={`absolute inset-0 flex items-center justify-center transition-all ${
            isCurrentTrack ? 'bg-amber-500/20 opacity-100' : 'bg-neutral-950/40 opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 p-0.5 shadow-xl transform group-hover:scale-105 transition-all flex items-center justify-center text-neutral-950">
            <IconRenderer
              name={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
              className="w-6 h-6 fill-neutral-950 text-neutral-950 ml-0.5"
            />
          </div>
        </div>
      </div>

      {/* Song Details */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-xs font-bold line-clamp-1 ${isCurrentTrack ? 'text-amber-300 font-serif' : 'text-white'}`}>
            {track.title}
          </h3>
        </div>

        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
          {track.artist}
        </p>

        <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-800/60 text-[10px] text-neutral-500 font-mono">
          <span>{track.category}</span>
          <span>{formatDuration(track.durationSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
