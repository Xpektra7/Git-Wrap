import React from 'react';
import { LucideAlarmClockCheck, Sparkles } from "lucide-react"; // Import a sensible default icon

// Update the prop definition to expect an Icon component
interface CodingPlanetBadgeProps {
  Icon: React.ElementType; 
}

// NOTE: We no longer set a default prop value in the function signature.
export default function CodingPlanetBadge({ Icon }: CodingPlanetBadgeProps) {
  
  // Use the passed Icon component, or fall back to Sparkles if not provided
  const RenderIcon = Icon || Sparkles; 
    


  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative rounded-full flex items-center justify-center shadow-lg"
        // Use standardized accentColor variable
      >
        {/* REVISED: Render the Lucide icon component directly, not inside a <span> */}
        <RenderIcon 
          // Lucide icons accept className for styling
          className="w-32 h-32 text-purple-500 drop-shadow-md" 
          strokeWidth={1.5} 
        />
      </div>
    </div>
  );
};