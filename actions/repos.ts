"use server";

import {
  getAuthenticatedOctokit,
  withRateLimitHandling,
  fetchUserPublicRepositories,
  fetchRepoReadme,
  GitHubAuthError,
  GitHubRateLimitError,
  type FetchUserReposOptions,
  type MarkdownExtractOptions,
} from "@/lib/github";
import type { ParsedRepository, RepoReadmeData } from "@/types/github";

export type FetchUserRepositoriesResult =
  | {
      success: true;
      repos: ParsedRepository[];
      total: number;
    }
  | {
      success: false;
      error: string;
      rateLimited?: boolean;
      retryAfter?: number;
    };

/**
 * Server Action: Fetches all public repositories for the authenticated user via GitHub API.
 * Parses name, description, primary language, stars, forks, open issues, and topics.
 * Employs rate-limit tracking and graceful error handling.
 */
export async function fetchUserRepositoriesAction(
  options?: FetchUserReposOptions,
): Promise<FetchUserRepositoriesResult> {
  try {
    const octokit = await getAuthenticatedOctokit();

    const repos = await withRateLimitHandling(() => fetchUserPublicRepositories(octokit, options), {
      maxRetries: 2,
      initialDelayMs: 1000,
      autoWaitIfSmall: true,
    });

    return {
      success: true,
      repos,
      total: repos.length,
    };
  } catch (error: unknown) {
    if (error instanceof GitHubAuthError) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof GitHubRateLimitError) {
      return {
        success: false,
        error: error.message,
        rateLimited: true,
        retryAfter: error.retryAfterSeconds,
      };
    }

    const message =
      error instanceof Error ? error.message : "Failed to fetch repositories from GitHub.";

    return {
      success: false,
      error: message,
    };
  }
}

export type FetchRepoReadmeResult =
  | {
      success: true;
      readme: RepoReadmeData;
    }
  | {
      success: false;
      error: string;
      rateLimited?: boolean;
      retryAfter?: number;
    };

/**
 * Server Action: Fetches and parses the README content for a given repository.
 * Extracts clean plain text ready for AI case study context generation.
 */
export async function fetchRepoReadmeAction(
  owner: string,
  repo: string,
  options?: MarkdownExtractOptions,
): Promise<FetchRepoReadmeResult> {
  try {
    const octokit = await getAuthenticatedOctokit();

    const readme = await withRateLimitHandling(
      () => fetchRepoReadme(octokit, owner, repo, options),
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        autoWaitIfSmall: true,
      },
    );

    return {
      success: true,
      readme,
    };
  } catch (error: unknown) {
    if (error instanceof GitHubAuthError) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof GitHubRateLimitError) {
      return {
        success: false,
        error: error.message,
        rateLimited: true,
        retryAfter: error.retryAfterSeconds,
      };
    }

    const message =
      error instanceof Error ? error.message : `Failed to fetch README for ${owner}/${repo}.`;

    return {
      success: false,
      error: message,
    };
  }
}
