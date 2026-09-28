import { Octokit } from "octokit";
import { getAuthSession } from "@/lib/session";
import type { RateLimitOverview } from "@/types/github";
import {
  parseRateLimitHeaders,
  updateLastKnownRateLimit,
  GitHubRateLimitError,
  GitHubAuthError,
} from "./rate-limit";

/**
 * Creates and configures an Octokit client with rate-limit tracking hooks and error interception.
 *
 * @param token Optional GitHub personal access token or OAuth access token.
 *              Falls back to process.env.GITHUB_TOKEN or GITHUB_PERSONAL_ACCESS_TOKEN if omitted.
 */
export function createOctokitClient(token?: string): Octokit {
  const authToken =
    token || process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || undefined;

  const client = new Octokit({
    auth: authToken,
    userAgent: "AI-GitHub-Portfolio-Generator/1.0.0",
  });

  // Track rate limits after every successful response
  client.hook.after("request", async (response) => {
    const rateLimit = parseRateLimitHeaders(response.headers as Record<string, unknown>);
    if (rateLimit) {
      updateLastKnownRateLimit(rateLimit);
    }
  });

  // Intercept rate limit errors and normalize to GitHubRateLimitError
  client.hook.error("request", async (error) => {
    const status = (error as { status?: number }).status;
    const headers = (error as { response?: { headers?: Record<string, unknown> } })?.response
      ?.headers;
    const msg = (error as { message?: string }).message ?? "";

    if (status === 403 || status === 429) {
      const parsed = parseRateLimitHeaders(headers);
      const isSecondary =
        msg.toLowerCase().includes("secondary rate limit") || msg.toLowerCase().includes("abuse");

      const retryAfterHeader = headers?.["retry-after"];
      const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;

      const resetDate =
        parsed?.reset ?? new Date(Date.now() + (retryAfter ? retryAfter * 1000 : 60000));
      const retryAfterSeconds =
        retryAfter ?? Math.max(1, Math.ceil((resetDate.getTime() - Date.now()) / 1000));

      throw new GitHubRateLimitError({
        message: msg,
        status,
        limit: parsed?.limit ?? 60,
        remaining: parsed?.remaining ?? 0,
        resetDate,
        retryAfterSeconds,
        isSecondary,
      });
    }

    throw error;
  });

  return client;
}

/**
 * Server-side helper to get an authenticated Octokit instance using the current user's session token.
 * Throws a typed GitHubAuthError if unauthenticated or token is missing.
 */
export async function getAuthenticatedOctokit(): Promise<Octokit> {
  const session = await getAuthSession();
  const token = session?.accessToken;

  if (!token) {
    throw new GitHubAuthError(
      "No GitHub OAuth token available in session. Please sign in to connect with GitHub.",
    );
  }

  return createOctokitClient(token);
}

/**
 * Directly queries GitHub's `/rate_limit` endpoint and returns parsed limits for core, search, and graphql.
 */
export async function checkRateLimit(client: Octokit): Promise<RateLimitOverview> {
  const { data } = await client.rest.rateLimit.get();

  const core = {
    limit: data.resources.core.limit,
    remaining: data.resources.core.remaining,
    reset: new Date(data.resources.core.reset * 1000),
    used: data.resources.core.used,
    resource: "core",
  };

  const search = {
    limit: data.resources.search.limit,
    remaining: data.resources.search.remaining,
    reset: new Date(data.resources.search.reset * 1000),
    used: data.resources.search.used,
    resource: "search",
  };

  const graphql = data.resources.graphql
    ? {
        limit: data.resources.graphql.limit,
        remaining: data.resources.graphql.remaining,
        reset: new Date(data.resources.graphql.reset * 1000),
        used: data.resources.graphql.used,
        resource: "graphql",
      }
    : undefined;

  // Update in-memory tracker
  updateLastKnownRateLimit(core);
  updateLastKnownRateLimit(search);

  return {
    core,
    search,
    graphql,
  };
}
