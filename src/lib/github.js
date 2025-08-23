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
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  // Use contributionsCollection.commitContributionsByRepository for accurate commit counts
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $since, to: $until) {
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              name
            }
            contributions {
              totalCount
            }
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { login: username, since, until });
  const repos = data.user?.contributionsCollection?.commitContributionsByRepository || [];
  let maxRepo = null;
  let maxCommits = 0;
  for (const entry of repos) {
    const repoName = entry.repository?.name;
    const commits = entry.contributions?.totalCount || 0;
    if (commits > maxCommits) {
      maxRepo = repoName;
      maxCommits = commits;
    }
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
