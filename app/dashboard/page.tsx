import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getUserRepositories } from "@/lib/github";
import { GITHUB_LANGUAGE_COLORS } from "@/lib/github/languages";
import { RepoSyncButton } from "@/components/dashboard";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui";
import { SkeletonDossier, SkeletonRepoRow } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Sparkles,
  FolderGit2,
  FileText,
  Activity,
  ExternalLink,
  Star,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Dashboard Overview | AI GitHub Portfolio Generator",
  description:
    "Engineering portfolio command center: sync repositories, generate AI case studies, and track pipeline metrics.",
};

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
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-5 flex flex-col gap-3 interactive-monograph">
      <div className="flex items-center justify-between">
        <span className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted tracking-wider uppercase">
          {label}
        </span>
        <Icon className="w-4 h-4 text-terracotta dark:text-telemetry-cyan" />
      </div>
      <div>
        <p className="font-serif text-heading-xl text-ink-primary dark:text-bone tracking-tight tabular-nums">
          {value}
        </p>
        {subtext && (
          <p className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted mt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  let repos: Awaited<ReturnType<typeof getUserRepositories>> = [];

  if (user?.id) {
    try {
      repos = await getUserRepositories(user.id);
    } catch {
      repos = [];
    }
  }

  const repoCount = repos.length;
  const selectedCount = repos.filter((r) => r.isSelected).length;
  const caseStudyCount = repos.filter((r) => r.hasCaseStudy).length;
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);

  // Take top 3 recent repositories
  const recentRepos = repos.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Page Header with One-Click Sync Repos Action */}
      <Reveal direction="up" delay={50}>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan uppercase tracking-widest">
                  § 01.0 OVERVIEW COMMAND
                </span>
                <Badge variant={repoCount > 0 ? "cyan" : "outline"} size="sm" dot>
                  {repoCount > 0 ? "SYNCED" : "AWAITING SYNC"}
                </Badge>
              </div>
              <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
                Command Center
              </h1>
              <p className="font-sans text-body-md text-ink-secondary dark:text-bone-secondary max-w-2xl">
                Your engineering portfolio command center. Sync repositories from GitHub, configure
                portfolio inclusion, and trigger autonomous AI case study generation.
              </p>
            </div>

            {/* Sync Repos Action Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <RepoSyncButton
                variant="primary"
                size="md"
                label="Sync Repos"
                loadingLabel="Syncing GitHub..."
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stats Grid */}
      <Reveal direction="up" delay={150}>
        <StaggerContainer
          staggerDelay={80}
          baseDelay={0}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <StaggerItem index={0}>
            <StatCard
              icon={FolderGit2}
              label="Repositories"
              value={repoCount > 0 ? repoCount.toString() : "—"}
              subtext={
                repoCount > 0 ? `${selectedCount} selected for portfolio` : "Connect GitHub to sync"
              }
            />
          </StaggerItem>
          <StaggerItem index={1}>
            <StatCard
              icon={FileText}
              label="Case Studies"
              value={caseStudyCount > 0 ? caseStudyCount.toString() : "0"}
              subtext={
                caseStudyCount > 0 ? `${caseStudyCount} generated dossiers` : "Ready for synthesis"
              }
            />
          </StaggerItem>
          <StaggerItem index={2}>
            <StatCard
              icon={Sparkles}
              label="Portfolio Stars"
              value={repoCount > 0 ? totalStars.toLocaleString() : "—"}
              subtext="Aggregated GitHub stars"
            />
          </StaggerItem>
          <StaggerItem index={3}>
            <StatCard
              icon={Activity}
              label="Pipeline"
              value="READY"
              subtext="Gemini 2.5 Flash active"
            />
          </StaggerItem>
        </StaggerContainer>
      </Reveal>

      {/* Two-Column: Recent Repositories + Latest Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Repositories Section */}
        <Reveal direction="up" delay={250}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-obsidian-border mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                  Recent Repositories
                </h2>
                {repoCount > 0 && (
                  <Badge variant="secondary" size="sm">
                    {repoCount}
                  </Badge>
                )}
              </div>
              <Link
                href="/dashboard/repos"
                className="font-mono text-mono-xs text-terracotta dark:text-telemetry-cyan hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentRepos.length > 0 ? (
              <div className="divide-y divide-hairline dark:divide-obsidian-border border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card">
                {recentRepos.map((repo) => {
                  const langColor =
                    (repo.primaryLanguage && GITHUB_LANGUAGE_COLORS[repo.primaryLanguage]) ||
                    (repo.language && GITHUB_LANGUAGE_COLORS[repo.language]) ||
                    "#888888";

                  return (
                    <div
                      key={repo.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-paper-sheet/40 dark:hover:bg-obsidian-panel/40 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-mono-sm font-semibold text-ink-primary dark:text-bone hover:text-terracotta dark:hover:text-telemetry-cyan flex items-center gap-1"
                          >
                            <span className="truncate">{repo.name}</span>
                            <ExternalLink className="w-3 h-3 text-ink-muted shrink-0" />
                          </Link>

                          {(repo.primaryLanguage || repo.language) && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-secondary dark:text-bone-secondary px-1.5 py-0.5 bg-paper-sheet dark:bg-obsidian-panel border border-hairline dark:border-obsidian-border">
                              <span
                                className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                                style={{ backgroundColor: langColor }}
                              />
                              {repo.primaryLanguage || repo.language}
                            </span>
                          )}

                          {repo.isSelected ? (
                            <Badge variant="cyan" size="sm">
                              PORTFOLIO
                            </Badge>
                          ) : (
                            <Badge variant="outline" size="sm">
                              EXCLUDED
                            </Badge>
                          )}
                        </div>

                        {repo.description ? (
                          <p className="font-sans text-body-xs text-ink-secondary dark:text-bone-secondary line-clamp-1">
                            {repo.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono text-mono-xs text-ink-muted dark:text-bone-muted">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{repo.stars}</span>
                        </div>
                        <span>{formatDate(repo.lastPushedAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className="space-y-0 border border-hairline dark:border-obsidian-border">
                  <SkeletonRepoRow />
                  <SkeletonRepoRow />
                  <SkeletonRepoRow />
                </div>
                <div className="mt-3 p-3 border border-dashed border-hairline dark:border-obsidian-border flex items-center justify-between gap-3">
                  <p className="font-mono text-mono-xs text-ink-muted dark:text-bone-muted tracking-wider">
                    § REPOSITORIES WILL POPULATE AFTER GITHUB SYNC
                  </p>
                  <RepoSyncButton variant="outline" size="sm" label="Sync Now" />
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Latest Case Study Dossier */}
        <Reveal direction="up" delay={350}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-obsidian-border mb-4">
              <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                Latest Dossier
              </h2>
              <Badge variant="outline" size="sm">
                {caseStudyCount > 0 ? "PUBLISHED" : "AWAITING SYNTHESIS"}
              </Badge>
            </div>
            <SkeletonDossier />
            <p className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted mt-3 tracking-wider">
              § GENERATE YOUR FIRST CASE STUDY FROM A SYNCED REPOSITORY
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
