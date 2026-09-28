"use server";

import { requireAuth } from "@/lib/session";
import {
  getAuthenticatedOctokit,
  withRateLimitHandling,
  fetchUserPublicRepositories,
  fetchRepoReadme,
  fetchRepoCommitStats,
  fetchRepoLanguages,
  upsertRepository,
  syncAndPersistUserRepositories,
  GitHubAuthError,
  GitHubRateLimitError,
  type FetchUserReposOptions,
  type MarkdownExtractOptions,
  type SyncOptions,
} from "@/lib/github";
import type {
  ParsedRepository,
  RepoReadmeData,
  RepoCommitStats,
  RepoLanguageBreakdown,
  UpsertRepoInput,
  SerializedRepo,
} from "@/types/github";

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

export type FetchRepoCommitStatsResult =
  | {
      success: true;
      stats: RepoCommitStats;
    }
  | {
      success: false;
      error: string;
      rateLimited?: boolean;
      retryAfter?: number;
    };

/**
 * Server Action: Fetches commit metrics (total count, latest commit date, sha, message)
 * and contributor count for a repository.
 */
export async function fetchRepoCommitStatsAction(
  owner: string,
  repo: string,
): Promise<FetchRepoCommitStatsResult> {
  try {
    const octokit = await getAuthenticatedOctokit();

    const stats = await withRateLimitHandling(() => fetchRepoCommitStats(octokit, owner, repo), {
      maxRetries: 2,
      initialDelayMs: 1000,
      autoWaitIfSmall: true,
    });

    return {
      success: true,
      stats,
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
      error instanceof Error ? error.message : `Failed to fetch commit stats for ${owner}/${repo}.`;

    return {
      success: false,
      error: message,
    };
  }
}

export type FetchRepoLanguagesResult =
  | {
      success: true;
      breakdown: RepoLanguageBreakdown;
    }
  | {
      success: false;
      error: string;
      rateLimited?: boolean;
      retryAfter?: number;
    };

/**
 * Server Action: Fetches language byte distribution and percentages for a repository.
 */
export async function fetchRepoLanguagesAction(
  owner: string,
  repo: string,
): Promise<FetchRepoLanguagesResult> {
  try {
    const octokit = await getAuthenticatedOctokit();

    const breakdown = await withRateLimitHandling(() => fetchRepoLanguages(octokit, owner, repo), {
      maxRetries: 2,
      initialDelayMs: 1000,
      autoWaitIfSmall: true,
    });

    return {
      success: true,
      breakdown,
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
      error instanceof Error ? error.message : `Failed to fetch languages for ${owner}/${repo}.`;

    return {
      success: false,
      error: message,
    };
  }
}

export type UpsertRepositoryResult =
  | {
      success: true;
      repo: SerializedRepo;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Upserts a repository record in Postgres for the authenticated user.
 */
export async function upsertRepositoryAction(
  repoData: UpsertRepoInput,
): Promise<UpsertRepositoryResult> {
  try {
    const user = await requireAuth();
    const repo = await upsertRepository(user.id, repoData);

    return {
      success: true,
      repo,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to persist repository.";

    return {
      success: false,
      error: message,
    };
  }
}

export type SyncAndPersistResult =
  | {
      success: true;
      totalSynced: number;
      repos: SerializedRepo[];
    }
  | {
      success: false;
      error: string;
      rateLimited?: boolean;
      retryAfter?: number;
    };

/**
 * Server Action: Fetches user repositories from GitHub API, enriches key projects,
 * and persists the updated dataset into PostgreSQL with lastSyncedAt timestamps.
 */
export async function syncAndPersistUserRepositoriesAction(
  options?: SyncOptions,
): Promise<SyncAndPersistResult> {
  try {
    const user = await requireAuth();
    const octokit = await getAuthenticatedOctokit();

    const result = await withRateLimitHandling(
      () => syncAndPersistUserRepositories(user.id, octokit, options),
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        autoWaitIfSmall: true,
      },
    );

    return {
      success: true,
      totalSynced: result.totalSynced,
      repos: result.repos,
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
      error instanceof Error ? error.message : "Failed to sync and persist repositories.";

    return {
      success: false,
      error: message,
    };
  }
}
