"use client";

import * as React from "react";
import { X, Loader2, SquareSlash, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateCaseStudyAction } from "@/actions/generate";
import type { RepoWithStatus } from "@/types/github";
import type { BatchItemStatus } from "@/types/ai";

export interface BatchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRepos: RepoWithStatus[];
  onRepoStatusUpdate?: (repoId: string, hasCaseStudy: boolean) => void;
  onBatchComplete?: () => void;
  onQuotaRefresh?: () => void;
}

interface ItemQueueState {
  repo: RepoWithStatus;
  status: BatchItemStatus;
  error?: string;
  durationMs?: number;
}

export function BatchGeneratorModal({
  isOpen,
  onClose,
  selectedRepos,
  onRepoStatusUpdate,
  onBatchComplete,
  onQuotaRefresh,
}: BatchGeneratorModalProps) {
  // Configuration options
  const [forceRegenerate, setForceRegenerate] = React.useState(false);

  // Execution states
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isAborted, setIsAborted] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<number>(-1);

  // Queue state tracking
  const [queue, setQueue] = React.useState<ItemQueueState[]>(() =>
    selectedRepos.map((repo) => ({
      repo,
      status: "PENDING",
    })),
  );

  // Abort ref to break execution loop immediately
  const abortControllerRef = React.useRef(false);

  // Filter repos based on configuration: if not forceRegenerate, we can optionally note which are skipped
  const missingCount = React.useMemo(() => {
    return selectedRepos.filter((r) => !r.hasCaseStudy).length;
  }, [selectedRepos]);

  // Synchronize queue when modal opens
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQueue(
        selectedRepos.map((repo) => ({
          repo,
          status: "PENDING",
        })),
      );
      setIsGenerating(false);
      setIsAborted(false);
      setIsFinished(false);
      setCurrentIndex(-1);
    }
  }

  // Derived counts
  const totalItems = queue.length;
  const completedCount = queue.filter(
    (q) => q.status === "SUCCESS" || q.status === "SKIPPED_CACHE",
  ).length;
  const failedCount = queue.filter((q) => q.status === "FAILED").length;
  const processedCount = queue.filter(
    (q) => q.status !== "PENDING" && q.status !== "GENERATING",
  ).length;
  const progressPercent = totalItems > 0 ? Math.round((processedCount / totalItems) * 100) : 0;

  // Run sequential generation
  const handleStartBatch = async () => {
    if (selectedRepos.length === 0 || isGenerating) return;

    setIsGenerating(true);
    setIsAborted(false);
    setIsFinished(false);
    abortControllerRef.current = false;

    // Reset all items to pending
    setQueue(
      selectedRepos.map((repo) => ({
        repo,
        status: "PENDING",
      })),
    );

    for (let i = 0; i < selectedRepos.length; i++) {
      if (abortControllerRef.current) {
        setIsAborted(true);
        break;
      }

      const currentRepo = selectedRepos[i];
      if (!currentRepo) continue;
      setCurrentIndex(i);

      // Update current item to GENERATING
      setQueue((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: "GENERATING" } : item)),
      );

      const startTime = Date.now();

      // Check if skipping existing case study
      if (!forceRegenerate && currentRepo.hasCaseStudy) {
        // Mark as SKIPPED_CACHE
        const duration = Date.now() - startTime;
        setQueue((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "SKIPPED_CACHE", durationMs: duration } : item,
          ),
        );
        continue;
      }

      try {
        if (currentRepo.id.startsWith("demo-")) {
          // Simulated demo generation with realistic latency
          await new Promise((r) => setTimeout(r, 900));

          if (abortControllerRef.current) {
            setIsAborted(true);
            break;
          }

          const duration = Date.now() - startTime;
          setQueue((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: "SUCCESS", durationMs: duration } : item,
            ),
          );
          onRepoStatusUpdate?.(currentRepo.id, true);
        } else {
          // Real server action execution
          const res = await generateCaseStudyAction({
            repoId: currentRepo.id,
            forceRegenerate,
          });

          if (abortControllerRef.current) {
            setIsAborted(true);
            break;
          }

          const duration = Date.now() - startTime;

          if (res.success) {
            setQueue((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? {
                      ...item,
                      status: res.cached ? "SKIPPED_CACHE" : "SUCCESS",
                      durationMs: duration,
                    }
                  : item,
              ),
            );
            onRepoStatusUpdate?.(currentRepo.id, true);
          } else {
            setQueue((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? {
                      ...item,
                      status: res.status === "RATE_LIMITED" ? "RATE_LIMITED" : "FAILED",
                      error: res.error || "Generation failed",
                      durationMs: duration,
                    }
                  : item,
              ),
            );
          }
        }
      } catch (err: unknown) {
        const duration = Date.now() - startTime;
        const msg = err instanceof Error ? err.message : "Network error during generation";
        setQueue((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "FAILED", error: msg, durationMs: duration } : item,
          ),
        );
      }
    }

    setIsGenerating(false);
    setIsFinished(true);
    setCurrentIndex(-1);
    onBatchComplete?.();
    onQuotaRefresh?.();
  };

  const handleAbort = () => {
    abortControllerRef.current = true;
    setIsGenerating(false);
    setIsAborted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-modal-title"
    >
      <div className="w-full max-w-3xl bg-paper-canvas dark:bg-obsidian-card border border-hairline dark:border-obsidian-border shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="hairline-b px-6 py-4 bg-paper-sheet/70 dark:bg-obsidian-panel/70 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />§ BATCH CASE STUDY SYNTHESIS
              </span>
              <Badge variant={isGenerating ? "cyan" : isFinished ? "success" : "outline"} size="sm">
                {isGenerating
                  ? "QUEUE EXECUTING"
                  : isFinished
                    ? isAborted
                      ? "ABORTED"
                      : "COMPLETED"
                    : "STANDBY"}
              </Badge>
            </div>
            <h2
              id="batch-modal-title"
              className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone"
            >
              Batch Generate Engineering Dossiers
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 hairline-all text-ink-muted hover:text-ink-primary dark:hover:text-bone bg-paper-sheet dark:bg-obsidian-panel transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Configuration Options (only enabled before running) */}
          {!isGenerating && !isFinished && (
            <div className="p-4 hairline-all bg-paper-sheet/40 dark:bg-obsidian-panel/40 space-y-3">
              <span className="block font-mono text-[10px] text-ink-muted dark:text-bone-muted uppercase tracking-wider">
                Execution Policy
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forceRegenerate}
                      onChange={(e) => setForceRegenerate(e.target.checked)}
                      className="w-4 h-4 rounded-none border border-hairline dark:border-obsidian-border text-terracotta dark:text-telemetry-cyan focus:ring-0 focus:outline-none"
                    />
                    <span className="font-mono text-mono-xs font-medium text-ink-primary dark:text-bone">
                      Force Regenerate Existing Dossiers
                    </span>
                  </label>
                  <p className="font-sans text-[11px] text-ink-secondary dark:text-bone-secondary ml-6.5">
                    {forceRegenerate
                      ? "Will overwrite all existing case studies using fresh Gemini AI analysis."
                      : `Will only generate for ${missingCount} missing dossier(s). Existing ones will be preserved.`}
                  </p>
                </div>

                <div className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted text-right">
                  <span>Selected Repos: </span>
                  <span className="font-semibold text-ink-primary dark:text-bone font-mono">
                    {selectedRepos.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Telemetry */}
          {(isGenerating || isFinished) && (
            <div className="space-y-3 p-4 hairline-all bg-paper-sheet/50 dark:bg-obsidian-panel/50">
              <div className="flex items-center justify-between font-mono text-mono-xs">
                <span className="text-ink-secondary dark:text-bone-secondary">
                  Processed: {processedCount} / {totalItems} repositories
                </span>
                <span className="font-semibold text-ink-primary dark:text-bone">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-paper-rule dark:bg-obsidian-border rounded-none overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isAborted
                      ? "bg-amber-500"
                      : failedCount > 0
                        ? "bg-terracotta dark:bg-telemetry-cyan"
                        : "bg-emerald-500 dark:bg-telemetry-emerald"
                  }`}
                  style={{ width: `${Math.max(2, progressPercent)}%` }}
                />
              </div>

              {/* Counter pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-mono-xs">
                <div className="px-2 py-1 hairline-all bg-paper-canvas dark:bg-obsidian-card">
                  <span className="text-ink-muted dark:text-bone-muted text-[10px] block uppercase">
                    Success
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-telemetry-emerald">
                    {completedCount}
                  </span>
                </div>
                <div className="px-2 py-1 hairline-all bg-paper-canvas dark:bg-obsidian-card">
                  <span className="text-ink-muted dark:text-bone-muted text-[10px] block uppercase">
                    Failed
                  </span>
                  <span className="font-semibold text-rose-600 dark:text-telemetry-rose">
                    {failedCount}
                  </span>
                </div>
                <div className="px-2 py-1 hairline-all bg-paper-canvas dark:bg-obsidian-card">
                  <span className="text-ink-muted dark:text-bone-muted text-[10px] block uppercase">
                    Queue Position
                  </span>
                  <span className="font-semibold text-ink-primary dark:text-bone">
                    {currentIndex >= 0 ? `${currentIndex + 1} of ${totalItems}` : "Idle"}
                  </span>
                </div>
                <div className="px-2 py-1 hairline-all bg-paper-canvas dark:bg-obsidian-card">
                  <span className="text-ink-muted dark:text-bone-muted text-[10px] block uppercase">
                    Pacing Delay
                  </span>
                  <span className="font-semibold text-ink-primary dark:text-bone">
                    ~4.0s (15 RPM)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Sequential Queue Table */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted uppercase tracking-wider block">
              Sequential Repositories Queue ({queue.length})
            </span>

            <div className="border border-hairline dark:border-obsidian-border divide-y divide-hairline dark:divide-obsidian-border max-h-64 overflow-y-auto">
              {queue.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={item.repo.id}
                    className={`px-4 py-2.5 flex items-center justify-between gap-3 text-mono-xs transition-colors ${
                      isCurrent
                        ? "bg-terracotta/10 dark:bg-telemetry-cyan/10 font-medium"
                        : "hover:bg-paper-sheet/40 dark:hover:bg-obsidian-panel/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-[11px] text-ink-muted dark:text-bone-muted w-5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <div className="truncate">
                        <span className="font-mono text-ink-primary dark:text-bone truncate block">
                          {item.repo.name}
                        </span>
                        {item.error && (
                          <span className="font-mono text-[10px] text-rose-600 dark:text-telemetry-rose truncate block">
                            {item.error}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.durationMs !== undefined && (
                        <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                          {(item.durationMs / 1000).toFixed(1)}s
                        </span>
                      )}

                      {/* Status indicator badge */}
                      {item.status === "GENERATING" && (
                        <Badge variant="cyan" size="sm" dot>
                          <Loader2 className="w-2.5 h-2.5 animate-spin mr-1" />
                          SYNTHESIZING
                        </Badge>
                      )}
                      {item.status === "SUCCESS" && (
                        <Badge variant="success" size="sm" dot>
                          GENERATED
                        </Badge>
                      )}
                      {item.status === "SKIPPED_CACHE" && (
                        <Badge variant="outline" size="sm">
                          PRESERVED
                        </Badge>
                      )}
                      {item.status === "FAILED" && (
                        <Badge variant="destructive" size="sm" dot>
                          FAILED
                        </Badge>
                      )}
                      {item.status === "RATE_LIMITED" && (
                        <Badge variant="outline" size="sm">
                          RATE LIMITED
                        </Badge>
                      )}
                      {item.status === "PENDING" && (
                        <Badge variant="outline" size="sm">
                          PENDING
                        </Badge>
                      )}

                      {/* Link to view if already generated */}
                      {item.status === "SUCCESS" && (
                        <Link
                          href={`/dashboard/case-studies?repo=${item.repo.id}`}
                          target="_blank"
                          className="p-1 text-ink-muted hover:text-ink-primary dark:hover:text-bone"
                          title="View Case Study"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="hairline-t px-6 py-4 bg-paper-sheet/70 dark:bg-obsidian-panel/70 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-ink-muted dark:text-bone-muted">
            {isGenerating
              ? "Running sequential queue honoring Gemini API quotas..."
              : isFinished
                ? "Batch execution concluded."
                : `Ready to process ${selectedRepos.length} selected repositories.`}
          </div>

          <div className="flex items-center gap-3">
            {isGenerating ? (
              <Button variant="destructive" size="sm" onClick={handleAbort}>
                <SquareSlash className="w-3.5 h-3.5 mr-1.5" />
                Stop Batch
              </Button>
            ) : isFinished ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsFinished(false);
                    setQueue(selectedRepos.map((r) => ({ repo: r, status: "PENDING" })));
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset Queue
                </Button>
                <Button variant="primary" size="sm" onClick={onClose}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartBatch}
                  disabled={selectedRepos.length === 0}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Start Batch ({selectedRepos.length})
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
