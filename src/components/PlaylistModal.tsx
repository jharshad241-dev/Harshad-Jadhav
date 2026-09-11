import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';
import { MusicLanguage, MusicCategory, Track } from '../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'addTrack' | 'createPlaylist';
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, mode }) => {
  const { addCustomTrack, createCustomPlaylist, tracks } = useAudio();

  // Add Track State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [language, setLanguage] = useState<MusicLanguage>('Marathi');
  const [category, setCategory] = useState<MusicCategory>('Marathi Devotional');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverArtUrl, setCoverArtUrl] = useState('');
  const [isBhakti, setIsBhakti] = useState(false);
  const [isLavani, setIsLavani] = useState(false);

  // Create Playlist State
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    const created: Track = {
      id: `custom-${Date.now()}`,
      title,
      artist,
      language,
      category,
      durationSeconds: 240,
      coverArtUrl: coverArtUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      audioUrl: audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-piano-111520.mp3',
      isBhaktiGeet: isBhakti,
      isLavaniSpecial: isLavani,
    };

    addCustomTrack(created);
    onClose();
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName) return;

    createCustomPlaylist(playlistName, playlistDesc, selectedTrackIds);
    onClose();
  };

  const toggleTrackSelect = (id: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border-2 border-amber-500/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative text-white my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <IconRenderer name={mode === 'addTrack' ? 'PlusCircle' : 'ListMusic'} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-serif text-white">
                {mode === 'addTrack' ? 'Add Custom Song Stream' : 'Create Personal Playlist'}
              </h2>
              <p className="text-[10px] text-amber-400 font-mono">
                Vaibhav Jadhav Music Station
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <IconRenderer name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          {mode === 'addTrack' ? (
            <form onSubmit={handleAddTrack} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Song Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tukaram Abhang / New Lavani Hit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Singer / Artist Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Wadkar / Lata Mangeshkar"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Marathi">Marathi</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Marathi Devotional">Marathi Devotional</option>
                    <option value="Lavani Special">Lavani Special</option>
                    <option value="Marathi Classics">Marathi Classics</option>
                    <option value="Hindi Devotional">Hindi Devotional</option>
                    <option value="Old Hindi Classics">Old Hindi Classics</option>
                    <option value="Latest Hindi">Latest Hindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Audio MP3 Stream URL:</label>
                <input
                  type="text"
                  placeholder="https://example.com/song.mp3 (leave empty for sample)"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-amber-300 font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Cover Art Image URL:</label>
                <input
                  type="text"
                  placeholder="https://example.com/cover.jpg"
                  value={coverArtUrl}
                  onChange={(e) => setCoverArtUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-300 font-mono text-[11px] outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={isBhakti}
                    onChange={(e) => setIsBhakti(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span>🕉️ Bhakti Geet</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-pink-400">
                  <input
                    type="checkbox"
                    checked={isLavani}
                    onChange={(e) => setIsLavani(e.target.checked)}
                    className="accent-pink-500 w-4 h-4 rounded"
                  />
                  <span>💃 Lavani Special</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 font-black uppercase tracking-wider cursor-pointer"
              >
                Add Song to Music Station
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreatePlaylist} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Playlist Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Morning Bhakti Favorites"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description:</label>
                <input
                  type="text"
                  placeholder="e.g. Handpicked Marathi & Hindi songs"
                  value={playlistDesc}
                  onChange={(e) => setPlaylistDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Select Songs:</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-neutral-800 rounded-xl p-2 bg-neutral-950">
                  {tracks.map((t) => {
                    const isSelected = selectedTrackIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTrackSelect(t.id)}
                        className={`p-2 rounded-lg flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                        }`}
                      >
                        <span className="truncate">{t.title} - {t.artist}</span>
                        {isSelected && <span>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 font-black uppercase tracking-wider cursor-pointer"
              >
                Create Playlist
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
