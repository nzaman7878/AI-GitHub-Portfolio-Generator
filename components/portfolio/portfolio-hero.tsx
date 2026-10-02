import Image from "next/image";
import {
  Star,
  GitFork,
  ExternalLink,
  MapPin,
  Globe,
  Terminal,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  FolderGit2,
} from "lucide-react";
import { GitHubIcon } from "@/components/auth/github-icon";
import { TelemetryDot } from "@/components/ui/motion";
import type { UserPortfolioProfile, PortfolioStats } from "@/types/portfolio";
import type { DisplayPreferences } from "@/types/settings";

export interface PortfolioHeroProps {
  user: UserPortfolioProfile;
  stats: PortfolioStats;
  caseStudiesCount: number;
  displayPreferences: DisplayPreferences;
}

export function PortfolioHero({
  user,
  stats,
  caseStudiesCount,
  displayPreferences,
}: PortfolioHeroProps) {
  const topLanguages = stats.languages.slice(0, 4);

  return (
    <section className="relative border-b border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void py-12 sm:py-16 lg:py-20 px-4 sm:px-8 overflow-hidden">
      {/* Background Architectural Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 bottom-2 select-none font-mono text-[9rem] sm:text-[12rem] font-black text-ink-primary/[0.02] dark:text-bone/[0.02] leading-none z-0"
      >
        VITRINE
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Asymmetric 12-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN (COL 1–7): PRIMARY MONOGRAPH SPINE
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Dossier Header Strip */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-muted dark:text-bone-muted border-b border-hairline-subtle dark:border-obsidian-border pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
                  § 00. OPERATIONAL DOSSIER
                </span>
                <span>{"//"}</span>
                <span>ARCHIVAL RECORD</span>
              </div>

              <div className="ml-auto flex items-center gap-2 font-mono text-[11px]">
                <TelemetryDot status="emerald" size="sm" pulse />
                <span className="text-ink-secondary dark:text-bone">ACTIVE_INGRESS</span>
              </div>
            </div>

            {/* Candidate Identity Headings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-ink-muted dark:text-bone-muted tracking-tight">
                <span className="text-terracotta dark:text-telemetry-cyan">{"ID //"}</span>
                <span>@{user.username}</span>
                <span>•</span>
                <span className="uppercase">{user.theme} SPECIFICATION</span>
              </div>

              <h1 className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-primary dark:text-bone leading-[1.08]">
                {user.name || `@${user.username}`}
              </h1>

              {user.headline && (
                <p className="font-mono text-xs sm:text-sm text-terracotta dark:text-telemetry-cyan uppercase tracking-wider font-medium max-w-2xl leading-relaxed">
                  {user.headline}
                </p>
              )}
            </div>

            {/* Biographical Narrative Block (Editorial Quote Style) */}
            {displayPreferences.showBio && user.bio && (
              <div className="relative pl-5 border-l-2 border-terracotta/70 dark:border-telemetry-cyan/70 py-1">
                <p className="font-sans text-sm sm:text-base text-ink-secondary dark:text-bone-secondary leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Recruiter / Reference Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {caseStudiesCount > 0 && (
                <a
                  href="#case-studies"
                  className="inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void hover:opacity-90 transition-opacity"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Inspect Case Studies ({caseStudiesCount})</span>
                </a>
              )}

              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel text-ink-primary dark:text-bone hover:border-terracotta dark:hover:border-telemetry-cyan hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
                <span>github.com/{user.username}</span>
                <ExternalLink className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
              </a>

              {user.websiteUrl && (
                <a
                  href={
                    user.websiteUrl.startsWith("http")
                      ? user.websiteUrl
                      : `https://${user.websiteUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase tracking-wider border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel text-ink-secondary dark:text-bone-secondary hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
                  <span>{user.websiteUrl.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
                </a>
              )}
            </div>

            {/* Metadata Badges Strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 font-mono text-xs text-ink-muted dark:text-bone-muted">
              {user.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
                  <span>{user.location}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan" />
                <span>slug: /{user.portfolioSlug || user.username}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-ink-faint dark:text-bone-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-telemetry-emerald" />
                <span>VERIFIED_PROFILE</span>
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN (COL 8–12): TELEMETRY DOSSIER & METRIC VITRINE
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 w-full">
            <div className="border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel p-5 sm:p-6 relative shadow-sm space-y-6">
              {/* Monograph Corner Brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-terracotta dark:border-telemetry-cyan -translate-x-[1px] translate-y-[1px]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-terracotta dark:border-telemetry-cyan translate-x-[1px] translate-y-[1px]" />

              {/* Dossier Plate Header */}
              <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted dark:text-bone-muted border-b border-hairline dark:border-obsidian-border pb-2.5">
                <span className="tracking-widest uppercase font-semibold text-terracotta dark:text-telemetry-cyan">
                  FIG. 01 — IDENTITY SPECIFICATION
                </span>
                <span className="tracking-tighter">{"REV // 2026.1"}</span>
              </div>

              {/* Identity Row with Avatar & Quick Handle */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 border border-hairline dark:border-obsidian-border bg-paper-elevated dark:bg-obsidian-card p-1">
                  {user.avatarUrl ? (
                    <div className="relative w-full h-full overflow-hidden bg-paper-muted dark:bg-obsidian-void">
                      <Image
                        src={user.avatarUrl}
                        alt={user.name || user.username}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-ink-secondary dark:text-bone bg-paper-muted dark:bg-obsidian-void">
                      {(user.name || user.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="font-serif text-lg sm:text-xl font-normal text-ink-primary dark:text-bone truncate">
                    {user.name || user.username}
                  </div>
                  <div className="font-mono text-xs text-ink-muted dark:text-bone-muted truncate">
                    @{user.username}
                  </div>
                  <div className="font-mono text-[10px] text-telemetry-emerald flex items-center gap-1.5 pt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-telemetry-emerald" />
                    <span>PUBLIC VITRINE READY</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Metric Quad (2x2 Grid) */}
              {displayPreferences.showStats && (
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted flex items-center justify-between">
                    <span>TELEMETRY METRICS</span>
                    <span>TABULAR_DATA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-px border border-hairline dark:border-obsidian-border bg-hairline dark:bg-obsidian-border">
                    {/* Stat 1: Curated Repos */}
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                        Curated Repos
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan shrink-0" />
                        <span className="font-serif text-2xl font-normal text-ink-primary dark:text-bone tabular-nums">
                          {stats.totalRepos}
                        </span>
                      </div>
                    </div>

                    {/* Stat 2: GitHub Stars */}
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                        Total Stars
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <Star className="w-3.5 h-3.5 text-signal-accent dark:text-telemetry-amber shrink-0" />
                        <span className="font-serif text-2xl font-normal text-ink-primary dark:text-bone tabular-nums">
                          {stats.totalStars.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Stat 3: Total Forks */}
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                        Total Forks
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <GitFork className="w-3.5 h-3.5 text-ink-muted dark:text-bone-muted shrink-0" />
                        <span className="font-serif text-2xl font-normal text-ink-primary dark:text-bone tabular-nums">
                          {stats.totalForks.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Stat 4: Case Studies */}
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted block">
                        Case Studies
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-telemetry-cyan shrink-0" />
                        <span className="font-serif text-2xl font-normal text-ink-primary dark:text-bone tabular-nums">
                          {caseStudiesCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Distribution Breakdown */}
              {displayPreferences.showTechStack && topLanguages.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-hairline-subtle dark:border-obsidian-border">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                    <span>PRIMARY RUNTIME ENGINES</span>
                    <span>{topLanguages.length} LANGUAGES</span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-1.5 w-full flex overflow-hidden border border-hairline dark:border-obsidian-border bg-paper-muted dark:bg-obsidian-overlay">
                    {topLanguages.map((lang) => (
                      <div
                        key={lang.name}
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: lang.color || "#888888",
                        }}
                        title={`${lang.name}: ${lang.percentage}%`}
                      />
                    ))}
                  </div>

                  {/* Language Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    {topLanguages.map((lang) => (
                      <div key={lang.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: lang.color || "#888888" }}
                          />
                          <span className="text-ink-secondary dark:text-bone truncate">
                            {lang.name}
                          </span>
                        </span>
                        <span className="text-ink-muted dark:text-bone-muted tabular-nums ml-2">
                          {lang.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Panel Footer Telemetry Tag */}
              <div className="pt-2 border-t border-hairline dark:border-obsidian-border flex items-center justify-between font-mono text-[10px] text-ink-faint dark:text-bone-muted">
                <span>INGRESS: GITHUB_REST_V3</span>
                <span>DATA: PERSISTED_PG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioHero;
