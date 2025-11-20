// Lightweight TypeScript wrapper for existing GitHub GraphQL helpers.
// This file mirrors the previous implementation in JS and uses `any` for
// raw GraphQL shapes to keep the incremental migration low-risk.

// Public data shapes (kept minimal and easy to expand).
export type ApiResult<T> = T | { error: string };

export interface Streaks {
  longestStreak: number;
  longestBreak: number;
  currentStreak: number;
}

export interface PRStats {
  opened: number;
  merged: number;
}

export interface ActivityPatternEntry {
  day: string;
  commits: number;
}

export interface FollowersGrowth {
  newFollowers: string[];
  count: number;
}

export interface TopLanguageEntry {
  name: string;
  count: number;
}

export interface LanguagesBreakdown {
  breakdown: Array<{ repo: string; languages: string[] }>;
  aggregate: Record<string, number>;
}

export interface CommitTimeAnalysis {
  hourDistribution: number[];
  nightOwl: number;
  earlyBird: number;
  difference: string; // percent string like "42.3"
  type: string; // "at night" | "during the day"
}

export interface UserProfile {
  name?: string | null;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
  twitterUsername?: string | null;
  socialAccounts: Array<{ provider?: string; url?: string; displayName?: string }>;
}

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const headers: Record<string, string> = {
  Authorization: `Bearer ${(import.meta as any).env.VITE_GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};

async function graphqlRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
  const res = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL error: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors.map((e: any) => e.message).join(", "));
  return data;
}

// Internal GraphQL response shapes (kept optional and permissive).
interface GraphQLLanguageNode { name?: string }
interface GraphQLRepoNode {
  name: string;
  createdAt?: string;
  languages?: { nodes?: GraphQLLanguageNode[] };
  stargazers?: { edges?: Array<{ starredAt?: string }> };
}

interface GraphQLSocialAccountNode {
  provider?: string;
  url?: string;
  displayName?: string;
}

interface GraphQLUser {
  name?: string | null;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
  twitterUsername?: string | null;
  socialAccounts?: { nodes?: GraphQLSocialAccountNode[] };
  repositories?: { nodes?: GraphQLRepoNode[] };
  followers?: { nodes?: Array<{ login?: string; createdAt?: string }> };
  starredRepositories?: { edges?: Array<{ starredAt?: string; node?: { name?: string; owner?: { login?: string } } }> };
  contributionsCollection?: any; // detailed shape varies per query
}


export async function getStreaks(username: string, year: string | number): Promise<ApiResult<Streaks>> {
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
  const data = await graphqlRequest(query, { login: username, since, until }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
  const days = data.user.contributionsCollection.contributionCalendar.weeks.flatMap((w: any) => w.contributionDays);
    let maxStreak = 0, currentStreak = 0, maxBreak = 0, currentBreak = 0;
    for (const day of days) {
      if (day.contributionCount > 0) {
        currentStreak++;
        maxBreak = Math.max(maxBreak, currentBreak);
        currentBreak = 0;
      } else {
        currentBreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak);
    maxBreak = Math.max(maxBreak, currentBreak);
    return { longestStreak: maxStreak, longestBreak: maxBreak, currentStreak: currentStreak };
  } catch (e: any) {
    console.error(e);
    return { error: "An error occurred. Please try again later." };
  }
}

export async function getCollaborationCount(username: string, year: string | number): Promise<ApiResult<number>> {
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
  const data = await graphqlRequest(query, { login: username, since, until }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    let count = 0;
    data.user.contributionsCollection.pullRequestContributionsByRepository.forEach((repo: any) => {
      repo.contributions.nodes.forEach((pr: any) => {
        if (pr.pullRequest.merged && pr.pullRequest.author?.login === username && repo.repository.owner.login !== username) {
          count++;
        }
      });
    });
    return count;
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getPullRequestsStats(username: string, year: string | number): Promise<ApiResult<PRStats>> {
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
  const data = await graphqlRequest(query, { login: username, since, until }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const prs = data.user.contributionsCollection.pullRequestContributions.nodes;
    const opened = prs.length;
    const merged = prs.filter((pr: any) => pr.pullRequest.merged).length;
    return { opened, merged };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getActivityPatterns(username: string, year: string | number): Promise<ApiResult<ActivityPatternEntry[]>> {
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
  const data = await graphqlRequest(query, { login: username, since, until }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const days = data.user.contributionsCollection.contributionCalendar.weeks.flatMap((w: any) => w.contributionDays);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const pattern = Array(7).fill(0);
    days.forEach((day: any) => {
      const d = new Date(day.date);
      const idx = d.getDay();
      pattern[idx] += day.contributionCount;
    });
    return weekDays.map((name, i) => ({ day: name, commits: pattern[i] }));
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getFollowersGrowth(username: string, year: string | number): Promise<ApiResult<FollowersGrowth>> {
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
  const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const user = data.user;
    const followers = (user.followers?.nodes ?? []).filter((f: any) => {
      if (!f.createdAt) return false;
      const created = new Date(f.createdAt);
      return created >= new Date(since) && created <= new Date(until);
    });
    return { newFollowers: followers.map((f: any) => f.login), count: followers.length };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getTopLanguages(username: string, year: string | number): Promise<ApiResult<TopLanguageEntry[]>> {
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
    const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const user = data.user;
    const langCount: Record<string, number> = {};
    (user.repositories?.nodes ?? []).forEach((repo: GraphQLRepoNode | any) => {
      const created = new Date(repo.createdAt);
      if (created >= new Date(since) && created <= new Date(until)) {
        repo.languages.nodes.forEach((lang: any) => {
          langCount[lang.name] = (langCount[lang.name] || 0) + 1;
        });
      }
    });
    return Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getStarsReceived(username: string, year: string | number): Promise<ApiResult<number>> {
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
    const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const user = data.user;
    let count = 0;
    (user.repositories?.nodes ?? []).forEach((repo: GraphQLRepoNode | any) => {
      (repo.stargazers?.edges ?? []).forEach((edge: any) => {
        const starred = new Date(edge.starredAt);
        if (starred >= new Date(since) && starred <= new Date(until)) {
          count++;
        }
      });
    });
    return count;
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getStarsGiven(username: string, year: string | number): Promise<ApiResult<Array<{ name: string; owner: string; starredAt: string }>>> {
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
    const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const user = data.user;
    const edges = user.starredRepositories?.edges ?? [];
    return edges
      .filter((edge: any) => {
        const starred = new Date(edge.starredAt);
        return starred >= new Date(since) && starred <= new Date(until);
      })
      .map((edge: any) => ({ name: edge.node.name, owner: edge.node.owner.login, starredAt: edge.starredAt }));
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getLanguagesBreakdown(username: string, year: string | number): Promise<ApiResult<LanguagesBreakdown>> {
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
    const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const user = data.user;
    const breakdown: any[] = [];
    const aggregate: Record<string, number> = {};
    (user.repositories?.nodes ?? []).forEach((repo: GraphQLRepoNode | any) => {
      const created = new Date(repo.createdAt);
      if (created >= new Date(since) && created <= new Date(until)) {
        const langs = repo.languages.nodes.map((lang: any) => lang.name);
        breakdown.push({ repo: repo.name, languages: langs });
        langs.forEach((lang: string) => {
          aggregate[lang] = (aggregate[lang] || 0) + 1;
        });
      }
    });
    return { breakdown, aggregate };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getCommitTimeAnalysis(username: string, year: string | number, timezoneOffset = 0): Promise<ApiResult<CommitTimeAnalysis>> {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
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
  const reposData = await graphqlRequest(reposQuery, { login: username }) as { user?: GraphQLUser };
  if (!reposData.user) throw new Error("User not found");
  const repoNames = (reposData.user.repositories?.nodes ?? []).map((r: any) => r.name);
    const hourDist = Array(24).fill(0);
    let night = 0, day = 0;
    async function fetchAllCommitsForRepo(repoName: string) {
      let commits: any[] = [];
      let after: string | null = null;
      let hasNextPage = true;
      while (hasNextPage) {
        const repoData = await graphqlRequest(commitsQuery, {
          owner: username,
          name: repoName,
          since,
          until,
          after,
        });
        const history = repoData.repository?.defaultBranchRef?.target?.history;
        if (!history) break;
        commits = commits.concat(history.nodes);
        hasNextPage = history.pageInfo.hasNextPage;
        after = history.pageInfo.endCursor;
      }
      return commits;
    }
    const allCommitsArrays = await Promise.all(repoNames.map((repoName: string) => fetchAllCommitsForRepo(repoName)));
    allCommitsArrays.flat().forEach((commit: any) => {
      const date = new Date(commit.committedDate);
      let hour = date.getUTCHours() + timezoneOffset;
      if (hour < 0) hour += 24;
      if (hour >= 24) hour -= 24;
      hourDist[hour]++;
      if (hour >= 6 && hour < 18) day++;
      else night++;
    });
    return { hourDistribution: hourDist, nightOwl: night, earlyBird: day, difference: night > day ? ((night/(night + day)) * 100).toFixed(1) : ((day/(night + day)) * 100).toFixed(1), type: night > day ? "at night" : "during the day" };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function fetchRepos(username: string, year: string | number): Promise<ApiResult<string[]>> {
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
    const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
    if (!data.user) throw new Error("User not found");
    const nodes = data.user.repositories?.nodes ?? [];
    return nodes
      .filter((repo: any) => {
        const created = new Date(repo.createdAt);
        return created >= new Date(since) && created <= new Date(until);
      })
      .map((repo: any) => repo.name);
}

export async function getTotalCommits(username: string, year: string | number = "2025"): Promise<ApiResult<number>> {
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
  const data = await graphqlRequest(query, { login: username, since, until }) as { user?: GraphQLUser };
  return data.user?.contributionsCollection?.totalCommitContributions ?? 0;
}

export async function mostActiveRepo(username: string, year: string | number): Promise<ApiResult<{ repo: string | null; commits: number }>> {
  const since = `${year}-01-01T00:00:00Z`;
  const until = `${year}-12-31T23:59:59Z`;
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
  const data = await graphqlRequest(query, { login: username, since, until }) as { user?: GraphQLUser };
  const repos = data.user?.contributionsCollection?.commitContributionsByRepository || [];
  let maxRepo: string | null = null;
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

export async function starGrazer(username: string): Promise<ApiResult<number>> {
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
  const data = await graphqlRequest(query, { login: username }) as { user?: GraphQLUser };
  return data.user?.repositories?.nodes?.reduce((acc: number, repo: any) => acc + (repo.stargazerCount || 0), 0) ?? 0;
}

export async function getUserProfile(username: string): Promise<ApiResult<UserProfile>> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        name
        avatarUrl
        websiteUrl
        twitterUsername
        socialAccounts(first: 10) {
          nodes {
            provider
            url
            displayName
          }
        }
      }
    }
  `;
  try {
    const data = await graphqlRequest(query, { login: username });
    if (!data.user) throw new Error("User not found");
    return {
      name: data.user.name,
      avatarUrl: data.user.avatarUrl,
      websiteUrl: data.user.websiteUrl,
      twitterUsername: data.user.twitterUsername,
      socialAccounts: data.user.socialAccounts.nodes || [],
    };
  } catch (e: any) {
    return { error: e.message };
  }
}
