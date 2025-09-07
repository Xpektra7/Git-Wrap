// Top languages used across user's repos for the year
// ✅ Streaks — Longest commit streak vs longest break
export async function getStreaks(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $since, to: $until) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username, since, until });
    if (!data.user) throw new Error("User not found");
    const days = data.user.contributionsCollection.contributionCalendar.weeks.flatMap(w => w.contributionDays);
    let maxStreak = 0, currentStreak = 0, maxBreak = 0, currentBreak = 0;
    let prevCommit = false;
    for (const day of days) {
      if (day.contributionCount > 0) {
        currentStreak++;
        maxBreak = Math.max(maxBreak, currentBreak);
        currentBreak = 0;
        prevCommit = true;
      } else {
        currentBreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
        prevCommit = false;
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak);
    maxBreak = Math.max(maxBreak, currentBreak);
    return { longestStreak: maxStreak, longestBreak: maxBreak, currentStreak: currentStreak };
  } catch (e) {
    return { error: e.message };
  }
}

// ✅ Collaboration Count — PRs merged into other people’s repos
export async function getCollaborationCount(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $since, to: $until) {
          pullRequestContributionsByRepository {
            repository {
              owner { login }
              name
            }
            contributions(first: 100) {
              nodes {
                pullRequest {
                  merged
                  author { login }
                }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username, since, until });
    if (!data.user) throw new Error("User not found");
    let count = 0;
    data.user.contributionsCollection.pullRequestContributionsByRepository.forEach(repo => {
      repo.contributions.nodes.forEach(pr => {
        if (pr.pullRequest.merged && pr.pullRequest.author?.login === username && repo.repository.owner.login !== username) {
          count++;
        }
      });
    });
    return count ;
  } catch (e) {
    return { error: e.message };
  }
}

// ✅ Pull Requests — Opened vs merged PRs
export async function getPullRequestsStats(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $since, to: $until) {
          pullRequestContributions(first: 100) {
            nodes {
              pullRequest {
                merged
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username, since, until });
    if (!data.user) throw new Error("User not found");
    const prs = data.user.contributionsCollection.pullRequestContributions.nodes;
    const opened = prs.length;
    const merged = prs.filter(pr => pr.pullRequest.merged).length;
    return { opened, merged };
  } catch (e) {
    return { error: e.message };
  }
}

// ✅ Activity Patterns — Days of the week and the no of commits made on those days
export async function getActivityPatterns(username, year){
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!, $since: DateTime!, $until: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $since, to: $until) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username, since, until });
    if (!data.user) throw new Error("User not found");
    const days = data.user.contributionsCollection.contributionCalendar.weeks.flatMap(w => w.contributionDays);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const pattern = Array(7).fill(0);
    days.forEach(day => {
      const d = new Date(day.date);
      const idx = d.getDay();
      pattern[idx] += day.contributionCount;
    });
    return weekDays.map((name, i) => ({ day: name, commits: pattern[i] }));
  } catch (e) {
    return { error: e.message };
  }
}

