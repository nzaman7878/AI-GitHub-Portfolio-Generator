import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for local development...");

  // Clean existing records to guarantee idempotent execution
  await prisma.generationLog.deleteMany({});
  await prisma.caseStudy.deleteMany({});
  await prisma.repo.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // ===========================================================================
  // USER 1: Alex Chen (Distributed Systems & Cloud Infrastructure Architect)
  // 5 repos, 3 case studies
  // ===========================================================================
  const userAlex = await prisma.user.create({
    data: {
      username: "alexchen",
      name: "Alex Chen",
      email: "alex.chen.dev@example.com",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Staff Distributed Systems Engineer. Obsessed with high-throughput stream processing, consensus algorithms, and zero-allocation networking in Rust and Go.",
      portfolioSlug: "alexchen",
      websiteUrl: "https://alexchen.dev",
      location: "San Francisco, CA",
      headline: "Distributed Systems & Cloud Infrastructure Architect",
      theme: "editorial",
      repos: {
        create: [
          // Repo 1 (With Case Study)
          {
            githubId: BigInt(104820491),
            name: "raft-consensus-engine",
            fullName: "alexchen/raft-consensus-engine",
            description:
              "High-performance Raft consensus engine implemented in Rust with zero-copy network serialization and io_uring storage log.",
            htmlUrl: "https://github.com/alexchen/raft-consensus-engine",
            homepage: "https://crates.io/crates/raft-consensus-engine",
            language: "Rust",
            primaryLanguage: "Rust",
            languageBreakdown: {
              Rust: 284000,
              Shell: 12000,
              Makefile: 4500,
            },
            stars: 1240,
            forks: 185,
            openIssues: 12,
            topics: ["rust", "raft", "distributed-systems", "consensus", "io-uring"],
            commitCount: 420,
            isSelected: true,
            displayOrder: 1,
            lastPushedAt: new Date("2026-08-15T12:00:00Z"),
            readmeContent: `# raft-consensus-engine\n\nA zero-copy implementation of the Raft consensus algorithm designed for NVMe storage backends and 100GbE network fabrics. Built with Tokio and io_uring.`,
            caseStudy: {
              create: {
                title:
                  "Building a Zero-Copy Raft Consensus Engine for Ultra-Low Latency NVMe Fabrics",
                subtitle: "Achieving 450k op/s consensus with sub-millisecond p99 latency in Rust",
                summary:
                  "Designed and engineered an ultra-low latency distributed consensus engine based on Raft. Utilizes Linux io_uring for non-blocking WAL appending and ring buffers to bypass kernel copy overhead.",
                problemStatement:
                  "Traditional Raft implementations in Go/Java suffer from GC pauses (50-200ms) and heavy syscall overhead during high-frequency write-ahead log (WAL) syncs, causing unpredictable consensus timeouts under high tail load.",
                approach:
                  "Replaced blocking thread pools with Linux io_uring asynchronous ring buffers and custom memory arena allocators for zero-copy TCP framing.",
                architecture:
                  "Asynchronous actor topology built atop Rust's Tokio runtime. Storage tier employs a custom direct-I/O append-only segment allocator with io_uring batching. Network pipeline uses custom frame encoders over TCP streams with TCP_NODELAY and epoll-driven dispatch.",
                impact:
                  "Sustained 450,000 committed ops/sec with sub-millisecond p99 latency while cutting tail memory footprint to 42MB.",
                keyDecisions: [
                  {
                    decision: "Replace standard fsync with io_uring submission queues",
                    rationale:
                      "Eliminated blocking disk I/O threads and reduced context switching overhead by 68%.",
                    tradeOff: "Restricts deployment targets to Linux kernels >= 5.10.",
                  },
                  {
                    decision: "Zero-copy wire frame deserialization via custom memory arenas",
                    rationale: "Avoided heap churn on 100,000 requests/second bursts.",
                    tradeOff:
                      "Required explicit lifetime constraints and manual unsafe pointer guards.",
                  },
                ],
                techStack: ["Rust", "Tokio", "io_uring", "TCP/IP", "NVMe Storage", "Prometheus"],
                highlights: [
                  "450,000 committed state-machine transactions per second across a 5-node cluster",
                  "Sub-800 microsecond p99 latency under saturated network bandwidth",
                  "Zero allocation during continuous leader-heartbeat steady state",
                ],
                challengesSolved:
                  "Resolved split-brain recovery storms during packet drop anomalies by implementing pre-vote RPCs and adaptive election timeouts tuned via rolling network jitter measurements.",
                impactMetrics: [
                  { metric: "Throughput", value: "450k writes/sec" },
                  { metric: "p99 Latency", value: "0.78 ms" },
                  { metric: "Memory Footprint", value: "42 MB RSS" },
                ],
                promptVersion: "v1.0",
                isPublished: true,
              },
            },
          },
          // Repo 2 (With Case Study)
          {
            githubId: BigInt(204859102),
            name: "flux-stream-router",
            fullName: "alexchen/flux-stream-router",
            description:
              "Distributed event mesh gateway routing 2M events/sec across Kafka and NATS clusters with WASM filter extensions.",
            htmlUrl: "https://github.com/alexchen/flux-stream-router",
            homepage: "https://flux-router.dev",
            language: "Go",
            primaryLanguage: "Go",
            languageBreakdown: {
              Go: 340000,
              WebAssembly: 65000,
              Docker: 8200,
            },
            stars: 870,
            forks: 94,
            openIssues: 5,
            topics: ["go", "kafka", "nats", "wasm", "event-driven", "grpc"],
            commitCount: 310,
            isSelected: true,
            displayOrder: 2,
            lastPushedAt: new Date("2026-09-02T18:30:00Z"),
            readmeContent: `# flux-stream-router\n\nA programmable event mesh gateway bridging Kafka and NATS with sandboxed WebAssembly stream filters.`,
            caseStudy: {
              create: {
                title: "Architecting a High-Throughput Event Mesh with Dynamic WebAssembly Filters",
                subtitle:
                  "Processing 2 Million Events/sec with dynamic in-flight policy evaluation",
                summary:
                  "Constructed an event router in Go supporting dynamic, multi-tenant payload transformation using embedded Wasmtime runtimes without requiring gateway restarts.",
                problemStatement:
                  "Microservices needing payload masking, schema enrichment, and dynamic routing were creating point-to-point Kafka consumers, leading to consumer lag and duplicate pipeline management costs.",
                approach:
                  "Embedded lightweight, sandboxed WebAssembly execution runtimes directly into the network ingress stream with pre-warmed instance caches.",
                architecture:
                  "Decoupled pipeline with lock-free ring buffers between network ingress workers and dynamic WASM worker pools. Outbound batches are dispatched to partitioned Kafka topics using snappy compression.",
                impact:
                  "Processes 2.1M events/sec, enables atomic live policy reload in under 2ms, and cut cross-region cloud egress costs by 34%.",
                keyDecisions: [
                  {
                    decision: "Wasmtime runtime embedding for user-submitted filters",
                    rationale:
                      "Ensured multi-tenant memory isolation and crash resilience: a malfunctioning filter cannot crash the host gateway.",
                    tradeOff: "Introduces ~15 microsecond boundary crossing cost per event.",
                  },
                ],
                techStack: ["Go", "Kafka", "NATS", "WebAssembly", "Wasmtime", "Docker", "gRPC"],
                highlights: [
                  "Sustained 2.1M events/second throughput with < 4ms pipeline transit time",
                  "Zero downtime filter hot-reloading using atomic pointer swaps",
                  "Cut cross-region cloud data transfer egress bills by 34%",
                ],
                challengesSolved:
                  "Solved memory leaks in rapid WASM module instantiation by introducing a pre-warmed instance memory pool.",
                impactMetrics: [
                  { metric: "Event Volume", value: "2.1M events/s" },
                  { metric: "Egress Cost Reduction", value: "34%" },
                  { metric: "Filter Hot-Reload Time", value: "< 2ms" },
                ],
                promptVersion: "v1.0",
                isPublished: true,
              },
            },
          },
          // Repo 3 (With Case Study)
          {
            githubId: BigInt(250194821),
            name: "hyper-wal",
            fullName: "alexchen/hyper-wal",
            description:
              "Direct-I/O append-only write-ahead log engine in C++ with memory-mapped checkpointing and CRC32C segment verification.",
            htmlUrl: "https://github.com/alexchen/hyper-wal",
            homepage: "https://github.com/alexchen/hyper-wal",
            language: "C++",
            primaryLanguage: "C++",
            languageBreakdown: {
              "C++": 195000,
              CMake: 14000,
            },
            stars: 620,
            forks: 52,
            openIssues: 4,
            topics: ["cpp", "wal", "storage-engine", "direct-io", "mmap"],
            commitCount: 220,
            isSelected: true,
            displayOrder: 3,
            lastPushedAt: new Date("2026-06-10T14:15:00Z"),
            readmeContent: `# hyper-wal\n\nA zero-fluff write-ahead log engine designed for distributed transactional storage layers.`,
            caseStudy: {
              create: {
                title: "Engineering a Lock-Free Append-Only WAL for Mission-Critical Transactions",
                subtitle:
                  "Eliminating storage tail latency through direct-I/O aligned segment batching",
                summary:
                  "Built a standalone append-only write-ahead log engine in C++ utilizing O_DIRECT sector alignment and AVX2-accelerated checksum verification to prevent tail-latency spikes during disk flushes.",
                problemStatement:
                  "OS page cache writeback contention caused periodic 300ms latency spikes when synchronizing dirty pages, impacting transactional databases under high write pressure.",
                approach:
                  "Bypassed the Linux page cache entirely using 4KB sector-aligned direct I/O memory buffers and asynchronous disk synchronization via double-buffered memory rings.",
                architecture:
                  "Double-buffered memory ring where active transactions write into user-space aligned buffers while a background worker issues direct I/O flushes to disk. Segments rotate automatically at 64MB boundaries.",
                impact:
                  "Eliminated OS cache writeback stalls, maintaining bounded p99.9 write latency under 1.2ms at 80,000 synchronous commits/sec.",
                keyDecisions: [
                  {
                    decision: "Bypass OS page cache with O_DIRECT flags",
                    rationale:
                      "Guaranteed predictable write latency by avoiding kernel writeback background throttling.",
                    tradeOff:
                      "Requires all writes to be aligned to physical disk sector boundaries.",
                  },
                ],
                techStack: ["C++", "CMake", "Linux Syscalls", "AVX2", "Google Benchmark"],
                highlights: [
                  "1.2ms p99.9 append latency under heavy write saturation",
                  "AVX2 vectorized CRC32C computation at 12 GB/sec",
                  "Automated zero-downtime log segment compaction",
                ],
                challengesSolved:
                  "Fixed torn write detection during unexpected node power losses by maintaining atomic 8-byte sequence tail markers.",
                impactMetrics: [
                  { metric: "p99.9 Append Latency", value: "1.2 ms" },
                  { metric: "Throughput", value: "80k commits/s" },
                  { metric: "Verification Speed", value: "12 GB/s" },
                ],
                promptVersion: "v1.0",
                isPublished: true,
              },
            },
          },
          // Repo 4 (Without Case Study)
          {
            githubId: BigInt(309482711),
            name: "k8s-cost-sentinel",
            fullName: "alexchen/k8s-cost-sentinel",
            description:
              "Kubernetes mutating admission controller that detects underutilized cloud resources and automates vertical pod rightsizing.",
            htmlUrl: "https://github.com/alexchen/k8s-cost-sentinel",
            language: "Go",
            primaryLanguage: "Go",
            languageBreakdown: {
              Go: 154000,
              YAML: 32000,
            },
            stars: 430,
            forks: 38,
            openIssues: 3,
            topics: ["kubernetes", "finops", "k8s-operator", "golang"],
            commitCount: 165,
            isSelected: true,
            displayOrder: 4,
            lastPushedAt: new Date("2026-07-20T10:00:00Z"),
          },
          // Repo 5 (Without Case Study)
          {
            githubId: BigInt(350918234),
            name: "bpf-tcp-telemetry",
            fullName: "alexchen/bpf-tcp-telemetry",
            description:
              "eBPF kernel probe monitor tracking TCP socket retransmits, handshake delays, and window sizing in real-time.",
            htmlUrl: "https://github.com/alexchen/bpf-tcp-telemetry",
            language: "C",
            primaryLanguage: "C",
            languageBreakdown: {
              C: 112000,
              Go: 45000,
            },
            stars: 310,
            forks: 22,
            openIssues: 1,
            topics: ["ebpf", "bpf", "linux-kernel", "networking", "telemetry"],
            commitCount: 95,
            isSelected: true,
            displayOrder: 5,
            lastPushedAt: new Date("2026-05-14T09:30:00Z"),
          },
        ],
      },
    },
  });

  // ===========================================================================
  // USER 2: Sarah Kim (Frontend Systems & Design Engineering Lead)
  // 5 repos, 3 case studies
  // ===========================================================================
  const userSarah = await prisma.user.create({
    data: {
      username: "sarahkim",
      name: "Sarah Kim",
      email: "sarah.kim.ui@example.com",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Principal Frontend Architect crafting accessible component systems, design tokens, and fluid web animations at scale.",
      portfolioSlug: "sarahkim",
      websiteUrl: "https://sarahkim.design",
      location: "New York, NY",
      headline: "Frontend Systems & Design Engineering Lead",
      theme: "editorial",
      repos: {
        create: [
          // Repo 1 (With Case Study)
          {
            githubId: BigInt(409283719),
            name: "canvas-flow-editor",
            fullName: "sarahkim/canvas-flow-editor",
            description:
              "WebGL & Canvas node-based graph editor with 60fps rendering for massive 10,000+ node workflow orchestration.",
            htmlUrl: "https://github.com/sarahkim/canvas-flow-editor",
            homepage: "https://flow.sarahkim.design",
            language: "TypeScript",
            primaryLanguage: "TypeScript",
            languageBreakdown: {
              TypeScript: 420000,
              GLSL: 45000,
              CSS: 38000,
            },
            stars: 2150,
            forks: 320,
            openIssues: 18,
            topics: [
              "typescript",
              "webgl",
              "canvas",
              "react",
              "graph-visualization",
              "design-tool",
            ],
            commitCount: 540,
            isSelected: true,
            displayOrder: 1,
            lastPushedAt: new Date("2026-09-18T15:45:00Z"),
            readmeContent: `# canvas-flow-editor\n\nHigh-performance node graph editor with WebGL acceleration and virtualized Canvas render tree.`,
            caseStudy: {
              create: {
                title: "Engineering a 60 FPS Infinite Canvas for 10,000+ Node Workflow Graphs",
                subtitle:
                  "Bypassing DOM limitations using hybrid WebGL and quadtree viewport culling",
                summary:
                  "Built an infinite interactive graph diagramming engine capable of fluidly panning, zooming, and editing 10,000+ complex operational nodes at native display refresh rates.",
                problemStatement:
                  "DOM/SVG-based graph editors degrade severely past 300 visible nodes due to layout thrashing and browser memory overhead, crippling enterprise workflow builder UX.",
                approach:
                  "Bypassed the browser DOM using a hybrid rendering pipeline: WebGL GPU instanced shaders for wire connections and virtualized Canvas 2D for interactive cards.",
                architecture:
                  "Layered architecture: WebGL shader layer for batch connection wire renders; high-precision 2D Canvas for interactive node cards; decoupled Zustand reactive state engine with spatial Quadtree indices for instant viewport query and collision checks.",
                impact:
                  "Maintains steady 60-120 FPS on 10,000+ connected nodes while keeping memory footprint under 35MB.",
                keyDecisions: [
                  {
                    decision: "QuadTree spatial indexing for hit testing and viewport culling",
                    rationale:
                      "Reduced node intersection calculations from O(N) to O(log N), keeping frame render times under 4ms.",
                    tradeOff: "Requires rebuilding spatial branch segments when nodes are dragged.",
                  },
                ],
                techStack: [
                  "TypeScript",
                  "WebGL",
                  "HTML5 Canvas",
                  "Zustand",
                  "Tailwind CSS",
                  "Vite",
                ],
                highlights: [
                  "Maintains steady 60–120 FPS on 10,000 connected nodes during rapid pan/zoom",
                  "Less than 35MB heap memory consumption at scale",
                  "Accessible keyboard navigation with topological node jumping",
                ],
                challengesSolved:
                  "Solved sub-pixel jitter during smooth trackpad pinch-zoom by maintaining high-precision camera coordinates and snapping only during final raster rasterization passes.",
                impactMetrics: [
                  { metric: "Render Rate", value: "60 FPS @ 10k nodes" },
                  { metric: "Frame Time", value: "3.8 ms" },
                  { metric: "Heap Memory", value: "34 MB" },
                ],
                promptVersion: "v1.0",
                isPublished: true,
              },
            },
          },
          // Repo 2 (With Case Study)
          {
            githubId: BigInt(450192837),
            name: "fluid-design-tokens",
            fullName: "sarahkim/fluid-design-tokens",
            description:
              "Multi-platform design token compiler transforming Figma variables into CSS variables, Tailwind presets, and Swift/Kotlin themes.",
            htmlUrl: "https://github.com/sarahkim/fluid-design-tokens",
            homepage: "https://tokens.sarahkim.design",
            language: "TypeScript",
            primaryLanguage: "TypeScript",
            languageBreakdown: {
              TypeScript: 185000,
              JSON: 42000,
            },
            stars: 1420,
            forks: 160,
            openIssues: 7,
            topics: ["design-tokens", "design-system", "tailwind", "figma-api", "cross-platform"],
            commitCount: 290,
            isSelected: true,
            displayOrder: 2,
            lastPushedAt: new Date("2026-08-28T11:20:00Z"),
            readmeContent: `# fluid-design-tokens\n\nA unified multi-brand design token transformer with automated Figma REST sync.`,
            caseStudy: {
              create: {
                title:
                  "Architecting a Multi-Platform Design Token Pipeline from Figma to Native Apps",
                subtitle:
                  "Eliminating design-engineering drift across Web, iOS, and Android codebases",
                summary:
                  "Constructed an automated token transformation compiler that ingests Figma Variables and compiles type-safe design tokens for Tailwind CSS, iOS Swift (AssetCatalogs), and Android Jetpack Compose.",
                problemStatement:
                  "Manual translation of design specs into CSS and mobile code created subtle color and typography discrepancies, slowing down product release cycles across 4 engineering teams.",
                approach:
                  "Built an AST-based transformation pipeline validating token hierarchies with JSON Schema and generating deterministic code bindings with zero runtime overhead.",
                architecture:
                  "CLI compiler engine that pulls Figma Variables API payloads, normalizes aliases into a DAG (Directed Acyclic Graph) for cyclic reference detection, and dispatches target platform emitters using Handlebars templates.",
                impact:
                  "Reduced brand token update cycles from 3 days to 45 seconds while ensuring 100% color and typography parity.",
                keyDecisions: [
                  {
                    decision: "DAG resolution for aliased color palettes",
                    rationale:
                      "Prevented infinite loops and deadlocks when designers nested semantic color aliases 4 levels deep.",
                    tradeOff: "Requires strict dependency topological sorting before emission.",
                  },
                ],
                techStack: [
                  "TypeScript",
                  "Node.js",
                  "Figma REST API",
                  "Handlebars",
                  "Zod",
                  "Vitest",
                ],
                highlights: [
                  "Sub-second compilation for 2,400+ design tokens across 3 brands",
                  "Generated TypeScript definitions with autocomplete for all theme classes",
                  "Automated GitHub Pull Request creation on Figma file version publications",
                ],
                challengesSolved:
                  "Handled alpha transparency color blending calculations across color spaces by implementing OKLCH gamut mapping algorithms.",
                impactMetrics: [
                  { metric: "Deployment Time", value: "< 45 seconds" },
                  { metric: "Design Parity", value: "100% across Web/Mobile" },
                  { metric: "Tokens Managed", value: "2,400+ tokens" },
                ],
                promptVersion: "v1.0",
                isPublished: true,
              },
            },
          },
          // Repo 3 (With Case Study)
          {
            githubId: BigInt(480928173),
            name: "a11y-tree-auditor",
            fullName: "sarahkim/a11y-tree-auditor",
            description:
              "Chromium CDP-based automated accessibility scanner validating accessibility trees, ARIA states, and color contrast in CI/CD.",
            htmlUrl: "https://github.com/sarahkim/a11y-tree-auditor",
            homepage: "https://github.com/sarahkim/a11y-tree-auditor",
            language: "TypeScript",
            primaryLanguage: "TypeScript",
            languageBreakdown: {
              TypeScript: 142000,
              HTML: 18000,
            },
            stars: 980,
            forks: 85,
            openIssues: 6,
            topics: ["accessibility", "a11y", "playwright", "wcag", "automated-testing"],
            commitCount: 210,
            isSelected: true,
            displayOrder: 3,
            lastPushedAt: new Date("2026-07-12T16:00:00Z"),
            readmeContent: `# a11y-tree-auditor\n\nDeep accessibility tree inspection and automated WCAG 2.2 AAA validation in CI.`,
            caseStudy: {
              create: {
                title:
                  "Building an Automated Accessibility Tree Scanner for Continuous WCAG Compliance",
                subtitle:
                  "Catching dynamic screen reader regressions before merging code to production",
                summary:
                  "Created a headless browser auditing tool connecting to Chrome DevTools Protocol to analyze the computed accessibility tree and detect inaccessible focus traps and missing ARIA relationships.",
                problemStatement:
                  "Standard static linting misses runtime accessibility failures such as improper focus management in complex modal dialogs and dynamic live regions.",
                approach:
                  "Instrumented browser execution traces via Chrome DevTools Protocol to inspect the live accessibility node tree rather than relying merely on static DOM heuristics.",
                architecture:
                  "Playwright-powered test runner that captures accessibility snapshots during simulated user interactions, calculates exact WCAG contrast ratios across translucent overlays, and outputs formatted GitHub PR annotations.",
                impact:
                  "Caught 42 critical keyboard trap defects in CI prior to production release, achieving 99.4% automated accessibility test coverage.",
                keyDecisions: [
                  {
                    decision: "Direct CDP Accessibility Tree inspection over axe-core alone",
                    rationale:
                      "Allowed evaluating how assistive technology actually interprets computed nodes rather than guessing from DOM attributes.",
                    tradeOff: "Requires running Chromium in headless container environments.",
                  },
                ],
                techStack: [
                  "TypeScript",
                  "Playwright",
                  "Chrome DevTools Protocol",
                  "WCAG 2.2",
                  "GitHub Actions",
                ],
                highlights: [
                  "Zero false-positive contrast calculations on animated background gradients",
                  "Automated keyboard tab navigation replay simulation",
                  "Direct integration with GitHub Checks API for inline PR feedback",
                ],
                challengesSolved:
                  "Solved false contrast warnings on CSS backdrop-filter blur elements by rendering localized canvas color samples.",
                impactMetrics: [
                  { metric: "Accessibility Coverage", value: "99.4%" },
                  { metric: "Regressions Caught", value: "42 in CI" },
                  { metric: "Audit Run Time", value: "< 8 sec" },
                ],
                promptVersion: "v1.0",
                isPublished: true,
              },
            },
          },
          // Repo 4 (Without Case Study)
          {
            githubId: BigInt(510293847),
            name: "micro-frontend-shell",
            fullName: "sarahkim/micro-frontend-shell",
            description:
              "Module Federation micro-frontend orchestrator with shared state synchronization and isolated stylesheet boundaries.",
            htmlUrl: "https://github.com/sarahkim/micro-frontend-shell",
            language: "TypeScript",
            primaryLanguage: "TypeScript",
            languageBreakdown: {
              TypeScript: 125000,
              JavaScript: 34000,
            },
            stars: 640,
            forks: 72,
            openIssues: 4,
            topics: ["module-federation", "micro-frontends", "webpack", "react"],
            commitCount: 180,
            isSelected: true,
            displayOrder: 4,
            lastPushedAt: new Date("2026-06-25T13:40:00Z"),
          },
          // Repo 5 (Without Case Study)
          {
            githubId: BigInt(530948271),
            name: "css-subgrid-experiments",
            fullName: "sarahkim/css-subgrid-experiments",
            description:
              "Interactive playground showcasing advanced modern CSS Grid, Subgrid, Container Queries, and view transitions.",
            htmlUrl: "https://github.com/sarahkim/css-subgrid-experiments",
            homepage: "https://subgrid.sarahkim.design",
            language: "CSS",
            primaryLanguage: "CSS",
            languageBreakdown: {
              CSS: 82000,
              HTML: 24000,
            },
            stars: 490,
            forks: 41,
            openIssues: 2,
            topics: ["css", "subgrid", "container-queries", "web-standards"],
            commitCount: 75,
            isSelected: true,
            displayOrder: 5,
            lastPushedAt: new Date("2026-04-18T10:15:00Z"),
          },
        ],
      },
    },
  });

  // ===========================================================================
  // Generation Logs (Tracking AI API usage, cache skips, and token budgets)
  // ===========================================================================
  await prisma.generationLog.createMany({
    data: [
      {
        userId: userAlex.id,
        promptVersion: "v1.0",
        status: "SUCCESS",
        tokensUsed: 2460,
        promptTokens: 1840,
        completionTokens: 620,
        totalTokens: 2460,
        durationMs: 2340,
        rawResponse: '{"status":"ok","model":"gemini-1.5-pro"}',
      },
      {
        userId: userAlex.id,
        promptVersion: "v1.0",
        status: "SKIPPED_CACHE",
        tokensUsed: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        durationMs: 12,
        rawResponse: '{"reason":"repo unchanged since last pushed timestamp"}',
      },
      {
        userId: userSarah.id,
        promptVersion: "v1.0",
        status: "SUCCESS",
        tokensUsed: 2810,
        promptTokens: 2100,
        completionTokens: 710,
        totalTokens: 2810,
        durationMs: 2780,
        rawResponse: '{"status":"ok","model":"gemini-1.5-pro"}',
      },
      {
        userId: userSarah.id,
        promptVersion: "v1.0",
        status: "SKIPPED_CACHE",
        tokensUsed: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        durationMs: 15,
        rawResponse: '{"reason":"repo unchanged since last pushed timestamp"}',
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(`- User 1: "${userAlex.username}" (5 repos, 3 case studies)`);
  console.log(`- User 2: "${userSarah.username}" (5 repos, 3 case studies)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
