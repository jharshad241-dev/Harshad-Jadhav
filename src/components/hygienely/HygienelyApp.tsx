import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserProfile,
  HygieneTask,
  ReminderItem,
  BadgeItem,
  UserGroup,
} from '../../types/hygienely';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_HYGIENE_TASKS,
  INITIAL_REMINDERS,
  HYGIENE_BADGES,
} from '../../data/hygienelyData';
import { HygienelyNavbar } from './HygienelyNavbar';
import { HomeDashboardView } from './HomeDashboardView';
import { DailyTasksView } from './DailyTasksView';
import { WeeklyTaskChart } from './WeeklyTaskChart';
import { HygieneGamesSuite } from './HygieneGamesSuite';
import { RemindersManager } from './RemindersManager';
import { ProgressView } from './ProgressView';
import { HealthInfoLibrary } from './HealthInfoLibrary';
import { BadgesLeaderboardView } from './BadgesLeaderboardView';
import { ProfileView } from './ProfileView';
import { WeeklyReportModal } from './WeeklyReportModal';
import { OnboardingModal } from './OnboardingModal';
import { soundEffects } from '../../utils/soundEffects';
import { triggerCelebration } from '../../utils/confetti';
import { Bell, X, Volume2, Music, Sparkles } from 'lucide-react';

interface HygienelyAppProps {
  onSwitchToMusic?: () => void;
}

