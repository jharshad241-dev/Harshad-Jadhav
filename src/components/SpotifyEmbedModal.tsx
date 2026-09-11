import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';

export const SpotifyEmbedModal: React.FC = () => {
  const { isSpotifyPlayerOpen, closeSpotifyPlayer, spotifyActiveEmbedUrl, currentTrack } = useAudio();
  const [customInput, setCustomInput] = useState<string>('');
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>(
    spotifyActiveEmbedUrl ||
      (currentTrack?.spotifyId
        ? `https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`
        : 'https://open.spotify.com/embed/track/303I22R7lR1A1XN9N8Ue5q?utm_source=generator&theme=0')
  );

  if (!isSpotifyPlayerOpen) return null;

  const handleParseAndPlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput) return;

    const match = customInput.match(/(?:track\/|track:)([a-zA-Z0-9]{22})/);
    const trackId = match ? match[1] : (/^[a-zA-Z0-9]{22}$/.test(customInput.trim()) ? customInput.trim() : null);

    if (trackId) {
      setCurrentEmbedUrl(`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`);
    } else if (customInput.startsWith('https://open.spotify.com/embed')) {
      setCurrentEmbedUrl(customInput);
    } else {
      alert('Please enter a valid Spotify track link (e.g. https://open.spotify.com/track/...)');
    }
  };

  const curatedSpotifyTracks = [
    { title: 'Apsara Aali (Natarang)', id: '303I22R7lR1A1XN9N8Ue5q', cat: 'Lavani' },
    { title: 'Khel Mandala (Natarang)', id: '5cXq6R8s4M3K1A0Z9B2cC3', cat: 'Marathi Bhakti' },
    { title: 'Deva Shree Ganesha', id: '6p543fOaG6oA2z3qI5GgM4', cat: 'Hindi Devotional' },
    { title: 'Shree Hanuman Chalisa', id: '2fG0wO5hK1m3mXv4K6GgQy', cat: 'Bhakti' },
    { title: 'Kesariya (Brahmastra)', id: '6wf7A3R3voMmn1B31S1I1n', cat: 'Bollywood' },
    { title: 'Zingaat (Sairat)', id: '7lQWRAA2M39S33G75O5i0a', cat: 'Marathi Folk' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border border-emerald-500/40 p-6 shadow-2xl shadow-emerald-950/50 text-white overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <IconRenderer name="Music" className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif bg-gradient-to-r from-emerald-300 via-white to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                Spotify Player
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Official Embed
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Play songs directly from Spotify's music network
              </p>
            </div>
          </div>

          <button
            onClick={closeSpotifyPlayer}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <IconRenderer name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Input Form */}
        <form onSubmit={handleParseAndPlay} className="mb-5 flex gap-2">
          <div className="relative flex-1">
            <IconRenderer
              name="Search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400"
            />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Paste Spotify Song Link (https://open.spotify.com/track/...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-neutral-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
          >
            <IconRenderer name="Play" className="w-4 h-4 fill-neutral-950" />
            Play Link
          </button>
        </form>

        {/* Embedded Spotify Official IFrame */}
        <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-xl bg-neutral-900 mb-5">
          <iframe
            style={{ borderRadius: '16px' }}
            src={currentEmbedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Embedded Audio Player"
          />
        </div>

        {/* Quick Pick Curated Spotify Tracks */}
        <div>
          <h4 className="text-xs font-bold text-neutral-300 mb-2.5 flex items-center gap-1.5">
            <IconRenderer name="Sparkles" className="w-3.5 h-3.5 text-emerald-400" />
            Featured Spotify Hits
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {curatedSpotifyTracks.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  setCurrentEmbedUrl(`https://open.spotify.com/embed/track/${item.id}?utm_source=generator&theme=0`)
                }
                className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-850 text-left transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                    {item.cat}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 flex items-center justify-center text-emerald-400 group-hover:text-neutral-950 transition-all shrink-0 ml-1">
                  <IconRenderer name="Play" className="w-3 h-3 fill-current" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>🎵 Powered by Spotify Web API & Embeds</span>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1"
          >
            Open Spotify Web App ↗
          </a>
        </div>
      </div>
    </div>
  );
};
