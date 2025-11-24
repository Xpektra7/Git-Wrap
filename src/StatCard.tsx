import React, { useRef, useState } from "react";
import SocialShareDialog from "./components/SocialShareDialog"; // <--- New Import

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
    // We remove the SocialCard from here and place it inside the dialog
    <div className="flex relative flex-col rounded border border-(--border)">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-sm text-(--sub-text)">{title}</h2>
          <div
            className="cursor-pointer text-(--sub-text) hover:text-(--color)"
            title="Download as image"
            // 2. ACTION: Open the dialog on click
            onClick={handleShareClick} 
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-baseline">
          <p className="text-(--color) font-bold">{value && value !== 0 ? value : "0"}</p>
          {subtitle && <p className="text-sm text-(--sub-text)">{subtitle}</p>}
        </div>
      </div>
      {prevValue !== undefined && (
        <div className="flex p-2 px-4 justify-between border-t border-(--border) pt-2">
          <p className="text-sm text-(--sub-text)">
            {prevValue}
            {prevSubtitle && <span className="text-sm text-(--sub-text) ml-2">{prevSubtitle}</span>}
          </p>
          <p className="text-sm text-(--sub-text)">{displayGrowth}</p>
        </div>
      )}
      
      {/* 3. CONDITIONAL RENDER: Display the dialog */}
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

    </div>
  );
}