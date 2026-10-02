"use client";

import * as React from "react";
import { RefreshCw, Zap, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getGeminiQuotaStatusAction } from "@/actions/generate";
import type { GeminiQuotaStatusSerialized } from "@/types/ai";

export interface QuotaDisplayProps {
  initialQuota?: GeminiQuotaStatusSerialized | null;
  compact?: boolean;
  onQuotaUpdate?: (quota: GeminiQuotaStatusSerialized) => void;
  className?: string;
}

const DEFAULT_DEMO_QUOTA: GeminiQuotaStatusSerialized = {
  rpmLimit: 15,
  rpmUsed: 0,
  rpmRemaining: 15,
  rpdLimit: 1500,
  rpdUsed: 0,
  rpdRemaining: 1500,
  resetMinuteDate: new Date(Date.now() + 60000).toISOString(),
  resetDayDate: new Date(new Date().setUTCHours(24, 0, 0, 0)).toISOString(),
  isDailyExhausted: false,
  isMinuteExhausted: false,
  estimatedWaitMs: 0,
};

export function QuotaDisplay({
  initialQuota,
  compact = false,
  onQuotaUpdate,
  className = "",
}: QuotaDisplayProps) {
  const [quota, setQuota] = React.useState<GeminiQuotaStatusSerialized>(
    initialQuota ?? DEFAULT_DEMO_QUOTA,
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Sync with prop updates if initialQuota changes
  const [prevInitialQuota, setPrevInitialQuota] = React.useState(initialQuota);
  if (initialQuota !== prevInitialQuota) {
    setPrevInitialQuota(initialQuota);
    if (initialQuota) {
      setQuota(initialQuota);
    }
  }

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getGeminiQuotaStatusAction();
      if (res.success) {
        setQuota(res.quota);
        onQuotaUpdate?.(res.quota);
      }
    } catch {
      // Keep existing quota state on network glitch
    } finally {
      setIsRefreshing(false);
    }
  }, [onQuotaUpdate]);

  // Derived metrics
  const rpdPercent = Math.min(
    100,
    Math.round(((quota.rpdUsed || 0) / (quota.rpdLimit || 1500)) * 100),
  );
  const rpmPercent = Math.min(
    100,
    Math.round(((quota.rpmUsed || 0) / (quota.rpmLimit || 15)) * 100),
  );

  // Determine status color
  const statusVariant = quota.isDailyExhausted
    ? "destructive"
    : rpdPercent >= 80
      ? "warning"
      : "cyan";

  // Calculate hours until daily reset
  const resetTimeRemaining = React.useMemo(() => {
    try {
      const reset = new Date(quota.resetDayDate);
      const now = new Date();
      const diffMs = reset.getTime() - now.getTime();
      if (diffMs <= 0) return "in < 1m";
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `in ${hours}h ${mins}m`;
    } catch {
      return "at 00:00 UTC";
    }
  }, [quota.resetDayDate]);

  if (compact) {
    return (
      <div
        className={`hairline-all bg-paper-sheet dark:bg-obsidian-panel px-3 py-2 flex items-center gap-3 ${className}`}
        role="status"
        aria-label="Gemini Quota Status"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan shrink-0" />
          <div className="font-mono text-mono-xs">
            <span className="text-ink-muted dark:text-bone-muted uppercase mr-1.5">Quota:</span>
            <span className="font-semibold text-ink-primary dark:text-bone">
              {quota.rpdUsed} / {quota.rpdLimit.toLocaleString()}
            </span>
            <span className="text-ink-muted dark:text-bone-muted text-[10px] ml-1">today</span>
          </div>
        </div>

        {/* Mini Segmented Bar */}
        <div className="w-16 h-1.5 bg-paper-rule dark:bg-obsidian-border rounded-none overflow-hidden hidden sm:block">
          <div
            className={`h-full transition-all duration-300 ${
              quota.isDailyExhausted
                ? "bg-rose-500"
                : rpdPercent > 80
                  ? "bg-amber-500"
                  : "bg-terracotta dark:bg-telemetry-cyan"
            }`}
            style={{ width: `${Math.max(4, rpdPercent)}%` }}
          />
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh Quota Telemetry"
          className="p-1 text-ink-muted hover:text-ink-primary dark:hover:text-bone transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-5 space-y-4 ${className}`}
      role="region"
      aria-label="AI Generation Quota Telemetry"
    >
      {/* Top Header Strip */}
      <div className="flex items-center justify-between gap-3 hairline-b pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />§ 02.2 AI ENGINE TELEMETRY // GEMINI-1.5-FLASH
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusVariant} size="sm" dot>
            {quota.isDailyExhausted
              ? "DAILY LIMIT REACHED"
              : rpdPercent >= 80
                ? "HIGH USAGE"
                : "OPTIMAL PACING"}
          </Badge>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh Quota Telemetry"
            className="p-1 hairline-all text-ink-muted hover:text-ink-primary dark:hover:text-bone bg-paper-sheet dark:bg-obsidian-panel transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Quota Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Quota Counter */}
        <div className="p-3.5 hairline-all bg-paper-sheet/50 dark:bg-obsidian-panel/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted uppercase tracking-wider">
              Daily Generations
            </span>
            <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted">
              {rpdPercent}% consumed
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-heading-md font-bold text-ink-primary dark:text-bone">
              {quota.rpdUsed}
            </span>
            <span className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted">
              / {quota.rpdLimit.toLocaleString()} used today
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-paper-rule dark:bg-obsidian-border rounded-none overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                quota.isDailyExhausted
                  ? "bg-rose-500"
                  : rpdPercent > 80
                    ? "bg-amber-500"
                    : "bg-terracotta dark:bg-telemetry-cyan"
              }`}
              style={{ width: `${Math.max(2, rpdPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted dark:text-bone-muted pt-0.5">
            <span>{quota.rpdRemaining.toLocaleString()} remaining</span>
            <span>Resets {resetTimeRemaining}</span>
          </div>
        </div>

        {/* Rate Pacer (RPM) */}
        <div className="p-3.5 hairline-all bg-paper-sheet/50 dark:bg-obsidian-panel/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted uppercase tracking-wider">
              Rate Pacer (RPM)
            </span>
            <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted">
              {quota.rpmLimit} req/min cap
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-heading-md font-bold text-ink-primary dark:text-bone">
              {quota.rpmUsed}
            </span>
            <span className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted">
              / {quota.rpmLimit} active
            </span>
          </div>

          {/* Minute Bar */}
          <div className="w-full h-1.5 bg-paper-rule dark:bg-obsidian-border rounded-none overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                quota.isMinuteExhausted
                  ? "bg-amber-500"
                  : "bg-emerald-500 dark:bg-telemetry-emerald"
              }`}
              style={{ width: `${Math.max(2, rpmPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted dark:text-bone-muted pt-0.5">
            <span>{quota.rpmRemaining} slots available</span>
            <span>Auto-metered queue</span>
          </div>
        </div>

        {/* Audit & Resilience Status */}
        <div className="p-3.5 hairline-all bg-paper-sheet/50 dark:bg-obsidian-panel/50 flex flex-col justify-between space-y-2">
          <div>
            <span className="block font-mono text-[10px] text-ink-muted dark:text-bone-muted uppercase tracking-wider">
              Telemetry Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              {quota.isDailyExhausted ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-mono text-mono-xs text-rose-600 dark:text-rose-400 font-semibold">
                    Daily Free Tier Depleted
                  </span>
                </>
              ) : quota.isMinuteExhausted ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-mono text-mono-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Pacing Delay Active (~4s)
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-telemetry-emerald shrink-0" />
                  <span className="font-mono text-mono-xs text-ink-primary dark:text-bone font-medium">
                    Queue Ready for Generation
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="font-sans text-[11px] text-ink-muted dark:text-bone-muted leading-relaxed">
            Case studies are cached indefinitely. Re-generating unchanged repos checks cache before
            invoking Gemini.
          </p>
        </div>
      </div>
    </div>
  );
}