// ✅ Followers Growth — New followers gained in the year
export async function getFollowersGrowth(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!) {
      user(login: $login) {
        followers(first: 100) {
          nodes {
            login
            createdAt
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username });
    if (!data.user) throw new Error("User not found");
    const followers = data.user.followers.nodes.filter(f => {
      if (!f.createdAt) return false;
      const created = new Date(f.createdAt);
      return created >= new Date(since) && created <= new Date(until);
    });
    return { newFollowers: followers.map(f => f.login), count: followers.length };
  } catch (e) {
    return { error: e.message };
  }
}
export async function getTopLanguages(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            name
            createdAt
            languages(first: 10) {
              nodes { name }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username });
    if (!data.user) throw new Error("User not found");
    const langCount = {};
    data.user.repositories.nodes.forEach(repo => {
      const created = new Date(repo.createdAt);
      if (created >= new Date(since) && created <= new Date(until)) {
        repo.languages.nodes.forEach(lang => {
          langCount[lang.name] = (langCount[lang.name] || 0) + 1;
        });
      }
    });
    return Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  } catch (e) {
    return { error: e.message };
  }
}
// Stars received by user's repos in a given year
export async function getStarsReceived(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            name
            createdAt
            stargazers(first: 100, orderBy: {field: STARRED_AT, direction: DESC}) {
              edges {
                starredAt
              }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username });
    if (!data.user) throw new Error("User not found");
    let count = 0;
    data.user.repositories.nodes.forEach(repo => {
      repo.stargazers.edges.forEach(edge => {
        const starred = new Date(edge.starredAt);
        if (starred >= new Date(since) && starred <= new Date(until)) {
          count++;
        }
      });
    });
    return count;
  } catch (e) {
    return { error: e.message };
  }
}
// Stars given by user in a given year
export async function getStarsGiven(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!) {
      user(login: $login) {
        starredRepositories(first: 100) {
          edges {
            starredAt
            node {
              name
              owner { login }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username });
    if (!data.user) throw new Error("User not found");
    return data.user.starredRepositories.edges
      .filter(edge => {
        const starred = new Date(edge.starredAt);
        return starred >= new Date(since) && starred <= new Date(until);
      })
      .map(edge => ({ name: edge.node.name, owner: edge.node.owner.login, starredAt: edge.starredAt }));
  } catch (e) {
    return { error: e.message };
  }
}
// Languages breakdown per repo and aggregate
export async function getLanguagesBreakdown(username, year) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            name
            createdAt
            languages(first: 10) {
              nodes { name }
            }
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username });
    if (!data.user) throw new Error("User not found");
    const breakdown = [];
    const aggregate = {};
    data.user.repositories.nodes.forEach(repo => {
      const created = new Date(repo.createdAt);
      if (created >= new Date(since) && created <= new Date(until)) {
        const langs = repo.languages.nodes.map(lang => lang.name);
        breakdown.push({ repo: repo.name, languages: langs });
        langs.forEach(lang => {
          aggregate[lang] = (aggregate[lang] || 0) + 1;
        });
      }
    });
    return { breakdown, aggregate };
  } catch (e) {
    return { error: e.message };
  }
}
// Commit time analysis with timezone offset
export async function getCommitTimeAnalysis(username, year, timezoneOffset = 0) {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
  // Step 1: Fetch all repo names for the user in the year
  const reposQuery = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            name
          }
        }
      }
    }
  `;
  // Step 2: For each repo, fetch all commits in parallel
  const commitsQuery = `
    query($owner: String!, $name: String!, $since: GitTimestamp!, $until: GitTimestamp!, $after: String) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(since: $since, until: $until, first: 100, after: $after) {
                pageInfo { hasNextPage endCursor }
                nodes {
                  committedDate
                }
              }
            }
          }
        }
      }
    }
  `;
  try {
    const reposData = await graphqlRequest(reposQuery, { login: username });
    if (!reposData.user) throw new Error("User not found");
    const repoNames = reposData.user.repositories.nodes.map(r => r.name);
    const hourDist = Array(24).fill(0);
    let night = 0, day = 0;
    // Helper to fetch all commits for a repo using pagination
    async function fetchAllCommitsForRepo(repoName) {
      let commits = [];
      let after = null;
      let hasNextPage = true;
      while (hasNextPage) {
        const repoData = await graphqlRequest(commitsQuery, {
          owner: username,
          name: repoName,
          since,
          until,
          after
        });
        const history = repoData.repository?.defaultBranchRef?.target?.history;
        if (!history) break;
        commits = commits.concat(history.nodes);
        hasNextPage = history.pageInfo.hasNextPage;
        after = history.pageInfo.endCursor;
      }
      return commits;
    }
    // Fetch all commits for all repos in parallel
    const allCommitsArrays = await Promise.all(
      repoNames.map(repoName => fetchAllCommitsForRepo(repoName))
    );
    // Flatten and process
    allCommitsArrays.flat().forEach(commit => {
      const date = new Date(commit.committedDate);
      let hour = date.getUTCHours() + timezoneOffset;
      if (hour < 0) hour += 24;
      if (hour >= 24) hour -= 24;
      hourDist[hour]++;
      if (hour >= 6 && hour < 18) day++;
      else night++;
    });
    return { hourDistribution: hourDist, nightOwl: night, earlyBird: day,difference : night > day ? ((night/(night + day)) * 100).toFixed(1) : ((day/(night + day)) * 100).toFixed(1), type: night > day ? "at night" : "during the day" };
  } catch (e) {
    return { error: e.message };
  }
}
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
