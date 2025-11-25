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
            title="Share Stat"
            // 2. ACTION: Open the dialog on click
            onClick={handleShareClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"></path><path strokeLinecap="round" d="M14 6.5L9 10m5 7.5L9 14"></path><path d="M19 18.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm0-13a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"></path></g></svg>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-baseline">
          <p className="text-(--color) font-bold font-mono">{value && value !== 0 ? value : "0"}</p>
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