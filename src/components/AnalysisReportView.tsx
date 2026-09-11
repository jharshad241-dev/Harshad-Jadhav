import React from 'react';
import { IconRenderer } from './IconRenderer';
import { FaceAnalysisResult, Hairstyle, BeardStyle } from '../types';
import { HAIRSTYLES_DATA, BEARD_STYLES_DATA } from '../data/saloonData';

interface AnalysisReportViewProps {
  report: FaceAnalysisResult;
  onOpenVirtualTryOnWithStyle: (hair?: Hairstyle, beard?: BeardStyle) => void;
  onBookWithStyle: (hairName?: string, beardName?: string) => void;
  onRescan: () => void;
}

export const AnalysisReportView: React.FC<AnalysisReportViewProps> = ({
  report,
  onOpenVirtualTryOnWithStyle,
  onBookWithStyle,
  onRescan,
}) => {
  // Find matched hairstyles
  const matchedHairstyles = HAIRSTYLES_DATA.filter((h) =>
    report.recommendedHairStyleIds.includes(h.id)
  );

  // Find matched beard styles
  const matchedBeardStyles = BEARD_STYLES_DATA.filter((b) =>
    report.recommendedBeardStyleIds.includes(b.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl border-2 border-amber-500/30 p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Scanned Image & Score Gauge */}
          <div className="flex items-center gap-5">
            {report.scannedImageUrl && (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shrink-0">
                <img
                  src={report.scannedImageUrl}
                  alt="Scanned Face"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-amber-400 text-[10px] font-mono text-center py-0.5 border-t border-amber-500/40">
                  AI VERIFIED
                </div>
              </div>
            )}

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <IconRenderer name="CheckCircle2" className="w-3.5 h-3.5" />
                <span>Face Scan Completed • {report.timestamp}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                Facial Structure Analysis Report
              </h1>
              <p className="text-neutral-400 text-xs mt-1">
                Primary Face Geometry: <span className="text-amber-400 font-bold">{report.faceShape}</span> | Hairline: <span className="text-amber-400 font-bold">{report.hairline}</span>
              </p>
            </div>
          </div>

          {/* Right: Grooming Score Circular Badge */}
          <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-2xl border border-amber-500/30 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#262626"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#FFD700"
                  strokeWidth="6"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * report.groomingScore) / 100}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-black text-amber-400 font-mono">
                {report.groomingScore}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
                AI Grooming Score
              </span>
              <span className="text-sm font-extrabold text-white font-serif">
                Master Executive
              </span>
              <span className="text-[10px] text-emerald-400 font-medium block">
                Top 5% Facial Symmetry ({report.symmetry}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 8 Key Facial Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Face Shape', value: report.faceShape, icon: 'Smile' },
          { label: 'Jawline Angle', value: report.jawline, icon: 'Shield' },
          { label: 'Hair Density', value: report.hairDensity, icon: 'Scissors' },
          { label: 'Hair Texture', value: report.hairTexture, icon: 'Sparkles' },
          { label: 'Hairline Type', value: report.hairline, icon: 'User' },
          { label: 'Beard Growth', value: report.beardGrowthPattern, icon: 'Sparkles' },
          { label: 'Skin Tone', value: report.skinTone, icon: 'Sun' },
          { label: 'Facial Symmetry', value: `${report.symmetry}% High`, icon: 'CheckSquare' },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-neutral-900/90 border border-amber-500/20 hover:border-amber-400 transition-all"
          >
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <IconRenderer name={metric.icon} className="w-3.5 h-3.5 text-amber-400" />
              <span>{metric.label}</span>
            </div>
            <p className="text-sm font-extrabold text-white truncate">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* AI Insights & Key Strengths Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Recommendations & Insights */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <IconRenderer name="Sparkles" className="w-4 h-4" />
            <span>AI Stylist Personal Observations</span>
          </h3>
          <ul className="space-y-2 text-xs text-neutral-300">
            {report.aiInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Facial Strengths */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <IconRenderer name="Award" className="w-4 h-4" />
            <span>Key Grooming Strengths</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.keyStrengths.map((str, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5"
              >
                <IconRenderer name="Check" className="w-3.5 h-3.5 text-amber-400" />
                <span>{str}</span>
              </span>
            ))}
          </div>
          <div className="pt-2 text-[11px] text-neutral-400">
            Tip: Paired with Vaibhav's signature hot towel line-up, these features give an effortless executive appearance.
          </div>
        </div>
      </div>

      {/* Top AI Recommended Hairstyles for this Face */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white font-serif flex items-center gap-2">
              <IconRenderer name="Scissors" className="w-5 h-5 text-amber-400" />
              <span>Top AI Matched Hairstyles</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Styles mathematically optimized for your <span className="text-amber-400 font-bold">{report.faceShape}</span> face shape & hair density.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {matchedHairstyles.map((hair) => (
            <div
              key={hair.id}
              className="bg-neutral-900/90 rounded-2xl border border-amber-500/30 overflow-hidden hover:border-amber-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={hair.imageUrl}
                    alt={hair.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-amber-500 text-neutral-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
                    {hair.matchScore}% MATCH
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <h3 className="font-bold text-sm text-white">{hair.name}</h3>
                  <p className="text-[11px] text-neutral-400 line-clamp-2">
                    {hair.description}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => onOpenVirtualTryOnWithStyle(hair, undefined)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-amber-500/20"
                >
                  <IconRenderer name="Eye" className="w-3.5 h-3.5" />
                  <span>Try On</span>
                </button>
                <button
                  onClick={() => onBookWithStyle(hair.name, undefined)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <IconRenderer name="Calendar" className="w-3.5 h-3.5" />
                  <span>Book This</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top AI Recommended Beard Styles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white font-serif flex items-center gap-2">
              <IconRenderer name="Sparkles" className="w-5 h-5 text-amber-400" />
              <span>Recommended Beard Styles</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matchedBeardStyles.map((beard) => (
            <div
              key={beard.id}
              className="bg-neutral-900/90 rounded-2xl border border-amber-500/30 p-4 flex items-center gap-4 hover:border-amber-400 transition-all"
            >
              <img
                src={beard.imageUrl}
                alt={beard.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-amber-500/40"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white truncate">{beard.name}</h3>
                  <span className="text-amber-400 font-mono font-bold text-xs">
                    {beard.suitabilityScore}% Suitability
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2">
                  {beard.description}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onOpenVirtualTryOnWithStyle(undefined, beard)}
                    className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <IconRenderer name="Eye" className="w-3 h-3" />
                    <span>Try On</span>
                  </button>
                  <button
                    onClick={() => onBookWithStyle(undefined, beard.name)}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <IconRenderer name="Calendar" className="w-3 h-3" />
                    <span>Book Beard Service</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onRescan}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center gap-2 cursor-pointer border border-neutral-700"
        >
          <IconRenderer name="RotateCcw" className="w-4 h-4 text-amber-400" />
          <span>Scan Another Photo</span>
        </button>

        <button
          onClick={() => onBookWithStyle(matchedHairstyles[0]?.name, matchedBeardStyles[0]?.name)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 cursor-pointer flex items-center gap-2"
        >
          <IconRenderer name="Calendar" className="w-4 h-4" />
          <span>Book Complete AI Recommended Session</span>
        </button>
      </div>
    </div>
  );
};
