import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div id="hygienely-app-logo" className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon combining Leaf + Water Drop + Health Shield + Check Mark */}
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-md shadow-emerald-500/25 ${iconSizes[size]} shrink-0 transition-transform hover:scale-105`}>
        {/* Organic Leaf / Water Drop Geometry */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Gentle Drop/Shield Backing */}
          <path
            d="M24 4C24 4 11 16.5 11 26.5C11 34.5 16.8 41 24 41C31.2 41 37 34.5 37 26.5C37 16.5 24 4 24 4Z"
            fill="white"
            fillOpacity="0.22"
          />
          {/* Healthy Vibrant Leaf Arc */}
          <path
            d="M24 8C24 8 15 18 15 26.5C15 32 19 36.5 24 37C24 28 29 19 33 14C30 9.5 24 8 24 8Z"
            fill="white"
            fillOpacity="0.5"
          />
          {/* Crisp Check Mark symbolizing habit done */}
          <path
            d="M17 25.5L22 30.5L32 19"
            stroke="white"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sparkle highlight */}
          <circle cx="33" cy="11" r="2.5" fill="#FEF08A" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-800 dark:text-white ${textSizes[size]}`}>
            Hygienely
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        {showTagline && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
            Small Habits, Big Changes
          </span>
        )}
      </div>
    </div>
  );
};
