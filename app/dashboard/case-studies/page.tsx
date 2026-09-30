import { Reveal } from "@/components/ui";
import { Badge } from "@/components/ui";

export default function CaseStudiesPage() {
  return (
    <Reveal direction="up" delay={50}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-heading-xl font-medium tracking-tight text-ink-primary dark:text-bone">
            Case Studies
          </h1>
          <Badge variant="outline" size="sm">
            PHASE 40
          </Badge>
        </div>
        <p className="font-sans text-body-md text-ink-secondary dark:text-bone-secondary max-w-2xl">
          AI-generated engineering dossiers and case study previews will appear here. Preview, edit,
          and manage your synthesized technical narratives.
        </p>
        <div className="hairline-all p-8 text-center font-mono text-mono-sm text-ink-muted dark:text-bone-muted tracking-wider uppercase">
          § CASE STUDY PREVIEW + EDIT — PENDING IMPLEMENTATION
        </div>
      </div>
    </Reveal>
  );
}
