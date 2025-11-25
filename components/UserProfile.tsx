import React from "react";

interface UserProfileProps {
  userProfile: any | null;
  username: string;
}

export default function UserProfile({ userProfile, username }: UserProfileProps) {
  if (!userProfile) {
    return (
      <div className="flex items-center gap-4 p-4 border border-(--border) rounded-md">
        <div className="w-16 h-16 bg-(--border) rounded-full animate-pulse"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-(--border) rounded w-32 animate-pulse"></div>
          <div className="h-3 bg-(--border) rounded w-24 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (userProfile.error) {
    return (
      <div className="flex items-center gap-4 p-4 border border-(--border) rounded-md">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H21M9 12C9 13.1 9.9 14 11 14H13C14.1 14 15 13.1 15 12V9H9V12Z"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-(--color)">{username}</h3>
          <p className="text-sm text-(--sub-text)">Profile data unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 border border-(--border) rounded-md bg-(--background-color)">
      {/* Main Profile Section */}
      <div className="flex items-start gap-4">
        <img
          src={userProfile.avatarUrl}
          alt={`${userProfile.name || username}'s avatar`}
          className="w-20 h-20 rounded-full border-2 border-(--border)"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userProfile.name || username);
          }}
        />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <h2 className="text-xl font-bold text-(--color)">{userProfile.name || username}</h2>
            <p className="text-(--sub-text)">@{username}</p>
          </div>

          {/* Website Link */}
          {userProfile.websiteUrl && (
            <a
              href={userProfile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-(--color) hover:text-(--sub-text) transition-colors min-w-0 max-w-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.78,13.4L6.37,14.81C5.96,15.2 5.36,15.2 4.95,14.81L3.54,13.4C3.13,13 3.13,12.4 3.54,12L9.19,6.37C9.6,5.96 10.2,5.96 10.61,6.37L12,7.78L13.41,6.37C13.8,5.96 14.4,5.96 14.81,6.37L20.46,12C20.87,12.4 20.87,13 20.46,13.41L19.05,14.82C18.64,15.23 18.04,15.23 17.63,14.82L16.22,13.41L14.81,14.82C14.4,15.23 13.8,15.23 13.39,14.82L12,13.41L10.59,13.41Z"/>
              </svg>
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
            className="flex items-center gap-2 px-3 py-1 bg-(--border) rounded-full text-sm text-(--color) hover:bg-(--sub-text) transition-colors min-w-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.05C2.38,12.15 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,15.98 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
            </svg>
            @{userProfile.twitterUsername}
          </a>
        )}

        {userProfile.socialAccounts?.filter((account: any) =>
          account.provider.toLowerCase() !== "twitter" &&
          account.provider.toLowerCase() !== "x"
        ).map((account: any, index: number) => (
          <a
            key={index}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-(--border) rounded-full text-sm text-(--color) hover:bg-(--sub-text) transition-colors min-w-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.78,13.4L6.37,14.81C5.96,15.2 5.36,15.2 4.95,14.81L3.54,13.4C3.13,13 3.13,12.4 3.54,12L9.19,6.37C9.6,5.96 10.2,5.96 10.61,6.37L12,7.78L13.41,6.37C13.8,5.96 14.4,5.96 14.81,6.37L20.46,12C20.87,12.4 20.87,13 20.46,13.41L19.05,14.82C18.64,15.23 18.04,15.23 17.63,14.82L16.22,13.41L14.81,14.82C14.4,15.23 13.8,15.23 13.39,14.82L12,13.41L10.59,13.41Z"/>
            </svg>
            <span className="truncate">{account.displayName || account.provider}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
