# 🔍 Data Sources & Endpoints

You can implement stats retrieval via:

## REST API (MVP)

| Stat                   | REST Endpoint(s)                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| Total Commits          | Loop `/users/:username/repos` → `/repos/:owner/:repo/stats/contributors` and sum `contributions` for your user¹ |
| Pull Requests Opened   | `/search/issues?q=type:pr+author:username+created:YYYY-MM-DD..YYYY-MM-DD`²                                      |
| Issues Opened          | `/search/issues?q=type:issue+author:username+created:YYYY-MM-DD..YYYY-MM-DD`²                                   |
| Repos Created          | `/users/:username/repos?type=owner&sort=created&direction=asc`, filter by `created_at`                          |
| Most Active Repository | Combine commit + PR + issue counts per repo                                                                     |
| Top Languages          | From `/users/:username/repos`, tally the `language` field                                                       |
| Stars Given            | `/users/:username/starred?per_page=1&sort=created&direction=asc` (count pages or `total_count`)                 |
| Stars Received         | Sum `stargazers_count` across `/users/:username/repos`                                                          |

¹ Note: `/stats/contributors` is cached and may lag.
² Search endpoints are rate-limited but support up to 30 requests/minute.

## GraphQL API (Advanced)

```graphql
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      commitContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
    }
    repositories(first: 100, orderBy: {field: CREATED_AT, direction: ASC}) {
      totalCount
      nodes { name createdAt primaryLanguage { name } stargazerCount }
    }
    starredRepositories(first: 1) { totalCount }
  }
}
```

* Use build-time fetch (Next.js SSG) or GitHub Actions for rate-limit safety.
* Requires a Personal Access Token for higher limits.
