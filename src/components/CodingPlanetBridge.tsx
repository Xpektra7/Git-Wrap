import React from 'react';

/**
 * CodingPlanetBadge Component
 * * A general, abstract illustration for most stats, representing 
 * a stylized planet/data system using pure CSS shapes and rotation.
 * * @param {string} emoji - The specific emoji (e.g., '✍️', '⭐') for the stat being displayed.
 */
const CodingPlanetBadge = ({ emoji = '✨' }) => {
  // Use colors defined by CSS variables
  const accentColor = 'var(--color-accent-text)'; 
  const orbitColor = 'var(--color-sub-text)';

  // Note: Ensure you have Tailwind's 'animate-spin' utility available
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* 1. Central Planet */}
      <div 
        className="relative w-1/3 h-1/3 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 30px 5px ${accentColor}80` }}
      >
        {/* Metric Specific Emoji (Hybrid Part) */}
        <span className="text-9xl drop-shadow-md" role="img" aria-label="metric icon">
          {emoji}
        </span>
      </div>
    </div>
  );
};

export default CodingPlanetBadge;