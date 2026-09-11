import React, { useState } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Navbar } from './components/Navbar';
import { BhaktiScheduleBanner } from './components/BhaktiScheduleBanner';
import { SongCard } from './components/SongCard';
import { MiniPlayer } from './components/MiniPlayer';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { AiLyricsModal } from './components/AiLyricsModal';
import { PlaylistModal } from './components/PlaylistModal';
import { SettingsModal } from './components/SettingsModal';
import { SpotifyEmbedModal } from './components/SpotifyEmbedModal';
import { SpotifyHubView } from './components/SpotifyHubView';
import { HealthAndHygieneView } from './components/HealthAndHygieneView';
import { IconRenderer } from './components/IconRenderer';
import { HygienelyApp } from './components/hygienely/HygienelyApp';

function MainMusicApp() {
  const { tracks, favorites, playlists, playTrack } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiLyricsOpen, setIsAiLyricsOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistMode, setPlaylistMode] = useState<'addTrack' | 'createPlaylist'>('addTrack');

  // Category Tabs
  const categories = [
    'All',
    'Health & Hygiene',
    'Spotify Station',
    'Marathi Songs',
    'Hindi Songs',
    'Bhakti Music',
    'Lavani Special',
    'Marathi Classics',
    'Hindi Evergreen',
    'Favorites',
    'Playlists',
  ];

  // Filter Tracks logic
  const filteredTracks = tracks.filter((t) => {
    // Search query check
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText =
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.language.toLowerCase().includes(q) ||
        (t.lyrics && t.lyrics.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    // Category Filter
    if (activeCategory === 'Marathi Songs') return t.language === 'Marathi';
    if (activeCategory === 'Hindi Songs') return t.language === 'Hindi';
    if (activeCategory === 'Bhakti Music') return t.isBhaktiGeet || t.category.includes('Devotional');
    if (activeCategory === 'Lavani Special') return t.isLavaniSpecial || t.category === 'Lavani Special';
    if (activeCategory === 'Marathi Classics') return t.language === 'Marathi' && (t.category.includes('Classic') || t.category.includes('Folk'));
    if (activeCategory === 'Hindi Evergreen') return t.language === 'Hindi' && (t.category.includes('Classic') || t.category.includes('Evergreen'));
    if (activeCategory === 'Favorites') return favorites.includes(t.id);

    return true;
  });

  // Category Sub-sections for Home View
  const bhaktiTracks = tracks.filter((t) => t.isBhaktiGeet);
  const lavaniTracks = tracks.filter((t) => t.isLavaniSpecial);
  const marathiTracks = tracks.filter((t) => t.language === 'Marathi' && !t.isBhaktiGeet && !t.isLavaniSpecial);
  const hindiTracks = tracks.filter((t) => t.language === 'Hindi' && !t.isBhaktiGeet);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-amber-500 selection:text-neutral-950 pb-28">
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiLyrics={() => setIsAiLyricsOpen(true)}
        onOpenAddMusic={() => {
          setPlaylistMode('addTrack');
          setIsPlaylistModalOpen(true);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Scheduled Bhakti Banner */}
        <BhaktiScheduleBanner onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Hero Banner with Founder Artwork Style */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-gradient-to-r from-amber-950 via-neutral-900 to-amber-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                <IconRenderer name="Crown" className="w-4 h-4 text-amber-400" />
                <span>FIRST EDITION 2026 • VAIBHAV JADHAV MUSIC</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight leading-tight">
                Marathi & Hindi Music & Bhakti Geet Station
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-serif">
                Experience high-fidelity devotional Abhangs, traditional Lavani hits, Marathi romantic melodies, and timeless Hindi evergreen classics. Features automated 9:00 AM & 7:00 PM Bhakti broadcasts with off-screen background playback.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    if (bhaktiTracks.length > 0) playTrack(bhaktiTracks[0], bhaktiTracks);
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <IconRenderer name="Play" className="w-4 h-4 fill-neutral-950" />
                  <span>Start Morning Bhakti Station</span>
                </button>

                <button
                  onClick={() => {
                    setPlaylistMode('createPlaylist');
                    setIsPlaylistModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
                >
                  <IconRenderer name="ListMusic" className="w-4 h-4" />
                  <span>Create Custom Playlist</span>
                </button>
              </div>
            </div>

            {/* Gold Artwork Crown Portrait */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-amber-400/80 p-1 bg-neutral-950 shadow-2xl shrink-0">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"
                alt="Vaibhav Jadhav Music Edition"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-neutral-950 border border-amber-400 text-[10px] font-black text-amber-300 uppercase tracking-widest font-mono">
                PRODUCER & ARTIST
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 border-amber-300 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/40'
              }`}
            >
              {cat === 'Health & Hygiene'
                ? '🧼 Health & Hygiene'
                : cat === 'Spotify Station'
                ? '🎧 Spotify Station'
                : cat === 'Bhakti Music'
                ? '🕉️ Bhakti Music'
                : cat === 'Lavani Special'
                ? '💃 Lavani Special'
                : cat}
            </button>
          ))}
        </div>

        {/* Conditional Search / Filter Results or Categorized Layout */}
        {activeCategory === 'Health & Hygiene' ? (
          <HygienelyApp />
        ) : activeCategory === 'Spotify Station' ? (
          <SpotifyHubView />
        ) : searchQuery || activeCategory !== 'All' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black font-serif text-white flex items-center gap-2">
                <span>Results for</span>
                <span className="text-amber-400">"{searchQuery || activeCategory}"</span>
                <span className="text-xs text-neutral-500 font-mono">({filteredTracks.length} tracks)</span>
              </h2>
            </div>

            {filteredTracks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTracks.map((track) => (
                  <SongCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-neutral-900/60 rounded-3xl border border-neutral-800 space-y-3">
                <IconRenderer name="Music" className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-300">No tracks match your query</h3>
                <p className="text-xs text-neutral-500">Try searching for Vitthal, Ganpati, Lavani, or Kishore Kumar.</p>
              </div>
            )}
          </div>
        ) : (
          /* Default Categorized Home Showcase */
          <div className="space-y-10">
            {/* SECTION 1: 🕉️ Daily Bhakti & Devotional Music Station */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-widest block">
                    DAILY DEVOTIONAL BROADCAST
                  </span>
                  <h2 className="text-xl font-extrabold text-white font-serif flex items-center gap-2">
                    <span>🕉️ Bhakti Music (Marathi & Hindi)</span>
                  </h2>
                </div>

                <button
                  onClick={() => setActiveCategory('Bhakti Music')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Bhakti</span>
                  <IconRenderer name="ChevronRight" className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {bhaktiTracks.map((track) => (
                  <SongCard key={track.id} track={track} />
                ))}
              </div>
            </div>

            {/* SECTION 2: 💃 Lavani Special Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-pink-400 font-mono tracking-widest block">
                    MAHARASHTRIAN FOLK & DANCE
                  </span>
                  <h2 className="text-xl font-extrabold text-white font-serif flex items-center gap-2">
                    <span>💃 Royal Lavani Special</span>
                  </h2>
                </div>

                <button
                  onClick={() => setActiveCategory('Lavani Special')}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Lavani</span>
                  <IconRenderer name="ChevronRight" className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {lavaniTracks.map((track) => (
                  <SongCard key={track.id} track={track} />
                ))}
              </div>
            </div>

            {/* SECTION 3: ❤️ Marathi Classics & Romantic Songs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-widest block">
                    MELODIOUS HARMONIES
                  </span>
                  <h2 className="text-xl font-extrabold text-white font-serif">
                    ❤️ Marathi Classics & Romantic Melodies
                  </h2>
                </div>

                <button
                  onClick={() => setActiveCategory('Marathi Songs')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Marathi</span>
                  <IconRenderer name="ChevronRight" className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {marathiTracks.map((track) => (
                  <SongCard key={track.id} track={track} layout="horizontal" />
                ))}
              </div>
            </div>

            {/* SECTION 4: 🎶 Hindi Evergreen & Bollywood Hits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-widest block">
                    RETRO GOLD & LATEST HITS
                  </span>
                  <h2 className="text-xl font-extrabold text-white font-serif">
                    🎶 Hindi Evergreen & Bollywood Songs
                  </h2>
                </div>

                <button
                  onClick={() => setActiveCategory('Hindi Songs')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Hindi</span>
                  <IconRenderer name="ChevronRight" className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hindiTracks.map((track) => (
                  <SongCard key={track.id} track={track} layout="horizontal" />
                ))}
              </div>
            </div>

            {/* SECTION 5: 📁 Curated Playlists Hub */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-widest block">
                    CURATED STATIONS
                  </span>
                  <h2 className="text-xl font-extrabold text-white font-serif">
                    📁 Curated Playlists & Stations
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setPlaylistMode('createPlaylist');
                    setIsPlaylistModalOpen(true);
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>+ Create Playlist</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => {
                      const firstTrack = tracks.find((t) => pl.trackIds.includes(t.id));
                      if (firstTrack) {
                        const playlistTracks = tracks.filter((t) => pl.trackIds.includes(t.id));
                        playTrack(firstTrack, playlistTracks);
                      }
                    }}
                    className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 transition-all cursor-pointer group space-y-3"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-800">
                      <img
                        src={pl.coverArtUrl}
                        alt={pl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-neutral-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                          {pl.trackIds.length} Songs
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-white font-serif group-hover:text-amber-300 transition-colors">
                        {pl.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                        {pl.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Bottom Mini Player */}
      <MiniPlayer />

      {/* Full Screen Player Modal */}
      <FullScreenPlayer />

      {/* AI Lyrics & Meaning Modal */}
      <AiLyricsModal
        isOpen={isAiLyricsOpen}
        onClose={() => setIsAiLyricsOpen(false)}
      />

      {/* Add Custom Music & Create Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        mode={playlistMode}
      />

      {/* Settings & Bhakti Schedule Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Spotify Interactive Official Embed Player Modal */}
      <SpotifyEmbedModal />

      {/* Legal & Public Domain License Notice Footer */}
      <footer className="mt-12 py-8 border-t border-amber-500/20 text-center text-xs text-neutral-500 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-serif font-extrabold text-amber-300">VAIBHAV JADHAV MUSIC</span>
            <span>•</span>
            <span className="text-neutral-400">MARATHI & HINDI AUDIO HUB</span>
          </div>
          <p className="text-[11px] text-neutral-400 max-w-2xl mx-auto">
            Authorized streams and royalty-free public domain audio broadcasts. Built with background MediaSession capabilities and Gemini AI lyrics analysis.
          </p>
          <p className="text-[10px] text-neutral-600 font-mono pt-1">
            © 2026 Vaibhav Jadhav Music. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  const [appMode, setAppMode] = useState<'hygienely' | 'music'>('hygienely');

  return (
    <AudioProvider>
      {appMode === 'hygienely' ? (
        <HygienelyApp onSwitchToMusic={() => setAppMode('music')} />
      ) : (
        <div>
          {/* Top Quick-Return Banner */}
          <div className="bg-emerald-600 text-white py-2 px-4 text-xs font-black flex items-center justify-between shadow-lg sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <span className="text-base">🧼</span>
              <span>Hygienely Habit Tracker is Running in Background</span>
            </div>
            <button
              onClick={() => setAppMode('hygienely')}
              className="px-3 py-1 rounded-xl bg-white text-emerald-800 font-extrabold hover:bg-emerald-50 transition shadow-sm"
            >
              Return to Hygienely 🚀
            </button>
          </div>
          <MainMusicApp />
        </div>
      )}
    </AudioProvider>
  );
}

export default App;
