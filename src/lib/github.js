const GITHUB_API = 'https://api.github.com';

export async function fetchRepos(username) {
  const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100`);
  const data = await res.json();
  const repos =  []
  for (let i = 0; i < data.length; i++) {
    repos.push(data[i].name);
  }
  return repos; // array of repo names
}


export async function fetchCommitsInAYear(username,repoName) {
  const since = `2025-01-01T00:00:00Z`;
  const until = `2025-12-31T23:59:59Z`;

  const res = await fetch(`${GITHUB_API}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`);
  const data = await res.json();

  return data.length; // total commits in the repo.
}

export async function getTotalCommits(username) {
  const repos = await fetchRepos(username);
  let totalCommits = 0;
  for (const repo of repos) {
    const commits = await fetchCommitsInAYear(username, repo);
    totalCommits += commits;
  }
  return totalCommits; // total commits across all repos in the year
}