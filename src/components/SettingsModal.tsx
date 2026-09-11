import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { bhaktiSchedule, updateBhaktiSchedule, simulateBhaktiSchedule } = useAudio();

  const [morningTime, setMorningTime] = useState(bhaktiSchedule.morningTime);
  const [eveningTime, setEveningTime] = useState(bhaktiSchedule.eveningTime);
  const [scheduleEnabled, setScheduleEnabled] = useState(bhaktiSchedule.enabled);
  const [autoPlay, setAutoPlay] = useState(bhaktiSchedule.autoPlayOnTime);
  const [notifications, setNotifications] = useState(bhaktiSchedule.notificationsEnabled);
  const [saveMessage, setSaveMessage] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBhaktiSchedule({
      enabled: scheduleEnabled,
      morningTime,
      eveningTime,
      autoPlayOnTime: autoPlay,
      notificationsEnabled: notifications,
    });
    setSaveMessage(true);
    setTimeout(() => {
      setSaveMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border-2 border-amber-500/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative text-white my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <IconRenderer name="Settings" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-serif text-white">
                Music & Bhakti Schedule Settings
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

        {/* Body Content */}
        <form onSubmit={handleSaveSettings} className="p-5 space-y-5 text-xs">
          {/* Section 1: Daily Bhakti Schedule Settings */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <IconRenderer name="Clock" className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-white uppercase tracking-wider text-xs">
                  Automatic Bhakti Schedule
                </h3>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleEnabled}
                  onChange={(e) => setScheduleEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  🌅 Morning Bhakti Time:
                </label>
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  🌆 Evening Bhakti Time:
                </label>
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-neutral-300">Auto-start playback on scheduled time</span>
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-neutral-300">Show visible Bhakti start banner</span>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
              </label>
            </div>

            {/* Quick Test Triggers */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  simulateBhaktiSchedule('morning');
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] cursor-pointer"
              >
                Test 9 AM Morning
              </button>
              <button
                type="button"
                onClick={() => {
                  simulateBhaktiSchedule('evening');
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] cursor-pointer"
              >
                Test 7 PM Evening
              </button>
            </div>
          </div>

          {/* Section 2: Background Audio Playback Info */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <h3 className="font-extrabold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
              <IconRenderer name="Headphones" className="w-4 h-4" />
              <span>Background & Off-Screen Audio Playback</span>
            </h3>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Vaibhav Jadhav Music integrates the native MediaSession API. Your audio continues playing seamlessly when you lock your screen, minimize the browser, or switch apps on Android and Desktop.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-black uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-110"
            >
              Save Schedule Settings
            </button>

            {saveMessage && (
              <span className="text-emerald-400 font-bold text-xs">
                ✓ Settings Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
