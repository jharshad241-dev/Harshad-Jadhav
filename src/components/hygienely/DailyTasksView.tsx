import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Filter,
  Flame,
  X,
  Edit2,
  Check,
} from 'lucide-react';
import { HygieneTask, TaskTimeOfDay, TaskCategory, UserGroup } from '../../types/hygienely';
import { HygieneIcon } from './HygieneIcon';
import { soundEffects } from '../../utils/soundEffects';
import { triggerCelebration } from '../../utils/confetti';

interface DailyTasksViewProps {
  tasks: HygieneTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<HygieneTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
  userGroup: UserGroup;
  completedCount: number;
}

export const DailyTasksView: React.FC<DailyTasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  userGroup,
  completedCount,
}) => {
  const [filterTime, setFilterTime] = useState<'all' | 'morning' | 'evening' | 'anytime'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<TaskTimeOfDay>('anytime');
  const [newCategory, setNewCategory] = useState<TaskCategory>('body');
  const [newPoints, setNewPoints] = useState<number>(15);
  const [newIcon, setNewIcon] = useState<string>('Sparkles');

  const filteredTasks = tasks.filter((t) => {
    const matchesTime =
      filterTime === 'all' ||
      t.timeOfDay === filterTime ||
      (filterTime === 'morning' && t.timeOfDay === 'both') ||
      (filterTime === 'evening' && t.timeOfDay === 'both');

    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;

    return matchesTime && matchesCategory;
  });

  const handleToggle = (taskId: string, isCurrentlyDone: boolean) => {
    if (!isCurrentlyDone) {
      soundEffects.playTaskComplete();
      triggerCelebration();
    } else {
      soundEffects.playClick();
    }
    onToggleTask(taskId);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddTask({
      name: newName.trim(),
      description: newDesc.trim() || 'Daily personal hygiene habit.',
      timeOfDay: newTimeOfDay,
      category: newCategory,
      points: Number(newPoints) || 15,
      icon: newIcon,
      userGroups: [userGroup],
      isCustom: true,
      completed: false,
    });

    soundEffects.playTaskComplete();
    setIsAddModalOpen(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div id="daily-tasks-view" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Daily Hygiene Habits
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {completedCount} of {tasks.length} habits completed today. Check off each habit to earn points!
          </p>
        </div>

        <button
          id="open-add-task-modal-btn"
          onClick={() => {
            soundEffects.playClick();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 sm:mx-0 px-2 sm:px-0">
        {/* Time of day filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          {(
            [
              { id: 'all', label: 'All Routines' },
              { id: 'morning', label: '🌅 Morning' },
              { id: 'evening', label: '🌙 Night' },
              { id: 'anytime', label: '⚡ Anytime' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playClick();
                setFilterTime(item.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTime === item.id
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category selector */}
        <select
          value={filterCategory}
          onChange={(e) => {
            soundEffects.playClick();
            setFilterCategory(e.target.value);
          }}
          className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Categories</option>
          <option value="oral">Oral / Dental</option>
          <option value="hands">Handwashing</option>
          <option value="body">Body & Bathing</option>
          <option value="hair_nails">Hair & Nails</option>
          <option value="nutrition_water">Water & Food</option>
          <option value="wellness_sleep">Exercise & Sleep</option>
          <option value="home_school">Home & School</option>
          <option value="medication">Medications</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <span className="text-4xl">✨</span>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-2">
              No tasks found under this filter!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = !!task.completed;

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all duration-200 flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <HygieneIcon name={task.icon} className="w-5 h-5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm sm:text-base font-black ${
                          isDone
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.name}
                      </h4>

                      {/* Time pill */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                        {task.timeOfDay}
                      </span>

                      {/* Points badge */}
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                        +{task.points} pts
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                {/* Right Action: Checkbox & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  {task.isCustom && (
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 transition"
                      title="Delete custom task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    id={`task-check-button-${task.id}`}
                    onClick={() => handleToggle(task.id, isDone)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 hover:bg-emerald-100 hover:text-emerald-600'
                    }`}
                    title={isDone ? 'Mark as Incomplete' : 'Complete Habit!'}
                  >
                    {isDone ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <Circle className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Custom Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white">
                    Add New Hygiene Habit
                  </h4>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanitize eyeglasses & phone screen"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Description & Health Reason
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wipe with alcohol swab to prevent eye strain and facial acne."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Time of Day
                    </label>
                    <select
                      value={newTimeOfDay}
                      onChange={(e) => setNewTimeOfDay(e.target.value as TaskTimeOfDay)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="morning">Morning</option>
                      <option value="evening">Night</option>
                      <option value="anytime">Anytime</option>
                      <option value="both">Day & Night</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Points Reward
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={newPoints}
                      onChange={(e) => setNewPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Select Habit Icon
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Sparkles', 'ShowerHead', 'Droplets', 'Scissors', 'CupSoda', 'Apple', 'Home', 'Pill', 'HeartPulse'].map(
                      (ic) => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setNewIcon(ic)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                            newIcon === ic
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <HygieneIcon name={ic} className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition"
                  >
                    Create Habit
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
