import React, { useState, useEffect, useCallback } from 'react';
import { IconRenderer } from './IconRenderer';
import { HygieneReminder, HygieneNotificationConfig, HygieneNotificationLog } from '../types';
import { DEFAULT_HYGIENE_REMINDERS } from '../data/hygieneData';
import { playHygieneSound } from '../utils/hygieneSounds';

const STORAGE_KEY_CONFIG = 'hygiene_notification_config';
const STORAGE_KEY_LOGS = 'hygiene_notification_logs';
const STORAGE_KEY_POINTS = 'hygiene_total_points';

const DEFAULT_CONFIG: HygieneNotificationConfig = {
  enabled: true,
  intervalMinutes: 45,
  soundEnabled: true,
  browserPushEnabled: false,
  selectedReminders: DEFAULT_HYGIENE_REMINDERS.map((r) => r.id),
};

interface HygieneNotificationManagerProps {
  onNotify?: (reminder: HygieneReminder) => void;
  onPointsEarned?: (pts: number) => void;
}

export const HygieneNotificationManager: React.FC<HygieneNotificationManagerProps> = ({
  onNotify,
  onPointsEarned,
}) => {
  const [config, setConfig] = useState<HygieneNotificationConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [logs, setLogs] = useState<HygieneNotificationLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [totalPoints, setTotalPoints] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY_POINTS) || '150', 10);
    } catch {
      return 150;
    }
  });

  const [nextAlertSeconds, setNextAlertSeconds] = useState<number>(config.intervalMinutes * 60);
  const [browserPermission, setBrowserPermission] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);

  // Save config on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {}
  }, [config]);

  // Save logs on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 30)));
    } catch {}
  }, [logs]);

  // Save points on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POINTS, totalPoints.toString());
    } catch {}
  }, [totalPoints]);

  // Fire a Notification
  const triggerNotification = useCallback((reminder: HygieneReminder) => {
    if (config.soundEnabled) {
      playHygieneSound('alert');
    }

    // Add to logs
    const newLog: HygieneNotificationLog = {
      id: `log-${Date.now()}`,
      reminderId: reminder.id,
      title: reminder.title,
      description: reminder.description,
      icon: reminder.icon,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: false,
    };
    setLogs((prev) => [newLog, ...prev]);

    // Native Browser Notification
    if (config.browserPushEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`💧 Health & Hygiene Alert: ${reminder.title}`, {
          body: reminder.description,
          icon: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=128&auto=format&fit=crop&q=80',
        });
      } catch {}
    }

    if (onNotify) {
      onNotify(reminder);
    }
  }, [config.browserPushEnabled, config.soundEnabled, onNotify]);

  // Interval timer for scheduled reminders
  useEffect(() => {
    if (!config.enabled) return;

    const timer = setInterval(() => {
      setNextAlertSeconds((prev) => {
        if (prev <= 1) {
          // Choose an active reminder
          const activeReminders = DEFAULT_HYGIENE_REMINDERS.filter((r) =>
            config.selectedReminders.includes(r.id)
          );
          if (activeReminders.length > 0) {
            const randomPick = activeReminders[Math.floor(Math.random() * activeReminders.length)];
            triggerNotification(randomPick);
          }
          return config.intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config.enabled, config.intervalMinutes, config.selectedReminders, triggerNotification]);

  // Request native browser permission
  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setBrowserPermission(permission);
        if (permission === 'granted') {
          setConfig((c) => ({ ...c, browserPushEnabled: true }));
          playHygieneSound('success');
        }
      } catch {}
    }
  };

  // Test Notification Now
  const handleTestNotification = () => {
    const randomPick = DEFAULT_HYGIENE_REMINDERS[Math.floor(Math.random() * DEFAULT_HYGIENE_REMINDERS.length)];
    triggerNotification(randomPick);
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  // Toggle specific reminder ID
  const toggleReminderItem = (id: string) => {
    setConfig((prev) => {
      const exists = prev.selectedReminders.includes(id);
      const updated = exists
        ? prev.selectedReminders.filter((r) => r !== id)
        : [...prev.selectedReminders, id];
      return { ...prev, selectedReminders: updated };
    });
  };

  // Mark a log as completed
  const handleCompleteLog = (logId: string, pts: number) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, completed: true } : l))
    );
    setTotalPoints((p) => p + pts);
    if (onPointsEarned) onPointsEarned(pts);
    playHygieneSound('success');
  };

  const minutesRemaining = Math.floor(nextAlertSeconds / 60);
  const secondsRemaining = nextAlertSeconds % 60;

  return (
    <div className="space-y-6">
      {/* Top Banner Status Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-neutral-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SMART HYGIENE AUTOMATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-white">
              Daily Health & Hygiene Notifications
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Automated reminders for hydration, hand sanitization, UV sunscreen protection, scalp massage, and digital eye fatigue resets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTestNotification}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer transform hover:scale-105"
            >
              <IconRenderer name="Bell" className="w-4 h-4" />
              <span>{testNotificationSent ? 'Sent Chime! ✓' : 'Send Test Alert'}</span>
            </button>

            <button
              onClick={() => setConfig((c) => ({ ...c, enabled: !c.enabled }))}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                config.enabled
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
              <span>{config.enabled ? 'Alerts: ACTIVE' : 'Alerts: PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800/80">
          <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              NEXT NOTIFICATION
            </span>
            <span className="text-lg font-black font-mono text-emerald-400">
              {config.enabled ? `${minutesRemaining}m ${secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}s` : 'Paused'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              REMINDER FREQUENCY
            </span>
            <span className="text-lg font-black font-mono text-amber-300">
              Every {config.intervalMinutes}m
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              HYGIENE POINTS
            </span>
            <span className="text-lg font-black font-mono text-cyan-300">
              ✨ {totalPoints} pts
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              BROWSER PERMISSION
            </span>
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mt-1">
              {browserPermission === 'granted' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <IconRenderer name="Check" className="w-3.5 h-3.5" /> Allowed
                </span>
              ) : (
                <button
                  onClick={requestBrowserPermission}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  Enable Native ↗
                </button>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Control Center & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interval & Preference Settings */}
        <div className="lg:col-span-1 rounded-3xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
          <h3 className="text-sm font-extrabold font-serif text-white flex items-center gap-2">
            <IconRenderer name="Sliders" className="w-4 h-4 text-emerald-400" />
            <span>Notification Settings</span>
          </h3>

          {/* Interval Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 block">
              Reminder Interval
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setConfig((c) => ({ ...c, intervalMinutes: mins }));
                    setNextAlertSeconds(mins * 60);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    config.intervalMinutes === mins
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div>
              <span className="text-xs font-bold text-white block">Audio Chime</span>
              <span className="text-[10px] text-neutral-500">Play harmonious bell on alert</span>
            </div>
            <button
              onClick={() => setConfig((c) => ({ ...c, soundEnabled: !c.soundEnabled }))}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                config.soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              <IconRenderer name={config.soundEnabled ? 'Volume2' : 'VolumeX'} className="w-4 h-4" />
            </button>
          </div>

          {/* Browser Notification Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div>
              <span className="text-xs font-bold text-white block">Push Notifications</span>
              <span className="text-[10px] text-neutral-500">Notify when browser tab is inactive</span>
            </div>
            <button
              onClick={() => {
                if (browserPermission !== 'granted') {
                  requestBrowserPermission();
                } else {
                  setConfig((c) => ({ ...c, browserPushEnabled: !c.browserPushEnabled }));
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                config.browserPushEnabled && browserPermission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              {config.browserPushEnabled && browserPermission === 'granted' ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Customizable Reminders Selector List */}
        <div className="lg:col-span-2 rounded-3xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold font-serif text-white flex items-center gap-2">
              <IconRenderer name="ListChecks" className="w-4 h-4 text-emerald-400" />
              <span>Active Hygiene Routines ({config.selectedReminders.length}/{DEFAULT_HYGIENE_REMINDERS.length})</span>
            </h3>

            <button
              onClick={() =>
                setConfig((c) => ({
                  ...c,
                  selectedReminders:
                    c.selectedReminders.length === DEFAULT_HYGIENE_REMINDERS.length
                      ? [DEFAULT_HYGIENE_REMINDERS[0].id]
                      : DEFAULT_HYGIENE_REMINDERS.map((r) => r.id),
                }))
              }
              className="text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
            >
              {config.selectedReminders.length === DEFAULT_HYGIENE_REMINDERS.length ? 'Select Minimal' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_HYGIENE_REMINDERS.map((reminder) => {
              const isSelected = config.selectedReminders.includes(reminder.id);
              return (
                <div
                  key={reminder.id}
                  onClick={() => toggleReminderItem(reminder.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-neutral-950 border-emerald-500/50 shadow-md'
                      : 'bg-neutral-950/50 border-neutral-800/80 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                    }`}
                  >
                    <IconRenderer name={reminder.icon} className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                        {reminder.title}
                      </h4>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold shrink-0">
                        +{reminder.points}pt
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                      {reminder.description}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-900 text-[10px] text-neutral-500 font-mono">
                      <span>{reminder.recommendedInterval}</span>
                      <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>
                        {isSelected ? 'Enabled ✓' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notification Activity History & Action Log */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold font-serif text-white flex items-center gap-2">
              <IconRenderer name="Clock" className="w-4 h-4 text-emerald-400" />
              <span>Recent Health Reminders & Completed Actions</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Mark tasks completed to log your daily hygiene score and earn badges
            </p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="text-xs text-neutral-500 hover:text-neutral-300 font-mono"
            >
              Clear Log
            </button>
          )}
        </div>

        {logs.length > 0 ? (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <IconRenderer name={log.icon || 'Bell'} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{log.title}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{log.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {log.completed ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <IconRenderer name="Check" className="w-3 h-3" />
                      Done (+30)
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteLog(log.id, 30)}
                      className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-300 border border-neutral-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Mark Done</span>
                      <IconRenderer name="Check" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-neutral-950/60 border border-neutral-850 space-y-2">
            <IconRenderer name="BellOff" className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400">No recent notifications logged yet.</p>
            <p className="text-[11px] text-neutral-500">
              Click <span className="text-emerald-400 font-bold">"Send Test Alert"</span> above or wait for your scheduled reminder to fire!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
