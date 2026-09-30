import { Reveal } from "@/components/ui";
import { Badge } from "@/components/ui";

export default function ReposPage() {
  return (
    <Reveal direction="up" delay={50}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
            Repositories
          </h1>
          <Badge variant="outline" size="sm">
            PHASE 38
          </Badge>
        </div>
        <p className="font-sans text-body-md text-ink-secondary dark:text-bone-secondary max-w-2xl">
          Synced GitHub repositories will appear here. Repository list view, status indicators, and
          selection toggles are coming in Phase 38.
        </p>
        <div className="hairline-all p-8 text-center font-mono text-mono-sm text-ink-muted dark:text-bone-muted tracking-wider uppercase">
          § REPOSITORY LIST VIEW — PENDING IMPLEMENTATION
        </div>
      </div>
    </Reveal>
  );
}
