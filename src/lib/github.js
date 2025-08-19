const GITHUB_API = "https://api.github.com";
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};
export async function fetchRepos(username, year) {
  const res = await fetch( `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner&sort=created&direction=desc`, { headers } );
  if (!res.ok) throw new Error(`Error fetching repos: ${res.status}`);
  const data = await res.json();
  const since = new Date(`${year}-01-01T00:00:00Z`);
  const until = new Date(`${year}-12-31T23:59:59Z`);
  return data
    .filter(repo => {
      const created = new Date(repo.created_at);
      return created >= since && created <= until;
    })
    .map(repo => repo.name);
}

// export async function repoLanguage(username, repoName) {
//   const since = "2025-01-01T00:00:00Z";
//   const until = "2025-12-31T23:59:59Z";

//   const url = `${GITHUB_API}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`;
//   const res = await fetch(url, { headers });
//   if (!res.ok) throw new Error(`Error fetching commits: ${res.status}`);
//   const data = await res.json();
//   return data.length;
// }

// async function fetchRepoCommits(username, repoName) {
//   const since = `2025-01-01T00:00:00Z`;
//   const until = `2025-12-31T23:59:59Z`;

//   const res = await fetch(
//     `${GITHUB_API}/repos/${username}/${repoName}/commits?author=${username}&since=${since}&until=${until}&per_page=100`
//   );
//   const data = await res.json();
//   if (!res.ok) throw new Error(`Error fetching commits: ${res.status}`);
//   return data;
// }

export async function getTotalCommits(username) {
  const url = `https://api.github.com/search/commits?q=author:${username}+committer-date:2025-01-01..2025-12-31`;
  const res = await fetch(url, { headers });
  const commits = await res.json();
  console.log(`Total commits in 2025 for ${username}:`, commits);
  return commits.total_count;
}

// ✅ central fetch wrapper with retries + delay
async function safeFetch(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { headers, ...options });
    if (res.ok) return res.json();

    if (res.status === 403) {
      console.warn(`Rate limited on ${url}, retrying...`);
      await new Promise(r => setTimeout(r, delay));
      continue;
    }

    const text = await res.text();
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return null;
}

// ✅ Most active repo
export async function mostActiveRepo(username, year) {
  const repos = await safeFetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner`
  );

  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;

  let maxRepo = null;
  let maxCommits = 0;

  for (const repo of repos) {
    await new Promise(r => setTimeout(r, 600));

    const commits = await safeFetch(
      `${GITHUB_API}/repos/${username}/${repo.name}/commits?author=${username}&since=${since}&until=${until}&per_page=100`
    );
    if (!commits) continue;

    if (commits.length > maxCommits) {
      maxCommits = commits.length;
      maxRepo = repo.name;
    }
  }

  return { repo: maxRepo, commits: maxCommits };
}
