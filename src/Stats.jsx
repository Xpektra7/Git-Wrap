import StatCard from "./StatCard";
import {
  fetchRepos,
  getTotalCommits,
  mostActiveRepo,
  starGrazer,
} from "./lib/github";
import { useEffect, useState } from "react";

export default function Stats({ username, year}) {
  const [repos, setRepos] = useState(null);
  const [commitsInAYear, setCommitsInAYear] = useState(null);
  const [activeRepo, setActiveRepo] = useState(null);
  const [stars, setStars] = useState(null);


  useEffect(() => {
  fetchRepos(username, year).then(setRepos);

  getTotalCommits(username, year).then(setCommitsInAYear);

  mostActiveRepo(username, year).then(setActiveRepo);

  starGrazer(username).then(setStars);


  }, [username]);



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title={`Repos Created in ${year}`} value={repos ? repos.length : 0} />
      <StatCard title={`Total Commits in ${year}`} value={commitsInAYear} />
      <StatCard title="Most Active Repo" value={`${activeRepo.repo} (${activeRepo.commits})`} />
      <StatCard title="Stars Received" value={stars} />
    </div>
  );
}
