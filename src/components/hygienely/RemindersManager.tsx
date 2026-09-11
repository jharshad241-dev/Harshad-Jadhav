import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Volume2,
  Sparkles,
  Edit2,
  Calendar,
  X,
  AlertCircle,
} from 'lucide-react';
import { ReminderItem, HygieneTask } from '../../types/hygienely';
import { HygieneIcon } from './HygieneIcon';
import { soundEffects } from '../../utils/soundEffects';

interface RemindersManagerProps {
  reminders: ReminderItem[];
  tasks: HygieneTask[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (newReminder: Omit<ReminderItem, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
  onSendTestNotification: (title: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const RemindersManager: React.FC<RemindersManagerProps> = ({
  reminders,
  tasks,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  onSendTestNotification,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestBrowserPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const res = await Notification.requestPermission();
      setBrowserPermission(res);
      if (res === 'granted') {
        soundEffects.playTaskComplete();
        onSendTestNotification('Hygienely alerts enabled! Stay fresh & healthy.');
      }
    } catch {
      // Permission prompt ignored or blocked
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    soundEffects.playClick();
    if (selectedDays.includes(dayIndex)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSubmitNewReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchedTask = tasks.find((t) => t.id === selectedTaskId);

    onAddReminder({
      title: newTitle.trim(),
      time: newTime,
      enabled: true,
      days: selectedDays,
      icon: matchedTask ? matchedTask.icon : 'Sparkles',
      sound: 'chime',
      taskId: selectedTaskId || undefined,
    });

    soundEffects.playTaskComplete();
    setIsModalOpen(false);
    setNewTitle('');
    setNewTime('08:00');
    setSelectedTaskId('');
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  return (
    <div id="reminders-manager-container" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Hygiene Reminders & Smart Alerts
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Never miss brushing, handwashing, safe hydration, or timely medications!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Test Alert Button */}
          <button
            id="test-reminder-chime-btn"
            onClick={() => {
              soundEffects.playReminderChime();
              onSendTestNotification('💧 Time for clean safe water! Stay hydrated.');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
            title="Preview alert chime and floating reminder"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Test Alert</span>
          </button>

          {/* Browser Permission button */}
          {browserPermission !== 'granted' && typeof Notification !== 'undefined' && (
            <button
              id="enable-browser-alerts-btn"
              onClick={requestBrowserPermission}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition hover:bg-amber-100"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Enable Browser Alerts</span>
            </button>
          )}

          {/* Add Reminder Button */}
          <button
            id="open-add-reminder-modal-btn"
            onClick={() => {
              soundEffects.playClick();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((rem) => {
          return (
            <motion.div
              key={rem.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between ${
                rem.enabled
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <HygieneIcon name={rem.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {rem.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{rem.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      id={`reminder-toggle-${rem.id}`}
                      checked={rem.enabled}
                      onChange={() => {
                        soundEffects.playClick();
                        onToggleReminder(rem.id);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Days repeated */}
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  {WEEKDAYS.map((day, idx) => {
                    const isDayActive = rem.days.includes(idx);
                    return (
                      <span
                        key={day}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isDayActive
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        {day[0]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer actions */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  {rem.enabled ? '🔔 Alert active' : '🔕 Muted'}
                </span>
                <button
                  id={`delete-reminder-${rem.id}`}
                  onClick={() => {
                    soundEffects.playClick();
                    onDeleteReminder(rem.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition"
                  title="Delete reminder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏰</span>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">
                    Create Hygiene Reminder
                  </h4>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitNewReminder} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wash hands with soap before dinner 🧼"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Linked Task */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Associate with Hygiene Habit (Optional)
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => {
                      setSelectedTaskId(e.target.value);
                      const t = tasks.find((tk) => tk.id === e.target.value);
                      if (t && !newTitle) {
                        setNewTitle(`Time for ${t.name}!`);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Select a habit or custom alert --</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Days */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Repeat on Days
                  </label>
                  <div className="flex items-center gap-1.5">
                    {WEEKDAYS.map((day, idx) => {
                      const isSelected = selectedDays.includes(idx);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleDay(idx)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                            isSelected
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
