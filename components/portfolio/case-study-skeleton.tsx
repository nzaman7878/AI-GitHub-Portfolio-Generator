import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export function CaseStudySkeleton() {
  return (
    <div className="w-full min-h-screen bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone py-10 px-4 sm:px-8 max-w-5xl mx-auto selection:bg-signal-accent/20">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS SKELETON
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-6 mb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <span className="text-ink-muted">/</span>
          <Skeleton className="h-4 w-20" />
          <span className="text-ink-muted">/</span>
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HEADER STRIP & ABSTRACT SKELETON
          ───────────────────────────────────────────────────────────── */}
      <header className="space-y-4 mb-8">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-3">
          <Skeleton className="h-4 w-44" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          <SkeletonText size="display" width="3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        {/* Abstract Box */}
        <div className="p-6 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-3">
          <Skeleton className="h-3 w-36" />
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="3/4" />
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. PROBLEM FORMULATION SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="p-5 border border-hairline dark:border-obsidian-border space-y-2">
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="3/4" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. ARCHITECTURE & TOPOLOGY SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-4">
          <SkeletonText size="body" width="full" />
          <div className="p-4 border border-hairline dark:border-obsidian-border space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. KEY DECISIONS SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-hairline-subtle dark:border-obsidian-border">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. PRODUCTION METRICS SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="p-5 border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel space-y-4">
          <SkeletonText size="body" width="3/4" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3.5 border border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-card space-y-1"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CODE SNIPPET SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center justify-between border-b border-hairline dark:border-obsidian-border pb-2.5">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="border border-hairline dark:border-obsidian-border bg-paper-elevated/70 dark:bg-obsidian-card">
          <div className="px-4 py-2 border-b border-hairline dark:border-obsidian-border flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="p-5 space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FOOTER SKELETON
          ───────────────────────────────────────────────────────────── */}
      <footer className="pt-8 border-t border-hairline dark:border-obsidian-border flex items-center justify-between">
        <Skeleton className="h-4 w-44" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-9 w-32" />
        </div>
      </footer>
    </div>
  );
}

export default CaseStudySkeleton;
