"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle, X, ExternalLink } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { syncAndPersistUserRepositoriesAction } from "@/actions/repos";
import type { SyncOptions } from "@/lib/github";
import { cn } from "@/lib/utils";

export interface RepoSyncButtonProps {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  label?: string;
  loadingLabel?: string;
  showFeedbackBanner?: boolean;
  className?: string;
  syncOptions?: SyncOptions;
  onSyncSuccess?: (result: { totalSynced: number; durationMs?: number; syncedAt?: string }) => void;
  onSyncError?: (error: string) => void;
}

export interface SyncFeedbackState {
  type: "success" | "error";
  message: string;
  timestamp: string;
  durationMs?: number;
  rateLimited?: boolean;
  retryAfter?: number;
}

export function RepoSyncButton({
  variant = "outline",
  size = "md",
  label = "Sync Repos",
  loadingLabel = "Syncing...",
  showFeedbackBanner = true,
  className,
  syncOptions = { enrichTopN: 6, includeForks: false },
  onSyncSuccess,
  onSyncError,
}: RepoSyncButtonProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncPhase, setSyncPhase] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<SyncFeedbackState | null>(null);

  // Auto-dismiss success banner after 8 seconds
  React.useEffect(() => {
    if (feedback?.type === "success") {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [feedback]);

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setFeedback(null);
    setSyncPhase("Connecting to GitHub API...");

    // Simulated telemetry progress steps for high-touch visual feedback
    const timer1 = setTimeout(() => {
      setSyncPhase("Fetching repositories & commit telemetry...");
    }, 1200);

    const timer2 = setTimeout(() => {
      setSyncPhase("Persisting records to PostgreSQL...");
    }, 2800);

    try {
      const res = await syncAndPersistUserRepositoriesAction(syncOptions);

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.success) {
        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const feedbackState: SyncFeedbackState = {
          type: "success",
          message: `Synchronized ${res.totalSynced} repositories from GitHub`,
          timestamp,
          durationMs: res.durationMs,
        };

        setFeedback(feedbackState);
        onSyncSuccess?.({
          totalSynced: res.totalSynced,
          durationMs: res.durationMs,
          syncedAt: res.syncedAt,
        });

        // Trigger App Router refresh to update server-rendered components
        router.refresh();
      } else {
        const errorMsg = res.error || "Failed to synchronize repositories from GitHub.";
        setFeedback({
          type: "error",
          message: errorMsg,
          timestamp: new Date().toLocaleTimeString(),
          rateLimited: res.rateLimited,
          retryAfter: res.retryAfter,
        });
        onSyncError?.(errorMsg);
      }
    } catch (err: unknown) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during repository synchronization.";
      setFeedback({
        type: "error",
        message: errorMsg,
        timestamp: new Date().toLocaleTimeString(),
      });
      onSyncError?.(errorMsg);
    } finally {
      setIsSyncing(false);
      setSyncPhase(null);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-start gap-2">
      {/* Sync Button */}
      <Button
        variant={variant}
        size={size}
        onClick={handleSync}
        disabled={isSyncing}
        className={cn("gap-2 select-none", className)}
        leftIcon={
          <RefreshCw
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              isSyncing && "animate-spin text-terracotta dark:text-telemetry-cyan",
            )}
          />
        }
        title="Trigger one-click GitHub data synchronization"
      >
        <span>{isSyncing ? loadingLabel : label}</span>
      </Button>

      {/* Real-time Telemetry Phase Subtext (Visible only during active sync) */}
      {isSyncing && syncPhase && (
        <span className="font-mono text-[10px] text-terracotta dark:text-telemetry-cyan tracking-wider uppercase animate-pulse flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-telemetry-cyan animate-ping" />
          {syncPhase}
        </span>
      )}

      {/* Floating / Embedded Feedback Banner */}
      {showFeedbackBanner && feedback && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "w-full max-w-md p-3 border font-mono text-mono-xs flex items-start justify-between gap-3 shadow-planar dark:shadow-planar-dark transition-all",
            feedback.type === "success"
              ? "bg-paper-sheet dark:bg-obsidian-card border-emerald-400 dark:border-telemetry-emerald/40 text-emerald-900 dark:text-telemetry-emerald"
              : "bg-paper-sheet dark:bg-obsidian-card border-rose-400 dark:border-telemetry-rose/40 text-rose-900 dark:text-telemetry-rose",
          )}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-telemetry-emerald" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-telemetry-rose" />
            )}
            <div className="space-y-0.5">
              <p className="font-semibold tracking-wide">{feedback.message}</p>
              <div className="flex items-center gap-3 text-[10px] opacity-75">
                <span>Timestamp: {feedback.timestamp}</span>
                {feedback.durationMs !== undefined && <span>{feedback.durationMs}ms</span>}
                {feedback.rateLimited && (
                  <span className="font-bold underline">
                    Rate limited. Retry in {feedback.retryAfter}s
                  </span>
                )}
              </div>
              {feedback.type === "error" && feedback.message.includes("sign in") && (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-1 mt-1 text-[11px] underline hover:opacity-80"
                >
                  Go to Sign In <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
            aria-label="Dismiss sync status message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
