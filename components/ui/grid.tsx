import * as React from "react";
import { cn } from "@/lib/utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  as?: React.ElementType;
}

export function Grid({
  className,
  cols = 12,
  gap = "md",
  as: Component = "div",
  children,
  ...props
}: GridProps) {
  const colStyles: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-12",
  };

  const gapStyles: Record<NonNullable<GridProps["gap"]>, string> = {
    none: "gap-0",
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  };

  return (
    <Component className={cn("grid w-full", colStyles[cols], gapStyles[gap], className)} {...props}>
      {children}
    </Component>
  );
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  as?: React.ElementType;
}

const spanMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const smMap: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
};

const mdMap: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

const lgMap: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

export function Col({
  className,
  span = 12,
  sm,
  md,
  lg,
  as: Component = "div",
  children,
  ...props
}: ColProps) {
  return (
    <Component
      className={cn(spanMap[span], sm && smMap[sm], md && mdMap[md], lg && lgMap[lg], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface EditorialGridProps extends React.HTMLAttributes<HTMLDivElement> {
  marginalia: React.ReactNode;
  children: React.ReactNode;
}

/**
 * An asymmetric 12-column Swiss editorial grid layout:
 * - Columns 1–3 (Desktop): Marginalia column for chapter indexes (§), metadata, and timeline markers.
 * - Columns 4–12 (Desktop): Main dissertation, architecture case studies, and engineering benchmarks.
 */
export function EditorialGrid({ className, marginalia, children, ...props }: EditorialGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full py-8 hairline-t",
        className,
      )}
      {...props}
    >
      <aside className="lg:col-span-3 lg:border-r border-hairline dark:border-obsidian-border lg:pr-8">
        <div className="sticky top-24 space-y-4">{marginalia}</div>
      </aside>

      <main className="lg:col-span-9 min-w-0 space-y-8">{children}</main>
    </div>
  );
}

export interface MarginaliaProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionNumber?: string;
  sectionTitle?: string;
  meta?: Array<{ label: string; value: string }>;
}

export function Marginalia({
  className,
  sectionNumber,
  sectionTitle,
  meta,
  children,
  ...props
}: MarginaliaProps) {
  return (
    <div className={cn("space-y-4 font-mono text-xs", className)} {...props}>
      {(sectionNumber || sectionTitle) && (
        <div className="space-y-1">
          {sectionNumber && (
            <span className="text-terracotta dark:text-telemetry-cyan font-bold tracking-widest block uppercase">
              § {sectionNumber}
            </span>
          )}
          {sectionTitle && (
            <h4 className="font-semibold text-ink-primary dark:text-bone tracking-wide uppercase">
              {sectionTitle}
            </h4>
          )}
        </div>
      )}

      {meta && meta.length > 0 && (
        <dl className="space-y-2 border-t border-hairline-subtle dark:border-obsidian-border pt-3">
          {meta.map((item, idx) => (
            <div key={idx} className="flex justify-between items-baseline gap-2">
              <dt className="text-ink-muted dark:text-bone-muted uppercase text-[10px]">
                {item.label}
              </dt>
              <dd className="text-ink-primary dark:text-bone font-medium tabular-nums">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children}
    </div>
  );
}
