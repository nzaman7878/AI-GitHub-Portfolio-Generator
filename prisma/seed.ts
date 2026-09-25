import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data for idempotent seeding
  await prisma.generationLog.deleteMany({});
  await prisma.caseStudy.deleteMany({});
  await prisma.repo.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create primary sample user: Alex Chen (Systems & Cloud Engineer)
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
                  "Designed and engineered an ultra-low latency distributed consensus engine based on Raft. Utilizes Linux io_uring for non-blocking WAL appending and ring-buffer ring buffers to bypass kernel copy overhead.",
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
            displayOrder: 3,
            lastPushedAt: new Date("2026-07-20T10:00:00Z"),
          },
        ],
      },
    },
  });

  // 2. Create second sample user: Sarah Kim (Product & Frontend Systems)
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
        ],
      },
    },
  });

  // 3. Create Sample Generation Logs (demonstrating API quota tracking & cache hits)
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
    ],
  });

  console.log(
    `✅ Seed completed: Created users "${userAlex.username}" and "${userSarah.username}" with repos and case studies.`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
