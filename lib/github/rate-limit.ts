import type { RateLimitState } from "@/types/github";

/**
 * Custom error thrown when GitHub API rate limits or secondary abuse limits are encountered.
 */
export class GitHubRateLimitError extends Error {
  public readonly status: number;
  public readonly limit: number;
  public readonly remaining: number;
  public readonly resetDate: Date;
  public readonly retryAfterSeconds: number;
  public readonly isSecondary: boolean;

  constructor(options: {
    message?: string;
    status: number;
    limit: number;
    remaining: number;
    resetDate: Date;
    retryAfterSeconds: number;
    isSecondary?: boolean;
  }) {
    const formattedReset = options.resetDate.toLocaleTimeString();
    const defaultMsg = options.isSecondary
      ? `GitHub secondary rate limit triggered. Back off and retry after ${options.retryAfterSeconds}s (resets at ${formattedReset}).`
      : `GitHub API rate limit exceeded (${options.remaining}/${options.limit} remaining). Resets at ${formattedReset} (${options.retryAfterSeconds}s remaining).`;

    super(options.message ?? defaultMsg);
    this.name = "GitHubRateLimitError";
    this.status = options.status;
    this.limit = options.limit;
    this.remaining = options.remaining;
    this.resetDate = options.resetDate;
    this.retryAfterSeconds = options.retryAfterSeconds;
    this.isSecondary = options.isSecondary ?? false;
  }
}

/**
 * Custom error thrown when a GitHub API call lacks valid authentication.
 */
export class GitHubAuthError extends Error {
  constructor(message = "GitHub authentication required or access token expired.") {
    super(message);
    this.name = "GitHubAuthError";
  }
}

/**
 * In-memory cache of the latest observed rate-limit state per GitHub resource bucket.
 */
const rateLimitCache: Record<string, RateLimitState> = {};

/**
 * Parses GitHub HTTP response headers into a structured RateLimitState.
 */
export function parseRateLimitHeaders(
  headers: Record<string, unknown> | undefined,
): RateLimitState | null {
  if (!headers) return null;

  const limitVal = headers["x-ratelimit-limit"];
  const remainingVal = headers["x-ratelimit-remaining"];
  const resetVal = headers["x-ratelimit-reset"];
  const usedVal = headers["x-ratelimit-used"];
  const resourceVal = headers["x-ratelimit-resource"];

  if (limitVal === undefined || remainingVal === undefined || resetVal === undefined) {
    return null;
  }

  const limit = Number(limitVal);
  const remaining = Number(remainingVal);
  const resetEpoch = Number(resetVal);
  const used = usedVal !== undefined ? Number(usedVal) : Math.max(0, limit - remaining);
  const resource = typeof resourceVal === "string" ? resourceVal : "core";

  return {
    limit,
    remaining,
    reset: new Date(resetEpoch * 1000),
    used,
    resource,
  };
}

/**
 * Updates the in-memory rate-limit cache with newly observed header metrics.
 */
export function updateLastKnownRateLimit(state: RateLimitState): void {
  rateLimitCache[state.resource] = state;
}

/**
 * Retrieves the latest observed rate-limit status for a given resource ("core", "search", "graphql").
 */
export function getLastKnownRateLimit(resource = "core"): RateLimitState | null {
  return rateLimitCache[resource] ?? null;
}

/**
 * Helper to determine if an unknown error represents a GitHub rate limit or secondary rate limit.
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof GitHubRateLimitError) {
    return true;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      status?: number;
      message?: string;
      response?: { headers?: Record<string, unknown> };
    };

    if (candidate.status === 403 || candidate.status === 429) {
      const remaining = candidate.response?.headers?.["x-ratelimit-remaining"];
      if (remaining === "0" || remaining === 0) return true;

      const msg = candidate.message?.toLowerCase() ?? "";
      if (
        msg.includes("rate limit") ||
        msg.includes("secondary rate limit") ||
        msg.includes("abuse")
      ) {
        return true;
      }
    }
  }

  return false;
}

export interface RateLimitWrapperOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  autoWaitIfSmall?: boolean;
}

/**
 * Rate-limit aware wrapper executing a GitHub API callback with exponential backoff and structured error reporting.
 */
export async function withRateLimitHandling<T>(
  operation: () => Promise<T>,
  options: RateLimitWrapperOptions = {},
): Promise<T> {
  const {
    maxRetries = 2,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    autoWaitIfSmall = true,
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (err: unknown) {
      if (!isRateLimitError(err)) {
        throw err;
      }

      attempt++;
      if (attempt > maxRetries) {
        throw err;
      }

      let waitMs = delay;

      if (err instanceof GitHubRateLimitError) {
        const secondsUntilReset = Math.max(
          1,
          Math.ceil((err.resetDate.getTime() - Date.now()) / 1000),
        );

        // If reset is very close (e.g. <= 3s), wait and retry automatically
        if (autoWaitIfSmall && secondsUntilReset <= 3) {
          waitMs = secondsUntilReset * 1000;
        } else {
          // If primary quota is depleted and reset is far off, don't stall execution indefinitely
          if (!err.isSecondary && err.remaining === 0 && secondsUntilReset > 5) {
            throw err;
          }
          waitMs = Math.min(secondsUntilReset * 1000, maxDelayMs);
        }
      } else {
        waitMs = Math.min(delay, maxDelayMs);
      }

      await new Promise((resolve) => setTimeout(resolve, waitMs));
      delay = Math.min(delay * 2, maxDelayMs);
    }
  }

  throw new Error("GitHub rate-limit retry attempts exhausted.");
}
