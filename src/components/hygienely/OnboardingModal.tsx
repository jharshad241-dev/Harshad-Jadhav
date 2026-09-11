import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Home,
  Heart,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserGroup, UserProfile } from '../../types/hygienely';
import { AppLogo } from './AppLogo';
import { soundEffects } from '../../utils/soundEffects';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup>('student');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(14);
  const [studentClass, setStudentClass] = useState('8th Grade');
  const [dailyGoal, setDailyGoal] = useState<number>(8);
  const [selectedAvatar, setSelectedAvatar] = useState('🧑‍🎓');

  if (!isOpen) return null;

  const groupOptions: {
    id: UserGroup;
    title: string;
    icon: string;
    tagline: string;
    description: string;
    defaultAvatar: string;
  }[] = [
    {
      id: 'student',
      title: 'Student',
      icon: '🎒',
      tagline: 'School & Study Vitality',
      description: 'Clean backpack, water bottle scrub, hand sanitizing after recess, healthy snacks & sleep.',
      defaultAvatar: '🧑‍🎓',
    },
    {
      id: 'homemaker',
      title: 'Homemaker',
      icon: '🏡',
      tagline: 'Family Health & Sanctuary',
      description: 'Kitchen food safety, sponge disinfection, surfaces sanitizing, hand moisture restoration & rest.',
      defaultAvatar: '👩‍🍳',
    },
    {
      id: 'senior',
      title: 'Senior Citizen',
      icon: '👵',
      tagline: 'Gentle Care & Fall-Safe Habits',
      description: 'Hydration schedule, gentle skin care, anti-slip checks, medication tracking & warm strolls.',
      defaultAvatar: '👴',
    },
  ];

  const handleGroupSelect = (group: UserGroup, avatar: string) => {
    soundEffects.playClick();
    setSelectedGroup(group);
    setSelectedAvatar(avatar);
    if (group === 'student') setAge(14);
    if (group === 'homemaker') setAge(38);
    if (group === 'senior') setAge(68);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playTaskComplete();
    onComplete({
      name: name.trim() || (selectedGroup === 'student' ? 'Alex' : selectedGroup === 'homemaker' ? 'Sarah' : 'Robert'),
      age: Number(age) || 25,
      userGroup: selectedGroup,
      studentClass: selectedGroup === 'student' ? studentClass : undefined,
      avatar: selectedAvatar,
      dailyGoal: Number(dailyGoal) || 8,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="text-center space-y-1">
          <AppLogo size="md" showTagline className="justify-center" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3">
            {step === 1 ? 'Welcome! Choose Your Lifestyle Path' : 'Personalize Your Hygiene Profile'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {step === 1
              ? 'Hygienely tailors daily habits, reminders, and health guides to your lifestyle.'
              : 'Let us set up your custom daily goals and profile details.'}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5">
              {groupOptions.map((opt) => {
                const isSelected = selectedGroup === opt.id;
                return (
                  <div
                    key={opt.id}
                    id={`onboarding-group-${opt.id}`}
                    onClick={() => handleGroupSelect(opt.id, opt.defaultAvatar)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 select-none ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                      {opt.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {opt.title}
                          </h4>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            {opt.tagline}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              id="onboarding-next-btn"
              onClick={() => {
                soundEffects.playClick();
                setStep(2);
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Continue with {selectedGroup.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleFinish} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Your Full Name / Nickname
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav, Grandma Sunita, Priya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Age & Class (if student) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min={4}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {selectedGroup === 'student' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Grade / Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7th Grade, High School"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Daily Habit Target
                  </label>
                  <select
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={5}>5 Tasks / Day (Gentle)</option>
                    <option value={8}>8 Tasks / Day (Standard)</option>
                    <option value={10}>10 Tasks / Day (Champion)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Choose Your Hygiene Mascot Avatar
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {['🧑‍🎓', '👧', '👦', '👩‍🍳', '👨‍🍳', '👴', '👵', '🫧', '🌿', '💧'].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedAvatar(av);
                    }}
                    className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition ${
                      selectedAvatar === av
                        ? 'bg-emerald-500 text-white shadow-md scale-110'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="submit"
                id="onboarding-complete-btn"
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-lg shadow-emerald-500/25 transition"
              >
                Start My Hygiene Journey! 🚀
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
