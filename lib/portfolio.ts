import { db } from "@/lib/db";
import { GITHUB_LANGUAGE_COLORS } from "@/lib/github/languages";
import type {
  FullPortfolioData,
  PortfolioCaseStudy,
  PortfolioRepoItem,
  LanguageStat,
  UserPortfolioProfile,
  PortfolioTheme,
} from "@/types/portfolio";
import type { DisplayPreferences, ThemeMode } from "@/types/settings";
import type { KeyDecision, ImpactMetric } from "@/types/ai";

const DEFAULT_DISPLAY_PREFERENCES: DisplayPreferences = {
  showBio: true,
  showStats: true,
  showTechStack: true,
  showCaseStudies: true,
  showAllRepos: true,
  showContact: true,
};

export const DEMO_PORTFOLIO_DATA: FullPortfolioData = {
  user: {
    id: "demo-user-alexchen",
    username: "alexchen",
    name: "Alex Chen",
    headline: "Staff Distributed Systems Engineer & Open Source Core Contributor",
    bio: "Specializing in high-throughput asynchronous consensus engines, compiler optimization passes, and sub-millisecond telemetry pipelines. Author of high-performance distributed systems primitives.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    location: "San Francisco, CA",
    websiteUrl: "https://chen.engineering",
    portfolioSlug: "alexchen",
    theme: "editorial",
    themeMode: "system",
  },
  caseStudies: [
    {
      id: "demo-cs-1",
      repoId: "demo-repo-1",
      repoName: "distributed-cache-engine",
      repoUrl: "https://github.com",
      stars: 342,
      forks: 48,
      primaryLanguage: "Go",
      title: "Consensus-Driven Replication for In-Memory Storage",
      subtitle: "Sub-millisecond p99 latency key-value store with Raft partition groups",
      summary:
        "High-throughput, in-memory distributed key-value store engineered with multi-Raft partition consensus, zero-copy socket IO, and strict linearizability under high-concurrency partition failovers.",
      problemStatement:
        "Existing storage nodes suffered from network partition split-brains and garbage collection pauses, driving p99 write latencies past 450ms during cluster failover storms.",
      approach:
        "Architected multi-Raft partition groups with asynchronous batch replication, ring-buffer WAL logging, and off-heap memory arena allocators.",
      architecture:
        "Ingress Telemetry Gateway -> Multi-Raft Consensus Routers -> WAL Log Segment Disks -> Memory Ring Buffers -> Secondary Replicas.",
      impact:
        "Reduced cluster p99 write latency from 450ms down to 850μs while eliminating data loss across simulated split-brain network failures.",
      keyDecisions: [
        {
          decision: "Multi-Raft Consensus Sharding",
          rationale: "Prevents global lock contention across high-cardinality keyspaces.",
          tradeOff: "Requires two-phase commit coordination for cross-partition transactions.",
        },
        {
          decision: "Off-Heap Ring Buffer Memory Allocator",
          rationale: "Eliminated Go runtime garbage collection pauses during burst writes.",
          tradeOff: "Requires manual memory lifecycle management and bounds verification.",
        },
      ],
      techStack: ["Go", "Raft Consensus", "eBPF", "gRPC", "Prometheus", "Linux Kernel"],
      highlights: [
        "Sustained 200,000 requests/sec with sub-millisecond p99 linearizable writes",
        "Deterministic recovery under network partition chaos experiments in <1.2s",
        "Adopted across 14 production infrastructure clusters",
      ],
      challengesSolved:
        "Resolved Linux kernel epoll socket starvation by implementing round-robin work-stealing event reactors.",
      impactMetrics: [
        { metric: "p99 Latency", value: "850μs" },
        { metric: "Throughput", value: "200k req/s" },
        { metric: "Data Loss", value: "0.00%" },
      ],
      promptVersion: "v1.0",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      isPublished: true,
    },
    {
      id: "demo-cs-2",
      repoId: "demo-repo-2",
      repoName: "neural-ast-optimizer",
      repoUrl: "https://github.com",
      stars: 215,
      forks: 31,
      primaryLanguage: "Rust",
      title: "Autonomous Bytecode Vectorization & Dead Code Elimination",
      subtitle: "Compiles TypeScript ASTs to optimized WebAssembly modules",
      summary:
        "Compiles TypeScript ASTs into SIMD-accelerated WebAssembly modules with automated loop vectorization, memory locality optimizations, and speculative branch prediction.",
      problemStatement:
        "Large-scale browser telemetry processing scripts were bottlenecked on JavaScript V8 execution speeds, maxing out CPU cores on edge devices.",
      approach:
        "Built a multi-pass optimizing compiler in Rust that parses ASTs, constructs static single assignment (SSA) graphs, and lowers them to vectorized WebAssembly.",
      architecture:
        "TypeScript Source -> Tree-Sitter Parser -> SSA Intermediate Representation -> LLVM Vectorizer -> WebAssembly Binary.",
      impact:
        "Delivered a 4.2x compute speedup on numerical vector calculations while reducing client bundle footprints by 58%.",
      keyDecisions: [
        {
          decision: "Static Single Assignment (SSA) Representation",
          rationale: "Allows aggressive dead-code elimination and register allocation passes.",
          tradeOff: "Increased compiler compilation time by 18%.",
        },
      ],
      techStack: ["Rust", "WebAssembly", "LLVM", "TypeScript", "SIMD"],
      highlights: [
        "4.2x performance speedup compared to standard V8 runtime execution",
        "Automated SIMD-128 loop vectorization on modern ARM and x86 hardware",
        "Zero runtime dependencies in generated WebAssembly outputs",
      ],
      challengesSolved:
        "Overcame WebAssembly memory fragmentation through a bump-allocated memory pool layout.",
      impactMetrics: [
        { metric: "Execution Speedup", value: "4.2x" },
        { metric: "Binary Footprint", value: "-58%" },
      ],
      promptVersion: "v1.0",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      isPublished: true,
    },
    {
      id: "demo-cs-3",
      repoId: "demo-repo-3",
      repoName: "event-stream-gateway",
      repoUrl: "https://github.com",
      stars: 189,
      forks: 24,
      primaryLanguage: "TypeScript",
      title: "Real-time Telemetry Multiplexer & Backpressure Gateway",
      subtitle: "100k concurrent WebSocket & SSE stream broker backed by Redis Streams",
      summary:
        "Enterprise WebSocket and SSE multiplexer handling 100,000 concurrent client telemetry connections with reactive backpressure control, zero socket exhaustion, and Redis streams replication.",
      problemStatement:
        "Thundering herd client reconnect storms overwhelmed gateway socket buffers, causing cascading socket drops across downstream microservices.",
      approach:
        "Implemented reactive stream buffers with client windowing, token bucket rate limiting, and Redis stream checkpointing.",
      architecture:
        "Client Sockets -> Edge Gateway Multiplexer -> Ring Buffer Queues -> Redis Streams Cluster -> Downstream Analytics Workers.",
      impact:
        "Maintained 100k concurrent client streams with zero socket drops and sub-10ms event dissemination.",
      keyDecisions: [
        {
          decision: "Token Bucket Dynamic Rate Limiting",
          rationale: "Protects worker microservices from sudden client telemetry bursts.",
          tradeOff: "Drops non-essential telemetry frames during severe network congestion.",
        },
      ],
      techStack: ["TypeScript", "Node.js", "Redis Streams", "WebSockets", "Docker"],
      highlights: [
        "Terminates 100,000 simultaneous client sockets with 120MB RSS memory footprint",
        "Zero-drop reconnect recovery via stream sequence checkpoints",
        "Sub-10ms event delivery across global edge regions",
      ],
      impactMetrics: [
        { metric: "Concurrent Streams", value: "100,000" },
        { metric: "Dissemination Latency", value: "< 10ms" },
      ],
      promptVersion: "v1.0",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      isPublished: true,
    },
  ],
  repos: [
    {
      id: "demo-repo-1",
      name: "distributed-cache-engine",
      fullName: "alexchen/distributed-cache-engine",
      description:
        "High-throughput, in-memory distributed key-value store with consistent hashing, raft consensus replication, and sub-millisecond p99 latency.",
      htmlUrl: "https://github.com",
      stars: 342,
      forks: 48,
      primaryLanguage: "Go",
      topics: ["distributed-systems", "raft", "go", "high-performance", "concurrency"],
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      hasCaseStudy: true,
      caseStudyId: "demo-cs-1",
    },
    {
      id: "demo-repo-2",
      name: "neural-ast-optimizer",
      fullName: "alexchen/neural-ast-optimizer",
      description:
        "Compiles TypeScript ASTs to optimized WebAssembly modules with automated loop vectorization and speculative dead-code elimination.",
      htmlUrl: "https://github.com",
      stars: 215,
      forks: 31,
      primaryLanguage: "Rust",
      topics: ["compiler", "rust", "webassembly", "optimization", "ast"],
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      hasCaseStudy: true,
      caseStudyId: "demo-cs-2",
    },
    {
      id: "demo-repo-3",
      name: "event-stream-gateway",
      fullName: "alexchen/event-stream-gateway",
      description:
        "Enterprise WebSocket and SSE multiplexer handling 100k concurrent telemetry connections with backpressure control and Redis streams backing.",
      htmlUrl: "https://github.com",
      stars: 189,
      forks: 24,
      primaryLanguage: "TypeScript",
      topics: ["websockets", "telemetry", "nodejs", "redis", "streaming"],
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      hasCaseStudy: true,
      caseStudyId: "demo-cs-3",
    },
    {
      id: "demo-repo-4",
      name: "query-execution-profiler",
      fullName: "alexchen/query-execution-profiler",
      description:
        "Autonomous PostgreSQL query execution visualizer and index recommender using eBPF kernel probes for zero-overhead profiling.",
      htmlUrl: "https://github.com",
      stars: 145,
      forks: 18,
      primaryLanguage: "Python",
      topics: ["ebpf", "postgresql", "profiler", "database-tuning"],
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
      hasCaseStudy: false,
      caseStudyId: null,
    },
    {
      id: "demo-repo-5",
      name: "kernel-metrics-collector",
      fullName: "alexchen/kernel-metrics-collector",
      description:
        "Zero-copy Linux network socket observability daemon exporting OpenTelemetry metrics for bare-metal Kubernetes clusters.",
      htmlUrl: "https://github.com",
      stars: 94,
      forks: 11,
      primaryLanguage: "C",
      topics: ["linux", "opentelemetry", "metrics", "sysadmin"],
      lastPushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      hasCaseStudy: false,
      caseStudyId: null,
    },
  ],
  stats: {
    totalRepos: 5,
    totalStars: 985,
    totalForks: 132,
    totalCommits: 1197,
    languages: [
      { name: "Go", percentage: 42.5, bytes: 850000, color: GITHUB_LANGUAGE_COLORS["Go"] },
      { name: "Rust", percentage: 31.0, bytes: 620000, color: GITHUB_LANGUAGE_COLORS["Rust"] },
      {
        name: "TypeScript",
        percentage: 16.5,
        bytes: 330000,
        color: GITHUB_LANGUAGE_COLORS["TypeScript"],
      },
      { name: "Python", percentage: 6.5, bytes: 130000, color: GITHUB_LANGUAGE_COLORS["Python"] },
      { name: "C", percentage: 3.5, bytes: 70000, color: GITHUB_LANGUAGE_COLORS["C"] },
    ],
  },
  displayPreferences: DEFAULT_DISPLAY_PREFERENCES,
};