export const HygienelyApp: React.FC<HygienelyAppProps> = ({ onSwitchToMusic }) => {
  // 1. User Profile State with LocalStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('hygienely_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // 3. Tasks State
  const [tasks, setTasks] = useState<HygieneTask[]>(() => {
    try {
      const saved = localStorage.getItem('hygienely_tasks_v1');
      return saved ? JSON.parse(saved) : INITIAL_HYGIENE_TASKS;
    } catch {
      return INITIAL_HYGIENE_TASKS;
    }
  });

  // 4. Reminders State
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem('hygienely_reminders_v1');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  // 5. Badges State
  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    try {
      const saved = localStorage.getItem('hygienely_badges_v1');
      return saved ? JSON.parse(saved) : HYGIENE_BADGES;
    } catch {
      return HYGIENE_BADGES;
    }
  });

  // 6. Weekly History (TaskId -> 7 days boolean)
  const [weeklyHistory, setWeeklyHistory] = useState<Record<string, boolean[]>>(() => {
    try {
      const saved = localStorage.getItem('hygienely_weekly_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Generate realistic seeded history
    const initialHist: Record<string, boolean[]> = {};
    INITIAL_HYGIENE_TASKS.forEach((t, i) => {
      initialHist[t.id] = [
        true,
        true,
        i % 2 === 0,
        true,
        i % 3 !== 0,
        true,
        !!t.completed,
      ];
    });
    return initialHist;
  });

  // 7. Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // 8. Active Floating Notification Toast
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
  } | null>(null);

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem('hygienely_profile_v1', JSON.stringify(profile));
    } catch {}

    // Apply dark class
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    soundEffects.setMuted(!profile.soundEnabled);
  }, [profile]);

  // Persist Tasks
  useEffect(() => {
    try {
      localStorage.setItem('hygienely_tasks_v1', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Persist Reminders
  useEffect(() => {
    try {
      localStorage.setItem('hygienely_reminders_v1', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  // Persist Badges
  useEffect(() => {
    try {
      localStorage.setItem('hygienely_badges_v1', JSON.stringify(badges));
    } catch {}
  }, [badges]);

  // Persist Weekly History
  useEffect(() => {
    try {
      localStorage.setItem('hygienely_weekly_history_v1', JSON.stringify(weeklyHistory));
    } catch {}
  }, [weeklyHistory]);

  // Check Badge Unlocks
  const checkBadgeUnlocks = (newPoints: number, completedCount: number, streak: number) => {
    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.unlocked) return badge;

        let shouldUnlock = false;
        if (badge.id === 'badge-first-step' && completedCount >= 1) shouldUnlock = true;
        if (badge.id === 'badge-clean-hands' && completedCount >= 3) shouldUnlock = true;
        if (badge.id === 'badge-streak-7' && streak >= 7) shouldUnlock = true;
        if (badge.id === 'badge-points-500' && newPoints >= 500) shouldUnlock = true;
        if (badge.id === 'badge-points-1000' && newPoints >= 1000) shouldUnlock = true;

        if (shouldUnlock) {
          soundEffects.playGameVictory();
          triggerCelebration();
          showNotificationToast(`New Badge Unlocked! 🏆`, badge.title);
          return { ...badge, unlocked: true };
        }
        return badge;
      })
    );
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => {
      let pointsDelta = 0;
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          pointsDelta = nextCompleted ? t.points : -t.points;
          return { ...t, completed: nextCompleted };
        }
        return t;
      });

      const nextPoints = Math.max(0, profile.totalPoints + pointsDelta);
      const nextDoneCount = updated.filter((t) => t.completed).length;

      // Update today's slot in weekly history (index 6 is today)
      setWeeklyHistory((prevHist) => {
        const currentTaskHist = prevHist[taskId] || [false, false, false, false, false, false, false];
        const newHist = [...currentTaskHist];
        newHist[6] = !currentTaskHist[6];
        return { ...prevHist, [taskId]: newHist };
      });

      // Update points and level
      const nextLevel = Math.floor(nextPoints / 250) + 1;
      setProfile((p) => ({
        ...p,
        totalPoints: nextPoints,
        level: nextLevel,
      }));

      checkBadgeUnlocks(nextPoints, nextDoneCount, profile.streak);

      return updated;
    });
  };

  // Add Custom Task
  const handleAddTask = (newTask: Omit<HygieneTask, 'id'>) => {
    const id = `custom-task-${Date.now()}`;
    const taskWithId: HygieneTask = { ...newTask, id };
    setTasks((prev) => [taskWithId, ...prev]);

    setWeeklyHistory((prev) => ({
      ...prev,
      [id]: [false, false, false, false, false, false, false],
    }));
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Reminders Handlers
  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddReminder = (newReminder: Omit<ReminderItem, 'id'>) => {
    const id = `rem-${Date.now()}`;
    setReminders((prev) => [{ ...newReminder, id }, ...prev]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const showNotificationToast = (title: string, message: string) => {
    soundEffects.playReminderChime();
    const id = `toast-${Date.now()}`;
    setActiveToast({ id, title, message });

    // Try native Notification if supported and granted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/icon.png',
        });
      } catch {}
    }

    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === id ? null : curr));
    }, 5500);
  };

  // Completed Count
  const completedTodayCount = tasks.filter((t) => t.completed).length;

  // Filter tasks based on user profile group
  const visibleTasks = tasks.filter((t) => {
    if (!t.userGroups || t.userGroups.length === 0) return true;
    return t.userGroups.includes(profile.userGroup);
  });

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors ${
        profile.largeText ? 'text-lg leading-relaxed' : 'text-base'
      } ${profile.highContrast ? 'border-2 border-slate-900' : ''}`}
    >
      {/* Optional Bridge to Music / Spotify Hub */}
      {onSwitchToMusic && (
        <div className="bg-neutral-900 text-amber-300 py-1.5 px-4 text-xs font-bold flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>Looking for Study, Focus & Devotional Music?</span>
          </div>
          <button
            onClick={onSwitchToMusic}
            className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-neutral-950 font-black hover:bg-amber-400 transition"
          >
            Open Music Hub 🎧
          </button>
        </div>
      )}

      {/* Floating In-App Reminder Notification Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-emerald-600 text-white p-4 rounded-3xl shadow-2xl shadow-emerald-500/30 border-2 border-white/20 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0">
                🔔
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-100">
                  {activeToast.title}
                </h4>
                <p className="text-xs font-bold text-white mt-0.5">
                  {activeToast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="p-1 rounded-xl hover:bg-white/20 text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Navigation Header */}
      <HygienelyNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        onToggleTheme={() => {
          const next = profile.theme === 'light' ? 'dark' : 'light';
          setProfile((p) => ({ ...p, theme: next }));
        }}
        onToggleSound={() => {
          setProfile((p) => ({ ...p, soundEnabled: !p.soundEnabled }));
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HomeDashboardView
                profile={profile}
                tasks={visibleTasks}
                badges={badges}
                completedCount={completedTodayCount}
                onNavigate={setActiveTab}
                onToggleTask={handleToggleTask}
                onOpenReport={() => setIsReportOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <DailyTasksView
                tasks={visibleTasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                userGroup={profile.userGroup}
                completedCount={completedTodayCount}
              />
            </motion.div>
          )}

          {activeTab === 'weekly' && (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <WeeklyTaskChart
                tasks={visibleTasks}
                weeklyHistory={weeklyHistory}
                onToggleDay={(taskId, dayIndex) => {
                  soundEffects.playClick();
                  setWeeklyHistory((prev) => {
                    const current = prev[taskId] || [false, false, false, false, false, false, false];
                    const next = [...current];
                    next[dayIndex] = !next[dayIndex];
                    return { ...prev, [taskId]: next };
                  });
                }}
                onOpenWeeklyReport={() => setIsReportOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HygieneGamesSuite
                onEarnPoints={(pts) => {
                  const nextPoints = profile.totalPoints + pts;
                  setProfile((p) => ({ ...p, totalPoints: nextPoints }));
                  showNotificationToast('Game Completed! 🎮', `+${pts} hygiene points earned.`);
                  checkBadgeUnlocks(nextPoints, completedTodayCount, profile.streak);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'reminders' && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <RemindersManager
                reminders={reminders}
                tasks={visibleTasks}
                onToggleReminder={handleToggleReminder}
                onAddReminder={handleAddReminder}
                onDeleteReminder={handleDeleteReminder}
                onSendTestNotification={(title) => {
                  showNotificationToast('Hygiene Alert', title);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProgressView
                profile={profile}
                badges={badges}
                tasks={visibleTasks}
                completedTodayCount={completedTodayCount}
                weeklyHistory={weeklyHistory}
                onOpenReport={() => setIsReportOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HealthInfoLibrary userGroup={profile.userGroup} />
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <BadgesLeaderboardView badges={badges} profile={profile} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileView
                profile={profile}
                onUpdateProfile={(updates) => {
                  setProfile((p) => ({ ...p, ...updates }));
                }}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onResetData={() => {
                  setTasks(INITIAL_HYGIENE_TASKS);
                  setProfile(DEFAULT_USER_PROFILE);
                  setReminders(INITIAL_REMINDERS);
                  setBadges(HYGIENE_BADGES);
                  localStorage.clear();
                  soundEffects.playClick();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Weekly Report Card Modal */}
      <WeeklyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        profile={profile}
        tasks={visibleTasks}
        weeklyHistory={weeklyHistory}
      />

      {/* Onboarding / Lifestyle Path Customizer Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(newProfileData) => {
          setProfile((p) => ({ ...p, ...newProfileData }));
          setIsOnboardingOpen(false);
          triggerCelebration();
          showNotificationToast(
            'Profile Activated!',
            `Welcome to the ${newProfileData.userGroup?.toUpperCase()} hygiene pathway.`
          );
        }}
      />

      {/* Footer Branding */}
      <footer className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
            Hygienely • Small Habits, Big Changes
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Dedicated health and hygiene routine companion for school students, homemakers, and senior citizens.
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Be Clean • Be Healthy • Be Happy
          </p>
        </div>
      </footer>
    </div>
  );
};
