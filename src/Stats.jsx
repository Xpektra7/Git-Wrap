import StatCard from "./StatCard";
import DailyCommits from "./components/DailyCommits";
import HourlyCommits from "./components/HourlyCommits";
import LanguageOverview from "./components/LanguagesOverview";
import {
  fetchRepos,
  getTotalCommits,
  mostActiveRepo,
  starGrazer,
  getStarsReceived,
  getStarsGiven,
  getTopLanguages,
  getCommitTimeAnalysis,
  getStreaks,
  getCollaborationCount,
  getPullRequestsStats,
  getFollowersGrowth,
} from "./lib/github";
import { useEffect, useState } from "react";

export default function Stats({ username, year, theme }) {
  // Current Year States
  const [repos, setRepos] = useState(0);
  const [commitsInAYear, setCommitsInAYear] = useState(0);
  const [activeRepo, setActiveRepo] = useState(null);
  const [starsReceived, setStarsReceived] = useState(0);
  const [starsGiven, setStarsGiven] = useState(0);
  const [topLanguages, setTopLanguages] = useState([]);
  const [collaborationCount, setCollaborationCount] = useState(0);
  const [commitTimeAnalysis, setCommitTimeAnalysis] = useState({
    hourDistribution: Array(24).fill(0),
    nightOwl: 0,
    earlyBird: 0,
  });
  const [stars, setStars] = useState(null); // legacy
  const [streakInfo,setStreakInfo] = useState({
    longestStreak: 0,
    longestBreak: 0,
    currentStreak: 0
  });
  const [pullRequestStats, setPullRequestStats] = useState({ });
  const [followers, setFollowers] = useState(0)


  // Previous Year States
  const [prevPullRequestStats, setPrevPullRequestStats] = useState({ });
  const [prevRepos, setPrevRepos] = useState(0);
  const [prevCommitsInAYear, setPrevCommitsInAYear] = useState(0);
  const [prevActiveRepo, setPrevActiveRepo] = useState(null);
  const [prevStarsReceived, setPrevStarsReceived] = useState(0);
  const [prevStarsGiven, setPrevStarsGiven] = useState(0);
  const [prevTopLanguages, setPrevTopLanguages] = useState([]);
  const [prevCollaborationCount, setPrevCollaborationCount] = useState(0);
  const [prevCommitTimeAnalysis, setPrevCommitTimeAnalysis] = useState({
    hourDistribution: Array(24).fill(0),
    nightOwl: 0,
    earlyBird: 0,
  });
  const [prevStreakInfo,setPrevStreakInfo] = useState({
    longestStreak: 0,
    longestBreak: 0,
    currentStreak: 0
  });
  const [prevFollowers, setPrevFollowers] = useState(0);
  const prevYear = year - 1;

  useEffect(() => {
    // Fetch repos
    fetchRepos(username, year).then(setRepos);
    fetchRepos(username, prevYear).then(setPrevRepos);
    // Total Commits
    getTotalCommits(username, year).then(setCommitsInAYear);
    getTotalCommits(username, prevYear).then(setPrevCommitsInAYear);
    // Active repos
    mostActiveRepo(username, year).then(setActiveRepo);
    mostActiveRepo(username, prevYear).then(setPrevActiveRepo);
    
    starGrazer(username).then(setStars); // legacy
    // Stars Recieved
    getStarsReceived(username, year).then(setStarsReceived);
    getStarsReceived(username, prevYear).then(setPrevStarsReceived);
    // Stars Given
    getStarsGiven(username, year).then(setStarsGiven);
    getStarsGiven(username, prevYear).then(setPrevStarsGiven);
    // Top Languages
    getTopLanguages(username, year).then(setTopLanguages);
    getTopLanguages(username, prevYear).then(setPrevTopLanguages);
    // Commit Time
    getCommitTimeAnalysis(username, year).then(setCommitTimeAnalysis);
    getCommitTimeAnalysis(username, prevYear).then(setPrevCommitTimeAnalysis);
    // Streaks
    getStreaks(username, year).then(setStreakInfo);
    getStreaks(username, prevYear).then(setPrevStreakInfo);
    // Collaboartion
    getCollaborationCount(username, year).then(setCollaborationCount);
    getCollaborationCount(username, prevYear).then(setPrevCollaborationCount);
    // Pull requests
    getPullRequestsStats(username, year).then(setPullRequestStats);
    getPullRequestsStats(username, prevYear).then(setPrevPullRequestStats);
    // Followers
    getFollowersGrowth(username,year).then(setFollowers);
    getFollowersGrowth(username,prevYear).then(setPrevFollowers);
    
    
  }, [username]);


  return (
    <div className="flex flex-col w-full gap-16">

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
              ? Math.round(
                  ((repos.length - prevRepos.length) / prevRepos.length) * 100
                )
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
              ? Math.round(
                  ((commitsInAYear - prevCommitsInAYear) / prevCommitsInAYear) *
                    100
                )
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
              ? Math.round(
                  ((activeRepo.commits - prevActiveRepo.commits) /
                    prevActiveRepo.commits) *
                    100
                )
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
              ? Math.round(
                  ((collaborationCount -
                    prevCollaborationCount) /
                    prevCollaborationCount) *
                    100
                )
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
          growth='ignore'
        />
        {/* Top Language*/}
        <StatCard
          username={username}
          title="Top Language"
          value={topLanguages.length > 0 ? topLanguages[0].name : "None"}
          subtitle={
            topLanguages.length > 0 ? `${topLanguages[0].count} repos` : ""
          }
          prevValue={
            prevTopLanguages.length > 0 ? prevTopLanguages[0].name : "None"
          }
          prevSubtitle={
            prevTopLanguages.length > 0 ? `${prevTopLanguages[0].count} repos` : ""
          }
          growth='ignore'
        />
          {/* Stars */}
          <StatCard
            username={username}
            title="Stars"
            value={`Received: ${starsReceived?.error ? starsReceived.error : starsReceived}`}
            subtitle={`Given: ${Array.isArray(starsGiven)
                ? starsGiven.length
                : starsGiven?.error || 0}`}
            prevValue={`Received: ${prevStarsReceived?.error ? prevStarsReceived.error : prevStarsReceived}`}
            prevSubtitle={`Given: ${Array.isArray(prevStarsGiven)
                ? prevStarsGiven.length
                : prevStarsGiven?.error || 0}`}
            growth='ignore'
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
          growth='ignore'
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
          growth='ignore'
        />

        {/* Followers */}
        <StatCard
          username={username} 
          title="Followers"
          value={followers.count}
          prevValue={prevFollowers.count}
          growth={
            prevFollowers.count !== 0
              ? Math.round(
                  ((followers.count - prevFollowers.count) /
                    prevFollowers.count) *
                    100
                )
              : 0
          }
        />
      </div>


      <div className="grid grid-cols-1 mt-8 h-240 md:h-120 grid-rows-4 md:grid-cols-2 gap-4">
        <HourlyCommits commitTimeAnalysis={commitTimeAnalysis} prevCommitTimeAnalysis={prevCommitTimeAnalysis} theme={theme} year={year} prevYear={prevYear} />

        <DailyCommits username={username} theme={theme} year={year} />

        <LanguageOverview 
          username={username}
          year={year}
          theme={theme}
        />
      </div>
    </div>
  );
}
