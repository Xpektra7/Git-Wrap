import StatCard from "./StatCard";
import {
  fetchRepos,
  getTotalCommits,
  mostActiveRepo,
  starGrazer,
} from "./lib/github";
import { useEffect, useState } from "react";

export default function Stats({ username, year }) {
  const [repos, setRepos] = useState(null);
  const [commitsInAYear, setCommitsInAYear] = useState(null);
  const [activeRepo, setActiveRepo] = useState(null);
  const [stars, setStars] = useState(null);
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

    starGrazer(username).then(setStars);
  }, [username]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title={`Repos Created in ${year}`}
        value={repos ? repos.length : 0}
        prevValue={prevRepos ? prevRepos.length : 0}
        growth={prevRepos ? Math.round(((repos.length - prevRepos.length) / prevRepos.length) * 100) : 0}
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
        growth={prevActiveRepo ? Math.round(((activeRepo.commits - prevActiveRepo.commits) / prevActiveRepo.commits) * 100) : 0}
      />
      <StatCard title="Stars Received" value={stars} />
    </div>
  );
}
