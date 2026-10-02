import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  GitFork,
  ExternalLink,
  MapPin,
  Globe,
  Terminal,
  Sparkles,
  ArrowUpRight,
  Activity,
  FolderGit2,
} from "lucide-react";
import { getPublicPortfolioData } from "@/lib/portfolio";
import { GitHubIcon } from "@/components/auth/github-icon";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPublicPortfolioData(username);

  if (!portfolio) {
    return {
      title: "Portfolio Not Found | AI GitHub Portfolio",
      description: "The requested engineer portfolio monograph could not be located.",
    };
  }

  const { user } = portfolio;
  const title = user.name
    ? `${user.name} (@${user.username}) — Engineering Monograph`
    : `@${user.username} — Engineering Monograph`;
  const description =
    user.headline ||
    user.bio ||
    `Engineering portfolio, case studies, and code telemetry for @${user.username}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/${user.portfolioSlug || user.username}`,
      images: user.avatarUrl
        ? [
            {
              url: user.avatarUrl,
              alt: user.name || user.username,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: user.avatarUrl ? [user.avatarUrl] : [],
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const data = await getPublicPortfolioData(username);

  if (!data) {
    notFound();
  }

  const { user, caseStudies, repos, stats, displayPreferences } = data;

  return (
    <main className="min-h-screen bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone selection:bg-signal-accent/20 flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION / TELEMETRY RUNTIME STRIP
          ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-paper-line dark:border-obsidian-line bg-paper-card/75 dark:bg-obsidian-surface/75 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-85"
            >
              <span className="font-mono text-xs font-bold px-2 py-0.5 border border-signal-accent text-signal-accent uppercase tracking-widest">
                VITRINE
              </span>
              <span className="hidden sm:inline font-mono text-xs text-ink-muted dark:text-bone-muted tracking-tight">
                {"// MONOGRAPH RUNTIME"}
              </span>
            </Link>

            <span className="text-paper-line dark:text-obsidian-line">|</span>

            <span className="font-mono text-xs text-ink-secondary dark:text-bone-muted tracking-tight">
              @{user.username}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
            <div className="hidden md:flex items-center gap-2 text-ink-faint dark:text-bone-faint">
              <span className="inline-block w-2 h-2 rounded-full bg-signal-success animate-pulse" />
              <span>LIVE_INDEX // {stats.totalRepos} REPOS</span>
            </div>

            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-paper-line dark:border-obsidian-line bg-paper-card dark:bg-obsidian-card text-ink-primary dark:text-bone hover:border-signal-accent hover:text-signal-accent transition-colors"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
            </a>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink-primary dark:border-bone bg-ink-primary text-paper-canvas dark:bg-bone dark:text-obsidian-void font-semibold uppercase tracking-wider text-[11px] hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO PROFILE HEADER
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-paper-line dark:border-obsidian-line bg-paper-canvas dark:bg-obsidian-void py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
            {/* Avatar block with monograph framing */}
            {user.avatarUrl && (
              <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 border border-paper-line dark:border-obsidian-line p-1.5 bg-paper-card dark:bg-obsidian-surface shadow-sm">
                <div className="relative w-full h-full overflow-hidden bg-paper-muted dark:bg-obsidian-card">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || user.username}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Monograph corner tags */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-signal-accent" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-signal-accent" />
              </div>
            )}

            {/* Profile Meta & Details */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-signal-accent font-semibold px-2 py-0.5 border border-signal-accent/30 bg-signal-accent/5">
                  THE TECHNICAL MONOGRAPH
                </span>
                <span className="font-mono text-xs text-ink-faint dark:text-bone-faint">
                  THEME: {user.theme.toUpperCase()}
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-ink-primary dark:text-bone">
                {user.name || `@${user.username}`}
              </h1>

              {user.headline && (
                <p className="font-mono text-sm sm:text-base text-signal-accent font-medium leading-relaxed">
                  {user.headline}
                </p>
              )}

              {displayPreferences.showBio && user.bio && (
                <p className="text-sm sm:text-base text-ink-secondary dark:text-bone-muted max-w-3xl leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Badges / Links strip */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-2 font-mono text-xs text-ink-muted dark:text-bone-muted">
                {user.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-signal-accent" />
                    {user.location}
                  </span>
                )}

                {user.websiteUrl && (
                  <a
                    href={
                      user.websiteUrl.startsWith("http")
                        ? user.websiteUrl
                        : `https://${user.websiteUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-primary dark:text-bone hover:text-signal-accent transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-signal-accent" />
                    <span>{user.websiteUrl.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3 text-ink-faint dark:text-bone-faint" />
                  </a>
                )}

                <span className="inline-flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-signal-accent" />
                  <span>/{user.portfolioSlug || user.username}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. TELEMETRY & STATS STRIP (IF SHOWSTATS)
          ───────────────────────────────────────────────────────────── */}
      {displayPreferences.showStats && (
        <section className="border-b border-paper-line dark:border-obsidian-line bg-paper-card/40 dark:bg-obsidian-surface/40 py-6 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 divide-x divide-paper-line dark:divide-obsidian-line">
              <div className="px-2 sm:px-4 space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                  Curated Repos
                </span>
                <p className="font-editorial text-2xl sm:text-3xl font-light text-ink-primary dark:text-bone">
                  {stats.totalRepos}
                </p>
              </div>

              <div className="px-2 sm:px-4 space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                  Total Stars
                </span>
                <p className="font-editorial text-2xl sm:text-3xl font-light text-signal-accent">
                  ★ {stats.totalStars.toLocaleString()}
                </p>
              </div>

              <div className="px-2 sm:px-4 space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                  Total Forks
                </span>
                <p className="font-editorial text-2xl sm:text-3xl font-light text-ink-primary dark:text-bone">
                  {stats.totalForks.toLocaleString()}
                </p>
              </div>

              <div className="px-2 sm:px-4 space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                  Case Studies
                </span>
                <p className="font-editorial text-2xl sm:text-3xl font-light text-ink-primary dark:text-bone">
                  {caseStudies.length}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. TECH STACK & LANGUAGE METRICS (IF SHOWTECHSTACK)
          ───────────────────────────────────────────────────────────── */}
      {displayPreferences.showTechStack && stats.languages.length > 0 && (
        <section className="border-b border-paper-line dark:border-obsidian-line py-8 px-4 sm:px-8 bg-paper-canvas dark:bg-obsidian-void">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-widest text-ink-muted dark:text-bone-muted flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-signal-accent" />
                <span>Compiler & Language Distribution</span>
              </h2>
              <span className="font-mono text-[11px] text-ink-faint dark:text-bone-faint">
                GITHUB TELEMETRY
              </span>
            </div>

            {/* Language distribution bar */}
            <div className="h-2 w-full flex overflow-hidden border border-paper-line dark:border-obsidian-line bg-paper-muted dark:bg-obsidian-surface">
              {stats.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || "#4f46e5",
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>

            {/* Language Chips */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 font-mono text-xs">
              {stats.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: lang.color || "#888" }}
                  />
                  <span className="text-ink-primary dark:text-bone font-medium">{lang.name}</span>
                  <span className="text-ink-muted dark:text-bone-muted text-[11px]">
                    {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. PUBLISHED CASE STUDIES (IF SHOWCASESTUDIES)
          ───────────────────────────────────────────────────────────── */}
      {displayPreferences.showCaseStudies && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 border-b border-paper-line dark:border-obsidian-line">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-paper-line dark:border-obsidian-line pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-signal-accent font-semibold">
                  § 01. DEEP ENGINEERING SPECIFICATIONS
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-ink-primary dark:text-bone mt-1">
                  Published Case Studies
                </h2>
              </div>
              <span className="font-mono text-xs text-ink-muted dark:text-bone-muted">
                [{caseStudies.length} ARCHITECTURAL MONOGRAPHS]
              </span>
            </div>

            {caseStudies.length === 0 ? (
              <div className="border border-dashed border-paper-line dark:border-obsidian-line p-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 mx-auto text-ink-muted dark:text-bone-muted" />
                <p className="font-mono text-xs uppercase tracking-wider text-ink-muted dark:text-bone-muted">
                  No case studies published yet for this vitrine.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {caseStudies.map((cs, idx) => (
                  <article
                    key={cs.id}
                    className="border border-paper-line dark:border-obsidian-line bg-paper-card dark:bg-obsidian-surface p-6 sm:p-8 space-y-6 hover:border-signal-accent/50 transition-colors relative"
                  >
                    {/* Index header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-line dark:border-obsidian-line pb-4 font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-signal-accent">
                          {`CASE_STUDY_0${idx + 1} //`}
                        </span>
                        <a
                          href={cs.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-primary dark:text-bone hover:underline flex items-center gap-1 font-semibold"
                        >
                          <FolderGit2 className="w-3.5 h-3.5 text-signal-accent" />
                          {cs.repoName}
                          <ArrowUpRight className="w-3 h-3 text-ink-muted dark:text-bone-muted" />
                        </a>
                      </div>

                      <div className="flex items-center gap-4 text-ink-muted dark:text-bone-muted">
                        {cs.primaryLanguage && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-signal-accent" />
                            {cs.primaryLanguage}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-signal-accent" />
                          {cs.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5" />
                          {cs.forks}
                        </span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-2">
                      <h3 className="font-editorial text-2xl sm:text-3xl text-ink-primary dark:text-bone leading-tight">
                        {cs.title}
                      </h3>
                      {cs.subtitle && (
                        <p className="font-mono text-xs sm:text-sm text-signal-accent">
                          {cs.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Summary & Problem/Approach */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-signal-danger font-semibold">
                          Problem Statement
                        </span>
                        <p className="text-xs sm:text-sm text-ink-secondary dark:text-bone-muted leading-relaxed">
                          {cs.problemStatement}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-signal-success font-semibold">
                          Architectural Solution
                        </span>
                        <p className="text-xs sm:text-sm text-ink-secondary dark:text-bone-muted leading-relaxed">
                          {cs.architecture || cs.approach || cs.summary}
                        </p>
                      </div>
                    </div>

                    {/* Impact Statement */}
                    {cs.impact && (
                      <div className="border-l-2 border-signal-accent pl-4 py-1.5 bg-paper-canvas/50 dark:bg-obsidian-void/50 font-mono text-xs text-ink-primary dark:text-bone leading-relaxed">
                        <span className="font-bold text-signal-accent uppercase mr-2">Impact:</span>
                        {cs.impact}
                      </div>
                    )}

                    {/* Tech Stack & Key Decisions Footer */}
                    <div className="pt-4 border-t border-paper-line dark:border-obsidian-line flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-ink-faint dark:text-bone-faint text-[11px] mr-1">
                          STACK:
                        </span>
                        {cs.techStack?.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 border border-paper-line dark:border-obsidian-line bg-paper-canvas dark:bg-obsidian-card text-ink-secondary dark:text-bone-muted text-[11px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {cs.keyDecisions && cs.keyDecisions.length > 0 && (
                        <div className="text-ink-faint dark:text-bone-faint text-[11px]">
                          <span>
                            {cs.keyDecisions.length} ARCHITECTURAL{" "}
                            {cs.keyDecisions.length === 1 ? "DECISION" : "DECISIONS"} DOCUMENTED
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. CURATED REPOSITORIES (IF SHOWALLREPOS)
          ───────────────────────────────────────────────────────────── */}
      {displayPreferences.showAllRepos && repos.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 border-b border-paper-line dark:border-obsidian-line bg-paper-card/30 dark:bg-obsidian-surface/30">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-paper-line dark:border-obsidian-line pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-ink-muted dark:text-bone-muted">
                  § 02. CODEBASE VITRINE
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-ink-primary dark:text-bone mt-1">
                  Selected Repositories
                </h2>
              </div>
              <span className="font-mono text-xs text-ink-muted dark:text-bone-muted">
                [{repos.length} REPOSITORIES]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="border border-paper-line dark:border-obsidian-line bg-paper-card dark:bg-obsidian-card p-5 space-y-3 hover:border-signal-accent/50 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm font-semibold text-ink-primary dark:text-bone hover:text-signal-accent transition-colors flex items-center gap-1.5"
                      >
                        <FolderGit2 className="w-4 h-4 text-signal-accent shrink-0" />
                        <span className="truncate">{repo.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-ink-faint dark:text-bone-faint shrink-0" />
                      </a>

                      <div className="flex items-center gap-3 font-mono text-xs text-ink-muted dark:text-bone-muted shrink-0">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-signal-accent" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {repo.forks}
                        </span>
                      </div>
                    </div>

                    {repo.description && (
                      <p className="text-xs text-ink-secondary dark:text-bone-muted line-clamp-2 leading-relaxed">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-paper-line/50 dark:border-obsidian-line/50 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-ink-muted dark:text-bone-muted">
                      {repo.primaryLanguage && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-signal-accent" />
                          {repo.primaryLanguage}
                        </span>
                      )}
                    </div>

                    {repo.hasCaseStudy && (
                      <span className="text-signal-accent font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Case Study Published
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-paper-line dark:border-obsidian-line py-8 px-4 sm:px-8 bg-paper-canvas dark:bg-obsidian-void">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-muted dark:text-bone-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-signal-accent">THE TECHNICAL MONOGRAPH</span>
            <span>{"// VITRINE SPECIFICATION"}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-signal-accent transition-colors">
              Generated by AI GitHub Portfolio
            </Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-signal-accent transition-colors">
              Claim Your Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
