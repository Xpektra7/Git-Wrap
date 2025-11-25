import React, { useState } from "react";
import SocialShareDialog from "./SocialShareDialog"; // Your existing dialog

// --- Shadcn/ui Imports ---
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react"; // Using a standard lucide icon

interface StatCardProps {
  username?: string;
  title: React.ReactNode;
  value?: string | number | React.ReactNode;
  subtitle?: string;
  prevValue?: string | number;
  prevSubtitle?: string;
  growth?: number | string;
  extra?: any;
}

export default function StatCard({
  username,
  title,
  value,
  subtitle,
  prevValue,
  prevSubtitle,
  growth,
  extra,
}: StatCardProps): React.ReactElement {
  
  // 1. STATE: Control the visibility of the dialog (Unchanged)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const displayGrowth =
    growth === "ignore"
      ? ""
      : `${(growth as number) > 0 ? "↑" : "↓"} ${Math.abs(Number(growth))}%`;

  // Function to open the dialog (Unchanged)
  const handleShareClick = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog (Unchanged)
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    // 1. Replaced the main div with the Card component.
    // The default shadcn Card styling replaces 'rounded border border-border'.
    <Card className="relative flex flex-col">
      
      {/* 2. Replaced the header div with CardHeader */}
      <CardHeader className="flex flex-row items-center justify-between">
        
        {/* 3. Replaced h2 with CardTitle. Assuming text-(--sub-text) is equivalent to text-muted-foreground or text-sm. */}
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        
        {/* 4. Replaced the clickable div/svg with a shadcn Button component */}
        <Button
          variant="ghost" // Makes it look like an icon without background
          size="icon"     // Standard small, square icon button size
          className="w-6 h-6 text-muted-foreground hover:text-primary" // Use standard colors
          title="Share Stat"
          onClick={handleShareClick}
        >
          <Share2 className="w-4 h-4" /> {/* Lucide Share icon */}
        </Button>
      </CardHeader>

      {/* 5. Replaced the content div with CardContent */}
      <CardContent className="">
        <div className="flex flex-wrap gap-2 items-baseline">
          {/* text-(--color) is assumed to be text-primary or a main highlight color */}
          <p className="text-2xl font-bold font-mono text-primary">
            {value && value !== 0 ? value : "0"}
          </p>
          {/* text-(--sub-text) is assumed to be text-muted-foreground */}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>

      {/* 6. Replaced the footer div with CardFooter */}
      {prevValue !== undefined && (
        <CardFooter className="flex justify-between border-t">
          {/* text-(--sub-text) is assumed to be text-muted-foreground */}
          <p className="text-sm text-muted-foreground">
            {prevValue}
            {prevSubtitle && (
              <span className="text-sm text-muted-foreground ml-2">
                {prevSubtitle}
              </span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{displayGrowth}</p>
        </CardFooter>
      )}

      {/* 7. Your dialog logic remains exactly the same */}
      {isDialogOpen && (
        <SocialShareDialog
          username={username}
          title={String(title)}
          value={value}
          subtitle={subtitle}
          extra={extra}
          onClose={handleCloseDialog}
        />
      )}
    </Card>
  );
}