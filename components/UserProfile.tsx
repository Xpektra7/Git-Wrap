import React from "react";

// --- shadcn/ui Imports ---
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkedinIcon, TwitterIcon, UserX, Link } from "lucide-react"; // Standard Lucide icons

interface UserProfileProps {
  userProfile: any | null;
  username: string;
}

export default function UserProfile({ userProfile, username }: UserProfileProps) {
  
  // --- 1. Loading/Skeleton State ---
  if (!userProfile) {
    return (
      <Card className="flex items-center gap-4 p-4">
        {/* bg-(--border) -> bg-border */}
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex flex-col gap-2">
          {/* bg-(--border) -> bg-border */}
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Card>
    );
  }

  // --- 2. Error State ---
  if (userProfile.error) {
    return (
      <Card className="flex items-center gap-4 p-4 text-destructive border-destructive/50 bg-destructive/10">
        <div className="w-16 h-16 rounded-full flex items-center justify-center">
          <UserX className="w-8 h-8" /> {/* Lucide icon for error */}
        </div>
        <div className="flex flex-col">
          {/* text-(--color) -> text-foreground */}
          <h3 className="font-semibold text-foreground">{username}</h3>
          {/* text-(--sub-text) -> text-muted-foreground */}
          <p className="text-sm text-muted-foreground">Profile data unavailable</p>
        </div>
      </Card>
    );
  }

  // --- 3. Success State ---
  return (
    // bg-(--background-color) -> bg-background
    <Card className="flex flex-col gap-4 p-6 bg-background">
      <CardContent className="p-0 flex flex-col gap-4">
        {/* Main Profile Section */}
        <div className="flex items-start gap-4">
          <img
            src={userProfile.avatarUrl}
            alt={`${userProfile.name || username}'s avatar`}
            // border-(--border) -> border-border
            className="w-20 h-20 rounded-full border-2 border-border"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userProfile.name || username);
            }}
          />
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div>
              {/* text-(--color) -> text-foreground */}
              <h2 className="text-xl font-bold text-foreground">{userProfile.name || username}</h2>
              {/* text-(--sub-text) -> text-muted-foreground */}
              <p className="text-muted-foreground">@{username}</p>
            </div>

            {/* Website Link */}
            {userProfile.websiteUrl && (
              <a
                href={userProfile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                // text-(--color) -> text-primary; hover:text-(--sub-text) -> hover:text-muted-foreground
                className="flex items-center gap-2 text-sm text-primary hover:text-muted-foreground transition-colors min-w-0 max-w-full"
              >
                <Link className="w-4 h-4" /> {/* Lucide Link icon */}
                <span className="truncate">{userProfile.websiteUrl.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-3">
          {/* Twitter/X */}
          {userProfile.twitterUsername && (
            <a
              href={`https://twitter.com/${userProfile.twitterUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              // bg-(--border) -> bg-accent; text-(--color) -> text-foreground; hover:bg-(--sub-text) -> hover:bg-muted
              className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-sm text-foreground hover:bg-muted transition-colors min-w-0"
            >
              <TwitterIcon className="w-4 h-4" /> {/* Lucide Twitter icon */}
              @{userProfile.twitterUsername}
            </a>
          )}

          {/* Other Social Accounts */}
          {userProfile.socialAccounts?.filter((account: any) =>
            account.provider.toLowerCase() !== "twitter" &&
            account.provider.toLowerCase() !== "x"
          ).map((account: any, index: number) => (
            <a
              key={index}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              // bg-(--border) -> bg-accent; text-(--color) -> text-foreground; hover:bg-(--sub-text) -> hover:bg-muted
              className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-sm text-foreground hover:bg-muted transition-colors min-w-0"
            >
              <LinkedinIcon className="w-4 h-4" /> {/* Lucide Globe icon (general social link) */}
              <span className="truncate">{account.displayName || account.provider}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}