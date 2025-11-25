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

  // --- 2. Font sizing helper (ADJUSTED FOR SMALLER CARD)
  const getFontSize = (len: number) => {
    // Reduced sizes proportionally from 7xl, 8xl, 9xl
    if (len >= 12) return "text-3xl"; // approx 30px
    if (len >= 8) return "text-4xl"; // approx 38px
    return "text-5xl"; // approx 48px
  };
  let fontSize = getFontSize(parsedValue.length);

  // --- 3. Title → prefix/suffix/emoji rules (Kept the same)
  const rules: any[] = [
    {
      key: "night owl",
      prefix: "I'm a",
      suffix: (extra: any) => `I made ${extra[0]}% of my commits late at night!`,
      value: (_: any, extra: any) => "Night Owl",
      emoji: "🦉"
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

  // --- 4. Apply rule if matched (Kept the same)
  let prefix = "",
    suffix = "",
    finalValue = parsedValue,
    currentEmoji = "✨";

  for (const rule of rules) {
    if (title.toLowerCase().includes(rule.key)) {
      prefix = rule.prefix || "";
      suffix = typeof rule.suffix === "function" ? rule.suffix(extra, subtitle) : rule.suffix || "";
      currentEmoji = rule.emoji || currentEmoji;
      if (rule.value) {
        finalValue = rule.value(parsedValue, extra, subtitle);
        fontSize = getFontSize(finalValue.length);
      }
      break;
    }
  }
  

  // --- 5. Render (Design focused on Duolingo inspiration)
  return (

    // FIXED SIZE: Reduced from 1024px to 400px, Padding reduced from p-20 to p-8
    <div 
      className={`w-[400px] h-[400px] aspect-square p-8 flex flex-col justify-between font-sans bg-linear-to-b from-50% from-primary to-purple-500/20 shadow-xl overflow-visible`}
      id="gitwrap-duolingo-card"
    >
      {/* --- Header (Logo and Year) --- */}
      <div className="flex flex-col items-start">
        {/* text-5xl -> text-xl */}
        <h1 className={`text-(--social-text) text-xl font-bold`}>
          GitWrap
        </h1>
        {/* text-3xl -> text-sm */}
        <p className={`text-(--social-sub) text-sm mt-0.5 opacity-80`}>
          {year} YEAR IN REVIEW
        </p>
      </div>

      {/* --- Main Content (Text and Illustration) --- */}
      <div className="flex justi items-end z-10 pb-4 h-full">
        
        {/* Left Side: Key Text */}
        {/* w-2/3 -> w-full (for better flow in a small card) */}
        <div className="flex flex-col w-full z-15"> 
          {/* text-4xl -> text-base, mb-6 -> mb-2 */}
          {prefix && <p className={`text-base text-(--social-text) font-semibold mb-2`}>{prefix}</p>}
          
          {finalValue && (
            // fontSize is now text-2xl/3xl/4xl. mb-6 -> mb-2
            <h3 className={`${fontSize} text-(--social-accent) font-black leading-none tracking-tight mb-2`}>
              {finalValue}
            </h3>
          )}

          {suffix && (
            // text-4xl -> text-base
            <p className={`text-base text-(--social-text) font-medium leading-snug`}>
              {suffix}
            </p>
          )}

          {/* User Handle - Always visible */}
          {/* text-4xl -> text-sm, mt-8 -> mt-3 */}
          <p className={`text-sm text-(--social-sub) mt-3 font-mono`}>
             @{username}
          </p>
        </div>
        
        {/* Right Side: Illustration/Badge (ADJUSTED POSITIONING AND SIZE) */}
        {/* w-[450px] -> w-[170px], adjusted positioning */}
        <div className="w-[170px] absolute top-8 right-[-0%] aspect-square flex items-center justify-center">
            {/* RENDER THE CODING PLANET BADGE WITH THE EMOJI */}
            <CodingPlanetBadge emoji={currentEmoji} />
        </div>

      </div>

      {/* --- Footer (Credit) --- */}
      {/* text-xl -> text-xs */}
      <p className={`text-xs text-(--social-sub) self-end`}>
        Built by Xpektra
      </p>
      
      {/* --- Background Decorative Element (ADJUSTED SIZE AND POSITION) --- */}
      {/* w-[600px] -> w-[250px] */}
      <div className="absolute top-[40%] translate-y-[-40%] -right-[15%] w-[250px] aspect-square rounded-full bg-white/5 opacity-5 pointer-events-none"></div>

    </div>
  );
}