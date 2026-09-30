import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variant of the skeleton geometry */
  variant?: "rectangular" | "circular" | "text";
}

/**
 * Base shimmer skeleton primitive.
 * Designed with archival monograph paper / obsidian telemetry gradients instead of flat grey.
 */
export function Skeleton({ variant = "rectangular", className, ...props }: SkeletonProps) {
  const variantClass = {
    rectangular: "rounded-none",
    circular: "rounded-full",
    text: "rounded-none h-4",
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer block", variantClass, className)}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Typographic role being simulated */
  size?: "display" | "heading-xl" | "heading-lg" | "heading-md" | "body" | "caption" | "mono";
  /** Width presets or custom width via className */
  width?: "full" | "3/4" | "2/3" | "1/2" | "1/3" | "1/4";
}

/**
 * Typography-proportional skeleton line matching exact line-heights and text scales.
 */
export function SkeletonText({
  size = "body",
  width = "full",
  className,
  ...props
}: SkeletonTextProps) {
  const heightClass = {
    display: "h-12 sm:h-14 my-1.5",
    "heading-xl": "h-9 sm:h-10 my-1",
    "heading-lg": "h-7 my-1",
    "heading-md": "h-5 my-0.5",
    body: "h-4 my-1",
    caption: "h-3 my-0.5",
    mono: "h-3.5 my-0.5",
  }[size];

  const widthClass = {
    full: "w-full",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "1/4": "w-1/4",
  }[width];

  return <Skeleton variant="text" className={cn(heightClass, widthClass, className)} {...props} />;
}

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hasFooter?: boolean;
}

/**
 * Standard card skeleton matching `Card` planar proportions.
 */
export function SkeletonCard({ hasFooter = true, className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "border border-hairline dark:border-hairline-dark bg-paper-canvas dark:bg-obsidian-card p-6 flex flex-col justify-between",
        className,
      )}
      {...props}
    >
      <div>
        {/* Header strip */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-hairline-dark mb-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* Title */}
        <SkeletonText size="heading-md" width="3/4" className="mb-3" />
        {/* Body lines */}
        <div className="space-y-2 mt-3">
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="2/3" />
        </div>
      </div>

      {hasFooter && (
        <div className="pt-4 mt-6 border-t border-hairline dark:border-hairline-dark flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      )}
    </div>
  );
}

/**
 * Content-matching skeleton for the technical monograph `DossierCard`.
 * Replicates the exact shape, ribbon, tags, and telemetry metrics strip.
 */
export function SkeletonDossier({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-hairline dark:border-hairline-dark bg-paper-canvas dark:bg-obsidian-card flex flex-col justify-between",
        className,
      )}
      {...props}
    >
      {/* Top Metadata Ribbon */}
      <div className="hairline-b px-4 py-2.5 flex items-center justify-between bg-paper-sheet/50 dark:bg-obsidian-panel/50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-1.5 h-1.5 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Main Narrative Area */}
      <div className="p-6 space-y-4">
        <div>
          <SkeletonText size="heading-lg" width="2/3" className="mb-2" />
          <SkeletonText size="caption" width="1/3" />
        </div>

        {/* Narrative excerpt */}
        <div className="space-y-2 pt-2">
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="full" />
          <SkeletonText size="body" width="3/4" />
        </div>

        {/* Tech Stack pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>

      {/* Bottom Telemetry Metrics Strip */}
      <div className="hairline-t px-6 py-3.5 bg-paper-sheet/30 dark:bg-obsidian-panel/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="h-7 w-24" />
      </div>
    </div>
  );
}

/**
 * Skeleton for repository list rows.
 */
export function SkeletonRepoRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "hairline-b p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-paper-canvas dark:bg-obsidian-void",
        className,
      )}
      {...props}
    >
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <SkeletonText size="caption" width="2/3" />
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  );
}
