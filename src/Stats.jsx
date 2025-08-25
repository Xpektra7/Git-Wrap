import StatCard from "./StatCard";
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

export default function Stats({ username, year }) {
  const [repos, setRepos] = useState(null);
  const [commitsInAYear, setCommitsInAYear] = useState(null);
  const [activeRepo, setActiveRepo] = useState(null);
  const [starsReceived, setStarsReceived] = useState(null);
  const [starsGiven, setStarsGiven] = useState(null);
  const [topLanguages, setTopLanguages] = useState([]);
  const [languagesBreakdown, setLanguagesBreakdown] = useState({ breakdown: [], aggregate: {} });
  const [commitTimeAnalysis, setCommitTimeAnalysis] = useState({ hourDistribution: [], nightOwl: 0, earlyBird: 0 });
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title={`Repos Created in ${year}`}
        value={repos ? repos.length : 0}
        prevValue={prevRepos ? prevRepos.length : 0}
        growth={repos && prevRepos && prevRepos.length !== 0
          ? Math.round(((repos.length - prevRepos.length) / prevRepos.length) * 100)
          : 0}
      />
      <StatCard
        title={`Total Commits in ${year}`}
        value={commitsInAYear}
        prevValue={prevCommitsInAYear}
        growth={prevCommitsInAYear ? Math.round(((commitsInAYear - prevCommitsInAYear) / prevCommitsInAYear) * 100) : 0}
      />
      <StatCard
        title="Most Active Repo"
        value={activeRepo?.repo || "No activity"}
        subtitle={activeRepo ? `${activeRepo.commits} commits` : "Loading..."}
        prevValue={prevActiveRepo?.repo || "No activity"}
        prevSubtitle={prevActiveRepo?.commits || "0"}
        growth={activeRepo && prevActiveRepo && typeof activeRepo.commits === "number" && typeof prevActiveRepo.commits === "number" && prevActiveRepo.commits !== 0
          ? Math.round(((activeRepo.commits - prevActiveRepo.commits) / prevActiveRepo.commits) * 100)
          : 0}
      />
      <StatCard title="Stars Received" value={starsReceived?.error ? starsReceived.error : starsReceived} />
      <StatCard title="Stars Given" value={Array.isArray(starsGiven) ? starsGiven.length : (starsGiven?.error || 0)} />
      <StatCard
        title="Top Languages"
        value={topLanguages.length > 0 ? topLanguages[0].name : "None"}
        subtitle={topLanguages.length > 0 ? `${topLanguages[0].count} repos` : ""}
      />
      <StatCard
        title="Night Owl vs Early Bird"
        value={commitTimeAnalysis.nightOwl > commitTimeAnalysis.earlyBird
          ? `Night: ${commitTimeAnalysis.nightOwl}`
          : `Early: ${commitTimeAnalysis.earlyBird}`}
        subtitle={commitTimeAnalysis.nightOwl > commitTimeAnalysis.earlyBird
          ? `Early: ${commitTimeAnalysis.earlyBird}`
          : `Night: ${commitTimeAnalysis.nightOwl}`}
      />
      {/* Languages Breakdown (custom display) */}
      <div className="col-span-1 md:col-span-3">
        <h3 className="text-sm text-(--sub-text) mt-4">Commit Distribution Per Hour</h3>
        <ul className="text-xs flex flex-wrap gap-2">
          {commitTimeAnalysis.hourDistribution.map((count, hour) => (
            <li key={hour}>{hour}: {count}</li>
          ))}
        </ul>
        <h3 className="text-sm text-(--sub-text) mt-4">Languages Breakdown</h3>
        <ul className="text-xs">
          {languagesBreakdown.breakdown.map((repo, i) => (
            <li key={i}><b>{repo.repo}:</b> {repo.languages.join(", ")}</li>
          ))}
        </ul>
        <h4 className="text-xs mt-2">Aggregate:</h4>
        <ul className="text-xs">
          {Object.entries(languagesBreakdown.aggregate).map(([lang, count], i) => (
            <li key={i}>{lang}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
