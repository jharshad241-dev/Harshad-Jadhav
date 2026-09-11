import React from 'react';
import { IconRenderer } from './IconRenderer';
import { useAudio } from '../context/AudioContext';

interface BhaktiScheduleBannerProps {
  onOpenSettings: () => void;
}

export const BhaktiScheduleBanner: React.FC<BhaktiScheduleBannerProps> = ({ onOpenSettings }) => {
  const { scheduleNotification, dismissScheduleNotification, simulateBhaktiSchedule, bhaktiSchedule } = useAudio();

  return (
    <div className="space-y-3">
      {/* Active Triggered Notification Card */}
      {scheduleNotification && scheduleNotification.visible && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-neutral-900 to-amber-950 border-2 border-amber-400/80 p-4 shadow-2xl shadow-amber-500/20 text-white animate-fadeIn">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shrink-0 flex items-center justify-center text-neutral-950">
                <IconRenderer name="Flame" className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase font-mono">
                    SCHEDULED BHAKTI BROADCAST
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">Live Sync</span>
                </div>
                <h3 className="text-sm font-black text-amber-200 mt-1 font-serif">
                  {scheduleNotification.text}
                </h3>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Automated Vaibhav Jadhav Music devotional station streaming for your peace and spiritual well-being.
                </p>
              </div>
            </div>

            <button
              onClick={dismissScheduleNotification}
              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
            >
              <IconRenderer name="X" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Permanently visible Bhakti Schedule Controller Banner */}
      <div className="p-4 rounded-3xl bg-neutral-900/80 border border-amber-500/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <IconRenderer name="Clock" className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold font-serif text-white">
                Daily Automatic Bhakti Geet Schedule
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                bhaktiSchedule.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {bhaktiSchedule.enabled ? 'SCHEDULE ACTIVE' : 'SCHEDULE OFF'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              🌅 9:00 AM Morning Bhakti Geet &nbsp;•&nbsp; 🌆 7:00 PM Evening Marathi Abhang & Aarti
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => simulateBhaktiSchedule('morning')}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <span>🌅 Test 9 AM</span>
          </button>

          <button
            onClick={() => simulateBhaktiSchedule('evening')}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <span>🌆 Test 7 PM</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition-all"
            title="Configure Times & Toggle"
          >
            <IconRenderer name="Sliders" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
