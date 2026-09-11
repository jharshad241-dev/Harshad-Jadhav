import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Trophy,
  Flame,
  Sparkles,
  Lock,
  CheckCircle2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { BadgeItem, LeaderboardUser, UserProfile } from '../../types/hygienely';
import { MOCK_LEADERBOARD } from '../../data/hygienelyData';
import { HygieneIcon } from './HygieneIcon';

interface BadgesLeaderboardViewProps {
  badges: BadgeItem[];
  profile: UserProfile;
}

export const BadgesLeaderboardView: React.FC<BadgesLeaderboardViewProps> = ({
  badges,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');

  // Inject current user into leaderboard
  const currentUserEntry: LeaderboardUser = {
    id: 'user-current',
    name: `${profile.name} (You)`,
    avatar: profile.avatar,
    userGroup: profile.userGroup,
    points: profile.totalPoints,
    streak: profile.streak,
    badgeCount: badges.filter((b) => b.unlocked).length,
    isCurrentUser: true,
  };

  const combinedLeaderboard = [...MOCK_LEADERBOARD, currentUserEntry].sort(
    (a, b) => b.points - a.points
  );

  return (
    <div id="badges-leaderboard-container" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Rewards, Trophies & Community
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Celebrate hygiene milestones and friendly community motivation!
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'badges'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Board</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BADGES SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            return (
              <motion.div
                key={badge.id}
                layout
                className={`p-6 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  badge.unlocked
                    ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800/60 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md bg-gradient-to-br ${
                        badge.unlocked ? badge.color : 'from-slate-400 to-slate-500'
                      }`}
                    >
                      {badge.unlocked ? (
                        <HygieneIcon name={badge.icon} className="w-7 h-7" />
                      ) : (
                        <Lock className="w-6 h-6 text-slate-200" />
                      )}
                    </div>

                    {badge.unlocked ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-4">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Requirement:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {badge.requirement}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PRIVACY-SAFE COMMUNITY LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/40 flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed font-medium">
              <strong>Privacy-Safe Inspiration:</strong> All user profiles only show first names, avatars, and hygiene achievement points. Keep cheering each other on!
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-xs font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-16">Rank</th>
                  <th className="py-3 px-3">Participant</th>
                  <th className="py-3 px-3 text-center">Category</th>
                  <th className="py-3 px-3 text-center">Streak</th>
                  <th className="py-3 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {combinedLeaderboard.map((user, idx) => {
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors ${
                        user.isCurrentUser
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/50 font-bold'
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-750'
                      }`}
                    >
                      {/* Rank Icon */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-900 shadow-sm'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-800'
                              : idx === 2
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{user.avatar}</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                              {user.name}
                            </span>
                            {user.isCurrentUser && (
                              <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                          {user.userGroup}
                        </span>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-black text-orange-500">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" />
                          {user.streak}d
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-3 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                        {user.points} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
