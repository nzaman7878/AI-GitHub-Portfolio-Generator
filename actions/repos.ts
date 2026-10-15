"use server";

import { revalidatePath } from "next/cache";
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
  getUserRepositories,
  toggleRepoSelection,
  bulkToggleRepoSelection,
  GitHubAuthError,
  GitHubRateLimitError,
  type FetchUserReposOptions,
  type MarkdownExtractOptions,
  type SyncOptions,
} from "@/lib/github";
import {
  fetchUserReposOptionsSchema,
  repoIdentifierSchema,
  markdownExtractOptionsSchema,
  syncOptionsSchema,
  toggleRepoSelectionInputSchema,
  bulkToggleRepoSelectionInputSchema,
  upsertRepoInputSchema,
  formatZodError,
} from "@/lib/validations/actions";
import type {
  ParsedRepository,
  RepoReadmeData,
  RepoCommitStats,
  RepoLanguageBreakdown,
  UpsertRepoInput,
  SerializedRepo,
  RepoWithStatus,
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
    const validated = fetchUserReposOptionsSchema.safeParse(options);
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const octokit = await getAuthenticatedOctokit();

    const repos = await withRateLimitHandling(
      () => fetchUserPublicRepositories(octokit, validated.data),
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        autoWaitIfSmall: true,
      },
    );

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
    const idValidation = repoIdentifierSchema.safeParse({ owner, repo });
    if (!idValidation.success) {
      return {
        success: false,
        error: formatZodError(idValidation.error),
      };
    }
    const optValidation = markdownExtractOptionsSchema.safeParse(options);
    if (!optValidation.success) {
      return {
        success: false,
        error: formatZodError(optValidation.error),
      };
    }

    const octokit = await getAuthenticatedOctokit();

    const readme = await withRateLimitHandling(
      () =>
        fetchRepoReadme(
          octokit,
          idValidation.data.owner,
          idValidation.data.repo,
          optValidation.data,
        ),
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
    const validated = repoIdentifierSchema.safeParse({ owner, repo });
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const octokit = await getAuthenticatedOctokit();

    const stats = await withRateLimitHandling(
      () => fetchRepoCommitStats(octokit, validated.data.owner, validated.data.repo),
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        autoWaitIfSmall: true,
      },
    );

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
    const validated = repoIdentifierSchema.safeParse({ owner, repo });
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const octokit = await getAuthenticatedOctokit();

    const breakdown = await withRateLimitHandling(
      () => fetchRepoLanguages(octokit, validated.data.owner, validated.data.repo),
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        autoWaitIfSmall: true,
      },
    );

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
    const validated = upsertRepoInputSchema.safeParse(repoData);
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const user = await requireAuth();
    const repo = await upsertRepository(user.id, validated.data);

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
      durationMs: number;
      syncedAt: string;
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
  const startTime = Date.now();
  try {
    const validated = syncOptionsSchema.safeParse(options);
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const user = await requireAuth();
    const octokit = await getAuthenticatedOctokit();

    const result = await withRateLimitHandling(
      () => syncAndPersistUserRepositories(user.id, octokit, validated.data),
      {
        maxRetries: 2,
        initialDelayMs: 1000,
        autoWaitIfSmall: true,
      },
    );

    revalidatePath("/dashboard/repos");
    revalidatePath("/dashboard");

    const durationMs = Date.now() - startTime;
    const syncedAt = new Date().toISOString();

    return {
      success: true,
      totalSynced: result.totalSynced,
      repos: result.repos,
      durationMs,
      syncedAt,
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

export type GetUserRepositoriesResult =
  | {
      success: true;
      repos: RepoWithStatus[];
      total: number;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Fetches all synced repositories for the authenticated user from the database.
 */
export async function getUserRepositoriesAction(): Promise<GetUserRepositoriesResult> {
  try {
    const user = await requireAuth();
    const repos = await getUserRepositories(user.id);

    return {
      success: true,
      repos,
      total: repos.length,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load repositories.";

    return {
      success: false,
      error: message,
    };
  }
}

export type ToggleRepoSelectionResult =
  | {
      success: true;
      repo: SerializedRepo;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Toggles or updates a single repository's portfolio inclusion state.
 */
export async function toggleRepoSelectionAction(
  repoId: string,
  isSelected: boolean,
): Promise<ToggleRepoSelectionResult> {
  try {
    const validated = toggleRepoSelectionInputSchema.safeParse({ repoId, isSelected });
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const user = await requireAuth();
    const repo = await toggleRepoSelection(
      user.id,
      validated.data.repoId,
      validated.data.isSelected,
    );

    revalidatePath("/dashboard/repos");
    revalidatePath("/dashboard");

    return {
      success: true,
      repo,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update repository inclusion status.";

    return {
      success: false,
      error: message,
    };
  }
}

export type BulkToggleRepoSelectionResult =
  | {
      success: true;
      updatedCount: number;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server Action: Bulk updates portfolio inclusion status for multiple repositories.
 */
export async function bulkToggleRepoSelectionAction(
  repoIds: string[],
  isSelected: boolean,
): Promise<BulkToggleRepoSelectionResult> {
  try {
    const validated = bulkToggleRepoSelectionInputSchema.safeParse({ repoIds, isSelected });
    if (!validated.success) {
      return {
        success: false,
        error: formatZodError(validated.error),
      };
    }

    const user = await requireAuth();
    const updatedCount = await bulkToggleRepoSelection(
      user.id,
      validated.data.repoIds,
      validated.data.isSelected,
    );

    revalidatePath("/dashboard/repos");
    revalidatePath("/dashboard");

    return {
      success: true,
      updatedCount,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to bulk update repository inclusion.";

    return {
      success: false,
      error: message,
    };
  }
}
