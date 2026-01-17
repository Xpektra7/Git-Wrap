import React, { useState } from "react";
import SocialShareDialog from "./SocialShareDialog";

// --- Shadcn/ui Imports ---
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react"; 

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

  // 1. STATE: Control the visibility of the dialog 
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const displayGrowth =
    growth === "ignore"
      ? ""
      : `${(growth as number) > 0 ? "↑" : "↓"} ${Math.abs(Number(growth))}%`;

  // Function to open the dialog 
  const handleShareClick = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog 
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-muted p-1 rounded-2xl border border-border">
      <Card className="relative flex flex-col">

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Button
            variant="ghost" 
            size="icon"    
            className="w-6 h-6 text-muted-foreground hover:text-primary" 
            title="Share Stat"
            onClick={handleShareClick}
          >
            <Share2 className="w-4 h-4" /> 
          </Button>
        </CardHeader>

        <CardContent className="">
          <div className="flex flex-wrap gap-2 items-baseline">
            <p className="text-2xl font-bold font-mono text-primary text-ellipsis overflow-hidden">
              {value && value !== 0 ? value : "0"}
            </p>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </CardContent>

        {prevValue !== undefined && (
          <CardFooter className="flex justify-between border-t">

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

    </div>
  );
}