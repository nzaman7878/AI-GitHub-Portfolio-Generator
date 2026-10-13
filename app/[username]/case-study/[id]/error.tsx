"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RotateCcw, ArrowLeft, AlertOctagon, FileCode2, Terminal } from "lucide-react";
import { TelemetryDot } from "@/components/ui/motion";

export default function CaseStudyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const username = (params?.username as string) || "";

  React.useEffect(() => {
    console.error("[CaseStudyError] Runtime fault caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone flex flex-col justify-between selection:bg-signal-accent/20">
      {/* ─────────────────────────────────────────────────────────────
          TOP TELEMETRY HEADER
          ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-hairline dark:border-obsidian-border bg-paper-card/75 dark:bg-obsidian-surface/75 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={username ? `/${username}` : "/"}
            className="flex items-center gap-2 group transition-opacity hover:opacity-85"
          >
            <span className="font-mono text-xs font-bold px-2 py-0.5 border border-signal-danger text-signal-danger uppercase tracking-widest">
              MONOGRAPH_FAULT
            </span>
            <span className="font-mono text-xs text-ink-muted dark:text-bone-muted tracking-tight">
              {"// CASE STUDY DECOMPILATION FAILURE"}
            </span>
          </Link>

          <div className="flex items-center gap-2.5 font-mono text-xs text-signal-danger">
            <TelemetryDot status="rose" pulse size="sm" />
            <span>ERR_SPEC_SYNTHESIS</span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN ERROR DOSSIER
          ───────────────────────────────────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center p-4 sm:p-8 my-8">
        <div className="max-w-xl w-full border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel p-6 sm:p-10 relative shadow-xl space-y-6">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-signal-danger -translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-signal-danger translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-signal-danger -translate-x-[1px] translate-y-[1px]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-signal-danger translate-x-[1px] translate-y-[1px]" />

          {/* Section Indicator */}
          <div className="flex items-center gap-2 font-mono text-xs text-signal-danger uppercase tracking-widest">
            <AlertOctagon className="w-4 h-4" />
            <span>§ 500 SPEC SYNTHESIS FAULT // DETAIL INGRESS ERROR</span>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="font-serif font-light text-3xl sm:text-4xl text-ink-primary dark:text-bone leading-tight">
              Case Study Decompilation Failure
            </h1>
            <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
              The architectural monograph could not be compiled or loaded from persistent storage.
              This may indicate temporary database latency, missing repository telemetry, or an
              ingress interruption.
            </p>
          </div>

          {/* Error Diagnostics Box */}
          <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-ink-muted dark:text-bone-muted text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-signal-danger" />
                <span>FAULT_DIAGNOSTIC</span>
              </span>
              <span>
                {error.digest ? `DIGEST: ${error.digest.slice(0, 12)}` : "CODE: ERR_SPEC_500"}
              </span>
            </div>
            <p className="text-signal-danger/90 break-words leading-relaxed text-[11px]">
              {error.message || "An unhandled runtime exception halted the case study renderer."}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-hairline dark:border-obsidian-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Monograph Query</span>
            </button>

            {username && (
              <Link
                href={`/${username}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </Link>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-hairline dark:border-obsidian-border py-4 px-6 bg-paper-canvas dark:bg-obsidian-void font-mono text-[11px] text-ink-muted dark:text-bone-muted flex items-center justify-between">
        <span>CASE_STUDY_ERROR_BOUNDARY // FAULT_RECOVERY</span>
        <span>STATUS: RESILIENCE_ACTIVE</span>
      </footer>
    </main>
  );
}
