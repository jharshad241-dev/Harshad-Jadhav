import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';

interface SpotifyTrackItem {
  id: string;
  spotifyTrackId: string;
  title: string;
  artist: string;
  category: string;
  coverArt: string;
}

const SPOTIFY_HUB_DATA: SpotifyTrackItem[] = [
  // Bhakti & Devotional
  {
    id: 'sp-1',
    spotifyTrackId: '3n3Pp32S33G2p0X0Y8Z1aB',
    title: 'Maajhe Vitthal Maajhe Ry',
    artist: 'Prahlad Shinde & Lata Mangeshkar',
    category: 'Marathi Bhakti',
    coverArt: 'https://images.unsplash.com/photo-1609102026400-3d026932e652?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp-2',
    spotifyTrackId: '5cXq6R8s4M3K1A0Z9B2cC3',
    title: 'Khel Mandala (Vitthal Abhang)',
    artist: 'Ajay Gogavale (Ajay-Atul)',
    category: 'Vitthal Abhang',
    coverArt: 'https://images.unsplash.com/photo-1545232979-fbf4203715d4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp-3',
    spotifyTrackId: '2fG0wO5hK1m3mXv4K6GgQy',
    title: 'Shree Hanuman Chalisa',
    artist: 'Hariharan & Gulshan Kumar',
    category: 'Hindi Devotional',
    coverArt: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp-4',
    spotifyTrackId: '6p543fOaG6oA2z3qI5GgM4',
    title: 'Deva Shree Ganesha',
    artist: 'Ajay-Atul & Ajay Gogavale',
    category: 'Ganesh Festival',
    coverArt: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80'
  },
  // Lavani Special
  {
    id: 'sp-5',
    spotifyTrackId: '303I22R7lR1A1XN9N8Ue5q',
    title: 'Apsara Aali (Natarang)',
    artist: 'Bela Shende & Ajay-Atul',
    category: 'Lavani Special',
    coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp-6',
    spotifyTrackId: '7lQWRAA2M39S33G75O5i0a',
    title: 'Zingaat (Sairat)',
    artist: 'Ajay-Atul',
    category: 'Marathi Blockbuster',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
  },
  // Hindi Hits
  {
    id: 'sp-7',
    spotifyTrackId: '6wf7A3R3voMmn1B31S1I1n',
    title: 'Kesariya (Brahmastra)',
    artist: 'Arijit Singh & Pritam',
    category: 'Bollywood Romantic',
    coverArt: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp-8',
    spotifyTrackId: '2R1Q0P9O8N7M6L5K4J3I2H',
    title: 'Tere Vaaste (Zara Hatke)',
    artist: 'Varun Jain & Sachin-Jigar',
    category: 'Latest Hindi',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
  }
];

export const SpotifyHubView: React.FC = () => {
  const { openSpotifyPlayer } = useAudio();
  const [activeEmbed, setActiveEmbed] = useState<string | null>(null);
  const [customLinkInput, setCustomLinkInput] = useState<string>('');

  const handleCustomLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkInput) return;
    openSpotifyPlayer(customLinkInput);
    setCustomLinkInput('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Spotify Branding Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-neutral-950 to-neutral-900 border border-emerald-500/30 p-6 md:p-8 shadow-2xl shadow-emerald-950/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <span>🎵 Official Spotify Integration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-white tracking-tight">
              Spotify Station & Track Importer
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Listen to authentic Marathi, Hindi, Lavani, and Bhakti tracks directly from Spotify. Paste any Spotify song link below or launch featured Spotify players.
            </p>
          </div>

          <button
            onClick={() => openSpotifyPlayer()}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 cursor-pointer shrink-0"
          >
            <IconRenderer name="Play" className="w-5 h-5 fill-neutral-950" />
            Launch Spotify Player
          </button>
        </div>

        {/* Link Importer Bar */}
        <form onSubmit={handleCustomLinkSubmit} className="mt-6 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconRenderer
              name="Search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400"
            />
            <input
              type="text"
              value={customLinkInput}
              onChange={(e) => setCustomLinkInput(e.target.value)}
              placeholder="Paste any Spotify song URL (e.g. https://open.spotify.com/track/303I22R...)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-neutral-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 border border-neutral-700 text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <IconRenderer name="Plus" className="w-4 h-4" />
            Import & Play
          </button>
        </form>
      </div>

      {/* Embedded Player Widget if active */}
      {activeEmbed && (
        <div className="rounded-3xl bg-neutral-950 border border-emerald-500/40 p-4 shadow-2xl relative animate-fade-in">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold font-mono text-emerald-300">
                Playing via Spotify Embed
              </h3>
            </div>
            <button
              onClick={() => setActiveEmbed(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <iframe
            style={{ borderRadius: '16px' }}
            src={`https://open.spotify.com/embed/track/${activeEmbed}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Embedded Track"
          />
        </div>
      )}

      {/* Featured Songs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              Featured Spotify Hits
              <span className="text-xs font-mono font-normal text-emerald-400">
                (Click to play)
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Curated Marathi, Bhakti, Lavani & Bollywood tracks on Spotify
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPOTIFY_HUB_DATA.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/50 p-4 transition-all hover:bg-neutral-900 flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800 mb-3 bg-neutral-950">
                <img
                  src={item.coverArt}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                  {item.category}
                </div>

                <div
                  onClick={() => openSpotifyPlayer(item.spotifyTrackId)}
                  className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                    <IconRenderer name="Play" className="w-6 h-6 fill-neutral-950 ml-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 line-clamp-1 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                  {item.artist}
                </p>

                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <button
                    onClick={() => openSpotifyPlayer(item.spotifyTrackId)}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    Play on Spotify
                    <IconRenderer name="ChevronRight" className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setActiveEmbed(item.spotifyTrackId)}
                    className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300"
                  >
                    Inline Player
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
