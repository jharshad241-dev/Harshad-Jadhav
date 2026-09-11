import React, { useState, useEffect } from 'react';
import { IconRenderer } from './IconRenderer';
import { HygieneGame } from './HygieneGame';
import { HygieneNotificationManager } from './HygieneNotificationManager';
import { HairSkinAdvisor } from './HairSkinAdvisor';
import { HygieneReminder } from '../types';
import { playHygieneSound } from '../utils/hygieneSounds';

export const HealthAndHygieneView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'game' | 'notifications' | 'advisor' | 'checklist'>('game');
  const [hygienePoints, setHygienePoints] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('hygiene_total_points') || '350', 10);
    } catch {
      return 350;
    }
  });

  // Active Toast Notification Banner
  const [activeToast, setActiveToast] = useState<{
    visible: boolean;
    reminder: HygieneReminder | null;
  }>({ visible: false, reminder: null });

  // Daily Checklist State
  const [dailyChecklist, setDailyChecklist] = useState<
    { id: string; label: string; sub: string; icon: string; points: number; done: boolean }[]
  >(() => {
    const defaultList = [
      {
        id: 'chk-1',
        label: 'Morning 20s Hand & Face Cleanse',
        sub: 'Lukewarm water with gentle cleanser to remove overnight sebum',
        icon: 'Sparkles',
        points: 40,
        done: true,
      },
      {
        id: 'chk-2',
        label: 'Drink 1 Glass Fresh Water (Hydration Target)',
        sub: 'Promotes skin elasticity and cellular nutrient flow',
        icon: 'Droplets',
        points: 30,
        done: true,
      },
      {
        id: 'chk-3',
        label: 'Apply Broad-Spectrum SPF 30+ Sunscreen',
        sub: 'Essential daytime barrier against UV oxidation & hyperpigmentation',
        icon: 'Sun',
        points: 50,
        done: false,
      },
      {
        id: 'chk-4',
        label: '2-Minute Scalp Micro-Circulation Massage',
        sub: 'Fingertip circular kneading to nourish hair roots',
        icon: 'HeartPulse',
        points: 40,
        done: false,
      },
      {
        id: 'chk-5',
        label: 'Sanitize Phone Screen & Personal Device',
        sub: 'Screens harbor more bacteria than public surfaces; clean with 70% IPA wipe',
        icon: 'Smartphone',
        points: 35,
        done: false,
      },
      {
        id: 'chk-6',
        label: '20-20-20 Screen Rest & Neck Stretch',
        sub: 'Relieve digital eye fatigue and cervical posture tension',
        icon: 'Eye',
        points: 25,
        done: false,
      },
      {
        id: 'chk-7',
        label: 'Night Face Wash & Scalp/Beard Elixir',
        sub: 'Deep detox before sleep; apply 3 drops of nourishing oil',
        icon: 'Moon',
        points: 50,
        done: false,
      },
    ];

    try {
      const saved = localStorage.getItem('hygiene_daily_checklist');
      return saved ? JSON.parse(saved) : defaultList;
    } catch {
      return defaultList;
    }
  });

  // Save checklist
  useEffect(() => {
    try {
      localStorage.setItem('hygiene_daily_checklist', JSON.stringify(dailyChecklist));
    } catch {}
  }, [dailyChecklist]);

  // Save points
  useEffect(() => {
    try {
      localStorage.setItem('hygiene_total_points', hygienePoints.toString());
    } catch {}
  }, [hygienePoints]);

  const handleScoreEarned = (earned: number) => {
    setHygienePoints((prev) => prev + earned);
  };

  const handleNotificationFired = (reminder: HygieneReminder) => {
    setActiveToast({ visible: true, reminder });
  };

  const handleDismissToast = () => {
    setActiveToast({ visible: false, reminder: null });
  };

  const handleCompleteToastReminder = () => {
    if (activeToast.reminder) {
      setHygienePoints((prev) => prev + activeToast.reminder!.points);
      playHygieneSound('success');
    }
    setActiveToast({ visible: false, reminder: null });
  };

  const toggleChecklistItem = (id: string, points: number) => {
    setDailyChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newDone = !item.done;
          if (newDone) {
            setHygienePoints((p) => p + points);
            playHygieneSound('pop');
          }
          return { ...item, done: newDone };
        }
        return item;
      })
    );
  };

  const completedCount = dailyChecklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / dailyChecklist.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Active In-App Toast Notification Banner */}
      {activeToast.visible && activeToast.reminder && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full animate-bounce-short">
          <div className="rounded-3xl bg-neutral-950 border-2 border-emerald-400 p-4 shadow-2xl shadow-emerald-500/30 text-white flex items-start justify-between gap-3 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <IconRenderer name={activeToast.reminder.icon || 'Bell'} className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase border border-emerald-500/30">
                  Hygiene Alert
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Just Now</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                {activeToast.reminder.title}
              </h4>
              <p className="text-[11px] text-neutral-300 leading-snug">
                {activeToast.reminder.description}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCompleteToastReminder}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <IconRenderer name="Check" className="w-3.5 h-3.5" />
                  <span>Done (+{activeToast.reminder.points} pts)</span>
                </button>
                <button
                  onClick={handleDismissToast}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Snooze
                </button>
              </div>
            </div>

            <button
              onClick={handleDismissToast}
              className="text-neutral-500 hover:text-white p-1"
            >
              <IconRenderer name="X" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-neutral-950 to-teal-950 border border-emerald-500/40 p-6 md:p-8 shadow-2xl shadow-emerald-950/40">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
              <IconRenderer name="ShieldCheck" className="w-4 h-4 text-emerald-400" />
              <span>VAIBHAV JADHAV HEALTH & HYGIENE SUITE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-white tracking-tight">
              Health, Hygiene, Game & Smart Alerts
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Maintain pristine grooming, clean skin barrier, and scalp micro-circulation. Play the interactive <span className="text-emerald-300 font-bold">Germ Buster Rush Game</span>, test your hygiene knowledge, and receive automated <span className="text-emerald-300 font-bold">scheduled notifications</span> for hydration, hand sanitizing, and sunscreen protection.
            </p>
          </div>

          {/* Hygiene Score Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-emerald-500/40 text-center shrink-0 shadow-xl space-y-1 min-w-[200px]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              HYGIENE LEVEL
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white flex items-center justify-center gap-1.5">
              <span>✨</span>
              <span>{hygienePoints}</span>
              <span className="text-xs text-neutral-400 font-normal">pts</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              {hygienePoints >= 1000 ? '👑 Sanitization Master' : hygienePoints >= 500 ? '🌟 Clean Champion' : '🛡️ Hygiene Guardian'}
            </span>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-neutral-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'game'
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-emerald-500/40'
            }`}
          >
            <IconRenderer name="Gamepad2" className="w-4 h-4" />
            <span>🎮 Hygiene Game & Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'notifications'
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-emerald-500/40'
            }`}
          >
            <IconRenderer name="Bell" className="w-4 h-4" />
            <span>🔔 Hygiene Notifications & Timers</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'checklist'
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-emerald-500/40'
            }`}
          >
            <IconRenderer name="CheckSquare" className="w-4 h-4" />
            <span>📋 Daily Hygiene Checklist ({completedCount}/{dailyChecklist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'advisor'
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-emerald-500/40'
            }`}
          >
            <IconRenderer name="HeartPulse" className="w-4 h-4" />
            <span>🧴 Hair & Skin Care Advisor</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: HYGIENE GAME & QUIZ ================= */}
      {activeTab === 'game' && (
        <HygieneGame onScoreEarned={handleScoreEarned} />
      )}

      {/* ================= TAB 2: HYGIENE NOTIFICATIONS & ALERTS ================= */}
      {activeTab === 'notifications' && (
        <HygieneNotificationManager
          onNotify={handleNotificationFired}
          onPointsEarned={handleScoreEarned}
        />
      )}

      {/* ================= TAB 3: DAILY HYGIENE CHECKLIST ================= */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold font-serif text-white flex items-center gap-2">
                  <IconRenderer name="CheckSquare" className="w-5 h-5 text-emerald-400" />
                  <span>Daily Hygiene & Wellness Checklist</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Check off daily rituals to lock in healthy habits and boost your hygiene score
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {completedCount} of {dailyChecklist.length} Done ({progressPercent}%)
                  </span>
                  <div className="w-36 h-2 rounded-full bg-neutral-800 overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {dailyChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id, item.points)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    item.done
                      ? 'bg-emerald-950/25 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                      item.done
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                    }`}
                  >
                    {item.done ? (
                      <IconRenderer name="Check" className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <IconRenderer name={item.icon || 'Circle'} className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate ${
                          item.done ? 'text-emerald-300 line-through opacity-80' : 'text-white'
                        }`}
                      >
                        {item.label}
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                        +{item.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {completedCount === dailyChecklist.length && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/50 text-center animate-fade-in space-y-1">
                <span className="text-xl">🎉</span>
                <h4 className="text-sm font-black font-serif text-white">
                  All Daily Hygiene Goals Completed!
                </h4>
                <p className="text-xs text-neutral-300">
                  Your skin barrier, scalp, and hand sanitization rituals are 100% safeguarded today.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: HAIR & SKIN ADVISOR ================= */}
      {activeTab === 'advisor' && (
        <div className="space-y-6">
          <HairSkinAdvisor />
        </div>
      )}
    </div>
  );
};
