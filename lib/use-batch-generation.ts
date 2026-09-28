"use client";

import { useState, useRef, useCallback } from "react";
import { generateCaseStudyAction } from "@/actions/generate";
import type {
  BatchGenerationProgress,
  BatchGenerationSummary,
  BatchItemResult,
  BatchItemStatus,
} from "@/types/ai";

export interface BatchRepoTarget {
  id: string;
  name: string;
}

export interface UseBatchGenerationOptions {
  forceRegenerate?: boolean;
  stopOnRateLimit?: boolean;
  onItemComplete?: (result: BatchItemResult) => void;
  onBatchComplete?: (summary: BatchGenerationSummary) => void;
}

export interface UseBatchGenerationReturn {
  isGenerating: boolean;
  isAborted: boolean;
  isCompleted: boolean;
  progress: BatchGenerationProgress;
  summary: BatchGenerationSummary | null;
  itemStatuses: Record<string, BatchItemStatus>;
  itemResults: Record<string, BatchItemResult>;
  startBatch: (
    repos: BatchRepoTarget[],
    options?: UseBatchGenerationOptions,
  ) => Promise<BatchGenerationSummary>;
  abortBatch: () => void;
  resetBatch: () => void;
}

const INITIAL_PROGRESS: BatchGenerationProgress = {
  total: 0,
  current: 0,
  completed: 0,
  skipped: 0,
  failed: 0,
  rateLimited: 0,
  percentage: 0,
  status: "idle",
};

/**
 * Custom React hook for driving batch case study generation on the client.
 *
 * Runs sequentially across selected repositories to honor Gemini free-tier
 * rate limits while streaming real-time progress, live per-repo statuses,
 * and abort capabilities directly to the UI.
 */
