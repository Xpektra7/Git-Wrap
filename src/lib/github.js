const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};

async function graphqlRequest(query, variables = {}) {
  const res = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL error: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors.map(e => e.message).join(", "));
  return data;
}
export async function fetchRepos(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $after: String) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: CREATED_AT, direction: DESC}, after: $after) {
          nodes {
            name
            createdAt
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { login: username });
  return data.user.repositories.nodes
    .filter(repo => {
      const created = new Date(repo.createdAt);
      return created >= new Date(since) && created <= new Date(until);
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

export async function getTotalCommits(username, year = "2025") {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $since, to: $until) {
          totalCommitContributions
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { login: username, since, until });
  return data.user?.contributionsCollection?.totalCommitContributions ?? 0;
}

// ✅ Most active repo
export async function mostActiveRepo(username, year) {
  // Use GraphQL to fetch all repos and their commit counts in the year
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!, $after: String) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: NAME, direction: ASC}, after: $after) {
          nodes {
            name
            defaultBranchRef {
              target {
                ... on Commit {
                  history(author: {id: null, emails: null, name: $login}, since: $since, until: $until) {
                    totalCount
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  let after = null;
  let maxRepo = null;
  let maxCommits = 0;
  let repos = [];
  do {
    const data = await graphqlRequest(query, { login: username, since, until, after });
    const repoNodes = data.user.repositories.nodes;
    repos = repos.concat(repoNodes);
    after = data.user.repositories.pageInfo.hasNextPage ? data.user.repositories.pageInfo.endCursor : null;
  } while (after);

  const sortedRepos = repos.map(repo => ({
    name: repo.name,
    commits: repo.defaultBranchRef?.target?.history?.totalCount || 0
  })).sort((a, b) => b.commits - a.commits);

  if (sortedRepos.length > 0) {
    maxRepo = sortedRepos[0].name;
    maxCommits = sortedRepos[0].commits;
  }

  return { repo: maxRepo, commits: maxCommits };
}

export async function starGrazer(username) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            stargazerCount
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { login: username });
  return data.user.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);
}
