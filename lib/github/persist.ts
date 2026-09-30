import { db } from "@/lib/db";
import type { Octokit } from "octokit";
import type {
  UpsertRepoInput,
  SerializedRepo,
  ParsedRepository,
  RepoWithStatus,
} from "@/types/github";
import { fetchUserPublicRepositories } from "./repos";
import { fetchRepoReadme } from "./readme";
import { fetchRepoCommitStats } from "./commits";
import { fetchRepoLanguages } from "./languages";

/**
 * Normalizes a Prisma Repo record to a JSON-safe SerializedRepo object,
 * safely casting BigInt and Date fields for Server Actions and client components.
 */
export function serializeRepo(repo: {
  id: string;
  userId: string;
  githubId: bigint | number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  primaryLanguage: string | null;
  languageBreakdown: unknown;
  stars: number;
  forks: number;
  openIssues: number;
  topics: string[];
  readmeContent: string | null;
  commitCount: number;
  isSelected: boolean;
  displayOrder: number;
  lastPushedAt: Date | string | null;
  lastSyncedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}): SerializedRepo {
  return {
    ...repo,
    githubId: Number(repo.githubId),
    lastPushedAt: repo.lastPushedAt ? new Date(repo.lastPushedAt).toISOString() : null,
    lastSyncedAt: new Date(repo.lastSyncedAt).toISOString(),
    createdAt: new Date(repo.createdAt).toISOString(),
    updatedAt: new Date(repo.updatedAt).toISOString(),
    languageBreakdown:
      repo.languageBreakdown && typeof repo.languageBreakdown === "object"
        ? (repo.languageBreakdown as Record<string, number>)
        : null,
  };
}

/**
 * Upserts a single repository record for a given user in PostgreSQL.
 * Updates fields and sets lastSyncedAt if the repository already exists,
 * or inserts a new row if it is encountered for the first time.
 */
export async function upsertRepository(
  userId: string,
  input: UpsertRepoInput,
): Promise<SerializedRepo> {
  const githubIdBigInt = BigInt(input.githubId);
  const now = new Date();
  const lastPushedAt = input.lastPushedAt ? new Date(input.lastPushedAt) : null;

  const result = await db.repo.upsert({
    where: {
      userId_githubId: {
        userId,
        githubId: githubIdBigInt,
      },
    },
    create: {
      userId,
      githubId: githubIdBigInt,
      name: input.name,
      fullName: input.fullName,
      description: input.description ?? null,
      htmlUrl: input.htmlUrl,
      homepage: input.homepage ?? null,
      language: input.language ?? null,
      primaryLanguage: input.primaryLanguage ?? input.language ?? null,
      languageBreakdown: input.languageBreakdown ?? undefined,
      stars: input.stars ?? 0,
      forks: input.forks ?? 0,
      openIssues: input.openIssues ?? 0,
      topics: input.topics ?? [],
      readmeContent: input.readmeContent ?? null,
      commitCount: input.commitCount ?? 0,
      isSelected: input.isSelected ?? true,
      displayOrder: input.displayOrder ?? 0,
      lastPushedAt,
      lastSyncedAt: now,
    },
    update: {
      name: input.name,
      fullName: input.fullName,
      description: input.description ?? null,
      htmlUrl: input.htmlUrl,
      homepage: input.homepage ?? null,
      language: input.language ?? null,
      primaryLanguage: input.primaryLanguage ?? input.language ?? null,
      ...(input.languageBreakdown !== undefined && {
        languageBreakdown: input.languageBreakdown ?? undefined,
      }),
      stars: input.stars ?? 0,
      forks: input.forks ?? 0,
      openIssues: input.openIssues ?? 0,
      topics: input.topics ?? [],
      ...(input.readmeContent !== undefined && {
        readmeContent: input.readmeContent ?? null,
      }),
      ...(input.commitCount !== undefined && {
        commitCount: input.commitCount,
      }),
      ...(input.isSelected !== undefined && {
        isSelected: input.isSelected,
      }),
      ...(input.displayOrder !== undefined && {
        displayOrder: input.displayOrder,
      }),
      lastPushedAt,
      lastSyncedAt: now,
    },
  });

  return serializeRepo(result);
}

/**
 * Persists an array of parsed repositories into PostgreSQL for the given user.
 * Returns synced repositories and counts of created vs updated records.
 */
