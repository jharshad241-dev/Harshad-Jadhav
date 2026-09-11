export type UserGroup = 'student' | 'homemaker' | 'senior';

export type TaskTimeOfDay = 'morning' | 'evening' | 'anytime' | 'both';

export type TaskCategory =
  | 'oral'
  | 'body'
  | 'hair_nails'
  | 'hands'
  | 'nutrition_water'
  | 'home_school'
  | 'wellness_sleep'
  | 'medication';

export interface HygieneTask {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  icon: string;
  timeOfDay: TaskTimeOfDay;
  points: number;
  userGroups: UserGroup[]; // which groups this task applies to
  isCustom?: boolean;
  completed?: boolean;
  completedAt?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  userGroup: UserGroup;
  studentClass?: string;
  avatar: string;
  dailyGoal: number; // e.g. 8 tasks
  theme: 'light' | 'dark';
  largeText: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  pushNotifications: boolean;
  streak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  lastActiveDate: string;
}

export interface ReminderItem {
  id: string;
  taskId?: string;
  title: string;
  time: string; // "08:00"
  enabled: boolean;
  days: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  icon: string;
  sound: string;
  userGroup?: UserGroup;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'tasks' | 'games' | 'special';
  unlocked: boolean;
  unlockedDate?: string;
  requirement: string;
  color: string;
}

export interface WeeklyDayData {
  dayName: string; // 'Mon', 'Tue'...
  dateStr: string; // '2026-09-08'
  tasksCompleted: number;
  tasksTotal: number;
  percentage: number;
}

export interface HealthInfoArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  badge: string;
  gradient: string;
  summary: string;
  targetAudience?: UserGroup[];
  steps?: { title: string; desc: string; icon?: string }[];
  keyPoints: string[];
  doList: string[];
  dontList: string[];
  funFact: string;
  scientificWhy: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  userGroup: UserGroup;
  points: number;
  streak: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}