export function useBatchGeneration(): UseBatchGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState<BatchGenerationProgress>(INITIAL_PROGRESS);
  const [summary, setSummary] = useState<BatchGenerationSummary | null>(null);
  const [itemStatuses, setItemStatuses] = useState<Record<string, BatchItemStatus>>({});
  const [itemResults, setItemResults] = useState<Record<string, BatchItemResult>>({});

  const abortControllerRef = useRef<boolean>(false);

  const abortBatch = useCallback(() => {
    if (isGenerating) {
      abortControllerRef.current = true;
      setIsAborted(true);
      setProgress((prev) => ({ ...prev, status: "aborted" }));
    }
  }, [isGenerating]);

  const resetBatch = useCallback(() => {
    setIsGenerating(false);
    setIsAborted(false);
    setIsCompleted(false);
    setProgress(INITIAL_PROGRESS);
    setSummary(null);
    setItemStatuses({});
    setItemResults({});
    abortControllerRef.current = false;
  }, []);

  const startBatch = useCallback(
    async (
      repos: BatchRepoTarget[],
      options?: UseBatchGenerationOptions,
    ): Promise<BatchGenerationSummary> => {
      const {
        forceRegenerate = false,
        stopOnRateLimit = true,
        onItemComplete,
        onBatchComplete,
      } = options ?? {};

      abortControllerRef.current = false;
      setIsGenerating(true);
      setIsAborted(false);
      setIsCompleted(false);
      setSummary(null);

      const total = repos.length;
      const initialStatuses: Record<string, BatchItemStatus> = {};
      repos.forEach((repo) => {
        initialStatuses[repo.id] = "PENDING";
      });
      setItemStatuses(initialStatuses);
      setItemResults({});

      setProgress({
        total,
        current: 0,
        completed: 0,
        skipped: 0,
        failed: 0,
        rateLimited: 0,
        percentage: 0,
        status: "running",
      });

      const batchStartTime = Date.now();
      let completedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;
      let rateLimitedCount = 0;
      let totalTokens = 0;
      const results: BatchItemResult[] = [];

      for (let i = 0; i < repos.length; i++) {
        // Check for manual abort
        if (abortControllerRef.current) {
          setIsAborted(true);
          setProgress((prev) => ({
            ...prev,
            status: "aborted",
          }));
          break;
        }

        const repo = repos[i]!;
        const currentIdx = i + 1;

        // Mark current item as GENERATING
        setItemStatuses((prev) => ({ ...prev, [repo.id]: "GENERATING" }));
        setProgress((prev) => ({
          ...prev,
          current: currentIdx,
          currentRepoName: repo.name,
        }));

        const itemStartTime = Date.now();
        try {
          const res = await generateCaseStudyAction({
            repoId: repo.id,
            forceRegenerate,
          });

          const itemDuration = res.durationMs ?? Date.now() - itemStartTime;

          if (res.success) {
            const isCached = Boolean(res.cached);
            if (isCached) {
              skippedCount++;
            } else {
              completedCount++;
            }
            totalTokens += res.tokensUsed;

            const itemResult: BatchItemResult = {
              repoId: repo.id,
              repoName: repo.name,
              status: isCached ? "SKIPPED_CACHE" : "SUCCESS",
              caseStudy: res.caseStudy,
              cached: isCached,
              durationMs: itemDuration,
              tokensUsed: res.tokensUsed,
            };

            results.push(itemResult);
            setItemStatuses((prev) => ({
              ...prev,
              [repo.id]: isCached ? "SKIPPED_CACHE" : "SUCCESS",
            }));
            setItemResults((prev) => ({ ...prev, [repo.id]: itemResult }));

            onItemComplete?.(itemResult);
          } else {
            const isRateLimit = res.status === "RATE_LIMITED";
            if (isRateLimit) {
              rateLimitedCount++;
            } else {
              failedCount++;
            }

            const itemResult: BatchItemResult = {
              repoId: repo.id,
              repoName: repo.name,
              status: isRateLimit ? "RATE_LIMITED" : "FAILED",
              error: res.error,
              durationMs: itemDuration,
              tokensUsed: 0,
            };

            results.push(itemResult);
            setItemStatuses((prev) => ({
              ...prev,
              [repo.id]: isRateLimit ? "RATE_LIMITED" : "FAILED",
            }));
            setItemResults((prev) => ({ ...prev, [repo.id]: itemResult }));

            onItemComplete?.(itemResult);

            if (isRateLimit && stopOnRateLimit) {
              // Rate limit encountered and stopOnRateLimit requested
              setIsAborted(true);
              // Mark remaining items as RATE_LIMITED
              for (let j = i + 1; j < repos.length; j++) {
                const rem = repos[j]!;
                rateLimitedCount++;
                const abortedResult: BatchItemResult = {
                  repoId: rem.id,
                  repoName: rem.name,
                  status: "RATE_LIMITED",
                  error: "Batch halted: Gemini free-tier rate limit reached on previous repo.",
                  durationMs: 0,
                  tokensUsed: 0,
                };
                results.push(abortedResult);
                setItemStatuses((prev) => ({ ...prev, [rem.id]: "RATE_LIMITED" }));
                setItemResults((prev) => ({ ...prev, [rem.id]: abortedResult }));
              }
              break;
            }
          }
        } catch (error: unknown) {
          failedCount++;
          const errorMessage =
            error instanceof Error ? error.message : "Unexpected error during generation.";
          const itemResult: BatchItemResult = {
            repoId: repo.id,
            repoName: repo.name,
            status: "FAILED",
            error: errorMessage,
            durationMs: Date.now() - itemStartTime,
            tokensUsed: 0,
          };
          results.push(itemResult);
          setItemStatuses((prev) => ({ ...prev, [repo.id]: "FAILED" }));
          setItemResults((prev) => ({ ...prev, [repo.id]: itemResult }));
          onItemComplete?.(itemResult);
        }

        // Update overall progress state after each repo finishes
        const processedSoFar = completedCount + skippedCount + failedCount + rateLimitedCount;
        setProgress((prev) => ({
          ...prev,
          completed: completedCount,
          skipped: skippedCount,
          failed: failedCount,
          rateLimited: rateLimitedCount,
          percentage: total > 0 ? Math.round((processedSoFar / total) * 100) : 0,
        }));
      }

      const finalSummary: BatchGenerationSummary = {
        total,
        succeeded: completedCount,
        skipped: skippedCount,
        failed: failedCount,
        rateLimited: rateLimitedCount,
        totalDurationMs: Date.now() - batchStartTime,
        totalTokensUsed: totalTokens,
        results,
      };

      setSummary(finalSummary);
      setIsGenerating(false);
      setIsCompleted(true);
      setProgress((prev) => ({
        ...prev,
        percentage: 100,
        status: abortControllerRef.current ? "aborted" : "completed",
      }));

      onBatchComplete?.(finalSummary);
      return finalSummary;
    },
    [],
  );

  return {
    isGenerating,
    isAborted,
    isCompleted,
    progress,
    summary,
    itemStatuses,
    itemResults,
    startBatch,
    abortBatch,
    resetBatch,
  };
}
