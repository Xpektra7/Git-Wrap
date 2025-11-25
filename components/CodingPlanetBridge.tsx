const CodingPlanetBadge = ({ emoji = '✨' }) => {
  const accentColor = 'var(--color-accent-text)';


  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative w-1/3 h-1/3 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 30px 5px ${accentColor}80` }}
      >
        <span className="text-9xl drop-shadow-md" role="img" aria-label="metric icon">
          {emoji}
        </span>
      </div>
    </div>
  );
};

export default CodingPlanetBadge;