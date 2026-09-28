import type { Octokit } from "octokit";
import type { ParsedRepository } from "@/types/github";

export interface FetchUserReposOptions {
  /**
   * Whether to include forked repositories in results.
   * Defaults to false so portfolios spotlight original work.
   */
  includeForks?: boolean;
  /**
   * Whether to include archived repositories.
   * Defaults to false.
   */
  includeArchived?: boolean;
  /**
   * Sort field for repository listing. Defaults to "pushed".
   */
  sort?: "created" | "updated" | "pushed" | "full_name";
  /**
   * Sort direction. Defaults to "desc".
   */
  direction?: "asc" | "desc";
  /**
   * Max items per page requested from GitHub API (max 100).
   */
  perPage?: number;
  /**
   * Optional maximum number of repositories to return.
   */
  maxRepos?: number;
}

/**
 * Normalizes a raw GitHub API repository object into our standardized ParsedRepository format.
 */
export function parseRepository(raw: Record<string, unknown>): ParsedRepository {
  return {
    githubId: Number(raw.id),
    name: String(raw.name ?? ""),
    fullName: String(raw.full_name ?? ""),
    description: raw.description ? String(raw.description) : null,
    htmlUrl: String(raw.html_url ?? ""),
    homepage: raw.homepage ? String(raw.homepage) : null,
    language: raw.language ? String(raw.language) : null,
    stars: typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0,
    forks: typeof raw.forks_count === "number" ? raw.forks_count : 0,
    openIssues: typeof raw.open_issues_count === "number" ? raw.open_issues_count : 0,
    topics: Array.isArray(raw.topics) ? raw.topics.map(String) : [],
    isFork: Boolean(raw.fork),
    isArchived: Boolean(raw.archived),
    isPrivate: Boolean(raw.private),
    pushedAt: raw.pushed_at ? String(raw.pushed_at) : null,
    createdAt: String(raw.created_at ?? new Date().toISOString()),
    updatedAt: String(raw.updated_at ?? new Date().toISOString()),
    defaultBranch: String(raw.default_branch ?? "main"),
  };
}

/**
 * Fetches and parses all public repositories owned by the authenticated GitHub user.
 * Automatically paginates through GitHub's REST API using Octokit.
 */
export async function fetchUserPublicRepositories(
  octokit: Octokit,
  options: FetchUserReposOptions = {},
): Promise<ParsedRepository[]> {
  const {
    includeForks = false,
    includeArchived = false,
    sort = "pushed",
    direction = "desc",
    perPage = 100,
    maxRepos,
  } = options;

  // Retrieve repositories using Octokit's built-in automatic pagination
  const rawRepos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
    visibility: "public",
    affiliation: "owner",
    sort,
    direction,
    per_page: perPage,
  });

  let filtered = (rawRepos as Record<string, unknown>[]).filter((repo) => {
    // Exclude forks unless explicitly requested
    if (!includeForks && repo.fork) return false;
    // Exclude archived repos unless explicitly requested
    if (!includeArchived && repo.archived) return false;
    return true;
  });

  if (typeof maxRepos === "number" && maxRepos > 0) {
    filtered = filtered.slice(0, maxRepos);
  }

  return filtered.map(parseRepository);
}
