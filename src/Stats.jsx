import StatCard from "./StatCard";
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
  getLanguagesBreakdown,
  getCommitTimeAnalysis,
} from "./lib/github";
import { useEffect, useState } from "react";

export default function Stats({ username, year, theme }) {
  const [repos, setRepos] = useState(null);
  const [commitsInAYear, setCommitsInAYear] = useState(null);
  const [activeRepo, setActiveRepo] = useState(null);
  const [starsReceived, setStarsReceived] = useState(null);
  const [starsGiven, setStarsGiven] = useState(null);
  const [topLanguages, setTopLanguages] = useState([]);
  const [languagesBreakdown, setLanguagesBreakdown] = useState({
    breakdown: [],
    aggregate: {},
  });
  const [commitTimeAnalysis, setCommitTimeAnalysis] = useState({
    hourDistribution: Array(24).fill(0),
    nightOwl: 0,
    earlyBird: 0,
  });
  const [stars, setStars] = useState(null); // legacy
  const [prevRepos, setPrevRepos] = useState(null);
  const [prevCommitsInAYear, setPrevCommitsInAYear] = useState(null);
  const [prevActiveRepo, setPrevActiveRepo] = useState(null);

  const prevYear = year - 1;

  useEffect(() => {
    fetchRepos(username, year).then(setRepos);
    fetchRepos(username, prevYear).then(setPrevRepos);

    getTotalCommits(username, year).then(setCommitsInAYear);
    getTotalCommits(username, prevYear).then(setPrevCommitsInAYear);

    mostActiveRepo(username, year).then(setActiveRepo);
    mostActiveRepo(username, prevYear).then(setPrevActiveRepo);

    starGrazer(username).then(setStars); // legacy
    getStarsReceived(username, year).then(setStarsReceived);
    getStarsGiven(username, year).then(setStarsGiven);
    getTopLanguages(username, year).then(setTopLanguages);
    getLanguagesBreakdown(username, year).then(setLanguagesBreakdown);
    getCommitTimeAnalysis(username, year).then(setCommitTimeAnalysis);
  }, [username]);

  return (
    <div classname="flex flex-col w-full gap-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
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
        <StatCard
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
        <StatCard
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
        <StatCard
          title="Stars Received"
          value={starsReceived?.error ? starsReceived.error : starsReceived}
        />
        <StatCard
          title="Stars Given"
          value={
            Array.isArray(starsGiven)
              ? starsGiven.length
              : starsGiven?.error || 0
          }
        />
        <StatCard
          title="Top Languages"
          value={topLanguages.length > 0 ? topLanguages[0].name : "None"}
          subtitle={
            topLanguages.length > 0 ? `${topLanguages[0].count} repos` : ""
          }
        />
        <StatCard
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
        />
      </div>

      <div className="grid grid-cols-1 mt-8 h-120 md:h-60 grid-rows-2 md:grid-cols-2 gap-4">
        <HourlyCommits commitTimeAnalysis={commitTimeAnalysis} theme={theme} />

        <LanguageOverview
          languagesBreakdown={languagesBreakdown}
          theme={theme}
        />
      </div>
    </div>
  );
}
