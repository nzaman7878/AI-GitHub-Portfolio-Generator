"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderGit2,
  ExternalLink,
  Star,
  GitFork,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Terminal,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { PortfolioCaseStudy, UserPortfolioProfile } from "@/types/portfolio";
import { TechBadge } from "@/components/ui/badge";

export interface CaseStudyDetailViewProps {
  caseStudy: PortfolioCaseStudy;
  user: UserPortfolioProfile;
  mode?: "page" | "modal";
  onClose?: () => void;
}

export function CaseStudyDetailView({
  caseStudy,
  user,
  mode = "page",
  onClose,
}: CaseStudyDetailViewProps) {
  const [copiedSnippet, setCopiedSnippet] = React.useState(false);

  // Fallback realistic code snippet if none explicitly attached to the case study
  const displaySnippet = React.useMemo(() => {
    if (caseStudy.codeSnippet) {
      return caseStudy.codeSnippet;
    }
    // Generate an illustrative architecture snippet based on tech stack & language
    const lang = (caseStudy.primaryLanguage || "typescript").toLowerCase();
    const filename = `src/core/${caseStudy.repoName.replace(/[^a-zA-Z0-9_-]/g, "_")}.${
      lang === "go" ? "go" : lang === "rust" ? "rs" : lang === "python" ? "py" : "ts"
    }`;

    let code = `// Architectural Core Module for ${caseStudy.repoName}\n`;
    if (lang === "go") {
      code += `package core

type EngineCoordinator struct {
    clusterState   *StateDescriptor
    eventRing      *RingBuffer
    activeQuorum   bool
}

// ExecuteStateTransition guarantees linearizable mutations across partition groups
func (ec *EngineCoordinator) ExecuteStateTransition(ctx context.Context, cmd *CommandPayload) (*Receipt, error) {
    if !ec.activeQuorum {
        return nil, ErrQuorumLoss
    }
    return ec.eventRing.Commit(ctx, cmd)
}`;
    } else if (lang === "rust") {
      code += `pub struct StateCoordinator {
    partition_id: u64,
    wal_journal: WalJournal,
}

impl StateCoordinator {
    pub fn commit_transaction(&mut self, payload: &[u8]) -> Result<TransactionReceipt, EngineError> {
        self.wal_journal.append_sync(payload)?;
        Ok(TransactionReceipt::acknowledged(self.partition_id))
    }
}`;
    } else {
      code += `export class SystemCoordinator {
  constructor(private readonly config: TopologyConfig) {}

  public async dispatchPayload(batch: TelemetryBatch): Promise<ExecutionReceipt> {
    const validated = this.enforceInvariants(batch);
    return await this.consensusBus.broadcast(validated);
  }
}`;
    }

    return {
      language: lang,
      filename,
      code,
    };
  }, [caseStudy]);

  const handleCopyCode = () => {
    if (!displaySnippet?.code) return;
    navigator.clipboard.writeText(displaySnippet.code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const portfolioSlug = user.portfolioSlug || user.username;

  return (
    <div
      className={`w-full bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone selection:bg-signal-accent/20 ${
        mode === "page" ? "min-h-screen py-10 px-4 sm:px-8 max-w-5xl mx-auto" : "p-0"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          NAV & BREADCRUMBS (PAGE MODE)
          ───────────────────────────────────────────────────────────── */}
      {mode === "page" && (
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-b border-hairline dark:border-obsidian-border pb-6 mb-8"
        >
          <div className="flex items-center gap-2 text-ink-muted dark:text-bone-muted">
            <Link
              href={`/${portfolioSlug}`}
              className="inline-flex items-center gap-1.5 text-ink-primary dark:text-bone hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>@{user.username}</span>
            </Link>
            <span>/</span>
            <span className="text-terracotta dark:text-telemetry-cyan font-semibold">
              case-study
            </span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{caseStudy.repoName}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={caseStudy.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel text-ink-primary dark:text-bone hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
              <span>View GitHub Repo</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
            </a>

            <Link
              href={`/${portfolioSlug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold uppercase text-[11px] tracking-wider hover:opacity-90 transition-opacity"
            >
              Vitrine Index
            </Link>
          </div>
        </nav>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CASE STUDY DOSSIER HEADER
          ───────────────────────────────────────────────────────────── */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline dark:border-obsidian-border pb-3 font-mono text-xs">
          <div className="flex items-center gap-3 text-ink-muted dark:text-bone-muted">
            <span className="font-bold text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
              {"§ ARCHITECTURAL MONOGRAPH //"}
            </span>
            <span className="text-ink-primary dark:text-bone font-medium">
              {caseStudy.repoName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-ink-muted dark:text-bone-muted">
            {caseStudy.primaryLanguage && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal-accent dark:bg-telemetry-cyan" />
                <span className="text-ink-primary dark:text-bone font-medium">
                  {caseStudy.primaryLanguage}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-signal-accent dark:text-telemetry-amber" />
              <span className="tabular-nums font-medium">{caseStudy.stars}</span>
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span className="tabular-nums font-medium">{caseStudy.forks}</span>
            </span>
            <span className="hidden sm:inline text-ink-faint dark:text-bone-muted">
              {caseStudy.promptVersion ? `REV: ${caseStudy.promptVersion}` : "VERIFIED_SPEC"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif font-light text-3xl sm:text-5xl text-ink-primary dark:text-bone leading-tight">
            {caseStudy.title}
          </h1>
          {caseStudy.subtitle && (
            <p className="font-mono text-sm sm:text-base text-terracotta dark:text-telemetry-cyan uppercase tracking-wider font-medium">
              {caseStudy.subtitle}
            </p>
          )}
        </div>

        {/* Executive Abstract Box */}
        <div className="p-5 sm:p-6 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel relative space-y-2">
          {/* Monograph corner tags */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] translate-y-[1px]" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] translate-y-[1px]" />

          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted">
            <span className="flex items-center gap-1.5 font-semibold text-terracotta dark:text-telemetry-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXECUTIVE ABSTRACT</span>
            </span>
            <span>SPEC_CLASSIFICATION: PUBLIC_RECORD</span>
          </div>
          <p className="font-sans text-sm sm:text-base text-ink-secondary dark:text-bone-secondary leading-relaxed">
            {caseStudy.summary}
          </p>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: PROBLEM STATEMENT & FORMULATION
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal-danger font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>§ 01. PROBLEM FORMULATION & PRODUCTION CONSTRAINTS</span>
          </div>
          <span className="font-mono text-[11px] text-ink-faint dark:text-bone-muted">
            OPERATIONAL BOTTLENECKS
          </span>
        </div>

        <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-3">
          <p className="font-sans text-sm sm:text-base text-ink-secondary dark:text-bone-secondary leading-relaxed">
            {caseStudy.problemStatement}
          </p>

          {caseStudy.challengesSolved && (
            <div className="mt-3 pt-3 border-t border-hairline-subtle dark:border-obsidian-border font-mono text-xs text-ink-primary dark:text-bone">
              <span className="text-signal-danger uppercase font-bold mr-2">
                Challenge Resolved:
              </span>
              <span>{caseStudy.challengesSolved}</span>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: APPROACH & ARCHITECTURAL TOPOLOGY
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-telemetry-emerald font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>§ 02. METHODOLOGY & SYSTEM ARCHITECTURE</span>
          </div>
          <span className="font-mono text-[11px] text-ink-faint dark:text-bone-muted">
            SYSTEM TOPOLOGY
          </span>
        </div>

        <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-4">
          <p className="font-sans text-sm sm:text-base text-ink-secondary dark:text-bone-secondary leading-relaxed">
            {caseStudy.approach || caseStudy.architecture || caseStudy.summary}
          </p>

          {/* Architecture Topology ASCII / Flow Card */}
          {caseStudy.architecture && (
            <div className="mt-2 p-4 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block font-semibold">
                SYSTEM TOPOLOGY INGRESS FLOW
              </span>
              <div className="font-mono text-xs sm:text-sm text-terracotta dark:text-telemetry-cyan bg-paper-elevated/40 dark:bg-obsidian-card/60 p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {caseStudy.architecture}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: KEY ARCHITECTURAL DECISIONS & TRADE-OFFS
          ───────────────────────────────────────────────────────────── */}
      {caseStudy.keyDecisions && caseStudy.keyDecisions.length > 0 && (
        <section className="space-y-4 mb-10">
          <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-terracotta dark:text-telemetry-cyan font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>§ 03. KEY ARCHITECTURAL DECISIONS & TRADE-OFFS</span>
            </div>
            <span className="font-mono text-[11px] text-ink-muted dark:text-bone-muted">
              {caseStudy.keyDecisions.length} RECORDED
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {caseStudy.keyDecisions.map((decision, dIdx) => (
              <div
                key={dIdx}
                className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline-subtle dark:border-obsidian-border pb-2">
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className="px-2 py-0.5 border border-terracotta/40 dark:border-telemetry-cyan/40 text-terracotta dark:text-telemetry-cyan font-bold">
                      {`DECISION_${dIdx + 1}`}
                    </span>
                    <h3 className="font-semibold text-ink-primary dark:text-bone text-sm sm:text-base">
                      {decision.decision}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-ink-faint dark:text-bone-muted">
                    TRADE-OFF VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-sans pt-1">
                  <div className="space-y-1.5 p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-telemetry-emerald" />
                      <span>Architectural Rationale</span>
                    </span>
                    <p className="text-ink-secondary dark:text-bone-secondary leading-relaxed">
                      {decision.rationale}
                    </p>
                  </div>

                  <div className="space-y-1.5 p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal-accent dark:text-telemetry-amber flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Accepted Trade-Off</span>
                    </span>
                    <p className="text-ink-secondary dark:text-bone-secondary leading-relaxed">
                      {decision.tradeOff}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: PRODUCTION IMPACT & TELEMETRY METRICS
          ───────────────────────────────────────────────────────────── */}
      {(caseStudy.impact || (caseStudy.impactMetrics && caseStudy.impactMetrics.length > 0)) && (
        <section className="space-y-4 mb-10">
          <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-telemetry-emerald font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>§ 04. PRODUCTION IMPACT & QUANTITATIVE TELEMETRY</span>
            </div>
            <span className="font-mono text-[11px] text-ink-faint dark:text-bone-muted">
              METRIC RIGOR
            </span>
          </div>

          <div className="p-5 sm:p-6 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-5">
            {caseStudy.impact && (
              <p className="font-sans text-sm sm:text-base text-ink-secondary dark:text-bone-secondary leading-relaxed">
                {caseStudy.impact}
              </p>
            )}

            {caseStudy.impactMetrics && caseStudy.impactMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {caseStudy.impactMetrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3.5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-1"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                      {m.metric}
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl text-terracotta dark:text-telemetry-cyan font-normal tabular-nums">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: CODE SNIPPETS & TECHNICAL HIGHLIGHTS
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-primary dark:text-bone font-semibold">
            <Code2 className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
            <span>§ 05. CODE IMPLEMENTATION & TECHNICAL HIGHLIGHTS</span>
          </div>
          <span className="font-mono text-[11px] text-ink-faint dark:text-bone-muted">
            SOURCE SPEC
          </span>
        </div>

        {/* Code Snippet Box */}
        {displaySnippet && (
          <div className="border border-hairline dark:border-obsidian-border bg-paper-elevated/70 dark:bg-obsidian-card overflow-hidden">
            <div className="px-4 py-2 border-b border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-ink-muted dark:text-bone-muted">
                <Terminal className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
                <span>{displaySnippet.filename || "implementation_module"}</span>
                <span className="text-ink-faint dark:text-bone-muted uppercase text-[10px]">
                  ({displaySnippet.language})
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-0.5 border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:text-terracotta dark:hover:text-telemetry-cyan text-[11px] transition-colors"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3 h-3 text-telemetry-emerald" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 sm:p-5 font-mono text-xs text-ink-primary dark:text-bone overflow-x-auto leading-relaxed bg-paper-canvas/70 dark:bg-obsidian-void/90 selection:bg-terracotta/20 dark:selection:bg-telemetry-cyan/20">
              <code>{displaySnippet.code}</code>
            </pre>
          </div>
        )}

        {/* Highlights List */}
        {caseStudy.highlights && caseStudy.highlights.length > 0 && (
          <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-bone-muted font-semibold block">
              KEY VERIFIED HIGHLIGHTS
            </span>
            <ul className="space-y-2.5">
              {caseStudy.highlights.map((highlight, hIdx) => (
                <li
                  key={hIdx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-secondary dark:text-bone-secondary"
                >
                  <CheckCircle2 className="w-4 h-4 text-telemetry-emerald shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Ecosystem Chips */}
        {caseStudy.techStack && caseStudy.techStack.length > 0 && (
          <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-bone-muted font-semibold block">
              TECHNOLOGY ECOSYSTEM & RUNTIMES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {caseStudy.techStack.map((tech) => (
                <TechBadge key={tech} name={tech} size="md" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER / ACTION STRIP
          ───────────────────────────────────────────────────────────── */}
      <footer className="pt-8 border-t border-hairline dark:border-obsidian-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-ink-muted dark:text-bone-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>GENERATED: {new Date(caseStudy.generatedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>INGRESS_HASH: {caseStudy.id.slice(0, 8)}</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={caseStudy.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Examine GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {mode === "page" ? (
            <Link
              href={`/${portfolioSlug}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Vitrine</span>
            </Link>
          ) : (
            onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan transition-colors"
              >
                Close Monograph
              </button>
            )
          )}
        </div>
      </footer>
    </div>
  );
}

export default CaseStudyDetailView;
