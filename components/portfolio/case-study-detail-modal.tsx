"use client";

import * as React from "react";
import {
  X,
  FolderGit2,
  ExternalLink,
  Star,
  GitFork,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Code2,
} from "lucide-react";
import type { PortfolioCaseStudy } from "@/types/portfolio";
import { TechBadge } from "@/components/ui/badge";

export interface CaseStudyDetailModalProps {
  caseStudy: PortfolioCaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyDetailModal({ caseStudy, isOpen, onClose }: CaseStudyDetailModalProps) {
  // Handle escape key to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !caseStudy) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-paper-canvas dark:bg-obsidian-void border border-hairline dark:border-obsidian-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Monograph Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] -translate-y-[1px] pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] -translate-y-[1px] pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] translate-y-[1px] pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] translate-y-[1px] pointer-events-none z-10" />

        {/* Modal Header */}
        <header className="px-6 py-4 border-b border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 font-mono text-xs text-ink-muted dark:text-bone-muted min-w-0">
            <span className="font-bold text-terracotta dark:text-telemetry-cyan uppercase tracking-widest shrink-0">
              {"§ ARCHITECTURAL MONOGRAPH //"}
            </span>
            <span className="truncate">{caseStudy.repoName}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={caseStudy.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border bg-paper-elevated dark:bg-obsidian-card text-ink-primary dark:text-bone hover:border-terracotta dark:hover:border-telemetry-cyan transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
              <span>Repository</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
            </a>

            <button
              onClick={onClose}
              type="button"
              aria-label="Close dossier modal"
              className="p-1.5 border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 focus:outline-none">
          {/* Title & Metadata Strip */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-ink-muted dark:text-bone-muted">
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
                <span className="tabular-nums">{caseStudy.stars}</span>
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" />
                <span className="tabular-nums">{caseStudy.forks}</span>
              </span>
              <span className="text-ink-faint dark:text-bone-muted">
                {caseStudy.promptVersion ? `REV: ${caseStudy.promptVersion}` : "VERIFIED_SPEC"}
              </span>
            </div>

            <h2
              id="case-study-modal-title"
              className="font-serif font-normal text-3xl sm:text-4xl text-ink-primary dark:text-bone leading-tight"
            >
              {caseStudy.title}
            </h2>

            {caseStudy.subtitle && (
              <p className="font-mono text-sm text-terracotta dark:text-telemetry-cyan uppercase tracking-wider font-medium">
                {caseStudy.subtitle}
              </p>
            )}
          </div>

          {/* Executive Summary */}
          <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
              <span>EXECUTIVE SUMMARY</span>
            </span>
            <p className="font-sans text-sm sm:text-base text-ink-secondary dark:text-bone-secondary leading-relaxed">
              {caseStudy.summary}
            </p>
          </div>

          {/* Problem & Architecture Dual Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem Formulation */}
            <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal-danger font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>§ PROBLEM FORMULATION</span>
              </div>
              <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
                {caseStudy.problemStatement}
              </p>
            </div>

            {/* Architectural Solution */}
            <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-telemetry-emerald font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>§ ARCHITECTURAL TOPOLOGY</span>
              </div>
              <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
                {caseStudy.architecture || caseStudy.approach || caseStudy.summary}
              </p>
            </div>
          </div>

          {/* Approach Details (If Present) */}
          {caseStudy.approach && caseStudy.approach !== caseStudy.architecture && (
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta dark:text-telemetry-cyan font-semibold block">
                METHODOLOGY & IMPLEMENTATION STRATEGY
              </span>
              <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed border-l-2 border-hairline dark:border-obsidian-border pl-4">
                {caseStudy.approach}
              </p>
            </div>
          )}

          {/* Key Decisions Grid */}
          {caseStudy.keyDecisions && caseStudy.keyDecisions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-terracotta dark:text-telemetry-cyan font-semibold flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>KEY ARCHITECTURAL DECISIONS</span>
                </span>
                <span className="font-mono text-[11px] text-ink-muted dark:text-bone-muted">
                  {caseStudy.keyDecisions.length} RECORDED
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {caseStudy.keyDecisions.map((decision, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-4 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-3"
                  >
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-1.5 py-0.5 border border-terracotta/30 dark:border-telemetry-cyan/30 text-terracotta dark:text-telemetry-cyan font-bold">
                        {`DECISION_${dIdx + 1}`}
                      </span>
                      <span className="font-semibold text-ink-primary dark:text-bone">
                        {decision.decision}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                          Technical Rationale
                        </span>
                        <p className="text-ink-secondary dark:text-bone-secondary leading-relaxed">
                          {decision.rationale}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-signal-accent dark:text-telemetry-amber block">
                          Trade-Off Accepted
                        </span>
                        <p className="text-ink-secondary dark:text-bone-secondary leading-relaxed">
                          {decision.tradeOff}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantitative Metrics & Impact */}
          {(caseStudy.impact ||
            (caseStudy.impactMetrics && caseStudy.impactMetrics.length > 0)) && (
            <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-telemetry-emerald font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>PRODUCTION IMPACT & METRICS</span>
              </span>

              {caseStudy.impact && (
                <p className="font-sans text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
                  {caseStudy.impact}
                </p>
              )}

              {caseStudy.impactMetrics && caseStudy.impactMetrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {caseStudy.impactMetrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-1"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                        {m.metric}
                      </span>
                      <span className="font-serif text-xl sm:text-2xl text-terracotta dark:text-telemetry-cyan font-normal tabular-nums">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Highlights & Challenges Solved */}
          {caseStudy.highlights && caseStudy.highlights.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-bone-muted font-semibold block">
                ENGINEERING HIGHLIGHTS
              </span>
              <ul className="space-y-2">
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

          {/* Tech Stack Chips */}
          {caseStudy.techStack && caseStudy.techStack.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-hairline dark:border-obsidian-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                TECHNOLOGY ECOSYSTEM
              </span>
              <div className="flex flex-wrap gap-1.5">
                {caseStudy.techStack.map((tech) => (
                  <TechBadge key={tech} name={tech} size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-4 border-t border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-faint dark:text-bone-muted">
            <Code2 className="w-3.5 h-3.5" />
            <span>VITRINE_SPEC // CASE_STUDY_DOSSIER</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={caseStudy.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
            >
              <span>Examine Source Code</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary hover:border-terracotta dark:hover:border-telemetry-cyan transition-colors"
            >
              Close Monograph
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
