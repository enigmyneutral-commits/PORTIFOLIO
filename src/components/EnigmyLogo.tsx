import React from 'react';

interface EnigmyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const EnigmyLogo: React.FC<EnigmyLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = false
}) => {
  // Height presets
  const heightClass = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg 
        viewBox="0 0 320 160" 
        className={`${heightClass} w-auto object-contain shrink-0`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Enigmy Neutral Logo"
      >
        {/* Top sweeping dynamic arch */}
        <path 
          d="M 68 68 C 96 30, 200 22, 268 54" 
          stroke="currentColor" 
          strokeWidth="3.8" 
          strokeLinecap="round" 
          className="text-white/80"
        />
        
        {/* Bottom left orbital sweep around the N */}
        <path 
          d="M 52 86 C 36 94, 34 116, 76 128" 
          stroke="currentColor" 
          strokeWidth="3.8" 
          strokeLinecap="round" 
          className="text-white/80"
        />

        {/* ENIGMY typography */}
        <text 
          x="160" 
          y="86" 
          textAnchor="middle" 
          fill="#FFFFFF" 
          fontFamily="'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontWeight="800" 
          fontSize="44" 
          letterSpacing="4"
        >
          ENIGMY
        </text>

        {/* NEUTRAL typography */}
        <text 
          x="160" 
          y="120" 
          textAnchor="middle" 
          fill="#F5F7F4" 
          fontFamily="'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontWeight="600" 
          fontSize="22" 
          letterSpacing="9"
        >
          NEUTRAL
        </text>
      </svg>

      {showSubtitle && (
        <span className="text-[10px] font-mono tracking-widest text-[#737D77] uppercase hidden sm:inline-block border-l border-[#293033] pl-2.5">
          SOFTWARE ENGINEERING
        </span>
      )}
    </div>
  );
};
