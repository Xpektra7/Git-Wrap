import React from "react";
import CodingPlanetBadge from "./CodingPlanetBridge"; 
import {
    Moon, Handshake, TrendingUp, FolderGit, Trophy, GitCommit, GitPullRequest, Code, Star, Flame, Sparkles, Sun
} from "lucide-react";

interface SocialCardProps {
  username?: string;
  title?: string;
  value?: any;
  subtitle?: string;
  extra?: any;
}

export default function SocialCard({ username = "gituser", title = "", value, subtitle, extra=["",""] }: SocialCardProps) {
  
  // --- 1. Parse value safely (Unchanged)
  let parsedValue = "";
  if (value !== null && value !== undefined) {
    parsedValue = value.toString();
    if (parsedValue.includes(":")) {
      parsedValue = parsedValue.split(":")[1].trim();
    }
  }

  const year = new Date().getFullYear();

  // --- 2. Font sizing helper (Unchanged)
  const getFontSize = (len: number) => {
    if (len >= 12) return "text-3xl"; 
    if (len >= 8) return "text-4xl"; 
    return "text-5xl"; 
  };
  let fontSize = getFontSize(parsedValue.length);

  // --- 3. Title → prefix/suffix/icon rules (REPLACED EMOJIS WITH LUCIDE COMPONENTS)
  const rules: any[] = [
    {
      key: "night owl",
      prefix: `I'm ${extra[1] === 'during the day' ? 'an' : 'a'}`,
      suffix: (extra: any) => `I made ${extra[0]}% of my commits ${extra[1]}`,
      value: (_: any, extra: any) => `${extra[1] === 'during the day' ? 'Early Bird' : 'Night Owl'}`,
      icon: extra[1] === 'during the day' ? Sun : Moon,
    },
    { key: "collaborations", prefix: "I collaborated on", suffix: () => "different repos this year", icon: Handshake }, 
    { key: "follower", prefix: "I gained", suffix: () => "new followers this year", icon: TrendingUp }, 
    { key: "repos", prefix: "I created", suffix: () => "new repos this year", icon: FolderGit }, 
    { key: "repo", prefix: "My most active project is", suffix: (_: any, subtitle: any) => `with ${subtitle}`, icon: Trophy }, 
    { key: "commits", prefix: "I made a total of", suffix: () => "commits this year", icon: GitCommit }, // Replaced "✍️" with GitCommit
    { key: "pull", prefix: "I opened", suffix: () => "pull requests this year", icon: GitPullRequest }, // Replaced "⚙️" with GitPullRequest
    { key: "language", prefix: "I coded mostly in", suffix: () => "this year", icon: Code }, // Replaced "💻" with Code
    { key: "stars", prefix: "I received", suffix: () => "stars on my repositories this year", icon: Star }, // Replaced "🌟" with Star
    { key: "streak", prefix: "My longest commit streak is", suffix: () => "days", icon: Flame }, // Replaced "🔥" with Flame
  ];

  // --- 4. Apply rule if matched
  let prefix = "",
    suffix = "",
    finalValue = parsedValue,
    // The currentIcon will be the component itself (e.g., <Star />)
    CurrentIcon = Sparkles; // Default Icon
  
  for (const rule of rules) {
    if (title.toLowerCase().includes(rule.key)) {
      prefix = rule.prefix || "";
      suffix = typeof rule.suffix === "function" ? rule.suffix(extra, subtitle) : rule.suffix || "";
      CurrentIcon = rule.icon || CurrentIcon; // <-- Store the icon component
      if (rule.value) {
        finalValue = rule.value(parsedValue, extra, subtitle);
        fontSize = getFontSize(finalValue.length);
      }
      break;
    }
  }
  

  // --- 5. Render (Standardized Aliases Retained)
  return (
    <div 
      className={`w-[400px] h-[400px] aspect-square relative p-8 flex flex-col justify-between font-sans bg-linear-to-b from-50% from-background to-purple-500/20 shadow-xl overflow-visible`}
      id="gitwrap-duolingo-card"
    >
      {/* ... Header ... */}
      <div className="flex flex-col items-start">
        <h1 className={`text-social-text text-xl font-bold`}>
          GitWrap
        </h1>
        <p className={`text-social-sub text-sm mt-0.5 opacity-80`}>
          {year} YEAR IN REVIEW
        </p>
      </div>

      {/* --- Main Content (Text and Illustration) --- */}
      <div className="flex justi items-end z-10 pb-4 h-full">
        
        {/* Left Side: Key Text */}
        <div className="flex flex-col w-full z-15"> 
          {prefix && <p className={`text-base mb-2`}>{prefix}</p>}
          
          {finalValue && (
            <h3 className={`${fontSize} text-purple-500 font-black font-mono leading-none tracking-tight mb-2`}>
              {finalValue}
            </h3>
          )}

          {suffix && (
            <p className={`text-base leading-snug`}>
              {suffix}
            </p>
          )}

          {/* User Handle - Always visible */}
          <p className={`text-sm text-muted-foreground mt-3 font-mono`}>
             @{username}
          </p>
        </div>
        
        {/* Right Side: Illustration/Badge */}
        <div className="w-[170px] absolute top-12 right-4 aspect-square flex items-center justify-center">
            {/* PASS THE ICON COMPONENT ITSELF */}
            <CodingPlanetBadge Icon={CurrentIcon} /> 
        </div>

      </div>

      {/* --- Footer (Credit) --- */}
      <p className={`text-xs text-muted-foreground self-end`}>
        Built by Xpektra
      </p>
      

    </div>
  );
}