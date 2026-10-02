import Link from "next/link";
import { ArrowLeft, Compass, SearchX } from "lucide-react";

export default function PortfolioNotFound() {
  return (
    <main className="min-h-screen bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone flex flex-col justify-between selection:bg-signal-accent/20">
      {/* Top Telemetry Header */}
      <header className="border-b border-paper-line dark:border-obsidian-line bg-paper-card/60 dark:bg-obsidian-surface/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            <span className="font-mono text-xs font-bold px-2 py-0.5 border border-signal-accent text-signal-accent uppercase tracking-widest">
              VITRINE
            </span>
            <span className="font-mono text-xs text-ink-muted dark:text-bone-muted tracking-tight">
              {"// TELEMETRY RUNTIME"}
            </span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-[11px] text-ink-faint dark:text-bone-faint">
            <span className="inline-block w-2 h-2 rounded-full bg-signal-danger animate-pulse" />
            <span>ERR_CODE: 404_PORTFOLIO_NOT_LOCATED</span>
          </div>
        </div>
      </header>

      {/* Main Error Monograph */}
      <section className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="max-w-xl w-full border border-paper-line dark:border-obsidian-line bg-paper-card dark:bg-obsidian-surface p-8 sm:p-12 relative shadow-2xl">
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-signal-accent -translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-signal-accent translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-signal-accent -translate-x-[1px] translate-y-[1px]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-signal-accent translate-x-[1px] translate-y-[1px]" />

          <div className="flex items-center gap-3 font-mono text-xs text-signal-accent uppercase tracking-widest mb-4">
            <SearchX className="w-4 h-4" />
            <span>§ 404 SPECIFICATION ERROR</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl font-normal tracking-tight text-ink-primary dark:text-bone mb-4">
            Portfolio Not Located
          </h1>

          <div className="font-mono text-xs text-ink-muted dark:text-bone-muted border-l-2 border-signal-danger pl-3 py-1 mb-6">
            Vitrine record query failed. No published engineering monograph or profile matching this
            username handle exists in the catalog.
          </div>

          <p className="text-sm text-ink-secondary dark:text-bone-muted leading-relaxed mb-8">
            The requested engineer may not have published their vitrine yet, the custom URL slug may
            have been modified, or the handle is typed incorrectly.
          </p>

          <div className="pt-6 border-t border-paper-line dark:border-obsidian-line flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Catalog
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider border border-paper-line dark:border-obsidian-line text-ink-secondary dark:text-bone-muted hover:border-signal-accent hover:text-signal-accent transition-colors"
            >
              <Compass className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer System Specs */}
      <footer className="border-t border-paper-line dark:border-obsidian-line py-4 px-6 bg-paper-card/40 dark:bg-obsidian-surface/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-ink-faint dark:text-bone-faint">
          <span>{"PORTFOLIO_GENERATOR_VITRINE // PROTOCOL 2026.1"}</span>
          <span>HTTP 404 RES_TARGET_UNREACHABLE</span>
        </div>
      </footer>
    </main>
  );
}
