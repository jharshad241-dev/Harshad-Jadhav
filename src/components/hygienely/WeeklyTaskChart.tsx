import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { HygieneTask } from '../../types/hygienely';
import { HygieneIcon } from './HygieneIcon';
import { soundEffects } from '../../utils/soundEffects';

interface WeeklyTaskChartProps {
  tasks: HygieneTask[];
  onToggleDayTask: (taskId: string, dayIndex: number) => void;
  weeklyHistory: Record<string, boolean[]>; // taskId -> [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  currentStreak: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyTaskChart: React.FC<WeeklyTaskChartProps> = ({
  tasks,
  onToggleDayTask,
  weeklyHistory,
  currentStreak,
}) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Calculate total completed cells
  let totalOpportunities = 0;
  let totalDone = 0;

  tasks.forEach((t) => {
    const history = weeklyHistory[t.id] || [false, false, false, false, false, false, false];
    history.forEach((done) => {
      totalOpportunities++;
      if (done) totalDone++;
    });
  });

  const weeklyPercentage =
    totalOpportunities > 0 ? Math.round((totalDone / totalOpportunities) * 100) : 0;

  const handleCellToggle = (taskId: string, dayIdx: number) => {
    soundEffects.playTaskComplete();
    onToggleDayTask(taskId, dayIdx);
  };

  return (
    <div id="weekly-task-chart-card" className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Weekly Hygiene Tracker
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monday through Sunday discipline grid. Consistency builds lifetime wellness!
          </p>
        </div>

        {/* Weekly Stats Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs font-bold">
            <Flame className="w-4 h-4" />
            <span>{currentStreak} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-black">
            <TrendingUp className="w-4 h-4" />
            <span>{weeklyPercentage}% Done</span>
          </div>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Weekly Completion: {totalDone} / {totalOpportunities} logs</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{weeklyPercentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weeklyPercentage}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-500 shadow-sm"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto pb-2 -mx-2 sm:mx-0">
        <table className="w-full min-w-[620px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="py-3 px-3 text-xs font-black text-slate-500 uppercase tracking-wider w-56">
                Hygiene Habit
              </th>
              {DAYS.map((day, idx) => (
                <th
                  key={day}
                  className="py-3 px-2 text-center text-xs font-black text-slate-600 dark:text-slate-300"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-slate-400">{day}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black mt-0.5">
                      {idx + 1}
                    </span>
                  </div>
                </th>
              ))}
              <th className="py-3 px-2 text-center text-xs font-black text-slate-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {tasks.map((task) => {
              const history =
                weeklyHistory[task.id] || [false, false, false, false, false, false, false];
              const completedDaysCount = history.filter(Boolean).length;
              const taskPercentage = Math.round((completedDaysCount / 7) * 100);

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-750 transition-colors"
                >
                  {/* Task Name & Icon */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <HygieneIcon name={task.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {task.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                          {task.category.replace('_', ' & ')} • +{task.points} pts
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 7 Day Checkboxes */}
                  {DAYS.map((_, dayIdx) => {
                    const isDone = history[dayIdx] || false;
                    return (
                      <td key={dayIdx} className="py-3 px-2 text-center">
                        <button
                          id={`weekly-check-${task.id}-${dayIdx}`}
                          onClick={() => handleCellToggle(task.id, dayIdx)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 mx-auto ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 scale-105'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                          title={`Toggle ${task.name} for ${DAYS[dayIdx]}`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    );
                  })}

                  {/* Progress percentage */}
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        taskPercentage === 100
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                          : taskPercentage >= 50
                          ? 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {completedDaysCount}/7
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Motivation Footer */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
          <strong>Tip for Success:</strong> Marking 7 days green builds subconscious neuro-pathways that make hygiene effortless. You are currently on track for a weekly champion reward!
        </p>
      </div>
    </div>
  );
};
