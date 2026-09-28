import { db } from "@/lib/db";
import { generateCaseStudyForRepo } from "./generate";
import type {
  BatchGenerateOptions,
  BatchGenerationProgress,
  BatchGenerationSummary,
  BatchItemResult,
} from "@/types/ai";

/**
 * Executes case study generation for multiple repositories strictly in sequence.
 *
 * Sequential execution ensures:
 * 1. Safe traversal that honors the Gemini free-tier rate limits (15 RPM / 1500 RPD).
 * 2. Predictable pacing via the rate-limiting queue.
 * 3. Granular progress tracking per repository.
 * 4. Resilient handling where failures or rate-limit warnings on one repo do not crash the batch.
 */
export async function generateBatchCaseStudies(
  options: BatchGenerateOptions,
): Promise<BatchGenerationSummary> {
  const { repoIds, userId, forceRegenerate = false, stopOnRateLimit = false, onProgress } = options;

  const batchStartTime = Date.now();

  if (!repoIds || repoIds.length === 0) {
    return {
      total: 0,
      succeeded: 0,
      skipped: 0,
      failed: 0,
      rateLimited: 0,
      totalDurationMs: 0,
      totalTokensUsed: 0,
      results: [],
    };
  }

  // 1. Fetch repositories requested in batch
  const fetchedRepos = await db.repo.findMany({
    where: {
      id: { in: repoIds },
      ...(userId ? { userId } : {}),
    },
    select: {
      id: true,
      name: true,
      userId: true,
    },
  });

  const repoMap = new Map(fetchedRepos.map((r) => [r.id, r]));

  // Preserve the exact order requested by the caller
  const orderedRepos = repoIds.map((id) => {
    const found = repoMap.get(id);
    return {
      id,
      name: found?.name ?? `Repository (${id.slice(0, 8)})`,
      exists: Boolean(found),
    };
  });

  const total = orderedRepos.length;
  let succeeded = 0;
  let skipped = 0;
  let failed = 0;
  let rateLimited = 0;
  let totalTokensUsed = 0;
  const results: BatchItemResult[] = [];

  // Helper to emit progress updates safely
  const notifyProgress = async (
    currentIdx: number,
    currentRepoName: string,
    batchStatus: "running" | "completed" | "aborted",
    latestResult?: BatchItemResult,
  ) => {
    if (!onProgress) return;

    const progress: BatchGenerationProgress = {
      total,
      current: currentIdx,
      completed: succeeded,
      skipped,
      failed,
      rateLimited,
      currentRepoName,
      percentage:
        total > 0 ? Math.round(((succeeded + skipped + failed + rateLimited) / total) * 100) : 0,
      status: batchStatus,
    };

    try {
      await onProgress(progress, latestResult);
    } catch (err: unknown) {
      console.error("[Batch Generation] Error in onProgress callback:", err);
    }
  };

  // 2. Sequential processing loop
  for (let i = 0; i < orderedRepos.length; i++) {
    const item = orderedRepos[i];
    if (!item) continue;

    // Check if the repo exists / is authorized
    if (!item.exists) {
      failed++;
      const missingResult: BatchItemResult = {
        repoId: item.id,
        repoName: item.name,
        status: "FAILED",
        error: `Repository with ID "${item.id}" not found or unauthorized.`,
        durationMs: 0,
        tokensUsed: 0,
      };
      results.push(missingResult);
      await notifyProgress(i + 1, item.name, "running", missingResult);
      continue;
    }

    // Notify that this repository is now generating
    await notifyProgress(i + 1, item.name, "running");

    const itemStartTime = Date.now();
    try {
      const response = await generateCaseStudyForRepo({
        repoId: item.id,
        userId,
        forceRegenerate,
      });

      const itemDurationMs = response.durationMs ?? Date.now() - itemStartTime;

      if (response.success) {
        if (response.cached) {
          skipped++;
        } else {
          succeeded++;
        }
        totalTokensUsed += response.tokensUsed;

        const successResult: BatchItemResult = {
          repoId: item.id,
          repoName: item.name,
          status: response.cached ? "SKIPPED_CACHE" : "SUCCESS",
          caseStudy: response.caseStudy,
          cached: response.cached,
          durationMs: itemDurationMs,
          tokensUsed: response.tokensUsed,
        };

        results.push(successResult);
        await notifyProgress(i + 1, item.name, "running", successResult);
      } else {
        const isRateLimit = response.status === "RATE_LIMITED";
        if (isRateLimit) {
          rateLimited++;
        } else {
          failed++;
        }

        const failResult: BatchItemResult = {
          repoId: item.id,
          repoName: item.name,
          status: isRateLimit ? "RATE_LIMITED" : "FAILED",
          error: response.error,
          durationMs: itemDurationMs,
          tokensUsed: 0,
        };

        results.push(failResult);
        await notifyProgress(i + 1, item.name, "running", failResult);

        // Abort remaining queue if configured
        if (isRateLimit && stopOnRateLimit) {
          // Mark remaining repos as unattempted due to rate limit abort
          for (let j = i + 1; j < orderedRepos.length; j++) {
            const remaining = orderedRepos[j];
            if (!remaining) continue;
            rateLimited++;
            const abortResult: BatchItemResult = {
              repoId: remaining.id,
              repoName: remaining.name,
              status: "RATE_LIMITED",
              error: "Batch aborted: Gemini rate limit reached on previous repository.",
              durationMs: 0,
              tokensUsed: 0,
            };
            results.push(abortResult);
          }

          await notifyProgress(orderedRepos.length, item.name, "aborted");
          break;
        }
      }
    } catch (error: unknown) {
      failed++;
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error during generation.";
      const errorResult: BatchItemResult = {
        repoId: item.id,
        repoName: item.name,
        status: "FAILED",
        error: errorMessage,
        durationMs: Date.now() - itemStartTime,
        tokensUsed: 0,
      };
      results.push(errorResult);
      await notifyProgress(i + 1, item.name, "running", errorResult);
    }
  }

  const finalStatus =
    rateLimited > 0 && stopOnRateLimit && results.length < total ? "aborted" : "completed";

  await notifyProgress(total, orderedRepos[orderedRepos.length - 1]?.name ?? "", finalStatus);

  return {
    total,
    succeeded,
    skipped,
    failed,
    rateLimited,
    totalDurationMs: Date.now() - batchStartTime,
    totalTokensUsed,
    results,
  };
}
