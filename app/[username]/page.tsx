import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, GitFork, Sparkles, ArrowUpRight, FolderGit2 } from "lucide-react";
import { getPublicPortfolioData } from "@/lib/portfolio";
import { GitHubIcon } from "@/components/auth/github-icon";
import { PortfolioHero, CaseStudyGrid, EmptyPortfolioState } from "@/components/portfolio";

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

  const { user, stats, caseStudies } = portfolio;
  const displayName = user.name || `@${user.username}`;
  const title = `${displayName} — Engineering Monograph & Telemetry`;
  const description =
    user.headline ||
    user.bio ||
    `Architectural monographs, ${stats.totalRepos} repositories, and ${caseStudies.length} engineering case studies for ${displayName}.`;

  const slug = user.portfolioSlug || user.username;
  const ogImageUrl = `/api/og/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/${slug}`,
      siteName: "AI GitHub Portfolio Generator",
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${displayName} — Engineering Monograph & Telemetry`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: `@${user.username}`,
      images: [ogImageUrl],
    },
    other: {
      "profile:username": user.username,
      author: displayName,
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

  // Empty state: when user has connected but not generated any case studies or selected repos
  if (caseStudies.length === 0 && repos.length === 0) {
    return <EmptyPortfolioState user={user} />;
  }

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
          2. PORTFOLIO HERO SECTION (ASYMMETRIC EDITORIAL DOSSIER)
          ───────────────────────────────────────────────────────────── */}
      <PortfolioHero
        user={user}
        stats={stats}
        caseStudiesCount={caseStudies.length}
        displayPreferences={displayPreferences}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. PUBLISHED CASE STUDIES (IF SHOWCASESTUDIES)
          ───────────────────────────────────────────────────────────── */}
      {displayPreferences.showCaseStudies && (
        <section
          id="case-studies"
          className="py-12 sm:py-16 px-4 sm:px-8 border-b border-paper-line dark:border-obsidian-line"
        >
          <div className="max-w-6xl mx-auto">
            <CaseStudyGrid
              caseStudies={caseStudies}
              portfolioSlug={user.portfolioSlug || user.username}
            />
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
