import React from "react";
// Import the general illustration component directly
import CodingPlanetBadge from "./CodingPlanetBridge"; 

interface SocialCardProps {
  username?: string;
  title?: string;
  value?: any;
  subtitle?: string;
  extra?: any;
  // NOTE: badgeComponent is now unused, as the badge is integrated
  badgeComponent?: React.ReactNode; 
}

export default function SocialCard({ username = "gituser", title = "", value, subtitle, extra }: SocialCardProps) {
  
  // --- 1. Parse value safely
  let parsedValue = "";
  if (value !== null && value !== undefined) {
    parsedValue = value.toString();
    if (parsedValue.includes(":")) {
      parsedValue = parsedValue.split(":")[1].trim();
    }
  }

  const year = new Date().getFullYear();

  // --- 2. Font sizing helper
  const getFontSize = (len: number) => {
    if (len >= 12) return "text-7xl";
    if (len >= 8) return "text-8xl";
    return "text-9xl"; // Massive size for short values like '1200' or 'Night Owl'
  };
  let fontSize = getFontSize(parsedValue.length);

  // --- 3. Title → prefix/suffix/emoji rules (ADDED 'emoji' KEY)
  const rules: any[] = [
    {
      key: "night owl",
      prefix: "I'm a",
      suffix: (extra: any) => `I made ${extra[0]}% of my commits late at night!`,
      value: (_: any, extra: any) => "Night Owl",
      emoji: "🦉" // Specific badge should override this, but good default
    },
    { key: "collaborations", prefix: "I collaborated on", suffix: () => "different repos this year", emoji: "🤝" },
    { key: "follower", prefix: "I gained", suffix: () => "new followers this year", emoji: "📈" },
    { key: "repos", prefix: "I created", suffix: () => "new repos this year", emoji: "📁" },
    { key: "repo", prefix: "My most active project is", suffix: (_: any, subtitle: any) => `with ${subtitle}`, emoji: "🥇" },
    { key: "commits", prefix: "I made a total of", suffix: () => "commits this year", emoji: "✍️" },
    { key: "pull", prefix: "I opened", suffix: () => "pull requests this year", emoji: "⚙️" },
    { key: "language", prefix: "I coded mostly in", suffix: () => "this year", emoji: "💻" },
    { key: "stars", prefix: "I received", suffix: () => "stars on my repositories this year", emoji: "🌟" },
    { key: "streak", prefix: "My longest commit streak is", suffix: () => "days", emoji: "🔥" },
  ];

  // --- 4. Apply rule if matched
  let prefix = "",
    suffix = "",
    finalValue = parsedValue,
    currentEmoji = "✨"; // Default fallback emoji

  for (const rule of rules) {
    if (title.toLowerCase().includes(rule.key)) {
      prefix = rule.prefix || "";
      suffix = typeof rule.suffix === "function" ? rule.suffix(extra, subtitle) : rule.suffix || "";
      currentEmoji = rule.emoji || currentEmoji; // Set the specific emoji
      if (rule.value) {
        finalValue = rule.value(parsedValue, extra, subtitle);
        fontSize = getFontSize(finalValue.length);
      }
      break;
    }
  }

  // --- 5. Render (Design focused on Duolingo inspiration)
  return (

    // Fixed size for reliable capture (1024x1024 or similar square)
    <div 
      className={`relative w-[1024px] h-[1024px] z-10 p-20 flex flex-col justify-between font-sans bg- shadow-xl overflow-hidden`}
      id="gitwrap-duolingo-card"
    >
      {/* --- Header (Logo and Year) --- */}
      <div className="flex flex-col items-start">
        <h1 className={`text-(--social-text) text-5xl font-bold`}>
          GitWrap
        </h1>
        <p className={`text-(--social-sub) text-3xl mt-1 opacity-80`}>
          {year} YEAR IN REVIEW
        </p>
      </div>

      {/* --- Main Content (Text and Illustration) --- */}
      <div className="flex justify-between items-center z-10">
        
        {/* Left Side: Key Text */}
        <div className="flex flex-col w-2/3">
          {prefix && <p className={`text-4xl text-(--social-text) font-semibold mb-6`}>{prefix}</p>}
          
          {finalValue && (
            <h3 className={`${fontSize} text-(--social-accent) font-black leading-none mb-6 tracking-tight`}>
              {finalValue}
            </h3>
          )}

          {suffix && (
            <p className={`text-4xl text-(--social-text) font-medium leading-snug`}>
              {suffix}
            </p>
          )}

          {/* User Handle - Always visible */}
          <p className={`text-4xl text-(--social-sub) mt-8 font-mono`}>
             @{username}
          </p>
        </div>
        
        {/* Right Side: Illustration/Badge (NOW EMBEDDED) */}
        <div className="w-[450px] absolute right-0 aspect-square flex items-center justify-center">
            {/* RENDER THE CODING PLANET BADGE WITH THE EMOJI */}
            <CodingPlanetBadge emoji={currentEmoji} />
        </div>

      </div>

      {/* --- Footer (Credit) --- */}
      <p className={`text-xl text-(--social-sub) self-end`}>
        Built by Xpektra
      </p>
      
      {/* --- Background Decorative Element (Optional but adds depth) --- */}
      <div className="absolute top-[50%] translate-y-[-40%] -right-[10%] w-[600px] aspect-square rounded-full bg-white/5 opacity-5 pointer-events-none"></div>

    </div>
  );
}