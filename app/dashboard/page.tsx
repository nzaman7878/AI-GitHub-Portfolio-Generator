import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui";
import { SkeletonDossier, SkeletonRepoRow } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Sparkles, FolderGit2, FileText, Activity } from "lucide-react";

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

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <Reveal direction="up" delay={50}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
              Dashboard
            </h1>
            <Badge variant="cyan" size="sm" dot>
              MILESTONE 7
            </Badge>
          </div>
          <p className="font-sans text-body-md text-ink-secondary dark:text-bone-secondary max-w-2xl">
            Your engineering portfolio command center. Sync repositories, generate AI case studies,
            and monitor synthesis pipeline telemetry.
          </p>
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
              value="—"
              subtext="Connect GitHub to sync"
            />
          </StaggerItem>
          <StaggerItem index={1}>
            <StatCard icon={FileText} label="Case Studies" value="—" subtext="Generated dossiers" />
          </StaggerItem>
          <StaggerItem index={2}>
            <StatCard icon={Sparkles} label="AI Credits" value="—" subtext="Gemini API quota" />
          </StaggerItem>
          <StaggerItem index={3}>
            <StatCard icon={Activity} label="Pipeline" value="IDLE" subtext="No active jobs" />
          </StaggerItem>
        </StaggerContainer>
      </Reveal>

      {/* Two-Column: Recent Activity + Skeleton Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Repositories Skeleton */}
        <Reveal direction="up" delay={250}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-obsidian-border mb-4">
              <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                Recent Repositories
              </h2>
              <Badge variant="outline" size="sm">
                SYNC PENDING
              </Badge>
            </div>
            <div className="space-y-0 border border-hairline dark:border-obsidian-border">
              <SkeletonRepoRow />
              <SkeletonRepoRow />
              <SkeletonRepoRow />
            </div>
            <p className="font-mono text-mono-sm text-ink-muted dark:text-bone-muted mt-3 tracking-wider">
              § REPOSITORIES WILL POPULATE AFTER GITHUB SYNC
            </p>
          </div>
        </Reveal>

        {/* Latest Case Study Skeleton */}
        <Reveal direction="up" delay={350}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-obsidian-border mb-4">
              <h2 className="font-serif text-heading-md font-medium text-ink-primary dark:text-bone">
                Latest Dossier
              </h2>
              <Badge variant="outline" size="sm">
                AWAITING SYNTHESIS
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
