"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, BookOpen, AlertOctagon, Terminal } from "lucide-react";
import { TelemetryDot } from "@/components/ui/motion";

export default function CaseStudiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[CaseStudiesError] Case study catalog fault:", error);
  }, [error]);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto my-auto flex flex-col justify-center min-h-[50vh] space-y-6">
      <div className="border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel p-6 sm:p-10 relative shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-signal-danger uppercase tracking-widest">
            <AlertOctagon className="w-4 h-4" />
            <span>§ CASE STUDY FAULT // COMPILATION EXCEPTION</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-signal-danger">
            <TelemetryDot status="rose" pulse size="sm" />
            <span>ERR_CASE_STUDIES_HALTED</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif font-light text-2xl sm:text-3xl text-ink-primary dark:text-bone leading-tight">
            Case Studies Query Exception
          </h2>
          <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
            An unexpected error occurred while loading your AI case studies collection. You can
            re-query the database or return to your repositories.
          </p>
        </div>

        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-ink-muted dark:text-bone-muted text-[11px]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-signal-danger" />
              <span>FAULT_DIAGNOSTIC</span>
            </span>
            <span>
              {error.digest ? `DIGEST: ${error.digest.slice(0, 12)}` : "CODE: ERR_CASE_STUDIES_500"}
            </span>
          </div>
          <p className="text-signal-danger/90 break-words leading-relaxed text-[11px]">
            {error.message || "An unhandled exception occurred during case study retrieval."}
          </p>
        </div>

        <div className="pt-4 border-t border-hairline dark:border-obsidian-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Query</span>
          </button>

          <Link
            href="/dashboard/repos"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Repositories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
