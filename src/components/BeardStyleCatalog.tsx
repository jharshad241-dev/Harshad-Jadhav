import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { BeardStyle } from '../types';
import { BEARD_STYLES_DATA } from '../data/saloonData';

interface BeardStyleCatalogProps {
  onSelectTryOn: (beardStyle: BeardStyle) => void;
  onBookBeardStyle: (beardStyleName: string) => void;
}

export const BeardStyleCatalog: React.FC<BeardStyleCatalogProps> = ({
  onSelectTryOn,
  onBookBeardStyle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'Full Beard', 'Stubble', 'Corporate', 'Designed'];

  const filteredBeards = BEARD_STYLES_DATA.filter(
    (b) => selectedCategory === 'All' || b.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <IconRenderer name="Sparkles" className="w-4 h-4" />
          <span>Beard Artistry & Trimming</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
          Beard Recommendation & Trimming Suite
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Precision cheek line sculpting, stubble maintenance, and full beard shaping tailored to your jawline.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-neutral-900/80 p-2 rounded-2xl border border-neutral-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Beard Style Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBeards.map((beard) => {
          const isExpanded = expandedId === beard.id;

          return (
            <div
              key={beard.id}
              className="bg-neutral-900/90 rounded-2xl border border-amber-500/20 hover:border-amber-400/80 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={beard.imageUrl}
                  alt={beard.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shrink-0 border-2 border-amber-500/30"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-white font-serif truncate">
                      {beard.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-xs border border-amber-500/30 shrink-0">
                      {beard.suitabilityScore}% Match
                    </span>
                  </div>

                  <span className="inline-block text-[10px] uppercase font-bold text-amber-400/80 tracking-widest">
                    {beard.category}
                  </span>

                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                    {beard.description}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1">
                    {beard.suitableFaceShapes.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-neutral-950 text-amber-300 text-[10px] font-semibold border border-neutral-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expandable Trimming & Growth Advice */}
              {isExpanded && (
                <div className="pt-3 border-t border-neutral-800 space-y-3 text-xs animate-fadeIn">
                  <div>
                    <span className="font-bold text-amber-400 block mb-1">Trimming Guide:</span>
                    <ul className="list-disc list-inside text-neutral-300 text-[11px] space-y-0.5">
                      {beard.trimmingGuide.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-amber-400 block mb-1">Maintenance & Growth Advice:</span>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">
                      {beard.growthAdvice}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : beard.id)}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Hide Guide' : 'View Trimming & Growth Guide'}</span>
                  <IconRenderer name={isExpanded ? 'ChevronUp' : 'ChevronDown'} className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectTryOn(beard)}
                    className="py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <IconRenderer name="Eye" className="w-3.5 h-3.5" />
                    <span>Try On</span>
                  </button>
                  <button
                    onClick={() => onBookBeardStyle(beard.name)}
                    className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <IconRenderer name="Calendar" className="w-3.5 h-3.5" />
                    <span>Book Service</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
