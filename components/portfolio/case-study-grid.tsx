"use client";

import * as React from "react";
import { LayoutGrid, List, Search, Sparkles, Filter, X } from "lucide-react";
import type { PortfolioCaseStudy } from "@/types/portfolio";
import { CaseStudyCard } from "./case-study-card";
import { CaseStudyDetailModal } from "./case-study-detail-modal";

export interface CaseStudyGridProps {
  caseStudies: PortfolioCaseStudy[];
  title?: string;
  subtitle?: string;
}

export function CaseStudyGrid({
  caseStudies,
  title = "Published Case Studies",
  subtitle = "§ 01. DEEP ENGINEERING SPECIFICATIONS",
}: CaseStudyGridProps) {
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTech, setSelectedTech] = React.useState<string | null>(null);
  const [activeModalCaseStudy, setActiveModalCaseStudy] = React.useState<PortfolioCaseStudy | null>(
    null,
  );

  // Extract unique tech stack tags from all case studies
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    caseStudies.forEach((cs) => {
      cs.techStack?.forEach((t) => techSet.add(t));
      if (cs.primaryLanguage) techSet.add(cs.primaryLanguage);
    });
    return Array.from(techSet).slice(0, 10);
  }, [caseStudies]);

  // Filter case studies based on search query and selected tech
  const filteredCaseStudies = React.useMemo(() => {
    return caseStudies.filter((cs) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cs.techStack &&
          cs.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTech =
        !selectedTech ||
        (cs.techStack && cs.techStack.includes(selectedTech)) ||
        cs.primaryLanguage === selectedTech;

      return matchesSearch && matchesTech;
    });
  }, [caseStudies, searchQuery, selectedTech]);

  return (
    <div className="space-y-8">
      {/* Section Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline dark:border-obsidian-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-terracotta dark:text-telemetry-cyan font-semibold">
            {subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary dark:text-bone mt-1">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-ink-muted dark:text-bone-muted">
            {`[${filteredCaseStudies.length} OF ${caseStudies.length} SPECIFICATIONS]`}
          </span>

          {/* Grid vs List View Switcher */}
          <div className="flex items-center border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel p-0.5">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              className={`p-1.5 transition-colors ${
                layout === "grid"
                  ? "bg-paper-canvas dark:bg-obsidian-card text-terracotta dark:text-telemetry-cyan shadow-sm"
                  : "text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone"
              }`}
              title="Grid Layout"
              aria-label="Grid Layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              className={`p-1.5 transition-colors ${
                layout === "list"
                  ? "bg-paper-canvas dark:bg-obsidian-card text-terracotta dark:text-telemetry-cyan shadow-sm"
                  : "text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone"
              }`}
              title="List Layout"
              aria-label="List Layout"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {caseStudies.length > 1 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-bone-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies by repo, title, or tech..."
              className="w-full pl-9 pr-8 py-2 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-panel text-ink-primary dark:text-bone text-xs placeholder:text-ink-muted/60 dark:placeholder:text-bone-muted/60 focus:outline-none focus:border-terracotta dark:focus:border-telemetry-cyan transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Technology Filter Pills */}
          {allTechnologies.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-ink-muted dark:text-bone-muted text-[11px] shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>FILTER:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className={`px-2.5 py-1 text-[11px] border shrink-0 transition-colors ${
                  selectedTech === null
                    ? "border-terracotta dark:border-telemetry-cyan bg-terracotta/10 dark:bg-telemetry-cyan/10 text-terracotta dark:text-telemetry-cyan font-bold"
                    : "border-hairline dark:border-obsidian-border text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone"
                }`}
              >
                All ({caseStudies.length})
              </button>

              {allTechnologies.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                  className={`px-2.5 py-1 text-[11px] border shrink-0 transition-colors ${
                    selectedTech === tech
                      ? "border-terracotta dark:border-telemetry-cyan bg-terracotta/10 dark:bg-telemetry-cyan/10 text-terracotta dark:text-telemetry-cyan font-bold"
                      : "border-hairline dark:border-obsidian-border text-ink-muted dark:text-bone-muted hover:text-ink-primary dark:hover:text-bone"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Case Studies Container: Grid or List */}
      {filteredCaseStudies.length === 0 ? (
        <div className="border border-dashed border-hairline dark:border-obsidian-border p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 mx-auto text-ink-muted dark:text-bone-muted" />
          <p className="font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-bone-muted">
            {caseStudies.length === 0
              ? "No case studies published yet for this vitrine."
              : "No specifications match your query criteria."}
          </p>
          {(searchQuery || selectedTech) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedTech(null);
              }}
              className="font-mono text-xs text-terracotta dark:text-telemetry-cyan underline pt-1"
            >
              Reset active filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
              : "grid grid-cols-1 gap-6 sm:gap-8"
          }
        >
          {filteredCaseStudies.map((cs, idx) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              index={idx}
              layout={layout}
              onOpenDetail={(study) => setActiveModalCaseStudy(study)}
            />
          ))}
        </div>
      )}

      {/* Full Monograph Detail Modal */}
      <CaseStudyDetailModal
        caseStudy={activeModalCaseStudy}
        isOpen={Boolean(activeModalCaseStudy)}
        onClose={() => setActiveModalCaseStudy(null)}
      />
    </div>
  );
}

export default CaseStudyGrid;
