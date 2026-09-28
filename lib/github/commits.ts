import type { Octokit } from "octokit";
import type { RepoCommitStats } from "@/types/github";

/**
 * Parses the last page number from GitHub's Link pagination header.
 *
 * Example link header:
 * <https://api.github.com/repositories/123/commits?per_page=1&page=342>; rel="last", <https://...>; rel="next"
 */
export function parseLastPageFromLinkHeader(linkHeader?: string): number | null {
  if (!linkHeader || typeof linkHeader !== "string") {
    return null;
  }

  const parts = linkHeader.split(",");
  for (const part of parts) {
    if (part.includes('rel="last"')) {
      const match = part.match(/[?&]page=(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }
  }

  return null;
}

/**
 * Efficiently computes total commit count, recency, and contributor volume
 * for a repository without exhausting API rate limits.
 */
export async function fetchRepoCommitStats(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<RepoCommitStats> {
  let totalCommits = 0;
  let lastCommitDate: string | null = null;
  let lastCommitMessage: string | null = null;
  let lastCommitSha: string | null = null;
  let isEmpty = false;

  try {
    // 1. Fetch the latest commit with per_page=1
    const commitResponse = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });

    const commits = commitResponse.data;

    if (!commits || commits.length === 0) {
      isEmpty = true;
    } else {
      const latest = commits[0];
      if (latest) {
        lastCommitDate = latest.commit.committer?.date || latest.commit.author?.date || null;
        lastCommitMessage = latest.commit.message || null;
        lastCommitSha = latest.sha || null;
      }

      // Extract total commit count from Link header's last page if paginated
      const lastPage = parseLastPageFromLinkHeader(commitResponse.headers.link);

      totalCommits = lastPage !== null ? lastPage : commits.length;
    }
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status;
    // HTTP 409 Conflict indicates an empty repository with no Git commits
    if (status === 409 || status === 404) {
      return {
        totalCommits: 0,
        lastCommitDate: null,
        lastCommitMessage: null,
        lastCommitSha: null,
        contributorCount: 0,
        isEmpty: true,
      };
    }

    throw error;
  }

  // 2. Fetch contributor count if repository has commits
  let contributorCount = 0;
  if (!isEmpty) {
    try {
      const contribResponse = await octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 1,
        anon: "false",
      });

      const contribs = contribResponse.data;
      if (Array.isArray(contribs) && contribs.length > 0) {
        const lastContribPage = parseLastPageFromLinkHeader(contribResponse.headers.link);
        contributorCount = lastContribPage !== null ? lastContribPage : contribs.length;
      }
    } catch {
      // If contributors endpoint fails or is disabled, fallback gracefully
      contributorCount = 1;
    }
  }

  return {
    totalCommits,
    lastCommitDate,
    lastCommitMessage,
    lastCommitSha,
    contributorCount,
    isEmpty,
  };
}
