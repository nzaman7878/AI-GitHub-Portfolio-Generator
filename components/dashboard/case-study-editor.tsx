"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Edit3,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
  RotateCcw,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Cpu,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Badge, TechBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal, TelemetryDot } from "@/components/ui/motion";
import { GITHUB_LANGUAGE_COLORS } from "@/lib/github/languages";
import {
  updateCaseStudyAction,
  generateCaseStudyAction,
  type UserCaseStudyItem,
} from "@/actions/generate";
import type { SerializedCaseStudy } from "@/types/ai";
import { cn } from "@/lib/utils";

export interface CaseStudyEditorProps {
  initialItems?: UserCaseStudyItem[];
  preselectedRepoId?: string | null;
  isAuthenticated?: boolean;
}

// Sample fallback case studies for demo mode
const DEMO_ITEMS: UserCaseStudyItem[] = [
  {
    repo: {
      id: "demo-repo-1",
      name: "distributed-cache-engine",
      fullName: "engineering/distributed-cache-engine",
      language: "Go",
      primaryLanguage: "Go",
      stars: 342,
      description:
        "High-throughput, in-memory distributed key-value store with consistent hashing, raft consensus replication, and sub-millisecond p99 latency.",
      htmlUrl: "https://github.com",
      topics: ["distributed-systems", "raft", "go", "high-performance"],
      commitCount: 428,
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    caseStudy: {
      id: "demo-cs-1",
      repoId: "demo-repo-1",
      title: "Building a Fault-Tolerant Distributed In-Memory Cache with Raft Consensus in Go",
      subtitle:
        "Achieving Sub-Millisecond p99 Latency Across 5-Node Clusters with Zero-Allocation Deserialization",
      summary:
        "Designed and implemented a distributed, memory-efficient key-value storage engine in Go. Leveraged consistent hashing with virtual nodes to distribute keys across cluster nodes and integrated a customized Raft state machine to guarantee strict linearizable consistency during partition events.",
      problemStatement:
        "Standard off-the-shelf caches faced high garbage collection pause spikes under heavy write pressure (80k ops/sec), resulting in unacceptable tail latencies for our real-time telemetry pipeline.",
      approach:
        "Engineered an arena memory allocator and flat buffer binary encoding to eliminate dynamic heap allocations in hot read/write paths, combined with a pipelined Raft heartbeat mechanism.",
      architecture:
        "The system consists of a Client Multiplexer layer, a Partition Director utilizing xxHash ring hashing, a Raft Consensus Log Engine written on top of memory-mapped append logs, and an in-memory B-Tree index with read-copy-update semantics.",
      impact:
        "Reduced p99 tail latency from 14.2ms to 0.85ms while scaling sustained write throughput to 120,000 requests per second across a 5-node cluster.",
      keyDecisions: [
        {
          decision: "Arena Allocation over standard sync.Pool",
          rationale:
            "Eliminated GC sweep pauses by allocating memory blocks in 64MB arenas freed in bulk.",
          tradeOff:
            "Increased overall baseline memory footprint by ~15% to retain reserved arena pages.",
        },
        {
          decision: "xxHash for Virtual Node Ring",
          rationale:
            "Provides superior distribution balance and 4x faster hash throughput compared to SHA-256.",
          tradeOff:
            "Non-cryptographic hash function; unsuitable for hostile untrusted keys without HMAC salts.",
        },
      ],
      techStack: ["Go", "Raft", "Consistent Hashing", "gRPC", "Protobuf", "Linux Epoll"],
      highlights: [
        "Sustained 120,000 write ops/sec with sub-millisecond p99 latency under synthetic load",
        "Zero-allocation binary wire protocol using memory arena slicing",
        "Deterministic leader election and failover in under 250 milliseconds during network partitions",
        "Comprehensive Jepsen-style automated fault injection test suite",
      ],
      challengesSolved:
        "Solved stop-the-world Go runtime garbage collection spikes through off-heap memory management and byte slice pooling.",
      impactMetrics: [
        { metric: "p99 Latency", value: "< 0.85 ms" },
        { metric: "Throughput", value: "120k req/s" },
        { metric: "Failover Time", value: "< 250 ms" },
      ],
      promptVersion: "v1.0",
      isPublished: true,
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    repo: {
      id: "demo-repo-2",
      name: "neural-ast-optimizer",
      fullName: "engineering/neural-ast-optimizer",
      language: "Rust",
      primaryLanguage: "Rust",
      stars: 215,
      description:
        "Compiles TypeScript ASTs to optimized WebAssembly modules with automated loop vectorization and speculative dead-code elimination.",
      htmlUrl: "https://github.com",
      topics: ["compiler", "rust", "webassembly", "optimization"],
      commitCount: 312,
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
    caseStudy: {
      id: "demo-cs-2",
      repoId: "demo-repo-2",
      title: "Optimizing TypeScript AST Compilation to WebAssembly via SSA Transformation in Rust",
      subtitle:
        "Static Analysis Engine Performing Speculative Type Specialization and Vectorized Code Generation",
      summary:
        "Built a multi-pass optimizing intermediate representation (IR) compiler in Rust that parses TypeScript abstract syntax trees and emits optimized WebAssembly bytecode. Includes dead-code elimination, loop unrolling, and SIMD instruction mapping.",
      problemStatement:
        "Interpreting dynamic scripts in resource-constrained edge environments suffered from high startup latency and memory overhead.",
      approach:
        "Mapped high-level typed AST nodes to a Static Single Assignment (SSA) form in Rust, enabling aggressive compiler optimization passes before binary codegen.",
      architecture:
        "Lexer & Parser feeding an SSA Control Flow Graph (CFG) builder, an optimization pipeline (DCE, GVN, SCCP), and a Cranelift/Wasm codegen backend.",
      impact:
        "Delivered a 3.4x execution speedup over baseline V8 execution for numeric compute kernels.",
      keyDecisions: [
        {
          decision: "SSA Form Intermediate Representation",
          rationale:
            "Enabled standard compiler textbook optimizations like Sparse Conditional Constant Propagation.",
          tradeOff:
            "Significantly higher compiler implementation complexity and phi-node placement bookkeeping.",
        },
      ],
      techStack: ["Rust", "WebAssembly", "Cranelift", "SSA Form", "LLVM", "Compiler Design"],
      highlights: [
        "3.4x execution speedup for matrix arithmetic and data transformation loops",
        "Deterministic single-pass register allocator minimizing stack spills",
        "Comprehensive round-trip validation using WebAssembly test suites",
      ],
      challengesSolved:
        "Handled TypeScript's dynamic duck-typing constraints through profile-guided monomorphic inline caches.",
      impactMetrics: [
        { metric: "Execution Speedup", value: "3.4x" },
        { metric: "Memory Footprint", value: "-45%" },
        { metric: "Binary Size", value: "180 KB" },
      ],
      promptVersion: "v1.0",
      isPublished: true,
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    repo: {
      id: "demo-repo-3",
      name: "event-stream-gateway",
      fullName: "engineering/event-stream-gateway",
      language: "TypeScript",
      primaryLanguage: "TypeScript",
      stars: 189,
      description:
        "Enterprise WebSocket and SSE multiplexer handling 100k concurrent telemetry connections with backpressure control and Redis streams backing.",
      htmlUrl: "https://github.com",
      topics: ["websockets", "telemetry", "streaming"],
      commitCount: 195,
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    },
    caseStudy: null,
  },
];

export function CaseStudyEditor({
  initialItems = [],
  preselectedRepoId,
  isAuthenticated = false,
}: CaseStudyEditorProps) {
  const isDemo = initialItems.length === 0;
  const [items, setItems] = React.useState<UserCaseStudyItem[]>(isDemo ? DEMO_ITEMS : initialItems);

  // Sync state with props
  const [prevInitialItems, setPrevInitialItems] = React.useState(initialItems);
  if (initialItems !== prevInitialItems) {
    setPrevInitialItems(initialItems);
    if (initialItems.length > 0) {
      setItems(initialItems);
    }
  }

  // Currently active repository selection
  const [selectedRepoId, setSelectedRepoId] = React.useState<string>(() => {
    if (preselectedRepoId && items.some((i) => i.repo.id === preselectedRepoId)) {
      return preselectedRepoId;
    }
    return items[0]?.repo.id ?? "";
  });

  const activeItem = items.find((i) => i.repo.id === selectedRepoId) ?? items[0];
  const activeCaseStudy = activeItem?.caseStudy ?? null;

  // Inline editing state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState("");
  const [editSubtitle, setEditSubtitle] = React.useState("");
  const [editSummary, setEditSummary] = React.useState("");
  const [editHighlights, setEditHighlights] = React.useState<string[]>([]);
  const [editPublished, setEditPublished] = React.useState(true);
  const [newHighlightInput, setNewHighlightInput] = React.useState("");

  // Action status state
  const [isSaving, setIsSaving] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<{
    type: "success" | "error";
    message: string;
    timestamp?: string;
  } | null>(null);

  // Synchronize edit fields when active case study changes
  const [prevCaseStudyId, setPrevCaseStudyId] = React.useState<string | null>(null);
  const currentCaseStudyId = activeCaseStudy?.id ?? null;
  if (currentCaseStudyId !== prevCaseStudyId) {
    setPrevCaseStudyId(currentCaseStudyId);
    if (activeCaseStudy) {
      setEditTitle(activeCaseStudy.title);
      setEditSubtitle(activeCaseStudy.subtitle || "");
      setEditSummary(activeCaseStudy.summary);
      setEditHighlights([...activeCaseStudy.highlights]);
      setEditPublished(activeCaseStudy.isPublished);
      setIsEditing(false);
      setSaveStatus(null);
    }
  }

  // Handle saving overrides
  const handleSaveOverrides = async () => {
    if (!activeCaseStudy) return;

    setIsSaving(true);
    setSaveStatus(null);

    const updatedData: Partial<SerializedCaseStudy> = {
      title: editTitle.trim(),
      subtitle: editSubtitle.trim() || null,
      summary: editSummary.trim(),
      highlights: editHighlights.filter((h) => h.trim().length > 0),
      isPublished: editPublished,
    };

    // If demo mode or test record, update locally
    if (isDemo || activeCaseStudy.id.startsWith("demo-")) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.repo.id === activeItem?.repo.id && item.caseStudy) {
            return {
              ...item,
              caseStudy: {
                ...item.caseStudy,
                ...updatedData,
                updatedAt: new Date().toISOString(),
              } as SerializedCaseStudy,
            };
          }
          return item;
        }),
      );
      setIsSaving(false);
      setIsEditing(false);
      setSaveStatus({
        type: "success",
        message: "Dossier overrides saved successfully (Demo Mode)",
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    try {
      const res = await updateCaseStudyAction({
        caseStudyId: activeCaseStudy.id,
        title: updatedData.title,
        subtitle: updatedData.subtitle,
        summary: updatedData.summary,
        highlights: updatedData.highlights,
        isPublished: updatedData.isPublished,
      });

      if (res.success) {
        setItems((prev) =>
          prev.map((item) => {
            if (item.repo.id === activeItem?.repo.id) {
              return {
                ...item,
                caseStudy: res.caseStudy,
              };
            }
            return item;
          }),
        );
        setIsEditing(false);
        setSaveStatus({
          type: "success",
          message: "Dossier overrides committed to PostgreSQL",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setSaveStatus({
          type: "error",
          message: res.error || "Failed to save overrides.",
        });
      }
    } catch {
      setSaveStatus({
        type: "error",
        message: "An unexpected network error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add new highlight bullet
  const handleAddHighlight = () => {
    if (!newHighlightInput.trim()) return;
    setEditHighlights((prev) => [...prev, newHighlightInput.trim()]);
    setNewHighlightInput("");
  };

  // Remove highlight bullet
  const handleRemoveHighlight = (idx: number) => {
    setEditHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  // Revert back to original AI draft
  const handleResetToDraft = () => {
    if (!activeCaseStudy) return;
    setEditTitle(activeCaseStudy.title);
    setEditSubtitle(activeCaseStudy.subtitle || "");
    setEditSummary(activeCaseStudy.summary);
    setEditHighlights([...activeCaseStudy.highlights]);
    setEditPublished(activeCaseStudy.isPublished);
  };

  // Trigger AI generation if case study is missing
  const handleGenerateCaseStudy = async () => {
    if (!activeItem) return;

    setIsGenerating(true);
    setSaveStatus(null);

    // If demo mode, populate a demo case study
    if (isDemo || activeItem.repo.id.startsWith("demo-")) {
      setTimeout(() => {
        const generated: SerializedCaseStudy = {
          id: `demo-cs-${Date.now()}`,
          repoId: activeItem.repo.id,
          title: `Architectural Blueprint for ${activeItem.repo.name}`,
          subtitle: `Telemetry & Stream Multiplexing Engine Implemented in ${activeItem.repo.primaryLanguage || "TypeScript"}`,
          summary: `High-availability event gateway engineered to terminate 100,000 concurrent client streams with continuous backpressure propagation and Redis cluster replication.`,
          problemStatement: `Connection exhaustion and unbuffered memory growth under thundering herd reconnect storms degraded core API gateway availability.`,
          approach: `Implemented an asynchronous epoll event reactor loop with per-socket token bucket rate limiting and non-blocking stream multiplexing.`,
          architecture: `Edge Load Balancer -> WebSocket Multiplexer Node -> Redis Stream Shards -> Downstream Consumer Workers.`,
          impact: `Eliminated connection dropouts during network rebalancing while reducing memory utilization by 40%.`,
          keyDecisions: [
            {
              decision: "Backpressure-controlled Socket Buffering",
              rationale: "Prevents memory bloat during slow client network degradation.",
              tradeOff: "Drops non-critical telemetry frames when buffer threshold is breached.",
            },
          ],
          techStack: [
            activeItem.repo.primaryLanguage || "TypeScript",
            "Redis Streams",
            "WebSockets",
            "Event Loop Optimization",
          ],
          highlights: [
            "Handled 100k concurrent client streams without socket exhaustion",
            "Sub-10ms event dissemination across geographically distributed worker nodes",
            "Zero-loss reconnect recovery using Redis stream sequence checkpoints",
          ],
          challengesSolved:
            "Overcame OS socket file descriptor exhaustion via kernel epoll tuning and socket connection pooling.",
          impactMetrics: [
            { metric: "Concurrent Streams", value: "100,000" },
            { metric: "Dissemination Latency", value: "< 10ms" },
          ],
          promptVersion: "v1.0",
          isPublished: true,
          generatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setItems((prev) =>
          prev.map((i) => (i.repo.id === activeItem.repo.id ? { ...i, caseStudy: generated } : i)),
        );
        setIsGenerating(false);
        setSaveStatus({
          type: "success",
          message: "AI Dossier synthesized successfully (Demo Mode)",
          timestamp: new Date().toLocaleTimeString(),
        });
      }, 1500);
      return;
    }

    try {
      const res = await generateCaseStudyAction({
        repoId: activeItem.repo.id,
        forceRegenerate: true,
      });

      if (res.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.repo.id === activeItem.repo.id ? { ...i, caseStudy: res.caseStudy } : i,
          ),
        );
        setSaveStatus({
          type: "success",
          message: `AI Dossier generated via Gemini (${res.tokensUsed} tokens in ${res.durationMs}ms)`,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setSaveStatus({
          type: "error",
          message: res.error || "Failed to generate case study via Gemini.",
        });
      }
    } catch {
      setSaveStatus({
        type: "error",
        message: "Failed to generate case study. Please check your Gemini API quota.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Dossier Identity Ribbon */}
      <Reveal direction="up" delay={50}>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <TelemetryDot status="cyan" size="sm" pulse />
                <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
                  § 03.1 CASE STUDY DOSSIERS
                </span>
                <Badge variant={isDemo ? "outline" : "cyan"} size="sm" dot>
                  {isDemo ? (isAuthenticated ? "PREVIEW MODE" : "DEMO VITRINE") : "PRODUCTION"}
                </Badge>
              </div>
              <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
                Case Study Preview & Overrides
              </h1>
              <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary max-w-xl">
                Review synthesized architectural case studies. Make manual overrides to titles,
                executive summaries, and engineering highlights before publishing to your public
                portfolio.
              </p>
            </div>

            {/* Save Status / Live Feedback */}
            {saveStatus && (
              <div
                className={cn(
                  "p-3 border font-mono text-mono-xs flex items-center justify-between gap-3 shadow-planar dark:shadow-planar-dark",
                  saveStatus.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-telemetry-emerald/40 text-emerald-800 dark:text-telemetry-emerald"
                    : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-telemetry-rose/40 text-rose-800 dark:text-telemetry-rose",
                )}
              >
                <div className="flex items-center gap-2">
                  {saveStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{saveStatus.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveStatus(null)}
                  className="p-1 hover:opacity-75"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* Main Two-Column Layout: Left Repo Selector, Right Dossier Viewer/Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Repository Navigation Strip (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-4">
            <div className="flex items-center justify-between pb-3 hairline-b mb-3">
              <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-wider">
                Select Project ({items.length})
              </span>
              <span className="font-mono text-[10px] text-terracotta dark:text-telemetry-cyan uppercase">
                {items.filter((i) => Boolean(i.caseStudy)).length} Ready
              </span>
            </div>

            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
              {items.map((item) => {
                const isSelected = item.repo.id === activeItem?.repo.id;
                const hasDossier = Boolean(item.caseStudy);
                const langColor =
                  (item.repo.primaryLanguage &&
                    GITHUB_LANGUAGE_COLORS[item.repo.primaryLanguage]) ||
                  (item.repo.language && GITHUB_LANGUAGE_COLORS[item.repo.language]) ||
                  "#888888";

                return (
                  <button
                    key={item.repo.id}
                    type="button"
                    onClick={() => {
                      setSelectedRepoId(item.repo.id);
                      setIsEditing(false);
                      setSaveStatus(null);
                    }}
                    className={cn(
                      "w-full text-left p-3 border transition-all duration-150 flex flex-col gap-1.5 rounded-none cursor-pointer",
                      isSelected
                        ? "border-terracotta dark:border-telemetry-cyan bg-paper-sheet/80 dark:bg-obsidian-panel shadow-planar dark:shadow-planar-dark"
                        : "border-hairline dark:border-obsidian-border hover:bg-paper-sheet/40 dark:hover:bg-obsidian-panel/40 bg-transparent",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone truncate">
                        {item.repo.name}
                      </span>
                      {hasDossier ? (
                        <Badge variant="cyan" size="sm">
                          DOSSIER
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          DRAFT PENDING
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-mono-xs font-mono text-ink-muted dark:text-bone-muted pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ backgroundColor: langColor }}
                        />
                        {item.repo.primaryLanguage || item.repo.language || "Code"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {item.repo.stars}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Study Dossier Preview / Inline Editor (8 Cols) */}
        <div className="lg:col-span-8">
          {activeCaseStudy ? (
            <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card">
              {/* Dossier Top Bar */}
              <div className="hairline-b px-6 py-3.5 bg-paper-sheet/60 dark:bg-obsidian-panel/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-wider">
                    {`§ SPEC REF: ${activeCaseStudy.promptVersion.toUpperCase()} // ${activeItem?.repo.name ?? ""}`}
                  </span>
                  <Badge variant={editPublished ? "success" : "outline"} size="sm" dot>
                    {editPublished ? "PUBLISHED" : "DRAFT"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={activeItem?.repo.htmlUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-ink-muted hover:text-ink-primary dark:hover:text-bone transition-colors"
                    title="View GitHub Repository"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Regenerate AI Dossier Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateCaseStudy()}
                    disabled={isGenerating || isSaving}
                    leftIcon={
                      isGenerating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
                      )
                    }
                    title="Regenerate case study using Gemini AI analysis"
                  >
                    {isGenerating ? "Synthesizing..." : "Regenerate"}
                  </Button>

                  {/* Toggle Edit Mode */}
                  <Button
                    variant={isEditing ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (!isEditing) {
                        setIsEditing(true);
                      } else {
                        handleResetToDraft();
                        setIsEditing(false);
                      }
                    }}
                    leftIcon={
                      isEditing ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <Edit3 className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {isEditing ? "Preview Mode" : "Edit Dossier"}
                  </Button>
                </div>
              </div>

              {/* Dossier Content Area */}
              <div className="p-6 space-y-6">
                {isEditing ? (
                  /* ══════════════════════════════════════════════════
                     INLINE EDITING MODE (User Overrides)
                     ══════════════════════════════════════════════════ */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 hairline-b">
                      <div>
                        <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                          Manual Overrides
                        </h2>
                        <p className="font-sans text-body-xs text-ink-muted dark:text-bone-muted">
                          Adjust title, executive summary, and key highlights. Changes are saved as
                          permanent overrides.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 font-mono text-mono-xs text-ink-primary dark:text-bone cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editPublished}
                            onChange={(e) => setEditPublished(e.target.checked)}
                            className="rounded-none border-hairline accent-terracotta dark:accent-telemetry-cyan"
                          />
                          <span>Publicly Visible</span>
                        </label>
                      </div>
                    </div>

                    {/* Edit: Title */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider">
                        Case Study Title
                      </label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter architectural case study title..."
                        className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone"
                      />
                    </div>

                    {/* Edit: Subtitle */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider">
                        Editorial Subtitle / Tagline
                      </label>
                      <Input
                        value={editSubtitle}
                        onChange={(e) => setEditSubtitle(e.target.value)}
                        placeholder="High-signal technical descriptor..."
                        className="font-mono text-mono-sm text-ink-secondary dark:text-bone-secondary"
                      />
                    </div>

                    {/* Edit: Executive Summary */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider">
                        Executive Summary
                      </label>
                      <Textarea
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        rows={4}
                        placeholder="Detailed technical summary of engineering problems and architectural solutions..."
                        className="font-sans text-body-sm leading-relaxed"
                      />
                    </div>

                    {/* Edit: Key Highlights (Bullet Points) */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block font-mono text-mono-xs text-ink-secondary dark:text-bone-secondary uppercase tracking-wider">
                          Engineering Highlights ({editHighlights.length})
                        </label>
                        <span className="font-mono text-[10px] text-ink-muted dark:text-bone-muted">
                          Bullet points for portfolio cards
                        </span>
                      </div>

                      {/* Current Highlights List */}
                      <div className="space-y-2">
                        {editHighlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2.5 border border-hairline dark:border-obsidian-border bg-paper-sheet/40 dark:bg-obsidian-panel/40"
                          >
                            <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan font-bold mt-0.5">
                              0{idx + 1}.
                            </span>
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const updated = [...editHighlights];
                                updated[idx] = e.target.value;
                                setEditHighlights(updated);
                              }}
                              className="w-full text-xs font-sans bg-transparent text-ink-primary dark:text-bone outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHighlight(idx)}
                              className="p-1 text-ink-muted hover:text-rose-600 transition-colors"
                              title="Delete highlight"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Highlight Field */}
                      <div className="flex items-center gap-2 pt-1">
                        <Input
                          value={newHighlightInput}
                          onChange={(e) => setNewHighlightInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddHighlight();
                            }
                          }}
                          placeholder="Add a new engineering highlight or metric..."
                          className="text-xs font-sans"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={handleAddHighlight}
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Editor Action Buttons */}
                    <div className="pt-4 hairline-t flex flex-wrap items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetToDraft}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Reset to Draft
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => {
                            handleResetToDraft();
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleSaveOverrides}
                          isLoading={isSaving}
                          leftIcon={<Check className="w-4 h-4" />}
                        >
                          {isSaving ? "Saving..." : "Save Overrides"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ══════════════════════════════════════════════════
                     PREVIEW MODE (Technical Monograph Dossier)
                     ══════════════════════════════════════════════════ */
                  <div className="space-y-8">
                    {/* Header: Title & Subtitle */}
                    <div className="space-y-2">
                      <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
                        {activeCaseStudy.title}
                      </h1>
                      {activeCaseStudy.subtitle && (
                        <p className="font-mono text-mono-sm text-ink-secondary dark:text-bone-secondary italic">
                          {activeCaseStudy.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Executive Summary */}
                    <div className="p-4 border border-hairline dark:border-obsidian-border bg-paper-sheet/40 dark:bg-obsidian-panel/40">
                      <span className="block font-mono text-[10px] text-ink-muted dark:text-bone-muted uppercase tracking-widest mb-1.5">
                        § EXECUTIVE ARCHITECTURAL SUMMARY
                      </span>
                      <p className="font-sans text-body-md text-ink-primary dark:text-bone leading-relaxed">
                        {activeCaseStudy.summary}
                      </p>
                    </div>

                    {/* Problem Statement & Architecture Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Problem Statement */}
                      <div className="p-4 border border-hairline dark:border-obsidian-border space-y-2">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-terracotta dark:text-telemetry-cyan" />
                          <span className="font-mono text-mono-xs font-semibold text-ink-primary dark:text-bone uppercase tracking-wider">
                            Problem Statement
                          </span>
                        </div>
                        <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary">
                          {activeCaseStudy.problemStatement}
                        </p>
                      </div>

                      {/* Architecture */}
                      <div className="p-4 border border-hairline dark:border-obsidian-border space-y-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-terracotta dark:text-telemetry-cyan" />
                          <span className="font-mono text-mono-xs font-semibold text-ink-primary dark:text-bone uppercase tracking-wider">
                            System Architecture
                          </span>
                        </div>
                        <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary">
                          {activeCaseStudy.architecture}
                        </p>
                      </div>
                    </div>

                    {/* Engineering Highlights */}
                    {activeCaseStudy.highlights && activeCaseStudy.highlights.length > 0 && (
                      <div className="space-y-3">
                        <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-widest block">
                          § KEY ENGINEERING HIGHLIGHTS
                        </span>
                        <div className="space-y-2">
                          {activeCaseStudy.highlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="p-3 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void flex items-start gap-3"
                            >
                              <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan font-bold mt-0.5">
                                0{idx + 1}.
                              </span>
                              <p className="font-sans text-body-sm text-ink-primary dark:text-bone">
                                {highlight}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Engineering Decisions Table */}
                    {activeCaseStudy.keyDecisions && activeCaseStudy.keyDecisions.length > 0 && (
                      <div className="space-y-3">
                        <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-widest block">
                          § ARCHITECTURAL TRADE-OFFS & DECISIONS
                        </span>
                        <div className="border border-hairline dark:border-obsidian-border divide-y divide-hairline dark:divide-obsidian-border">
                          {activeCaseStudy.keyDecisions.map((decision, idx) => (
                            <div key={idx} className="p-4 space-y-1.5">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-telemetry-emerald shrink-0" />
                                <span className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone">
                                  {decision.decision}
                                </span>
                              </div>
                              <p className="font-sans text-body-xs text-ink-secondary dark:text-bone-secondary">
                                <strong className="font-mono uppercase text-[10px] text-ink-muted dark:text-bone-muted">
                                  Rationale:{" "}
                                </strong>
                                {decision.rationale}
                              </p>
                              <p className="font-sans text-body-xs text-ink-muted dark:text-bone-muted italic">
                                <strong className="font-mono uppercase text-[10px] not-italic">
                                  Trade-off:{" "}
                                </strong>
                                {decision.tradeOff}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack Pills Strip */}
                    {activeCaseStudy.techStack && activeCaseStudy.techStack.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-widest block">
                          § VERIFIED TECHNOLOGY STACK
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeCaseStudy.techStack.map((tech) => (
                            <TechBadge key={tech} name={tech} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Impact Metrics Strip */}
                    {activeCaseStudy.impactMetrics && activeCaseStudy.impactMetrics.length > 0 && (
                      <div className="hairline-t pt-4 flex flex-wrap items-center gap-6 font-mono text-mono-sm">
                        <div className="flex items-center gap-2 text-ink-muted dark:text-bone-muted">
                          <TrendingUp className="w-4 h-4 text-terracotta dark:text-telemetry-cyan" />
                          <span className="text-[10px] uppercase tracking-wider">
                            Measured Impact:
                          </span>
                        </div>
                        {activeCaseStudy.impactMetrics.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-ink-secondary dark:text-bone-secondary text-mono-xs">
                              {m.metric}:
                            </span>
                            <span className="font-semibold text-ink-primary dark:text-bone tabular-nums">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════
               EMPTY STATE: No Case Study Generated for this Repo
               ══════════════════════════════════════════════════ */
            <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto hairline-all flex items-center justify-center text-ink-muted dark:text-bone-muted bg-paper-sheet dark:bg-obsidian-panel">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-serif text-heading-lg font-medium text-ink-primary dark:text-bone">
                  No Case Study Generated for {activeItem?.repo.name}
                </h3>
                <p className="font-sans text-body-sm text-ink-secondary dark:text-bone-secondary">
                  Synthesize an architectural case study from this repository using Gemini AI. The
                  model analyzes commit messages, directory architecture, and code metrics.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerateCaseStudy}
                  isLoading={isGenerating}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {isGenerating ? "Synthesizing Dossier..." : "Generate Case Study with Gemini"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
