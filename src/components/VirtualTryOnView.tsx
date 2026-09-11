import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { Hairstyle, BeardStyle } from '../types';
import { HAIRSTYLES_DATA, BEARD_STYLES_DATA } from '../data/saloonData';

interface VirtualTryOnViewProps {
  initialHairstyle?: Hairstyle;
  initialBeardStyle?: BeardStyle;
  onBookTryOnLook: (hairstyleName?: string, beardName?: string) => void;
}

export const VirtualTryOnView: React.FC<VirtualTryOnViewProps> = ({
  initialHairstyle,
  initialBeardStyle,
  onBookTryOnLook,
}) => {
  const [selectedHair, setSelectedHair] = useState<Hairstyle>(
    initialHairstyle || HAIRSTYLES_DATA[0]
  );
  const [selectedBeard, setSelectedBeard] = useState<BeardStyle | null>(
    initialBeardStyle || BEARD_STYLES_DATA[0]
  );

  const [hairColor, setHairColor] = useState<string>('#1c1917'); // Natural Black default
  const [hairVolume, setHairVolume] = useState<number>(85);
  const [beardDensity, setBeardDensity] = useState<number>(90);
  const [lightingBrightness, setLightingBrightness] = useState<number>(100);

  // Before/After comparison slider percentage (0 to 100)
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [showSplitComparison, setShowSplitComparison] = useState<boolean>(true);

  // Base Face Image
  const [baseFaceUrl, setBaseFaceUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  );

  // Hair Colors Palette
  const colorOptions = [
    { name: 'Natural Black', hex: '#1c1917' },
    { name: 'Espresso Brown', hex: '#3b2314' },
    { name: 'Golden Honey', hex: '#d4af37' },
    { name: 'Platinum Silver', hex: '#9ca3af' },
    { name: 'Burgundy Red', hex: '#581c87' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <IconRenderer name="Eye" className="w-4 h-4" />
            <span>AI Virtual Try-On Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Interactive Hairstyle & Beard Simulator
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Preview hairstyles, beard styles, and hair colors while preserving your natural face identity and skin tone.
          </p>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSplitComparison(!showSplitComparison)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              showSplitComparison
                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800'
            }`}
          >
            <IconRenderer name="Columns" className="w-4 h-4" />
            <span>{showSplitComparison ? 'Before/After Mode' : 'Single View'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Studio Stage: Virtual Mirror Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-900/90 rounded-3xl border-2 border-amber-500/30 p-4 sm:p-6 shadow-2xl relative flex flex-col items-center">
          {/* Virtual Mirror Frame Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-xs text-neutral-400 mb-4">
            <span className="font-mono flex items-center gap-1 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE AI RENDER ENGINE v3.4
            </span>
            <span className="font-mono text-[11px]">Identity Lock: 100% Preserved</span>
          </div>

          {/* Interactive Visual Canvas Container */}
          <div
            className="relative w-full max-w-md aspect-[3/4] rounded-2xl bg-neutral-950 border border-amber-500/30 overflow-hidden shadow-2xl select-none"
            style={{ filter: `brightness(${lightingBrightness}%)` }}
          >
            {/* Base Face Image */}
            <img
              src={baseFaceUrl}
              alt="Original User Face"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* AI Hairstyle & Beard Virtual Overlays */}
            <div className="absolute inset-0 pointer-events-none mix-blend-normal">
              {/* Overlay hairstyle sample image clipped seamlessly */}
              <div
                className="absolute inset-0 opacity-80 transition-opacity duration-300"
                style={{
                  filter: `contrast(110%) opacity(${hairVolume / 100})`,
                }}
              >
                <img
                  src={selectedHair.imageUrl}
                  alt={selectedHair.name}
                  className="w-full h-full object-cover mix-blend-hard-light"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tint overlay for Hair Color */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-color transition-colors duration-300"
                style={{ backgroundColor: hairColor, opacity: 0.35 }}
              />
            </div>

            {/* Split Comparison Before/After Slider Layer */}
            {showSplitComparison && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-amber-400 shadow-[0_0_15px_#FFD700]"
                style={{ width: `${splitPosition}%` }}
              >
                {/* Original Unmodified Face */}
                <img
                  src={baseFaceUrl}
                  alt="Before Original"
                  className="w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/90 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-700">
                  BEFORE (ORIGINAL)
                </div>
              </div>
            )}

            {/* After Tag Label */}
            <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
              AFTER (AI TRY-ON)
            </div>

            {/* Active Selected Look Badges at bottom of frame */}
            <div className="absolute bottom-3 inset-x-3 bg-neutral-950/85 backdrop-blur-md p-2.5 rounded-xl border border-amber-500/40 flex items-center justify-between text-xs text-white">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block">
                  Active Style Preview
                </span>
                <p className="font-extrabold text-xs truncate">
                  {selectedHair.name} {selectedBeard ? `+ ${selectedBeard.name}` : ''}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                {selectedHair.matchScore}% Match
              </span>
            </div>
          </div>

          {/* Before/After Split Drag Controller Bar */}
          {showSplitComparison && (
            <div className="w-full max-w-md mt-4 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                <span>◀ Original Face</span>
                <span className="text-amber-400">Drag Comparison Slider</span>
                <span>AI Style Preview ▶</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={splitPosition}
                onChange={(e) => setSplitPosition(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          )}

          {/* Stage Action Buttons */}
          <div className="w-full max-w-md mt-5 flex items-center gap-3">
            <button
              onClick={() => onBookTryOnLook(selectedHair.name, selectedBeard?.name)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
            >
              <IconRenderer name="Calendar" className="w-4 h-4" />
              <span>Book This Exact Look</span>
            </button>
          </div>
        </div>

        {/* Right Studio Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Hairstyle Selector Strip */}
          <div className="bg-neutral-900/90 rounded-2xl border border-amber-500/20 p-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <IconRenderer name="Scissors" className="w-4 h-4" />
              <span>1. Choose Hairstyle</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar">
              {HAIRSTYLES_DATA.map((hair) => {
                const isSelected = selectedHair.id === hair.id;
                return (
                  <button
                    key={hair.id}
                    onClick={() => setSelectedHair(hair)}
                    className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center text-center ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={hair.imageUrl}
                      alt={hair.name}
                      className="w-full h-14 object-cover rounded-lg mb-1"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-white line-clamp-1">
                      {hair.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Beard Style Selector */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <IconRenderer name="Sparkles" className="w-4 h-4" />
              <span>2. Choose Beard Style</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {BEARD_STYLES_DATA.map((beard) => {
                const isSelected = selectedBeard?.id === beard.id;
                return (
                  <button
                    key={beard.id}
                    onClick={() => setSelectedBeard(isSelected ? null : beard)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={beard.imageUrl}
                      alt={beard.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {beard.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {beard.suitabilityScore}% Score
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hair Color Palette Selector */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <IconRenderer name="Palette" className="w-4 h-4" />
              <span>3. Hair Color Tint</span>
            </h3>

            <div className="flex items-center justify-between gap-2">
              {colorOptions.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => setHairColor(col.hex)}
                  className={`flex-1 py-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    hairColor === col.hex
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-neutral-800 bg-neutral-950'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-[9px] font-bold text-neutral-300 truncate max-w-[50px]">
                    {col.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fine-Tuning Adjustment Sliders */}
          <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <IconRenderer name="Sliders" className="w-4 h-4" />
              <span>4. Adjust Hair & Lighting Parameters</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-neutral-300 mb-1">
                  <span>Hair Density & Opacity</span>
                  <span className="text-amber-400 font-mono">{hairVolume}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={hairVolume}
                  onChange={(e) => setHairVolume(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-neutral-300 mb-1">
                  <span>Lighting / Mirror Spotlight</span>
                  <span className="text-amber-400 font-mono">{lightingBrightness}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={lightingBrightness}
                  onChange={(e) => setLightingBrightness(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
