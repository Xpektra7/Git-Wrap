import { useEffect, useState } from "react";
import { fetchRepos, getTotalCommits } from "./lib/github";

export default function App() {
  const [commits, setCommits] = useState(null);
  const [repos, setRepos] = useState(null);
  const [commitsInAYear, setCommitsInAYear] = useState(null);
  
  const GITHUB_API = 'https://api.github.com';
  const since = `2025-01-01T00:00:00Z`;
  const until = `2025-12-31T23:59:59Z`;
  const username = "Xpektra7";
  const repoName = "elxtract"; 
  
  
  useEffect(() => {
    getTotalCommits(username).then(setCommitsInAYear);

    fetchRepos(username).then(setRepos);

    async function fetchData() {
      const res = await fetch(`${GITHUB_API}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`);
      const data = await res.json();
      setCommits(data);
      console.log(data);
    }
    fetchData();
  }, [username]);

  return (
    <>
      <p>{repos ? repos.length : 0}</p>
      <p>Total commits in a year : {commitsInAYear}</p>
      <h1>Commits for {username} in {repoName}</h1>
      <p>Total Commits: {commits ? commits.length : 0}</p>
      <p>Year: 2025</p>
      <p>Username: {username}</p>
      <p>Repository: {repoName}</p>
      <p>Since: {since}</p>
      <p>Until: {until}</p>
    </>
  );
}
