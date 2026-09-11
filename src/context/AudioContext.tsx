import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, BhaktiScheduleConfig, EqualizerPreset } from '../types';
import { TRACKS_DATA, INITIAL_PLAYLISTS, INITIAL_BHAKTI_SCHEDULE } from '../data/musicData';

interface AudioContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
  favorites: string[];
  playlists: Playlist[];
  bhaktiSchedule: BhaktiScheduleConfig;
  equalizerPreset: EqualizerPreset;
  isFullScreenPlayerOpen: boolean;
  scheduleNotification: { visible: boolean; text: string; slot?: string } | null;
  isSpotifyPlayerOpen: boolean;
  spotifyActiveEmbedUrl: string | null;

  // Actions
  playTrack: (track: Track, customQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  toggleFavorite: (trackId: string) => void;
  setFullScreenPlayerOpen: (open: boolean) => void;
  updateBhaktiSchedule: (newSchedule: Partial<BhaktiScheduleConfig>) => void;
  setEqualizerPreset: (preset: EqualizerPreset) => void;
  simulateBhaktiSchedule: (slot: 'morning' | 'evening') => void;
  dismissScheduleNotification: () => void;
  addCustomTrack: (newTrack: Track) => void;
  createCustomPlaylist: (name: string, description: string, trackIds: string[]) => void;
  openSpotifyPlayer: (spotifyUrlOrId?: string) => void;
  closeSpotifyPlayer: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(TRACKS_DATA);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(285);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [queue, setQueue] = useState<Track[]>(TRACKS_DATA);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(['m-bhakti-1', 'lavani-1', 'h-bhakti-1']);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [bhaktiSchedule, setBhaktiSchedule] = useState<BhaktiScheduleConfig>(INITIAL_BHAKTI_SCHEDULE);
  const [equalizerPreset, setEqualizerPreset] = useState<EqualizerPreset>('Devotional Pure');
  const [isFullScreenPlayerOpen, setFullScreenPlayerOpen] = useState<boolean>(false);
  const [scheduleNotification, setScheduleNotification] = useState<{
    visible: boolean;
    text: string;
    slot?: string;
  } | null>(null);

  // Spotify Player State
  const [isSpotifyPlayerOpen, setIsSpotifyPlayerOpen] = useState<boolean>(false);
  const [spotifyActiveEmbedUrl, setSpotifyActiveEmbedUrl] = useState<string | null>(null);

  const openSpotifyPlayer = (spotifyUrlOrId?: string) => {
    if (spotifyUrlOrId) {
      const match = spotifyUrlOrId.match(/(?:track\/|track:)([a-zA-Z0-9]{22})/);
      const id = match ? match[1] : (/^[a-zA-Z0-9]{22}$/.test(spotifyUrlOrId.trim()) ? spotifyUrlOrId.trim() : null);
      if (id) {
        setSpotifyActiveEmbedUrl(`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`);
      } else {
        setSpotifyActiveEmbedUrl(spotifyUrlOrId);
      }
    } else if (currentTrack?.spotifyId) {
      setSpotifyActiveEmbedUrl(`https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`);
    } else {
      setSpotifyActiveEmbedUrl('https://open.spotify.com/embed/track/303I22R7lR1A1XN9N8Ue5q?utm_source=generator&theme=0');
    }
    setIsSpotifyPlayerOpen(true);
  };

  const closeSpotifyPlayer = () => {
    setIsSpotifyPlayerOpen(false);
  };

  // HTML5 Audio & Web Audio Synth Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthOscsRef = useRef<OscillatorNode[]>([]);
  const synthGainRef = useRef<GainNode | null>(null);
  const isUsingSynthRef = useRef<boolean>(false);

  // Web Audio Synthesizer Fallback (Tanpura, Harmonium & Devotional Harmonies)
  const startSynthAudio = (category?: string) => {
    try {
      if (!synthCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          synthCtxRef.current = new AudioCtx();
        }
      }
      const ctx = synthCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop any existing synth notes
      stopSynthAudio();

      const masterGain = ctx.createGain();
      const effVol = isMuted ? 0 : volume * 0.18;
      masterGain.gain.setValueAtTime(effVol, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthGainRef.current = masterGain;

      // Select frequency scales based on category
      let frequencies = [130.81, 196.00, 261.63, 329.63]; // C Major Tanpura
      if (category?.includes('Lavani')) {
        frequencies = [146.83, 220.00, 293.66, 369.99]; // D Major rhythmic scale
      } else if (category?.includes('Devotional') || category?.includes('Bhakti')) {
        frequencies = [130.81, 164.81, 196.00, 261.63]; // Raag Bhairav / Tanpura
      } else if (category?.includes('Romantic') || category?.includes('Classic')) {
        frequencies = [164.81, 220.00, 246.94, 329.63]; // E Minor harmonic acoustic scale
      }

      const oscs: OscillatorNode[] = [];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const subGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle LFO modulation for warm chorus effect
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.08, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.8, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        subGain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(subGain);
        subGain.connect(masterGain);
        osc.start();

        oscs.push(osc);
      });

      synthOscsRef.current = oscs;
      isUsingSynthRef.current = true;
    } catch (e) {
      console.warn('Synth start warning:', e);
    }
  };

  const stopSynthAudio = () => {
    try {
      synthOscsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      synthOscsRef.current = [];
      isUsingSynthRef.current = false;
    } catch (e) {
      console.warn('Synth stop warning:', e);
    }
  };

  // Initialize HTML5 Audio once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = () => {
      console.warn('Audio stream error, engaging Web Audio synth fallback');
      if (isPlaying && currentTrack) {
        startSynthAudio(currentTrack.category);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      stopSynthAudio();
    };
  }, []);

  // Update MediaSession & Audio Source when track changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    audioRef.current.src = currentTrack.audioUrl;
    setPlaybackTime(0);
    setDuration(currentTrack.durationSeconds || 285);

    if (isPlaying) {
      audioRef.current.play().then(() => {
        stopSynthAudio();
      }).catch((err) => {
        console.warn('Autoplay prevented or stream error, using synth:', err);
        startSynthAudio(currentTrack.category);
      });
    }

    // MediaSession API for background playback & lock screen
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: `${currentTrack.artist} • Vaibhav Jadhav Music`,
          album: currentTrack.album || `${currentTrack.language} ${currentTrack.category}`,
          artwork: [
            { src: currentTrack.coverArtUrl, sizes: '512x512', type: 'image/jpeg' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          setIsPlaying(true);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          setIsPlaying(false);
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
          handlePreviousTrack();
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          handleNextTrack();
        });

        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) {
            seekTo(details.seekTime);
          }
        });
      } catch (err) {
        console.warn('MediaSession API warning:', err);
      }
    }
  }, [currentTrack]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.play().then(() => {
        stopSynthAudio();
      }).catch((e) => {
        console.warn('Audio play request failed, launching synth:', e);
        startSynthAudio(currentTrack.category);
      });
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    } else {
      audioRef.current.pause();
      stopSynthAudio();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    }
  }, [isPlaying]);

  // Active Playback Progress Ticker (Smooth timer for HTML5 + Synth Audio)
  useEffect(() => {
    let timer: any = null;

    if (isPlaying) {
      timer = setInterval(() => {
        const audio = audioRef.current;
        if (audio && !audio.paused && !isNaN(audio.currentTime) && audio.currentTime > 0) {
          setPlaybackTime(audio.currentTime);
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            setDuration(audio.duration);
          }
        } else {
          // Advance timer smoothly for synth or buffering streams
          setPlaybackTime((prev) => {
            const next = prev + 0.25;
            if (next >= duration) {
              handleNextTrack();
              return 0;
            }
            return next;
          });
        }
      }, 250);
    } else {
      stopSynthAudio();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, duration, currentTrack]);

  // Sync volume & mute across HTML5 audio & Synth
  useEffect(() => {
    const effVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effVol;
    }
    if (synthGainRef.current && synthCtxRef.current) {
      synthGainRef.current.gain.setValueAtTime(effVol * 0.18, synthCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Automatic Bhakti Schedule Checker (Triggers 9 AM & 7 PM Bhakti Songs)
  useEffect(() => {
    if (!bhaktiSchedule.enabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Morning 9 AM check (09:00)
      if (currentHours === 9 && currentMinutes === 0 && bhaktiSchedule.lastTriggeredSlot !== 'morning') {
        triggerScheduleSlot('morning');
      }

      // Evening 7 PM check (19:00)
      if (currentHours === 19 && currentMinutes === 0 && bhaktiSchedule.lastTriggeredSlot !== 'evening') {
        triggerScheduleSlot('evening');
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [bhaktiSchedule]);

  const triggerScheduleSlot = (slot: 'morning' | 'evening') => {
    const isMorning = slot === 'morning';
    const playlistId = isMorning ? bhaktiSchedule.morningPlaylistId : bhaktiSchedule.eveningPlaylistId;
    const targetPlaylist = playlists.find((p) => p.id === playlistId);

    const timeLabel = isMorning ? '9:00 AM' : '7:00 PM';
    const textLabel = isMorning
      ? `🕉️ 9 AM Bhakti Time – Morning Marathi & Hindi Bhakti Geet is starting now.`
      : `🕉️ 7 PM Bhakti Time – Marathi Bhakti Geet & Abhang is starting now.`;

    setScheduleNotification({
      visible: true,
      text: textLabel,
      slot: slot,
    });

    if (targetPlaylist && targetPlaylist.trackIds.length > 0) {
      const firstTrack = tracks.find((t) => t.id === targetPlaylist.trackIds[0]);
      if (firstTrack) {
        const playlistTracks = tracks.filter((t) => targetPlaylist.trackIds.includes(t.id));
        playTrack(firstTrack, playlistTracks);
      }
    }

    setBhaktiSchedule((prev) => ({
      ...prev,
      lastTriggeredSlot: slot,
    }));
  };

  const simulateBhaktiSchedule = (slot: 'morning' | 'evening') => {
    triggerScheduleSlot(slot);
  };

  const dismissScheduleNotification = () => {
    setScheduleNotification(null);
  };

  // Play a track
  const playTrack = (track: Track, customQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    if (customQueue && customQueue.length > 0) {
      setQueue(customQueue);
      const idx = customQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        setQueueIndex(idx);
      } else {
        setQueue([track, ...queue]);
        setQueueIndex(0);
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setQueueIndex(randomIndex);
      setCurrentTrack(queue[randomIndex]);
    } else {
      const nextIdx = (queueIndex + 1) % queue.length;
      setQueueIndex(nextIdx);
      setCurrentTrack(queue[nextIdx]);
    }
    setIsPlaying(true);
  };

  const handlePreviousTrack = () => {
    if (playbackTime > 4 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setPlaybackTime(0);
      return;
    }

    if (queue.length === 0) return;

    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setIsPlaying(true);
  };

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setPlaybackTime(seconds);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const updateBhaktiSchedule = (newSchedule: Partial<BhaktiScheduleConfig>) => {
    setBhaktiSchedule((prev) => ({ ...prev, ...newSchedule }));
  };

  const addCustomTrack = (newTrack: Track) => {
    setTracks((prev) => [newTrack, ...prev]);
    playTrack(newTrack);
  };

  const createCustomPlaylist = (name: string, description: string, trackIds: string[]) => {
    const created: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      description,
      coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      trackIds,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setPlaylists((prev) => [...prev, created]);
  };

  return (
    <AudioContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        playbackTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        favorites,
        playlists,
        bhaktiSchedule,
        equalizerPreset,
        isFullScreenPlayerOpen,
        scheduleNotification,
        isSpotifyPlayerOpen,
        spotifyActiveEmbedUrl,
        playTrack,
        togglePlay,
        nextTrack: handleNextTrack,
        previousTrack: handlePreviousTrack,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        toggleFavorite,
        setFullScreenPlayerOpen,
        updateBhaktiSchedule,
        setEqualizerPreset,
        simulateBhaktiSchedule,
        dismissScheduleNotification,
        addCustomTrack,
        createCustomPlaylist,
        openSpotifyPlayer,
        closeSpotifyPlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
