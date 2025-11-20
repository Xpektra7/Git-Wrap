import { useEffect, useState } from "react";
import type { SetURLSearchParams } from "react-router-dom";
import StatCard from "./StatCard";
import DailyCommits from "./components/DailyCommits";
import HourlyCommits from "./components/HourlyCommits";
import LanguageOverview from "./components/LanguagesOverview";
import UserProfile from "./components/UserProfile";
import MetaTags from "./components/MetaTags";
import {
  fetchRepos,
  getTotalCommits,
  mostActiveRepo,
  getStarsReceived,
  getStarsGiven,
  getTopLanguages,
  getCommitTimeAnalysis,
  getStreaks,
  getCollaborationCount,
  getPullRequestsStats,
  getFollowersGrowth,
  getUserProfile,
} from "./lib/github";

interface StatsProps {
  username: string;
  year: number;
  theme?: string;
  setSearchParams?: SetURLSearchParams;
}

export default function Stats({ username, year, theme }: StatsProps) {
  // User Profile State
  const [userProfile, setUserProfile] = useState<any | null>(null);

  // Current Year States
  const [repos, setRepos] = useState<any[]>([]);
  const [commitsInAYear, setCommitsInAYear] = useState<number>(0);
  const [activeRepo, setActiveRepo] = useState<any | null>(null);
  const [starsReceived, setStarsReceived] = useState<any>(0);
  const [starsGiven, setStarsGiven] = useState<any>(0);
  const [topLanguages, setTopLanguages] = useState<any[]>([]);
  const [collaborationCount, setCollaborationCount] = useState<number>(0);
  const [commitTimeAnalysis, setCommitTimeAnalysis] = useState<any>({
    hourDistribution: Array(24).fill(0),
    nightOwl: 0,
    earlyBird: 0,
  });
  // legacy: stars data not used in UI currently
  const [streakInfo, setStreakInfo] = useState<any>({
    longestStreak: 0,
    longestBreak: 0,
    currentStreak: 0,
  });
  const [pullRequestStats, setPullRequestStats] = useState<any>({});
  const [followers, setFollowers] = useState<{ count: number }>({ count: 0 });

  // Previous Year States
  const [prevPullRequestStats, setPrevPullRequestStats] = useState<any>({});
  const [prevRepos, setPrevRepos] = useState<any[]>([]);
  const [prevCommitsInAYear, setPrevCommitsInAYear] = useState<number>(0);
  const [prevActiveRepo, setPrevActiveRepo] = useState<any | null>(null);
  const [prevStarsReceived, setPrevStarsReceived] = useState<any>(0);
  const [prevStarsGiven, setPrevStarsGiven] = useState<any>(0);
  const [prevTopLanguages, setPrevTopLanguages] = useState<any[]>([]);
  const [prevCollaborationCount, setPrevCollaborationCount] = useState<number>(0);
  const [prevCommitTimeAnalysis, setPrevCommitTimeAnalysis] = useState<any>({
    hourDistribution: Array(24).fill(0),
    nightOwl: 0,
    earlyBird: 0,
  });
  const [prevStreakInfo, setPrevStreakInfo] = useState<any>({
    longestStreak: 0,
    longestBreak: 0,
    currentStreak: 0,
  });
  const [prevFollowers, setPrevFollowers] = useState<{ count: number }>({ count: 0 });
  const prevYear = year - 1;

  useEffect(() => {
    // Fetch user profile
    getUserProfile(username)
      .then(setUserProfile)
      .catch((error: any) => setUserProfile({ error: error.message || "Failed to fetch profile" }));

    // Fetch repos
  fetchRepos(username, String(year)).then((r: any) => setRepos(r as any));
  fetchRepos(username, String(prevYear)).then((r: any) => setPrevRepos(r as any));
    // Total Commits
  getTotalCommits(username, String(year)).then((r: any) => setCommitsInAYear(r as number));
  getTotalCommits(username, String(prevYear)).then((r: any) => setPrevCommitsInAYear(r as number));
    // Active repos
  mostActiveRepo(username, String(year)).then((r: any) => setActiveRepo(r as any));
  mostActiveRepo(username, String(prevYear)).then((r: any) => setPrevActiveRepo(r as any));

    // Stars Received
  getStarsReceived(username, String(year)).then((r: any) => setStarsReceived(r as any));
  getStarsReceived(username, String(prevYear)).then((r: any) => setPrevStarsReceived(r as any));
    // Stars Given
  getStarsGiven(username, String(year)).then((r: any) => setStarsGiven(r as any));
  getStarsGiven(username, String(prevYear)).then((r: any) => setPrevStarsGiven(r as any));
    // Top Languages
  getTopLanguages(username, String(year)).then((r: any) => setTopLanguages(r as any));
  getTopLanguages(username, String(prevYear)).then((r: any) => setPrevTopLanguages(r as any));
    // Commit Time
  getCommitTimeAnalysis(username, String(year)).then((r: any) => setCommitTimeAnalysis(r as any));
  getCommitTimeAnalysis(username, String(prevYear)).then((r: any) => setPrevCommitTimeAnalysis(r as any));
    // Streaks
  getStreaks(username, String(year)).then((r: any) => setStreakInfo(r as any));
  getStreaks(username, String(prevYear)).then((r: any) => setPrevStreakInfo(r as any));
    // Collaboration
  getCollaborationCount(username, String(year)).then((r: any) => setCollaborationCount(r as number));
  getCollaborationCount(username, String(prevYear)).then((r: any) => setPrevCollaborationCount(r as number));
    // Pull requests
  getPullRequestsStats(username, String(year)).then((r: any) => setPullRequestStats(r as any));
  getPullRequestsStats(username, String(prevYear)).then((r: any) => setPrevPullRequestStats(r as any));
    // Followers
  getFollowersGrowth(username, String(year)).then((r: any) => setFollowers(r as { count: number }));
  getFollowersGrowth(username, String(prevYear)).then((r: any) => setPrevFollowers(r as { count: number }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, year]);


  return (
    <div className="flex flex-col w-full gap-16">
      {/* Dynamic Meta Tags for Social Media Previews */}
      <MetaTags
        userProfile={userProfile}
        username={username}
        stats={{
          commits: commitsInAYear,
          repos: repos?.length || 0,
          topLanguage: topLanguages.length > 0 ? topLanguages[0].name : null,
          mostActiveRepo: activeRepo?.repo,
        }}
      />
      {/* User Profile Section */}
      <UserProfile userProfile={userProfile} username={username} />

      {/* Basic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Repos Created in that year */}
        <StatCard
          username={username}
          title={`Repos Created in ${year}`}
          value={repos ? repos.length : 0}
          prevValue={prevRepos ? prevRepos.length : 0}
          growth={
            repos && prevRepos && prevRepos.length !== 0
              ? Math.round(((repos.length - prevRepos.length) / prevRepos.length) * 100)
              : 0
          }
        />
        {/* Total Commits in that year*/}
        <StatCard
          username={username}
          title={`Total Commits in ${year}`}
          value={commitsInAYear}
          prevValue={prevCommitsInAYear}
          growth={
            prevCommitsInAYear
              ? Math.round(((commitsInAYear - prevCommitsInAYear) / prevCommitsInAYear) * 100)
              : 0
          }
        />
        {/* Most Active Repo */}
        <StatCard
          username={username}
          title="Most Active Repo"
          value={activeRepo?.repo || "No activity"}
          subtitle={activeRepo ? `${activeRepo.commits} commits` : "Loading..."}
          prevValue={prevActiveRepo?.repo || "No activity"}
          prevSubtitle={prevActiveRepo?.commits || "0"}
          growth={
            activeRepo &&
            prevActiveRepo &&
            typeof activeRepo.commits === "number" &&
            typeof prevActiveRepo.commits === "number" &&
            prevActiveRepo.commits !== 0
              ? Math.round(((activeRepo.commits - prevActiveRepo.commits) / prevActiveRepo.commits) * 100)
              : 0
          }
        />
        {/* Collaboration */}
        <StatCard
          username={username}
          title="Collaborations"
          value={collaborationCount || 0}
          prevValue={prevCollaborationCount || 0}
          growth={
            prevCollaborationCount !== 0
              ? Math.round(((collaborationCount - prevCollaborationCount) / prevCollaborationCount) * 100)
              : 0
          }
        />
        {/* Pull requests vs Merged */}
        <StatCard
          username={username}
          title="Pull Requests"
          value={`${pullRequestStats.opened || 0}`}
          subtitle={`Merged: ${pullRequestStats.merged || 0}`}
          prevValue={`${prevPullRequestStats.opened || 0}`}
          prevSubtitle={`Merged: ${prevPullRequestStats.merged || 0}`}
          growth={'ignore'}
        />
        {/* Top Language*/}
        <StatCard
          username={username}
          title="Top Language"
          value={topLanguages.length > 0 ? topLanguages[0].name : "None"}
          subtitle={topLanguages.length > 0 ? `${topLanguages[0].count} repos` : ""}
          prevValue={prevTopLanguages.length > 0 ? prevTopLanguages[0].name : "None"}
          prevSubtitle={prevTopLanguages.length > 0 ? `${prevTopLanguages[0].count} repos` : ""}
          growth={'ignore'}
        />
        {/* Stars */}
        <StatCard
          username={username}
          title="Stars"
          value={`Received: ${starsReceived?.error ? starsReceived.error : starsReceived}`}
          subtitle={`Given: ${Array.isArray(starsGiven) ? starsGiven.length : starsGiven?.error || 0}`}
          prevValue={`Received: ${prevStarsReceived?.error ? prevStarsReceived.error : prevStarsReceived}`}
          prevSubtitle={`Given: ${Array.isArray(prevStarsGiven) ? prevStarsGiven.length : prevStarsGiven?.error || 0}`}
          growth={'ignore'}
        />
        {/* Night Owl vs Early Bird */}
        <StatCard
          username={username}
          title="Night Owl vs Early Bird"
          value={
            commitTimeAnalysis.nightOwl > commitTimeAnalysis.earlyBird
              ? `Night: ${commitTimeAnalysis.nightOwl}`
              : `Early: ${commitTimeAnalysis.earlyBird}`
          }
          subtitle={
            commitTimeAnalysis.nightOwl > commitTimeAnalysis.earlyBird
              ? `Early: ${commitTimeAnalysis.earlyBird}`
              : `Night: ${commitTimeAnalysis.nightOwl}`
          }
          prevValue={
            prevCommitTimeAnalysis.nightOwl > prevCommitTimeAnalysis.earlyBird
              ? `Night: ${prevCommitTimeAnalysis.nightOwl}`
              : `Early: ${prevCommitTimeAnalysis.earlyBird}`
          }
          prevSubtitle={
            prevCommitTimeAnalysis.nightOwl > prevCommitTimeAnalysis.earlyBird
              ? `Early: ${prevCommitTimeAnalysis.earlyBird}`
              : `Night: ${prevCommitTimeAnalysis.nightOwl}`
          }
          growth={'ignore'}
          extra={[commitTimeAnalysis.difference, commitTimeAnalysis.type]}
        />

        {/* Streaks */}
        <StatCard
          username={username}
          title="Streaks"
          value={`Longest Streak: ${streakInfo.longestStreak || 0}`}
          subtitle={`Longest Break: ${streakInfo.longestBreak || 0}`}
          prevValue={`Longest Streak: ${prevStreakInfo.longestStreak || 0}`}
          prevSubtitle={`Longest Break: ${prevStreakInfo.longestBreak || 0}`}
          growth={'ignore'}
        />

        {/* Followers */}
        <StatCard
          username={username}
          title="Followers"
          value={followers.count}
          prevValue={prevFollowers.count}
          growth={
            prevFollowers.count !== 0
              ? Math.round(((followers.count - prevFollowers.count) / prevFollowers.count) * 100)
              : 0
          }
        />
      </div>


      <div className="grid grid-cols-1 mt-8 h-240 md:h-120 grid-rows-4 md:grid-cols-2 gap-4">
        <HourlyCommits commitTimeAnalysis={commitTimeAnalysis} prevCommitTimeAnalysis={prevCommitTimeAnalysis} theme={theme} year={year} prevYear={prevYear} />

        <DailyCommits username={username} theme={theme} year={year} />

        <LanguageOverview username={username} year={year} theme={theme} />
      </div>
    </div>
  );
}
