import { db } from "@/lib/db";

/**
 * Free-tier rate limits for Google Gemini API (gemini-1.5-flash).
 * Overridable via environment variables.
 */
export const GEMINI_RPM_LIMIT = parseInt(process.env.GEMINI_RPM_LIMIT || "15", 10);
export const GEMINI_RPD_LIMIT = parseInt(process.env.GEMINI_RPD_LIMIT || "1500", 10);

/**
 * Minimum interval between successive requests to prevent RPM spikes (e.g. 4,000ms for 15 RPM).
 */
export const MIN_REQUEST_INTERVAL_MS = Math.ceil(60000 / GEMINI_RPM_LIMIT);

export interface GeminiQuotaStatus {
  rpmLimit: number;
  rpmUsed: number;
  rpmRemaining: number;
  rpdLimit: number;
  rpdUsed: number;
  rpdRemaining: number;
  resetMinuteDate: Date;
  resetDayDate: Date;
  isDailyExhausted: boolean;
  isMinuteExhausted: boolean;
  estimatedWaitMs: number;
}

/**
 * Custom error thrown when daily Gemini free tier quota is depleted.
 */
export class GeminiQuotaExhaustedError extends Error {
  public readonly rpdLimit: number;
  public readonly rpdUsed: number;
  public readonly resetDate: Date;

  constructor(rpdUsed: number, rpdLimit: number, resetDate: Date) {
    const formattedReset = resetDate.toLocaleTimeString();
    super(
      `Gemini free-tier daily quota reached (${rpdUsed}/${rpdLimit} requests). Quota resets at ${formattedReset}. Please try again tomorrow or upgrade your API tier.`,
    );
    this.name = "GeminiQuotaExhaustedError";
    this.rpdLimit = rpdLimit;
    this.rpdUsed = rpdUsed;
    this.resetDate = resetDate;
  }
}

/**
 * Queries PostgreSQL GenerationLog to calculate current RPM and RPD consumption.
 */
export async function getGeminiQuotaUsage(userId?: string): Promise<GeminiQuotaStatus> {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60000);

  // Billable statuses (SKIPPED_CACHE does not consume Gemini tokens/requests)
  const billableFilter = {
    status: {
      in: ["SUCCESS", "FAILED"],
    },
    ...(userId ? { userId } : {}),
  };

  const [rpmUsed, rpdUsed] = await Promise.all([
    db.generationLog.count({
      where: {
        ...billableFilter,
        createdAt: { gte: oneMinuteAgo },
      },
    }),
    db.generationLog.count({
      where: {
        ...billableFilter,
        createdAt: { gte: oneDayAgo },
      },
    }),
  ]);

  const rpmRemaining = Math.max(0, GEMINI_RPM_LIMIT - rpmUsed);
  const rpdRemaining = Math.max(0, GEMINI_RPD_LIMIT - rpdUsed);
  const isDailyExhausted = rpdRemaining <= 0;
  const isMinuteExhausted = rpmRemaining <= 0;

  const resetMinuteDate = new Date(now.getTime() + 60000);
  const resetDayDate = new Date(now.getTime() + 24 * 60 * 60000);

  const estimatedWaitMs = isDailyExhausted
    ? resetDayDate.getTime() - now.getTime()
    : isMinuteExhausted
      ? 60000
      : 0;

  return {
    rpmLimit: GEMINI_RPM_LIMIT,
    rpmUsed,
    rpmRemaining,
    rpdLimit: GEMINI_RPD_LIMIT,
    rpdUsed,
    rpdRemaining,
    resetMinuteDate,
    resetDayDate,
    isDailyExhausted,
    isMinuteExhausted,
    estimatedWaitMs,
  };
}

/**
 * Sequential queue promise chain and timestamp tracker for rate-limit pacing.
 */
let lastCallTimestamp = 0;
let queuePromiseChain: Promise<unknown> = Promise.resolve();

export interface EnqueueOptions {
  userId?: string;
  maxRetries?: number;
  initialBackoffMs?: number;
}

/**
 * Asynchronous rate-limiting queue wrapper for Gemini API calls.
 * Ensures:
 * 1. Requests respect the minimum spacing interval (~4s for 15 RPM).
 * 2. Checks database daily quota before executing.
 * 3. Gracefully retries with exponential backoff on transient 429/RESOURCE_EXHAUSTED errors.
 */
export async function enqueueGeminiRequest<T>(
  task: () => Promise<T>,
  options: EnqueueOptions = {},
): Promise<T> {
  const { userId, maxRetries = 2, initialBackoffMs = 2000 } = options;

  // Chain tasks sequentially onto the queue
  const executePacedTask = async (): Promise<T> => {
    // 1. Check daily quota in database
    const quota = await getGeminiQuotaUsage(userId);
    if (quota.isDailyExhausted) {
      throw new GeminiQuotaExhaustedError(quota.rpdUsed, quota.rpdLimit, quota.resetDayDate);
    }

    // 2. Pace requests to prevent RPM spikes
    const now = Date.now();
    const elapsed = now - lastCallTimestamp;
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      const waitTime = MIN_REQUEST_INTERVAL_MS - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    lastCallTimestamp = Date.now();

    // 3. Execute with exponential backoff on 429 rate-limit responses
    let attempt = 0;
    let backoff = initialBackoffMs;

    while (attempt <= maxRetries) {
      try {
        return await task();
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message.toLowerCase() : "";
        const isRateLimit =
          errorMsg.includes("429") ||
          errorMsg.includes("resource_exhausted") ||
          errorMsg.includes("rate limit") ||
          errorMsg.includes("quota");

        if (!isRateLimit) {
          throw err;
        }

        attempt++;
        if (attempt > maxRetries) {
          throw new Error(
            `Gemini API rate limit exceeded after ${maxRetries} retries. Please wait 60 seconds and try again.`,
          );
        }

        // Wait with jittered exponential backoff
        const jitter = Math.floor(Math.random() * 500);
        await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
        backoff *= 2;
        lastCallTimestamp = Date.now();
      }
    }

    throw new Error("Gemini request queue processing failed.");
  };

  // Append task to the promise chain and capture result
  const taskPromise = queuePromiseChain.then(
    () => executePacedTask(),
    () => executePacedTask(),
  );

  // Update chain to continue even if this specific task throws
  queuePromiseChain = taskPromise.catch(() => {});

  return taskPromise;
}
