import Link from "next/link";
import {
  Container,
  EditorialGrid,
  Marginalia,
  Section,
  SectionHeader,
  Button,
  Badge,
  DossierCard,
  SkeletonDossier,
  PageTransition,
  Reveal,
  StaggerContainer,
  StaggerItem,
  TelemetryDot,
  HairlineExpand,
  InteractiveLink,
} from "@/components/ui";
import { UserMenu } from "@/components/auth/user-menu";
import { ArrowRight, Sparkles, Terminal, FileCode2, Layers } from "lucide-react";

export default function Home() {
  return (
    <PageTransition
      variant="aperture"
      className="min-h-screen flex flex-col bg-paper-canvas dark:bg-obsidian-void text-ink-primary dark:text-bone"
    >
      {/* Top Editorial Masthead & Telemetry Strip */}
      <header className="hairline-b sticky top-0 z-40 bg-paper-canvas/90 dark:bg-obsidian-void/90 backdrop-blur-md">
        <Container size="editorial">
          <div className="flex h-14 items-center justify-between">
            {/* Brand & Monograph Title */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-mono text-mono-md font-bold tracking-widest text-terracotta dark:text-telemetry-cyan uppercase">
                  MONOGRAPH // 01
                </span>
                <span className="hidden sm:inline-block text-ink-muted/40 dark:text-bone-muted/40">
                  /
                </span>
                <span className="hidden sm:inline-block font-sans text-body-sm text-ink-secondary dark:text-bone-secondary font-medium">
                  AI GitHub Portfolio Engine
                </span>
              </Link>
            </div>

            {/* Live Telemetry Status & Actions */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-mono-sm text-ink-muted dark:text-bone-muted font-mono tracking-wider">
                <TelemetryDot status="emerald" size="sm" pulse />
                <span>TELEMETRY: ONLINE</span>
              </div>
              <HairlineExpand origin="center" className="hidden lg:block w-8" />
              <div className="flex items-center gap-3">
                <UserMenu />
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero Section: The Technical Monograph */}
      <Section hairline={false} className="py-12 md:py-20">
        <Container size="editorial">
          <EditorialGrid
            marginalia={
              <Marginalia
                sectionNumber="01"
                sectionTitle="EXECUTIVE THESIS"
                meta={[
                  { label: "TARGET AUDIENCE", value: "STAFF & PRINCIPAL RECRUITERS" },
                  { label: "SYNTHESIS ENGINE", value: "GEMINI 2.5 FLASH" },
                  { label: "STANDARD", value: "RFC-9041 EDITORIAL SPEC" },
                ]}
              >
                <div className="mt-4 space-y-2 text-body-sm text-ink-muted dark:text-bone-secondary">
                  <p>
                    Engineered for high-volume technical recruiters, principal engineers, and hiring
                    managers.
                  </p>
                </div>
              </Marginalia>
            }
          >
            <div className="space-y-8 max-w-3xl">
              <Reveal direction="up" delay={100}>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 hairline-all bg-paper-sheet dark:bg-obsidian-card font-mono text-mono-sm text-ink-secondary dark:text-bone-secondary mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
                  <span>GEMINI-POWERED REPOSITORY REASONING</span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <h1 className="font-serif text-display-xl sm:text-display-2xl font-normal leading-[1.08] tracking-tight">
                  From raw commits to <br />
                  <span className="italic font-normal text-terracotta dark:text-telemetry-cyan">
                    rigorous engineering
                  </span>{" "}
                  dossiers.
                </h1>
              </Reveal>

              <Reveal direction="up" delay={300}>
                <p className="font-sans text-body-xl text-ink-secondary dark:text-bone-secondary max-w-2xl leading-relaxed">
                  Transform scattered codebases into peer-review-grade case studies. Surfacing
                  distributed architectures, concrete trade-offs, and verified production impact
                  metrics without marketing fluff.
                </p>
              </Reveal>

              <Reveal direction="up" delay={400}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/auth/signin">
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      }
                    >
                      Connect GitHub
                    </Button>
                  </Link>
                  <Link href="#preview">
                    <Button variant="outline" size="lg">
                      Review Architecture
                    </Button>
                  </Link>
                </div>
              </Reveal>

              {/* Technical Spec Pillars */}
              <Reveal direction="up" delay={500}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-hairline dark:border-hairline-dark">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-mono-sm font-semibold text-terracotta dark:text-telemetry-cyan uppercase">
                      <Terminal className="w-4 h-4" />
                      <span>01. Deep AST Parser</span>
                    </div>
                    <p className="font-sans text-body-sm text-ink-muted dark:text-bone-muted mt-1.5">
                      Ingests commit deltas, language byte distributions, and structural
                      dependencies.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-mono-sm font-semibold text-terracotta dark:text-telemetry-cyan uppercase">
                      <FileCode2 className="w-4 h-4" />
                      <span>02. Technical Dossier</span>
                    </div>
                    <p className="font-sans text-body-sm text-ink-muted dark:text-bone-muted mt-1.5">
                      Synthesizes problem statements, system tradeoffs, and verifiable latency
                      gains.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-mono-sm font-semibold text-terracotta dark:text-telemetry-cyan uppercase">
                      <Layers className="w-4 h-4" />
                      <span>03. Swiss Typography</span>
                    </div>
                    <p className="font-sans text-body-sm text-ink-muted dark:text-bone-muted mt-1.5">
                      Monograph editorial styling, tabular telemetry, and zero-radius planar
                      discipline.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </EditorialGrid>
        </Container>
      </Section>

      <HairlineExpand origin="left" className="my-6" />

      {/* Interactive Dossier Demo & Content-matching Skeleton Section */}
      <Section id="preview" hairline={false} className="py-12">
        <Container size="editorial">
          <SectionHeader
            sectionNumber="02"
            title="Generated Engineering Dossiers"
            subtitle="Side-by-side demonstration of live generated monograph dossiers and content-matching skeleton states."
          />

          <StaggerContainer
            staggerDelay={120}
            baseDelay={100}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10"
          >
            {/* Live Dossier Card */}
            <StaggerItem index={0}>
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-wider mb-2">
                  <span>STATE: SYNTHESIZED ARTIFACT</span>
                  <Badge variant="success" size="sm">
                    READY
                  </Badge>
                </div>
                <DossierCard
                  specRef="RFC-7102"
                  statusBadge={
                    <Badge variant="default" size="sm">
                      BENCHMARK VERIFIED
                    </Badge>
                  }
                  title="Distributed Log Replication Engine"
                  subtitle="Zero-dependency consensus implementation targeting sub-millisecond tail latency."
                  metrics={[
                    { label: "P99 LATENCY", value: "0.82ms" },
                    { label: "THROUGHPUT", value: "240k ops/sec" },
                    { label: "ARCHITECTURE RATING", value: "A+" },
                  ]}
                  tags={["Rust", "Tokio", "Raft", "gRPC"]}
                >
                  <p className="text-body-sm text-ink-secondary dark:text-bone-secondary">
                    Designed to eliminate single points of failure across geo-distributed
                    multi-region clusters with deterministic crash-recovery semantics.
                  </p>
                </DossierCard>
              </div>
            </StaggerItem>

            {/* Content-Matching Skeleton State */}
            <StaggerItem index={1}>
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-mono-xs text-ink-muted dark:text-bone-muted uppercase tracking-wider mb-2">
                  <span>STATE: AI SYNTHESIS IN PROGRESS</span>
                  <Badge variant="outline" size="sm">
                    ANALYZING
                  </Badge>
                </div>
                <SkeletonDossier />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="hairline-t mt-auto py-10 bg-paper-sheet dark:bg-obsidian-card">
        <Container size="editorial">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-mono-sm text-ink-muted dark:text-bone-muted">
            <div className="flex items-center gap-2">
              <span className="text-terracotta dark:text-telemetry-cyan font-bold">§</span>
              <span>MONOGRAPH PORTFOLIO GENERATOR</span>
              <span>—</span>
              <span>MILESTONE 6: DESIGN SYSTEM</span>
            </div>
            <div className="flex items-center gap-6">
              <InteractiveLink
                href="https://github.com/nzaman7878/AI-GitHub-Portfolio-Generator"
                target="_blank"
                rel="noreferrer"
              >
                GITHUB REPOSITORY
              </InteractiveLink>
              <InteractiveLink href="/auth/signin">SIGN IN</InteractiveLink>
            </div>
          </div>
        </Container>
      </footer>
    </PageTransition>
  );
}
