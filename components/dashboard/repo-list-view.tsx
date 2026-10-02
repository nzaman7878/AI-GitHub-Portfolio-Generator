"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Star,
  GitFork,
  Check,
  X,
  FileText,
  AlertCircle,
  FolderGit2,
  CheckCircle2,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { GITHUB_LANGUAGE_COLORS } from "@/lib/github/languages";
import {
  toggleRepoSelectionAction,
  bulkToggleRepoSelectionAction,
  getUserRepositoriesAction,
} from "@/actions/repos";
import { generateCaseStudyAction, getGeminiQuotaStatusAction } from "@/actions/generate";
import { RepoSyncButton } from "./repo-sync-button";
import { QuotaDisplay } from "./quota-display";
import { BatchGeneratorModal } from "./batch-generator-modal";
import type { RepoWithStatus } from "@/types/github";
import type { GeminiQuotaStatusSerialized } from "@/types/ai";

export interface RepoListViewProps {
  initialRepos?: RepoWithStatus[];
  initialQuota?: GeminiQuotaStatusSerialized | null;
  isAuthenticated?: boolean;
  username?: string | null;
  lastSyncedAt?: string | null;
}

// Sample fallback repositories for demo/preview mode if database is empty
const DEMO_REPOSITORIES: RepoWithStatus[] = [
  {
    id: "demo-repo-1",
    userId: "demo-user",
    githubId: 10101,
    name: "distributed-cache-engine",
    fullName: "engineering/distributed-cache-engine",
    description:
      "High-throughput, in-memory distributed key-value store with consistent hashing, raft consensus replication, and sub-millisecond p99 latency.",
    htmlUrl: "https://github.com",
    homepage: "https://docs.cache-engine.internal",
    language: "Go",
    primaryLanguage: "Go",
    languageBreakdown: { Go: 850000, Assembly: 24000 },
    stars: 342,
    forks: 48,
    openIssues: 5,
    topics: ["distributed-systems", "raft", "go", "high-performance", "concurrency"],
    readmeContent: "README content for distributed cache engine",
    commitCount: 428,
    isSelected: true,
    displayOrder: 0,
    lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasCaseStudy: true,
    caseStudyId: "demo-cs-1",
  },
  {
    id: "demo-repo-2",
    userId: "demo-user",
    githubId: 10102,
    name: "neural-ast-optimizer",
    fullName: "engineering/neural-ast-optimizer",
    description:
      "Compiles TypeScript ASTs to optimized WebAssembly modules with automated loop vectorization and speculative dead-code elimination.",
    htmlUrl: "https://github.com",
    homepage: null,
    language: "Rust",
    primaryLanguage: "Rust",
    languageBreakdown: { Rust: 1200000, TypeScript: 150000 },
    stars: 215,
    forks: 31,
    openIssues: 3,
    topics: ["compiler", "rust", "webassembly", "optimization", "ast"],
    readmeContent: "README content for neural ast optimizer",
    commitCount: 312,
    isSelected: true,
    displayOrder: 1,
    lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasCaseStudy: true,
    caseStudyId: "demo-cs-2",
  },
  {
    id: "demo-repo-3",
    userId: "demo-user",
    githubId: 10103,
    name: "event-stream-gateway",
    fullName: "engineering/event-stream-gateway",
    description:
      "Enterprise WebSocket and SSE multiplexer handling 100k concurrent telemetry connections with backpressure control and Redis streams backing.",
    htmlUrl: "https://github.com",
    homepage: "https://gateway.internal",
    language: "TypeScript",
    primaryLanguage: "TypeScript",
    languageBreakdown: { TypeScript: 640000, CSS: 12000 },
    stars: 189,
    forks: 24,
    openIssues: 2,
    topics: ["websockets", "telemetry", "nodejs", "redis", "streaming"],
    readmeContent: "README content for event stream gateway",
    commitCount: 195,
    isSelected: true,
    displayOrder: 2,
    lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasCaseStudy: false,
    caseStudyId: null,
  },
  {
    id: "demo-repo-4",
    userId: "demo-user",
    githubId: 10104,
    name: "query-execution-profiler",
    fullName: "engineering/query-execution-profiler",
    description:
      "Autonomous PostgreSQL query execution visualizer and index recommender using eBPF kernel probes for zero-overhead profiling.",
    htmlUrl: "https://github.com",
    homepage: null,
    language: "Python",
    primaryLanguage: "Python",
    languageBreakdown: { Python: 450000, C: 80000 },
    stars: 145,
    forks: 18,
    openIssues: 8,
    topics: ["ebpf", "postgresql", "profiler", "database-tuning"],
    readmeContent: "README content for query execution profiler",
    commitCount: 164,
    isSelected: false,
    displayOrder: 3,
    lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasCaseStudy: false,
    caseStudyId: null,
  },
  {
    id: "demo-repo-5",
    userId: "demo-user",
    githubId: 10105,
    name: "kernel-metrics-collector",
    fullName: "engineering/kernel-metrics-collector",
    description:
      "Zero-copy Linux network socket observability daemon exporting OpenTelemetry metrics for bare-metal Kubernetes clusters.",
    htmlUrl: "https://github.com",
    homepage: null,
    language: "C",
    primaryLanguage: "C",
    languageBreakdown: { C: 320000, Makefile: 12000 },
    stars: 94,
    forks: 11,
    openIssues: 1,
    topics: ["linux", "opentelemetry", "metrics", "sysadmin"],
    readmeContent: "README content for kernel metrics collector",
    commitCount: 98,
    isSelected: false,
    displayOrder: 4,
    lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasCaseStudy: false,
    caseStudyId: null,
  },
];

