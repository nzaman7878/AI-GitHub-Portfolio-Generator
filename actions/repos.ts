"use server";

import {
  getAuthenticatedOctokit,
  withRateLimitHandling,
  fetchUserPublicRepositories,
  GitHubAuthError,
  GitHubRateLimitError,
  type FetchUserReposOptions,
} from "@/lib/github";
import type { ParsedRepository } from "@/types/github";

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
