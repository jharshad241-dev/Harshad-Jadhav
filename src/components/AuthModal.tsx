import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login'>('profile');
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name,
      email,
      phone,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-amber-500/40 w-full max-w-md rounded-3xl p-6 space-y-4 text-white relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
        >
          <IconRenderer name="X" className="w-4 h-4" />
        </button>

        <div className="flex border-b border-neutral-800 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400'
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400'
            }`}
          >
            Switch Account / Login
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                  {userProfile.membershipTier} Member
                </span>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Reward Points: {userProfile.rewardPoints} PTS
                </p>
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-400 block mb-1">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-400 block mb-1">Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-400 block mb-1">Phone Number:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold cursor-pointer uppercase tracking-wider"
            >
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-neutral-400 text-xs">
              Sign in with Firebase Auth or OAuth to sync saved face scans across devices:
            </p>

            <button
              onClick={() => {
                alert('Signed in with Google Account.');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconRenderer name="LogIn" className="w-4 h-4 text-amber-400" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => {
                alert('Signed in with Apple ID.');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconRenderer name="Apple" className="w-4 h-4 text-amber-400" />
              <span>Continue with Apple ID</span>
            </button>

            <button
              onClick={() => {
                alert('Logged in as Guest User.');
                onClose();
              }}
              className="w-full py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold cursor-pointer"
            >
              Continue in Guest Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