function formatDate(isoString: string | null): string {
  if (!isoString) return "Never";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "Recently";
  }
}

type SortOption = "stars" | "updated" | "name" | "commits";
type StatusFilter = "all" | "selected" | "unselected";

export function RepoListView({
  initialRepos = [],
  initialQuota = null,
  isAuthenticated = false,
  username,
  lastSyncedAt: serverLastSyncedAt,
}: RepoListViewProps) {
  // Use demo data if no initial repositories exist
  const isDemo = initialRepos.length === 0;
  const [repos, setRepos] = React.useState<RepoWithStatus[]>(
    isDemo ? DEMO_REPOSITORIES : initialRepos,
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("stars");

  // Interaction states
  const [pendingRepoIds, setPendingRepoIds] = React.useState<Set<string>>(new Set());
  const [isBulkPending, setIsBulkPending] = React.useState(false);
  const [bulkFeedback, setBulkFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Generation states
  const [generatingRepoIds, setGeneratingRepoIds] = React.useState<Set<string>>(new Set());
  const [isBatchModalOpen, setIsBatchModalOpen] = React.useState(false);
  const [currentQuota, setCurrentQuota] = React.useState<GeminiQuotaStatusSerialized | null>(
    initialQuota,
  );
  const [generationFeedback, setGenerationFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
    repoId?: string;
  } | null>(null);

  // Sync quota with prop
  const [prevInitialQuota, setPrevInitialQuota] = React.useState(initialQuota);
  if (initialQuota !== prevInitialQuota) {
    setPrevInitialQuota(initialQuota);
    if (initialQuota) {
      setCurrentQuota(initialQuota);
    }
  }

  // Generate or Regenerate single repo case study
  const handleGenerateSingle = async (repo: RepoWithStatus, forceRegenerate: boolean = false) => {
    setGeneratingRepoIds((prev) => new Set(prev).add(repo.id));
    setGenerationFeedback(null);

    try {
      if (isDemo || repo.id.startsWith("demo-")) {
        // Simulated latency for demo
        await new Promise((r) => setTimeout(r, 900));
        setRepos((prev) => prev.map((r) => (r.id === repo.id ? { ...r, hasCaseStudy: true } : r)));
        setGenerationFeedback({
          type: "success",
          message: `Successfully synthesized engineering dossier for ${repo.name}.`,
          repoId: repo.id,
        });
      } else {
        const res = await generateCaseStudyAction({
          repoId: repo.id,
          forceRegenerate,
        });

        if (res.success) {
          setRepos((prev) =>
            prev.map((r) => (r.id === repo.id ? { ...r, hasCaseStudy: true } : r)),
          );
          setGenerationFeedback({
            type: "success",
            message: `Case study dossier ready for ${repo.name} (${res.cached ? "preserved fresh cache" : "synthesized via Gemini AI"}).`,
            repoId: repo.id,
          });

          // Refresh quota
          try {
            const qRes = await getGeminiQuotaStatusAction();
            if (qRes.success) setCurrentQuota(qRes.quota);
          } catch {
            // Handled
          }
        } else {
          setGenerationFeedback({
            type: "error",
            message: res.error || `Failed to generate case study for ${repo.name}.`,
            repoId: repo.id,
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setGenerationFeedback({
        type: "error",
        message: msg,
        repoId: repo.id,
      });
    } finally {
      setGeneratingRepoIds((prev) => {
        const next = new Set(prev);
        next.delete(repo.id);
        return next;
      });
    }
  };

  // Sync state with props
  const [prevInitialRepos, setPrevInitialRepos] = React.useState(initialRepos);
  if (initialRepos !== prevInitialRepos) {
    setPrevInitialRepos(initialRepos);
    if (initialRepos.length > 0) {
      setRepos(initialRepos);
    }
  }

  // Derived language list
  const availableLanguages = React.useMemo(() => {
    const langSet = new Set<string>();
    repos.forEach((r) => {
      if (r.primaryLanguage) langSet.add(r.primaryLanguage);
      else if (r.language) langSet.add(r.language);
    });
    return Array.from(langSet).sort();
  }, [repos]);

  // Telemetry counts
  const totalCount = repos.length;
  const selectedCount = repos.filter((r) => r.isSelected).length;
  const totalStars = repos.filter((r) => r.isSelected).reduce((acc, r) => acc + (r.stars || 0), 0);

  // Filtered & Sorted repositories
  const filteredRepos = React.useMemo(() => {
    let result = [...repos];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.fullName.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          r.topics.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Language filter
    if (selectedLanguage !== "all") {
      result = result.filter(
        (r) =>
          r.primaryLanguage?.toLowerCase() === selectedLanguage.toLowerCase() ||
          r.language?.toLowerCase() === selectedLanguage.toLowerCase(),
      );
    }

    // Status filter
    if (statusFilter === "selected") {
      result = result.filter((r) => r.isSelected);
    } else if (statusFilter === "unselected") {
      result = result.filter((r) => !r.isSelected);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "stars") {
        return (b.stars || 0) - (a.stars || 0);
      }
      if (sortBy === "updated") {
        const timeA = a.lastPushedAt ? new Date(a.lastPushedAt).getTime() : 0;
        const timeB = b.lastPushedAt ? new Date(b.lastPushedAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "commits") {
        return (b.commitCount || 0) - (a.commitCount || 0);
      }
      return 0;
    });

    return result;
  }, [repos, searchQuery, selectedLanguage, statusFilter, sortBy]);

  // Toggle single repo inclusion
  const handleToggleSelection = async (repo: RepoWithStatus) => {
    const newSelected = !repo.isSelected;

    // Optimistic UI update
    setRepos((prev) => prev.map((r) => (r.id === repo.id ? { ...r, isSelected: newSelected } : r)));

    // If demo mode, don't execute server action
    if (isDemo || repo.id.startsWith("demo-")) {
      return;
    }

    setPendingRepoIds((prev) => new Set(prev).add(repo.id));

    try {
      const res = await toggleRepoSelectionAction(repo.id, newSelected);
      if (!res.success) {
        // Rollback on failure
        setRepos((prev) =>
          prev.map((r) => (r.id === repo.id ? { ...r, isSelected: !newSelected } : r)),
        );
        setBulkFeedback({
          type: "error",
          message: res.error || "Failed to update repository inclusion.",
        });
      }
    } catch {
      // Rollback on exception
      setRepos((prev) =>
        prev.map((r) => (r.id === repo.id ? { ...r, isSelected: !newSelected } : r)),
      );
      setBulkFeedback({
        type: "error",
        message: "Network error updating repository inclusion.",
      });
    } finally {
      setPendingRepoIds((prev) => {
        const next = new Set(prev);
        next.delete(repo.id);
        return next;
      });
    }
  };

  // Bulk update visible filtered repos
  const handleBulkToggle = async (select: boolean) => {
    const targetIds = filteredRepos.map((r) => r.id);
    if (targetIds.length === 0) return;

    // Optimistic UI update
    setRepos((prev) =>
      prev.map((r) => (targetIds.includes(r.id) ? { ...r, isSelected: select } : r)),
    );

    if (isDemo || targetIds.some((id) => id.startsWith("demo-"))) {
      return;
    }

    setIsBulkPending(true);
    try {
      const res = await bulkToggleRepoSelectionAction(targetIds, select);
      if (!res.success) {
        setBulkFeedback({
          type: "error",
          message: res.error || "Bulk update failed.",
        });
      } else {
        setBulkFeedback({
          type: "success",
          message: `Successfully updated ${res.updatedCount} repositories.`,
        });
      }
    } catch {
      setBulkFeedback({
        type: "error",
        message: "An unexpected error occurred during bulk update.",
      });
    } finally {
      setIsBulkPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Header Strip */}
      <Reveal direction="up" delay={50}>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Section Identity */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
                  § 02.1 REPOSITORY INVENTORY{username ? ` — @${username}` : ""}
                </span>
                <Badge variant={isDemo ? "outline" : "cyan"} size="sm" dot>
                  {isDemo ? (isAuthenticated ? "PREVIEW MODE" : "UNAUTHENTICATED") : "SYNCED"}
                </Badge>
              </div>
              <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
                Repository Index
              </h1>
              <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary max-w-xl">
                Configure which engineering projects appear in your public portfolio. Selected
                repositories are queued for architectural analysis and AI dossier synthesis.
                {serverLastSyncedAt && (
                  <span className="block mt-1 font-mono text-[11px] text-ink-muted dark:text-bone-muted">
                    Last synchronized: {formatDate(serverLastSyncedAt)}
                  </span>
                )}
              </p>
            </div>

            {/* Right: Telemetry Quick Counters & Sync Action */}
            <div className="flex flex-wrap items-center gap-4 lg:self-center">
              <QuotaDisplay compact initialQuota={currentQuota} onQuotaUpdate={setCurrentQuota} />
              <div className="hairline-all bg-paper-sheet dark:bg-obsidian-panel px-4 py-2.5 flex items-center gap-6">
                <div>
                  <span className="block font-mono text-[10px] text-ink-muted dark:text-bone-muted tracking-wider uppercase">
                    Selected
                  </span>
                  <span className="font-mono text-mono-md font-semibold text-ink-primary dark:text-bone">
                    {selectedCount}{" "}
                    <span className="text-ink-muted dark:text-bone-muted font-normal">
                      / {totalCount}
                    </span>
                  </span>
                </div>
                <div className="hairline-l pl-4">
                  <span className="block font-mono text-[10px] text-ink-muted dark:text-bone-muted tracking-wider uppercase">
                    Portfolio Stars
                  </span>
                  <span className="font-mono text-mono-md font-semibold text-ink-primary dark:text-bone flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {totalStars.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* One-Click Sync Repos Action */}
              <RepoSyncButton
                variant="outline"
                size="md"
                label="Sync Repos"
                loadingLabel="Syncing..."
                onSyncSuccess={async () => {
                  try {
                    const res = await getUserRepositoriesAction();
                    if (res.success && res.repos.length > 0) {
                      setRepos(res.repos);
                    }
                  } catch {
                    // Handled
                  }
                }}
              />
            </div>
          </div>

          {/* Bulk Update Feedback Alert */}
          {bulkFeedback && (
            <div
              className={`mt-4 p-3 border font-mono text-mono-sm flex items-center justify-between gap-3 ${
                bulkFeedback.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-telemetry-emerald/40 text-emerald-800 dark:text-telemetry-emerald"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-telemetry-rose/40 text-rose-800 dark:text-telemetry-rose"
              }`}
            >
              <div className="flex items-center gap-2">
                {bulkFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{bulkFeedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setBulkFeedback(null)}
                className="p-1 hover:opacity-75 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {/* AI Generation Quota & Telemetry Panel */}
      <Reveal direction="up" delay={75}>
        <QuotaDisplay initialQuota={currentQuota} onQuotaUpdate={setCurrentQuota} />
      </Reveal>

      {/* Single Generation Feedback Alert */}
      {generationFeedback && (
        <div
          className={`p-3.5 border font-mono text-mono-sm flex items-center justify-between gap-3 ${
            generationFeedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-telemetry-emerald/40 text-emerald-800 dark:text-telemetry-emerald"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-telemetry-rose/40 text-rose-800 dark:text-telemetry-rose"
          }`}
        >
          <div className="flex items-center gap-2">
            {generationFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{generationFeedback.message}</span>
            {generationFeedback.repoId && generationFeedback.type === "success" && (
              <Link
                href={`/dashboard/case-studies?repo=${generationFeedback.repoId}`}
                className="underline font-semibold ml-2 inline-flex items-center gap-1"
              >
                Open Dossier &rarr;
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setGenerationFeedback(null)}
            className="p-1 hover:opacity-75 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Bar: Search, Language Filter, Status Tabs, Sorting */}
      <Reveal direction="up" delay={100}>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-bone-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by repository name, description, or topic..."
                className="w-full h-10 pl-9 pr-9 text-xs font-mono bg-paper-sheet dark:bg-obsidian-void text-ink-primary dark:text-bone border border-hairline dark:border-obsidian-border rounded-none outline-none focus:border-ink-primary dark:focus:border-telemetry-cyan transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary dark:hover:text-bone"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Controls Right: Language Filter & Sort Selector */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Language Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase">
                  Lang:
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="h-9 px-2.5 text-xs font-mono bg-paper-sheet dark:bg-obsidian-void text-ink-primary dark:text-bone border border-hairline dark:border-obsidian-border rounded-none cursor-pointer outline-none focus:border-ink-primary dark:focus:border-telemetry-cyan"
                >
                  <option value="all">All Languages</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-9 px-2.5 text-xs font-mono bg-paper-sheet dark:bg-obsidian-void text-ink-primary dark:text-bone border border-hairline dark:border-obsidian-border rounded-none cursor-pointer outline-none focus:border-ink-primary dark:focus:border-telemetry-cyan"
                >
                  <option value="stars">Stars (High to Low)</option>
                  <option value="updated">Recently Updated</option>
                  <option value="commits">Total Commits</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sub-bar: Status Tabs & Bulk Action Controls */}
          <div className="hairline-t pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Inclusion Status Filter Tabs */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 font-mono text-mono-xs tracking-wider uppercase transition-colors ${
                  statusFilter === "all"
                    ? "bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold"
                    : "text-ink-secondary dark:text-bone-secondary hover:bg-paper-sheet dark:hover:bg-obsidian-panel"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("selected")}
                className={`px-3 py-1 font-mono text-mono-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                  statusFilter === "selected"
                    ? "bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold"
                    : "text-ink-secondary dark:text-bone-secondary hover:bg-paper-sheet dark:hover:bg-obsidian-panel"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-telemetry-cyan" />
                Included ({selectedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("unselected")}
                className={`px-3 py-1 font-mono text-mono-xs tracking-wider uppercase transition-colors ${
                  statusFilter === "unselected"
                    ? "bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold"
                    : "text-ink-secondary dark:text-bone-secondary hover:bg-paper-sheet dark:hover:bg-obsidian-panel"
                }`}
              >
                Excluded ({totalCount - selectedCount})
              </button>
            </div>

            {/* Bulk Selection Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
              <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase mr-1">
                Bulk:
              </span>
              <button
                type="button"
                onClick={() => handleBulkToggle(true)}
                disabled={isBulkPending || filteredRepos.length === 0}
                className="font-mono text-mono-xs px-2.5 py-1 hairline-all text-ink-secondary dark:text-bone-secondary hover:text-ink-primary dark:hover:text-bone hover:bg-paper-sheet dark:hover:bg-obsidian-panel transition-colors disabled:opacity-40"
              >
                Select Filtered ({filteredRepos.length})
              </button>
              <button
                type="button"
                onClick={() => handleBulkToggle(false)}
                disabled={isBulkPending || filteredRepos.length === 0}
                className="font-mono text-mono-xs px-2.5 py-1 hairline-all text-ink-secondary dark:text-bone-secondary hover:text-ink-primary dark:hover:text-bone hover:bg-paper-sheet dark:hover:bg-obsidian-panel transition-colors disabled:opacity-40"
              >
                Deselect Filtered
              </button>
              <div className="hairline-l pl-2 ml-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsBatchModalOpen(true)}
                  disabled={selectedCount === 0}
                  className="h-7 px-3 text-xs font-mono"
                  title="Run sequential AI generation on all selected repositories"
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Batch Generate ({selectedCount})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Main Repository List Table / Rows */}
      <Reveal direction="up" delay={150}>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card">
          {/* Table Header Row */}
          <div className="hairline-b px-4 sm:px-6 py-3 bg-paper-sheet/60 dark:bg-obsidian-panel/60 flex items-center justify-between text-mono-xs font-mono text-ink-muted dark:text-bone-muted tracking-wider uppercase">
            <div className="flex items-center gap-3">
              <span className="w-6 text-center">Inc</span>
              <span>Project Specification</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <span className="w-24 text-right">Metrics</span>
              <span className="w-24 text-right">Last Push</span>
              <span className="w-56 text-right">Dossier / Controls</span>
            </div>
          </div>

          {/* List Content */}
          {filteredRepos.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto hairline-all flex items-center justify-center text-ink-muted dark:text-bone-muted bg-paper-sheet dark:bg-obsidian-panel">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                No Repositories Match Filter Criteria
              </h3>
              <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary max-w-sm mx-auto">
                No repositories were found matching your current search query or filter selection.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage("all");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-hairline dark:divide-obsidian-border">
              {filteredRepos.map((repo) => {
                const isSelected = repo.isSelected;
                const isPending = pendingRepoIds.has(repo.id);
                const langColor =
                  (repo.primaryLanguage && GITHUB_LANGUAGE_COLORS[repo.primaryLanguage]) ||
                  (repo.language && GITHUB_LANGUAGE_COLORS[repo.language]) ||
                  "#888888";

                return (
                  <div
                    key={repo.id}
                    className={`group px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isSelected
                        ? "bg-paper-canvas hover:bg-paper-sheet/40 dark:bg-obsidian-card dark:hover:bg-obsidian-panel/40"
                        : "bg-paper-sheet/20 hover:bg-paper-sheet/50 dark:bg-obsidian-void/40 dark:hover:bg-obsidian-void/80 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* Left Section: Inclusion Checkbox + Repo Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Interactive Selection Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleSelection(repo)}
                        disabled={isPending}
                        title={
                          isSelected
                            ? "Included in portfolio — Click to exclude"
                            : "Excluded from portfolio — Click to include"
                        }
                        className={`mt-1 w-6 h-6 shrink-0 flex items-center justify-center border transition-all duration-150 rounded-none cursor-pointer ${
                          isSelected
                            ? "border-terracotta bg-terracotta text-white dark:border-telemetry-cyan dark:bg-telemetry-cyan dark:text-obsidian-void"
                            : "border-hairline hover:border-ink-primary dark:border-obsidian-border dark:hover:border-bone bg-transparent"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[2.5]" />}
                      </button>

                      {/* Details Area */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Title line + external link + language badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-mono-md font-semibold text-ink-primary dark:text-bone hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors flex items-center gap-1.5"
                          >
                            <span>{repo.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-ink-muted dark:text-bone-muted group-hover:text-terracotta dark:group-hover:text-telemetry-cyan" />
                          </Link>

                          {/* Language indicator */}
                          {(repo.primaryLanguage || repo.language) && (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-secondary dark:text-bone-secondary px-2 py-0.5 bg-paper-sheet dark:bg-obsidian-panel border border-hairline dark:border-obsidian-border">
                              <span
                                className="w-2 h-2 rounded-full inline-block shrink-0"
                                style={{ backgroundColor: langColor }}
                              />
                              {repo.primaryLanguage || repo.language}
                            </span>
                          )}

                          {/* Portfolio status tag */}
                          {isSelected ? (
                            <Badge variant="cyan" size="sm" dot>
                              PORTFOLIO
                            </Badge>
                          ) : (
                            <Badge variant="outline" size="sm">
                              EXCLUDED
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        {repo.description ? (
                          <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary line-clamp-2 max-w-2xl">
                            {repo.description}
                          </p>
                        ) : (
                          <p className="font-sans text-body-xs italic text-ink-muted dark:text-bone-muted">
                            No repository description provided on GitHub.
                          </p>
                        )}

                        {/* Topics strip */}
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {repo.topics.slice(0, 4).map((topic) => (
                              <span
                                key={topic}
                                className="font-mono text-[10px] text-ink-muted dark:text-bone-muted px-1.5 py-0.5 bg-paper-sheet/60 dark:bg-obsidian-void/60 border border-hairline/40 dark:border-obsidian-border/40"
                              >
                                #{topic}
                              </span>
                            ))}
                            {repo.topics.length > 4 && (
                              <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                                +{repo.topics.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section: Metrics, Push Date, Dossier Link */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline dark:border-obsidian-border">
                      {/* Metrics: Stars & Forks */}
                      <div className="w-24 text-left sm:text-right font-mono text-mono-sm text-ink-secondary dark:text-bone-secondary">
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="tabular-nums font-medium">{repo.stars}</span>
                        </div>
                        <div className="flex items-center sm:justify-end gap-1.5 text-mono-xs text-ink-muted dark:text-bone-muted">
                          <GitFork className="w-3 h-3" />
                          <span className="tabular-nums">{repo.forks} forks</span>
                        </div>
                      </div>

                      {/* Push timestamp */}
                      <div className="w-24 text-right font-mono text-mono-xs text-ink-muted dark:text-bone-muted">
                        <span className="block text-ink-secondary dark:text-bone-secondary font-medium">
                          {formatDate(repo.lastPushedAt)}
                        </span>
                        <span className="block text-[10px]">
                          {repo.commitCount > 0 ? `${repo.commitCount} commits` : "activity"}
                        </span>
                      </div>

                      {/* Dossier status badge & generation controls */}
                      <div className="w-56 text-right flex items-center justify-end gap-2">
                        {repo.hasCaseStudy ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateSingle(repo, true)}
                              disabled={generatingRepoIds.has(repo.id)}
                              className="h-7 px-2 font-mono text-[10px] tracking-wider uppercase"
                              title="Regenerate case study using Gemini AI"
                            >
                              {generatingRepoIds.has(repo.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <RefreshCw className="w-3 h-3 mr-1 text-terracotta dark:text-telemetry-cyan" />
                              )}
                              {generatingRepoIds.has(repo.id) ? "SYNTHESIZING" : "REGENERATE"}
                            </Button>
                            <Link
                              href={`/dashboard/case-studies?repo=${repo.id}`}
                              className="inline-flex items-center gap-1 font-mono text-[10px] text-terracotta dark:text-telemetry-cyan hover:underline tracking-wider uppercase px-1.5 py-1 shrink-0"
                            >
                              <FileText className="w-3 h-3" />
                              VIEW
                            </Link>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateSingle(repo, false)}
                            disabled={generatingRepoIds.has(repo.id)}
                            className="h-7 px-2.5 font-mono text-[10px] tracking-wider uppercase border-terracotta/40 dark:border-telemetry-cyan/40 text-terracotta dark:text-telemetry-cyan hover:bg-terracotta/10 dark:hover:bg-telemetry-cyan/10"
                            title="Generate recruiter-ready case study using Gemini AI"
                          >
                            {generatingRepoIds.has(repo.id) ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <Sparkles className="w-3 h-3 mr-1" />
                            )}
                            {generatingRepoIds.has(repo.id) ? "SYNTHESIZING" : "GENERATE"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Ribbon with Inventory Summary */}
          <div className="hairline-t px-6 py-3.5 bg-paper-sheet/40 dark:bg-obsidian-panel/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-mono-xs text-ink-muted dark:text-bone-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-telemetry-cyan" />
              <span>
                Displaying {filteredRepos.length} of {totalCount} total indexed repositories
              </span>
            </div>
            <div className="tracking-wider uppercase">
              § PORTFOLIO SYNDICATION STATE:{" "}
              <span className="text-ink-primary dark:text-bone font-medium">
                {selectedCount} PUBLISHED TO VITRINE
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Batch Generation Modal */}
      <BatchGeneratorModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        selectedRepos={repos.filter((r) => r.isSelected)}
        onRepoStatusUpdate={(repoId, hasCs) => {
          setRepos((prev) =>
            prev.map((r) => (r.id === repoId ? { ...r, hasCaseStudy: hasCs } : r)),
          );
        }}
        onQuotaRefresh={async () => {
          try {
            const res = await getGeminiQuotaStatusAction();
            if (res.success) setCurrentQuota(res.quota);
          } catch {
            // Handled
          }
        }}
      />
    </div>
  );
}
