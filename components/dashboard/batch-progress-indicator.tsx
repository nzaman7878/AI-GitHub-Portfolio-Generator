"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  Zap,
  SquareSlash,
  RotateCcw,
} from "lucide-react";
import type {
  BatchGenerationProgress,
  BatchGenerationSummary,
  BatchItemResult,
  BatchItemStatus,
} from "@/types/ai";

export interface BatchRepoItem {
  id: string;
  name: string;
}

export interface BatchProgressIndicatorProps {
  repos: BatchRepoItem[];
  progress: BatchGenerationProgress;
  summary: BatchGenerationSummary | null;
  itemStatuses: Record<string, BatchItemStatus>;
  itemResults: Record<string, BatchItemResult>;
  isGenerating: boolean;
  onAbort?: () => void;
  onReset?: () => void;
  onClose?: () => void;
}

/**
 * Visual progress indicator for batch case study generation operations.
 * Displays real-time progress percentages, per-repo status pills, rate-limit warnings,
 * and completion telemetry.
 */
export function BatchProgressIndicator({
  repos,
  progress,
  summary,
  itemStatuses,
  itemResults,
  isGenerating,
  onAbort,
  onReset,
  onClose,
}: BatchProgressIndicatorProps) {
  const percentage = progress.percentage;
  const isFinished = progress.status === "completed" || progress.status === "aborted";

  // Calculate live counts
  const counts = useMemo(() => {
    return {
      total: repos.length,
      succeeded: progress.completed,
      cached: progress.skipped,
      rateLimited: progress.rateLimited,
      failed: progress.failed,
    };
  }, [repos.length, progress]);

  return (
    <div
      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-6"
      role="region"
      aria-label="Batch Generation Progress"
    >
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 tracking-tight">
              Batch Case Study Generation
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isGenerating
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                  : progress.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : progress.status === "aborted"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {isGenerating && <Loader2 className="w-3 h-3 animate-spin" />}
              {isGenerating
                ? "Running Batch"
                : progress.status === "completed"
                  ? "Completed"
                  : progress.status === "aborted"
                    ? "Aborted"
                    : "Idle"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {isGenerating
              ? `Processing ${progress.currentRepoName ? `"${progress.currentRepoName}"` : "repositories"} sequentially with Gemini rate-limiting queue.`
              : isFinished
                ? `Finished processing ${repos.length} repositories in ${((summary?.totalDurationMs ?? 0) / 1000).toFixed(1)}s.`
                : "Sequential AI generation queue ready."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isGenerating && onAbort && (
            <button
              type="button"
              onClick={onAbort}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
            >
              <SquareSlash className="w-3.5 h-3.5" />
              Stop Batch
            </button>
          )}

          {isFinished && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          {isFinished && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Percent Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <span>
            Progress:{" "}
            {progress.completed + progress.skipped + progress.failed + progress.rateLimited} /{" "}
            {counts.total} repos
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              progress.status === "aborted"
                ? "bg-amber-500"
                : progress.failed > 0 && progress.status === "completed"
                  ? "bg-indigo-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Metric Breakdown Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            Total Repos
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {counts.total}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Generated
          </div>
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {counts.succeeded}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
          <div className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
            Fresh (Cached)
          </div>
          <div className="text-lg font-bold text-sky-700 dark:text-sky-400 mt-0.5">
            {counts.cached}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Rate-Limited
          </div>
          <div className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-0.5">
            {counts.rateLimited}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
          <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Failed</div>
          <div className="text-lg font-bold text-rose-700 dark:text-rose-400 mt-0.5">
            {counts.failed}
          </div>
        </div>
      </div>

      {/* Sequential Repositories Status List */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Batch Items Queue
        </h4>

        <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {repos.map((repo, idx) => {
            const status: BatchItemStatus = itemStatuses[repo.id] ?? "PENDING";
            const result = itemResults[repo.id];

            return (
              <div
                key={repo.id}
                className={`flex items-center justify-between px-4 py-3 text-xs transition-colors ${
                  status === "GENERATING"
                    ? "bg-indigo-50/50 dark:bg-indigo-950/30 font-medium"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px] w-5 text-right">
                    {idx + 1}.
                  </span>
                  <div className="truncate">
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate block">
                      {repo.name}
                    </span>
                    {result?.error && (
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 truncate block mt-0.5">
                        {result.error}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {result?.durationMs !== undefined && result.durationMs > 0 && (
                    <span className="text-zinc-400 dark:text-zinc-500 text-[11px] font-mono">
                      {(result.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}

                  {/* Status Badge */}
                  <ItemStatusBadge status={status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ItemStatusBadge({ status }: { status: BatchItemStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    case "GENERATING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          Generating...
        </span>
      );
    case "SUCCESS":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" />
          Generated
        </span>
      );
    case "SKIPPED_CACHE":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800">
          <Zap className="w-3 h-3" />
          Fresh (Cached)
        </span>
      );
    case "RATE_LIMITED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3 h-3" />
          Rate Limited
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
  }
}
