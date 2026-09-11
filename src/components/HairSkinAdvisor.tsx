import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { PRODUCTS_DATA } from '../data/saloonData';
import { HygieneGame } from './HygieneGame';
import { HygieneNotificationManager } from './HygieneNotificationManager';

export const HairSkinAdvisor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'routine' | 'game' | 'notifications'>('routine');
  const [selectedHairType, setSelectedHairType] = useState<string>('Normal Hair');
  const [selectedHairConcern, setSelectedHairConcern] = useState<string>('Hair Fall');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('Combination');

  const hairTypes = ['Normal Hair', 'Dry Hair', 'Oily Hair', 'Curly Hair', 'Damaged Hair'];
  const hairConcerns = ['Hair Fall', 'Dandruff', 'Scalp Itchiness', 'Thinning Hair', 'Frizz Control'];
  const skinTypes = ['Oily Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin'];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <IconRenderer name="HeartPulse" className="w-4 h-4" />
            <span>Trichology & Skincare Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Personalized Hair & Skin Care Suite
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Custom daily routine, interactive hygiene games, and automated hydration/sunscreen alerts.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 shrink-0">
          <button
            onClick={() => setActiveSection('routine')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'routine'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <IconRenderer name="Sparkles" className="w-3.5 h-3.5" />
            <span>Routine</span>
          </button>
          <button
            onClick={() => setActiveSection('game')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'game'
                ? 'bg-emerald-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <IconRenderer name="Gamepad2" className="w-3.5 h-3.5" />
            <span>🎮 Game</span>
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'notifications'
                ? 'bg-cyan-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <IconRenderer name="Bell" className="w-3.5 h-3.5" />
            <span>🔔 Alerts</span>
          </button>
        </div>
      </div>

      {activeSection === 'game' && <HygieneGame />}
      {activeSection === 'notifications' && <HygieneNotificationManager />}

      {activeSection === 'routine' && (
        <>
          {/* Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900/90 p-5 rounded-3xl border border-amber-500/20">
        {/* Hair Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            1. Hair Texture / Type
          </label>
          <select
            value={selectedHairType}
            onChange={(e) => setSelectedHairType(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 cursor-pointer"
          >
            {hairTypes.map((ht) => (
              <option key={ht} value={ht}>
                {ht}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Concern */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            2. Primary Scalp Concern
          </label>
          <select
            value={selectedHairConcern}
            onChange={(e) => setSelectedHairConcern(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 cursor-pointer"
          >
            {hairConcerns.map((hc) => (
              <option key={hc} value={hc}>
                {hc}
              </option>
            ))}
          </select>
        </div>

        {/* Skin Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            3. Face Skin Profile
          </label>
          <select
            value={selectedSkinType}
            onChange={(e) => setSelectedSkinType(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold text-xs rounded-xl p-2.5 outline-none focus:border-amber-400 cursor-pointer"
          >
            {skinTypes.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customized Routine Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl border border-amber-500/30 p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-extrabold text-white font-serif flex items-center gap-2">
          <IconRenderer name="Sparkles" className="w-5 h-5 text-amber-400" />
          <span>Recommended Daily Grooming Routine</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Morning Routine */}
          <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider block text-[11px]">
              ☀️ Morning Scalp & Skin Prep
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-300">
              <li>Wash with lukewarm water and sulfate-free hydrating shampoo.</li>
              <li>Apply 2 drops of Trichology Anti-Hairfall Caffeine Serum onto scalp.</li>
              <li>Use matte styling wax for pliable hold without clogging pores.</li>
              <li>Apply non-greasy SPF 30 facial moisturizer.</li>
            </ol>
          </div>

          {/* Evening Routine */}
          <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <span className="font-extrabold text-amber-400 uppercase tracking-wider block text-[11px]">
              🌙 Night Recovery & Beard Care
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-300">
              <li>Cleanse face with gentle detox charcoal face wash.</li>
              <li>Massage 4 drops of Gold Infused Argan Beard Elixir into beard roots.</li>
              <li>Perform 2-minute scalp pressure points massage before bed.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Recommended Products Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white font-serif flex items-center gap-2">
          <IconRenderer name="ShoppingBag" className="w-5 h-5 text-amber-400" />
          <span>Vaibhav Luxury Grooming Formulas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRODUCTS_DATA.map((prod) => (
            <div
              key={prod.id}
              className="bg-neutral-900/90 rounded-2xl border border-amber-500/20 hover:border-amber-400 transition-all p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded-xl mb-3 border border-neutral-800"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {prod.brand} • {prod.category}
                </span>
                <h3 className="font-extrabold text-sm text-white font-serif">{prod.name}</h3>
                <p className="text-xs text-neutral-300 mt-1">{prod.purpose}</p>
                <div className="mt-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
                  <span className="font-bold text-amber-400 block">How to use:</span>
                  {prod.howToUse}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-base font-black text-amber-400 font-mono">
                  ₹{prod.price}
                </span>
                <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs transition-all cursor-pointer shadow-md">
                  Buy at Salon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
