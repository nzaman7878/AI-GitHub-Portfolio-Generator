"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderGit2,
  Star,
  GitFork,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ExternalLink,
  Layers,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import type { PortfolioCaseStudy } from "@/types/portfolio";
import { TechBadge } from "@/components/ui/badge";

export interface CaseStudyCardProps {
  caseStudy: PortfolioCaseStudy;
  index: number;
  layout?: "grid" | "list";
  portfolioSlug?: string;
  onOpenDetail?: (caseStudy: PortfolioCaseStudy) => void;
  initiallyExpanded?: boolean;
}

export function CaseStudyCard({
  caseStudy,
  index,
  layout = "grid",
  portfolioSlug,
  onOpenDetail,
  initiallyExpanded = false,
}: CaseStudyCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(initiallyExpanded);

  return (
    <article
      className={`border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-card p-6 sm:p-7 relative transition-all duration-200 group hover:border-terracotta/60 dark:hover:border-telemetry-cyan/60 flex flex-col justify-between ${
        layout === "list" ? "space-y-5" : "space-y-6"
      }`}
    >
      {/* Corner Bracket Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-terracotta dark:border-telemetry-cyan -translate-x-[1px] -translate-y-[1px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-terracotta dark:border-telemetry-cyan translate-x-[1px] -translate-y-[1px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-terracotta dark:border-telemetry-cyan -translate-x-[1px] translate-y-[1px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-terracotta dark:border-telemetry-cyan translate-x-[1px] translate-y-[1px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top Telemetry Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline-subtle dark:border-obsidian-border pb-3 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-terracotta dark:text-telemetry-cyan">
              {`CASE_STUDY_0${index + 1} //`}
            </span>
            <a
              href={caseStudy.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-primary dark:text-bone hover:text-terracotta dark:hover:text-telemetry-cyan flex items-center gap-1 font-semibold truncate transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan shrink-0" />
              <span className="truncate">{caseStudy.repoName}</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted dark:text-bone-muted shrink-0" />
            </a>
          </div>

          <div className="flex items-center gap-3.5 text-ink-muted dark:text-bone-muted">
            {caseStudy.primaryLanguage && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal-accent dark:bg-telemetry-cyan" />
                <span className="text-ink-secondary dark:text-bone font-medium">
                  {caseStudy.primaryLanguage}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-signal-accent dark:text-telemetry-amber" />
              <span className="tabular-nums">{caseStudy.stars}</span>
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span className="tabular-nums">{caseStudy.forks}</span>
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink-primary dark:text-bone leading-tight group-hover:text-terracotta dark:group-hover:text-bone transition-colors">
            {caseStudy.title}
          </h3>
          {caseStudy.subtitle && (
            <p className="font-mono text-xs sm:text-sm text-terracotta dark:text-telemetry-cyan uppercase tracking-wider font-medium">
              {caseStudy.subtitle}
            </p>
          )}
        </div>

        {/* Executive Summary */}
        <p className="font-sans text-xs sm:text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed line-clamp-3">
          {caseStudy.summary}
        </p>

        {/* High-Level Dual Synopsis: Problem & Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-signal-danger font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Problem Statement</span>
            </span>
            <p className="text-xs text-ink-secondary dark:text-bone-secondary line-clamp-2 leading-relaxed">
              {caseStudy.problemStatement}
            </p>
          </div>

          <div className="p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-telemetry-emerald font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Architectural Solution</span>
            </span>
            <p className="text-xs text-ink-secondary dark:text-bone-secondary line-clamp-2 leading-relaxed">
              {caseStudy.architecture || caseStudy.approach || caseStudy.summary}
            </p>
          </div>
        </div>

        {/* Quantitative Impact Ribbon (if present) */}
        {caseStudy.impact && (
          <div className="border-l-2 border-terracotta dark:border-telemetry-cyan pl-3.5 py-1 bg-paper-elevated/40 dark:bg-obsidian-panel/60 font-mono text-xs text-ink-primary dark:text-bone leading-relaxed">
            <span className="font-bold text-terracotta dark:text-telemetry-cyan uppercase mr-2">
              Impact:
            </span>
            {caseStudy.impact}
          </div>
        )}

        {/* Tech Stack Badges */}
        {caseStudy.techStack && caseStudy.techStack.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
              TECHNOLOGY STACK
            </span>
            <div className="flex flex-wrap gap-1.5">
              {caseStudy.techStack.slice(0, 6).map((tech) => (
                <TechBadge key={tech} name={tech} size="sm" />
              ))}
              {caseStudy.techStack.length > 6 && (
                <span className="px-2 py-0.5 border border-hairline dark:border-obsidian-border font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                  +{caseStudy.techStack.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            EXPANDED INLINE DEEP DIVE (EXPAND / DETAIL VIEW)
            ───────────────────────────────────────────────────────────── */}
        {isExpanded && (
          <div className="pt-4 border-t border-hairline dark:border-obsidian-border space-y-5 animate-in fade-in duration-200">
            {/* Approach */}
            {caseStudy.approach && (
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-terracotta dark:text-telemetry-cyan font-semibold block">
                  METHODOLOGY & APPROACH
                </span>
                <p className="font-sans text-xs sm:text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed bg-paper-canvas dark:bg-obsidian-panel p-3 border border-hairline dark:border-obsidian-border">
                  {caseStudy.approach}
                </p>
              </div>
            )}

            {/* Key Decisions */}
            {caseStudy.keyDecisions && caseStudy.keyDecisions.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                  <span className="flex items-center gap-1.5 text-terracotta dark:text-telemetry-cyan font-semibold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Key Architectural Decisions</span>
                  </span>
                  <span>{caseStudy.keyDecisions.length} Documented</span>
                </div>

                <div className="space-y-2">
                  {caseStudy.keyDecisions.map((decision, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel space-y-1.5 text-xs"
                    >
                      <div className="font-semibold text-ink-primary dark:text-bone flex items-center gap-2">
                        <span className="font-mono text-[10px] text-terracotta dark:text-telemetry-cyan border border-hairline dark:border-obsidian-border px-1 py-0.2">
                          #{dIdx + 1}
                        </span>
                        <span>{decision.decision}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink-secondary dark:text-bone-secondary pt-1 font-sans">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-ink-muted dark:text-bone-muted block">
                            Rationale:
                          </span>
                          <span>{decision.rationale}</span>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-signal-accent dark:text-telemetry-amber block">
                            Trade-Off:
                          </span>
                          <span>{decision.tradeOff}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Metrics (if present) */}
            {caseStudy.impactMetrics && caseStudy.impactMetrics.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-telemetry-emerald font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Telemetry Metrics</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {caseStudy.impactMetrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-2.5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel"
                    >
                      <span className="font-mono text-[10px] uppercase text-ink-muted dark:text-bone-muted block">
                        {m.metric}
                      </span>
                      <span className="font-serif text-lg text-terracotta dark:text-telemetry-cyan tabular-nums font-normal">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {caseStudy.highlights && caseStudy.highlights.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                  ENGINEERING HIGHLIGHTS
                </span>
                <ul className="space-y-1.5">
                  {caseStudy.highlights.map((h, hIdx) => (
                    <li
                      key={hIdx}
                      className="flex items-start gap-2 text-xs text-ink-secondary dark:text-bone-secondary"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-telemetry-emerald shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-2 border-t border-hairline dark:border-obsidian-border flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline dark:border-obsidian-border text-ink-primary dark:text-bone hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Collapse Spec</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Inspect Architecture</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {portfolioSlug && (
            <Link
              href={`/${portfolioSlug}/case-study/${caseStudy.repoName}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
              title="Open full page monograph view"
            >
              <ExternalLink className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
              <span className="hidden sm:inline">Deep Dive</span>
            </Link>
          )}

          {onOpenDetail && (
            <button
              type="button"
              onClick={() => onOpenDetail(caseStudy)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
              title="Open full monograph dossier modal"
            >
              <Maximize2 className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
              <span className="hidden sm:inline">Modal Spec</span>
            </button>
          )}

          <a
            href={caseStudy.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold uppercase text-[11px] tracking-wider hover:opacity-90 transition-opacity"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default CaseStudyCard;