export async function persistRepositories(
  userId: string,
  repos: (ParsedRepository | UpsertRepoInput)[],
): Promise<{
  totalSynced: number;
  repos: SerializedRepo[];
}> {
  const syncedRepos: SerializedRepo[] = [];

  for (const repo of repos) {
    const synced = await upsertRepository(userId, repo);
    syncedRepos.push(synced);
  }

  return {
    totalSynced: syncedRepos.length,
    repos: syncedRepos,
  };
}

export interface SyncOptions {
  includeForks?: boolean;
  includeArchived?: boolean;
  enrichTopN?: number; // Enrich top N repositories with deep README, languages, and commit stats
}

/**
 * End-to-end sync workflow: Fetches repositories directly from GitHub,
 * enriches them with deep code metrics, and persists everything into PostgreSQL.
 */
export async function syncAndPersistUserRepositories(
  userId: string,
  octokit: Octokit,
  options: SyncOptions = {},
): Promise<{
  totalSynced: number;
  repos: SerializedRepo[];
}> {
  const { includeForks = false, includeArchived = false, enrichTopN = 5 } = options;

  // 1. Fetch public repos from GitHub API
  const rawRepos = await fetchUserPublicRepositories(octokit, {
    includeForks,
    includeArchived,
    sort: "pushed",
    direction: "desc",
  });

  const upsertInputs: UpsertRepoInput[] = [];

  // 2. Map and optionally enrich top projects
  for (let i = 0; i < rawRepos.length; i++) {
    const repo = rawRepos[i];
    if (!repo) continue;

    let readmeContent: string | null = null;
    let commitCount = 0;
    let languageBreakdown: Record<string, number> | null = null;
    let primaryLanguage = repo.language;

    // Deep enrich top projects or those with high stars / recent activity
    if (i < enrichTopN) {
      const [owner, repoName] = repo.fullName.split("/");
      if (owner && repoName) {
        try {
          const [readmeData, commitStats, langData] = await Promise.all([
            fetchRepoReadme(octokit, owner, repoName).catch(() => null),
            fetchRepoCommitStats(octokit, owner, repoName).catch(() => null),
            fetchRepoLanguages(octokit, owner, repoName).catch(() => null),
          ]);

          readmeContent = readmeData?.plainText ?? null;
          commitCount = commitStats?.totalCommits ?? 0;
          languageBreakdown = langData?.rawBreakdown ?? null;
          if (langData?.primaryLanguage) {
            primaryLanguage = langData.primaryLanguage;
          }
        } catch {
          // If enrichment fails for individual repo, continue with base metadata
        }
      }
    }

    upsertInputs.push({
      githubId: repo.githubId,
      name: repo.name,
      fullName: repo.fullName,
      description: repo.description,
      htmlUrl: repo.htmlUrl,
      homepage: repo.homepage,
      language: repo.language,
      primaryLanguage,
      languageBreakdown,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: repo.openIssues,
      topics: repo.topics,
      readmeContent,
      commitCount,
      lastPushedAt: repo.pushedAt,
      isSelected: true,
      displayOrder: i,
    });
  }

  // 3. Persist all into PostgreSQL
  return await persistRepositories(userId, upsertInputs);
}

/**
 * Retrieves all synced repositories for a user from PostgreSQL,
 * enriched with case study status, sorted by selection and stars.
 */
export async function getUserRepositories(userId: string): Promise<RepoWithStatus[]> {
  const repos = await db.repo.findMany({
    where: { userId },
    include: {
      caseStudy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [{ isSelected: "desc" }, { stars: "desc" }, { lastPushedAt: "desc" }],
  });

  return repos.map((repo) => ({
    ...serializeRepo(repo),
    hasCaseStudy: Boolean(repo.caseStudy),
    caseStudyId: repo.caseStudy?.id ?? null,
  }));
}

/**
 * Toggles or sets the isSelected status for a user's repository.
 */
export async function toggleRepoSelection(
  userId: string,
  repoId: string,
  isSelected: boolean,
): Promise<SerializedRepo> {
  const updated = await db.repo.update({
    where: {
      id: repoId,
      userId,
    },
    data: {
      isSelected,
    },
  });

  return serializeRepo(updated);
}

/**
 * Bulk updates the isSelected status for multiple repositories belonging to a user.
 */
export async function bulkToggleRepoSelection(
  userId: string,
  repoIds: string[],
  isSelected: boolean,
): Promise<number> {
  const result = await db.repo.updateMany({
    where: {
      id: { in: repoIds },
      userId,
    },
    data: {
      isSelected,
    },
  });

  return result.count;
}
