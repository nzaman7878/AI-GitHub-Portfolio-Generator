import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-paper-canvas text-ink-primary dark:bg-obsidian-void dark:text-bone flex flex-col justify-between selection:bg-signal-accent/20">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVIGATION SKELETON
          ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-hairline dark:border-obsidian-border bg-paper-card/75 dark:bg-obsidian-surface/75 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20" />
            <span className="text-paper-line dark:text-obsidian-border">|</span>
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Skeleton className="h-4 w-32 hidden md:block" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. ASYMMETRIC HERO SECTION SKELETON (MATCHING PORTFOLIOHERO)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-hairline dark:border-obsidian-border bg-paper-canvas dark:bg-obsidian-void py-12 sm:py-16 lg:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (7 cols): Spine */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Dossier Ribbon */}
              <div className="flex items-center justify-between border-b border-hairline-subtle dark:border-obsidian-border pb-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <SkeletonText size="display" width="3/4" />
                <Skeleton className="h-5 w-2/3" />
              </div>

              {/* Bio Block */}
              <div className="pl-5 border-l-2 border-hairline dark:border-obsidian-border space-y-2 py-1">
                <SkeletonText size="body" width="full" />
                <SkeletonText size="body" width="full" />
                <SkeletonText size="body" width="2/3" />
              </div>

              {/* Actions Strip */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Skeleton className="h-9 w-44" />
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-9 w-28" />
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Right Column (5 cols): Framed Inspector Dossier */}
            <div className="lg:col-span-5 w-full">
              <div className="border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-panel p-5 sm:p-6 space-y-6 relative">
                {/* Monograph corner tags */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-hairline dark:border-obsidian-border" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-hairline dark:border-obsidian-border" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-hairline dark:border-obsidian-border" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-hairline dark:border-obsidian-border" />

                {/* Plate Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-hairline dark:border-obsidian-border">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-16" />
                </div>

                {/* Identity with Avatar */}
                <div className="flex items-center gap-4">
                  <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 border border-hairline dark:border-obsidian-border" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>

                {/* Telemetry Metric Quad (2x2 Grid) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>

                  <div className="grid grid-cols-2 gap-px border border-hairline dark:border-obsidian-border bg-hairline dark:border-obsidian-border">
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-7 w-12" />
                    </div>
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-7 w-12" />
                    </div>
                    <div className="bg-paper-canvas dark:bg-obsidian-card p-3 space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-7 w-10" />
                    </div>
                  </div>
                </div>

                {/* Language Bar */}
                <div className="space-y-2 pt-1 border-t border-hairline-subtle dark:border-obsidian-border">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CASE STUDIES GRID SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 border-b border-hairline dark:border-obsidian-border">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-hairline dark:border-obsidian-border pb-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-7 w-32" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2].map((cardIdx) => (
              <div
                key={cardIdx}
                className="border border-hairline dark:border-obsidian-border bg-paper-sheet dark:bg-obsidian-card p-6 sm:p-7 space-y-5"
              >
                {/* Top strip */}
                <div className="flex items-center justify-between pb-3 border-b border-hairline-subtle dark:border-obsidian-border">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <SkeletonText size="body" width="full" />
                  <SkeletonText size="body" width="full" />
                </div>

                {/* Dual problem & architecture */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="p-3 border border-hairline dark:border-obsidian-border space-y-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-12" />
                </div>

                {/* Actions footer */}
                <div className="pt-4 border-t border-hairline dark:border-obsidian-border flex items-center justify-between">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-7 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. REPOSITORIES SKELETON
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 border-b border-hairline dark:border-obsidian-border bg-paper-card/30 dark:bg-obsidian-surface/30">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-7 w-56" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((repoIdx) => (
              <div
                key={repoIdx}
                className="border border-hairline dark:border-obsidian-border bg-paper-card dark:bg-obsidian-card p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <SkeletonText size="caption" width="3/4" />
                <div className="pt-2 border-t border-hairline-subtle dark:border-obsidian-border flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FOOTER SKELETON
          ───────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 sm:px-8 border-t border-hairline dark:border-obsidian-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </footer>
    </div>
  );
}

export default PortfolioSkeleton;