/**
 * Server-side helper to query public portfolio data by slug or username.
 * Returns null if the user does not exist.
 */
export async function getPublicPortfolioData(
  slugOrUsername: string,
): Promise<FullPortfolioData | null> {
  const normalized = slugOrUsername.trim().toLowerCase();

  if (!normalized) return null;

  // Demo user showcase fallback
  if (normalized === "alexchen" || normalized === "demo") {
    return DEMO_PORTFOLIO_DATA;
  }

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [
          { portfolioSlug: normalized },
          { username: { equals: normalized, mode: "insensitive" } },
        ],
      },
      include: {
        repos: {
          where: { isSelected: true },
          orderBy: [{ displayOrder: "asc" }, { stars: "desc" }],
          include: {
            caseStudy: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Parse theme and display preferences
    let theme: PortfolioTheme = "editorial";
    let themeMode: ThemeMode = "system";
    let displayPreferences: DisplayPreferences = { ...DEFAULT_DISPLAY_PREFERENCES };

    if (user.theme) {
      if (user.theme === "editorial" || user.theme === "mono" || user.theme === "brutalist") {
        theme = user.theme;
      } else if (user.theme.startsWith("{")) {
        try {
          const parsed = JSON.parse(user.theme);
          if (parsed.designTheme) theme = parsed.designTheme;
          if (parsed.themeMode) themeMode = parsed.themeMode;
          if (parsed.displayPreferences) {
            displayPreferences = {
              ...displayPreferences,
              ...parsed.displayPreferences,
            };
          }
        } catch {
          // Defaults
        }
      }
    }

    const userProfile: UserPortfolioProfile = {
      id: user.id,
      username: user.username || normalized,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl || user.image,
      headline: user.headline,
      location: user.location,
      websiteUrl: user.websiteUrl,
      portfolioSlug: user.portfolioSlug || user.username || normalized,
      theme,
      themeMode,
    };

    // Extract published case studies
    const caseStudies: PortfolioCaseStudy[] = [];
    const repos: PortfolioRepoItem[] = [];

    let totalStars = 0;
    let totalForks = 0;
    let totalCommits = 0;
    const languageByteMap: Record<string, number> = {};

    for (const repo of user.repos) {
      totalStars += repo.stars || 0;
      totalForks += repo.forks || 0;
      totalCommits += repo.commitCount || 0;

      // Aggregate byte-level language breakdown
      if (repo.languageBreakdown && typeof repo.languageBreakdown === "object") {
        const breakdown = repo.languageBreakdown as Record<string, number>;
        for (const [lang, bytes] of Object.entries(breakdown)) {
          if (typeof bytes === "number") {
            languageByteMap[lang] = (languageByteMap[lang] || 0) + bytes;
          }
        }
      } else if (repo.primaryLanguage || repo.language) {
        const lang = repo.primaryLanguage || repo.language || "Unknown";
        languageByteMap[lang] = (languageByteMap[lang] || 0) + 10000;
      }

      const hasCaseStudy = Boolean(repo.caseStudy && repo.caseStudy.isPublished);

      repos.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.fullName,
        description: repo.description,
        htmlUrl: repo.htmlUrl,
        stars: repo.stars,
        forks: repo.forks,
        primaryLanguage: repo.primaryLanguage || repo.language,
        topics: repo.topics || [],
        lastPushedAt: repo.lastPushedAt ? repo.lastPushedAt.toISOString() : null,
        hasCaseStudy,
        caseStudyId: repo.caseStudy?.id ?? null,
      });

      if (repo.caseStudy && repo.caseStudy.isPublished) {
        const cs = repo.caseStudy;
        caseStudies.push({
          id: cs.id,
          repoId: repo.id,
          repoName: repo.name,
          repoUrl: repo.htmlUrl,
          stars: repo.stars,
          forks: repo.forks,
          primaryLanguage: repo.primaryLanguage || repo.language,
          title: cs.title,
          subtitle: cs.subtitle || undefined,
          summary: cs.summary,
          problemStatement: cs.problemStatement,
          approach: cs.approach || undefined,
          architecture: cs.architecture,
          impact: cs.impact || undefined,
          keyDecisions: Array.isArray(cs.keyDecisions)
            ? (cs.keyDecisions as unknown as KeyDecision[])
            : [],
          techStack: cs.techStack || [],
          highlights: cs.highlights || [],
          challengesSolved: cs.challengesSolved || undefined,
          impactMetrics: Array.isArray(cs.impactMetrics)
            ? (cs.impactMetrics as unknown as ImpactMetric[])
            : undefined,
          promptVersion: cs.promptVersion,
          generatedAt: cs.generatedAt.toISOString(),
          isPublished: cs.isPublished,
        });
      }
    }

    // Compute language percentages
    const totalBytes = Object.values(languageByteMap).reduce((a, b) => a + b, 0);
    const languages: LanguageStat[] = Object.entries(languageByteMap)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
        color: GITHUB_LANGUAGE_COLORS[name] || "#888888",
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);

    return {
      user: userProfile,
      caseStudies,
      repos,
      stats: {
        totalRepos: user.repos.length,
        totalStars,
        totalForks,
        totalCommits,
        languages,
      },
      displayPreferences,
    };
  } catch (error: unknown) {
    console.error("[getPublicPortfolioData] Error fetching portfolio:", error);
    // If DB is offline, provide demo data for demo/alexchen or return null
    if (normalized === "alexchen" || normalized === "demo") {
      return DEMO_PORTFOLIO_DATA;
    }
    return null;
  }
}
