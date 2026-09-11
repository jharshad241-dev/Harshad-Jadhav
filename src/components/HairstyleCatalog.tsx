import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { Hairstyle, FaceShape } from '../types';
import { HAIRSTYLES_DATA } from '../data/saloonData';

interface HairstyleCatalogProps {
  onSelectTryOn: (hairstyle: Hairstyle) => void;
  onBookHairstyle: (hairstyleName: string) => void;
}

export const HairstyleCatalog: React.FC<HairstyleCatalogProps> = ({
  onSelectTryOn,
  onBookHairstyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFaceFilter, setSelectedFaceFilter] = useState<string>('All');
  const [expandedStyleId, setExpandedStyleId] = useState<string | null>(null);

  const categories = ['All', 'Fade', 'Crop', 'Classic', 'Long', 'Textured', 'Modern'];
  const faceShapesList: (FaceShape | 'All')[] = ['All', 'Oval', 'Square', 'Round', 'Heart', 'Diamond', 'Rectangle'];

  const filteredStyles = HAIRSTYLES_DATA.filter((style) => {
    const matchesCat = activeCategory === 'All' || style.category === activeCategory;
    const matchesSearch =
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFace =
      selectedFaceFilter === 'All' ||
      style.suitableFaceShapes.includes(selectedFaceFilter as FaceShape);

    return matchesCat && matchesSearch && matchesFace;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <IconRenderer name="Scissors" className="w-4 h-4" />
            <span>Luxury Grooming Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Hairstyle Recommendation Engine
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Explore 25+ precision haircuts curated by Vaibhav AI Saloon master stylists.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pompadour, fade, crop..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 text-white text-xs placeholder-neutral-500 outline-none transition-all"
          />
          <IconRenderer name="Search" className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Filter Row: Category Pills & Face Shape Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/80 p-2.5 rounded-2xl border border-neutral-800">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Face Shape Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-neutral-400 font-bold hidden sm:inline">Face Shape:</span>
          <select
            value={selectedFaceFilter}
            onChange={(e) => setSelectedFaceFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-amber-300 font-bold text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:border-amber-400"
          >
            {faceShapesList.map((shape) => (
              <option key={shape} value={shape}>
                {shape === 'All' ? 'All Face Shapes' : `${shape} Face`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hairstyle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStyles.map((style) => {
          const isExpanded = expandedStyleId === style.id;

          return (
            <div
              key={style.id}
              className="bg-neutral-900/90 rounded-2xl border border-amber-500/20 hover:border-amber-400/80 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
            >
              <div>
                {/* Image & Match Score Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                  <img
                    src={style.imageUrl}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <IconRenderer name="Sparkles" className="w-3 h-3" />
                    <span>{style.matchScore}% Match</span>
                  </div>

                  {style.isTrending && (
                    <div className="absolute top-2 left-2 bg-red-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      TRENDING
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-950/80 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      ⏱ {style.stylingTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-950/80 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      Difficulty: {style.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-950/80 text-neutral-300 text-[10px] font-mono border border-neutral-700">
                      Maint: {style.maintenanceLevel}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white font-serif">{style.name}</h3>
                      <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-widest">
                        {style.category} STYLE
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {style.description}
                  </p>

                  {/* Compatible Face Shapes Tags */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Best For Face Shapes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {style.suitableFaceShapes.map((shape) => (
                        <span
                          key={shape}
                          className="px-2 py-0.5 rounded-md bg-neutral-950 border border-amber-500/30 text-amber-300 font-semibold text-[10px]"
                        >
                          {shape}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Details Section */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-neutral-800 space-y-3 text-xs animate-fadeIn">
                      {/* Recommended Products */}
                      <div>
                        <span className="font-bold text-amber-400 block mb-1">Recommended Products:</span>
                        <ul className="list-disc list-inside text-neutral-300 text-[11px] space-y-0.5">
                          {style.recommendedProducts.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Styling Instructions */}
                      <div>
                        <span className="font-bold text-amber-400 block mb-1">Styling Steps:</span>
                        <ol className="list-decimal list-inside text-neutral-300 text-[11px] space-y-1">
                          {style.stylingInstructions.map((ins, i) => (
                            <li key={i}>{ins}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-emerald-950/30 border border-emerald-500/30 p-2 rounded-xl">
                          <span className="font-bold text-emerald-400 block mb-1">Pros:</span>
                          <ul className="space-y-0.5 text-neutral-300">
                            {style.pros.map((p, i) => (
                              <li key={i}>✓ {p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-950/30 border border-red-500/30 p-2 rounded-xl">
                          <span className="font-bold text-red-400 block mb-1">Considerations:</span>
                          <ul className="space-y-0.5 text-neutral-300">
                            {style.cons.map((c, i) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => setExpandedStyleId(isExpanded ? null : style.id)}
                  className="w-full text-[11px] font-bold text-amber-400/90 hover:text-amber-300 text-center cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>{isExpanded ? 'Hide Styling Guide' : 'View Styling Guide & Products'}</span>
                  <IconRenderer name={isExpanded ? 'ChevronUp' : 'ChevronDown'} className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectTryOn(style)}
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <IconRenderer name="Eye" className="w-3.5 h-3.5 text-amber-400" />
                    <span>Virtual Try-On</span>
                  </button>
                  <button
                    onClick={() => onBookHairstyle(style.name)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <IconRenderer name="Calendar" className="w-3.5 h-3.5" />
                    <span>Book Haircut</span>
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
