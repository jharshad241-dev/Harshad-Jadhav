import React from 'react';
import { IconRenderer } from './IconRenderer';
import { UserProfile } from '../types';

interface LoyaltyViewProps {
  userProfile: UserProfile;
}

export const LoyaltyView: React.FC<LoyaltyViewProps> = ({ userProfile }) => {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <IconRenderer name="Crown" className="w-4 h-4" />
          <span>Vaibhav VIP Gentlemen's Club</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
          Membership Loyalty & Rewards Pass
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Earn 10 Reward Points for every ₹100 spent at Vaibhav AI Saloon. Unlock birthday gifts and complimentary hair spa upgrades.
        </p>
      </div>

      {/* Luxury Black & Gold VIP Card Canvas */}
      <div className="relative aspect-[1.8/1] sm:aspect-[2.2/1] max-w-xl mx-auto rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-amber-400 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Shimmer Effect Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Top Row */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-extrabold text-lg tracking-wider text-white font-serif">
                VAIBHAV
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 uppercase tracking-widest">
                VIP
              </span>
            </div>
            <p className="text-[10px] text-amber-300 font-mono tracking-widest">
              {userProfile.membershipTier.toUpperCase()} MEMBER
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
            <IconRenderer name="Crown" className="w-6 h-6" />
          </div>
        </div>

        {/* Card Center Row: Points Balance */}
        <div className="my-2 relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
            REWARD POINTS BALANCE
          </span>
          <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
            {userProfile.rewardPoints} <span className="text-sm font-sans font-bold text-white">PTS</span>
          </span>
        </div>

        {/* Card Bottom Row: User Name & Referral Code */}
        <div className="flex items-end justify-between relative z-10 border-t border-amber-500/20 pt-3 text-xs">
          <div>
            <span className="text-[9px] font-mono uppercase text-neutral-500 block">MEMBER NAME</span>
            <span className="font-extrabold text-white uppercase tracking-wider">{userProfile.name}</span>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono uppercase text-neutral-500 block">REFERRAL CODE</span>
            <span className="font-mono font-bold text-amber-300">{userProfile.referralCode}</span>
          </div>
        </div>
      </div>

      {/* Rewards & Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <IconRenderer name="Gift" className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm text-white font-serif">Birthday Special Offer</h3>
          <p className="text-xs text-neutral-400">Get a complimentary 24K Gold Detox Facial on your birthday month.</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <IconRenderer name="Share2" className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm text-white font-serif">Referral Program</h3>
          <p className="text-xs text-neutral-400">Share code <span className="text-amber-400 font-mono font-bold">{userProfile.referralCode}</span>. Both get ₹200 off your haircut!</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <IconRenderer name="Scissors" className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm text-white font-serif">Free Hair Spa Upgrade</h3>
          <p className="text-xs text-neutral-400">Redeem 1,000 points for a Keratin Hydration Scalp Therapy session.</p>
        </div>
      </div>
    </div>
  );
};
