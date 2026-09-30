import { Reveal } from "@/components/ui";
import { Badge } from "@/components/ui";

export default function SettingsPage() {
  return (
    <Reveal direction="up" delay={50}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
            Settings
          </h1>
          <Badge variant="outline" size="sm">
            PHASE 42
          </Badge>
        </div>
        <p className="font-sans text-body-md text-ink-secondary dark:text-bone-secondary max-w-2xl">
          Configure your portfolio slug, theme preferences, and display toggles. Dashboard settings
          are coming in Phase 42.
        </p>
        <div className="hairline-all p-8 text-center font-mono text-mono-sm text-ink-muted dark:text-bone-muted tracking-wider uppercase">
          § DASHBOARD SETTINGS — PENDING IMPLEMENTATION
        </div>
      </div>
    </Reveal>
  );
}
