const GITHUB_API = 'https://api.github.com';


export async function fetchRepos(username) {
  const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100`);
  const data = await res.json();
  return data; // array of repo objects
}

export async function getCommitsForRepo(username, repoName, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const url = `${GITHUB_API}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`;

  const res = await fetch(url);
  const data = await res.json();

  return Array.isArray(data) ? data.length : 0;
}

export async function getTotalCommits(username) {
  const repos = await fetchRepos(username);
  console.log(repos);
  
  let total = 0;

  for (const repo of repos) {
    const stats = await fetch(`/repos/${username}/${repo.name}/stats/contributors`);
    const data = await stats.json();
    const me = data.find(d => d.author.login === username);
    total += me ? me.total : 0;
  }

  return total;
}
