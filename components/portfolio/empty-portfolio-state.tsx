import Image from "next/image";
import Link from "next/link";
import { FolderGit2, ExternalLink, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
import { GitHubIcon } from "@/components/auth/github-icon";
import type { UserPortfolioProfile } from "@/types/portfolio";

export interface EmptyPortfolioStateProps {
  user: UserPortfolioProfile;
}

export function EmptyPortfolioState({ user }: EmptyPortfolioStateProps) {
  return (
    <div className="min-h-screen bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone flex flex-col justify-between selection:bg-signal-accent/20">
      {/* ─────────────────────────────────────────────────────────────
          TOP TELEMETRY HEADER
          ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-hairline dark:border-obsidian-border bg-paper-card/75 dark:bg-obsidian-surface/75 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-85"
            >
              <span className="font-mono text-xs font-bold px-2 py-0.5 border border-terracotta dark:border-telemetry-cyan text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
                VITRINE
              </span>
              <span className="hidden sm:inline font-mono text-xs text-ink-muted dark:text-bone-muted tracking-tight">
                {"// MONOGRAPH RUNTIME"}
              </span>
            </Link>

            <span className="text-paper-line dark:text-obsidian-border">|</span>

            <span className="font-mono text-xs text-ink-secondary dark:text-bone-muted tracking-tight">
              @{user.username}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline dark:border-obsidian-border bg-paper-card dark:bg-obsidian-card text-ink-primary dark:text-bone hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
            </a>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold uppercase tracking-wider text-[11px] hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN EMPTY STATE ARCHIVAL DOSSIER
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 my-8">
        <div className="max-w-2xl w-full border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel p-6 sm:p-10 relative shadow-lg space-y-8">
          {/* Monograph Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] translate-y-[1px]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] translate-y-[1px]" />

          {/* Dossier Status Banner */}
          <div className="flex items-center justify-between font-mono text-xs border-b border-hairline dark:border-obsidian-border pb-3">
            <span className="text-terracotta dark:text-telemetry-cyan font-bold tracking-widest uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>§ STATUS: UNGENERATED VITRINE</span>
            </span>
            <span className="text-ink-muted dark:text-bone-muted text-[11px]">
              REV // PENDING_INGRESS
            </span>
          </div>

          {/* User Identity Preview */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void p-1">
              {user.avatarUrl ? (
                <div className="relative w-full h-full overflow-hidden bg-paper-muted dark:bg-obsidian-card">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || user.username}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-ink-secondary dark:text-bone bg-paper-muted dark:bg-obsidian-card">
                  {(user.name || user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl text-ink-primary dark:text-bone truncate">
                {user.name || `@${user.username}`}
              </h2>
              <p className="font-mono text-xs text-ink-muted dark:text-bone-muted truncate">
                @{user.username}
              </p>
              {user.headline && (
                <p className="font-mono text-[11px] text-terracotta dark:text-telemetry-cyan truncate">
                  {user.headline}
                </p>
              )}
            </div>
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <h1 className="font-serif font-light text-2xl sm:text-4xl text-ink-primary dark:text-bone leading-tight">
              {"This user hasn't generated their portfolio yet"}
            </h1>

            <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
              This developer profile is registered, but no public case studies or curated
              repositories have been published to this vitrine. Once generated, detailed
              architectural monographs, system topologies, and trade-off analyses will appear here.
            </p>
          </div>

          {/* 3-Step Monograph Generation Pipeline Preview */}
          <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-4 sm:p-5 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block font-semibold">
              VITRINE GENERATION PIPELINE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                <span className="text-terracotta dark:text-telemetry-cyan font-bold block">
                  01. SYNC
                </span>
                <span className="text-ink-secondary dark:text-bone text-[11px] block">
                  Ingest GitHub commit telemetry & languages
                </span>
              </div>

              <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                <span className="text-terracotta dark:text-telemetry-cyan font-bold block">
                  02. CURATE
                </span>
                <span className="text-ink-secondary dark:text-bone text-[11px] block">
                  Select flagship production repositories
                </span>
              </div>

              <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                <span className="text-terracotta dark:text-telemetry-cyan font-bold block">
                  03. DISTILL
                </span>
                <span className="text-ink-secondary dark:text-bone text-[11px] block">
                  AI extracts architecture & trade-offs
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4 text-signal-accent" />
              <span>Open Dashboard to Generate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
            >
              <FolderGit2 className="w-4 h-4 text-terracotta dark:text-telemetry-cyan" />
              <span>Inspect Raw GitHub Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-hairline dark:border-obsidian-border py-6 px-4 sm:px-8 bg-paper-canvas dark:bg-obsidian-void">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-muted dark:text-bone-muted">
          <span>PORTFOLIO_GENERATOR_VITRINE // PROTOCOL 2026.1</span>
          <Link
            href="/"
            className="hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
          >
            Create Your Monograph Vitrine
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default EmptyPortfolioState;
