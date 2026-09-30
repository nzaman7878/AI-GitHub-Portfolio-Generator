import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outline" | "canvas";
  interactive?: boolean;
}

export function Card({
  className,
  variant = "default",
  interactive = false,
  children,
  ...props
}: CardProps) {
  const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
    default:
      "bg-paper-sheet border-hairline text-ink-primary dark:bg-obsidian-panel dark:border-obsidian-border dark:text-bone",
    elevated:
      "bg-paper-elevated border-hairline text-ink-primary dark:bg-obsidian-card dark:border-obsidian-border dark:text-bone",
    outline:
      "bg-transparent border-hairline text-ink-primary dark:border-obsidian-border dark:text-bone",
    canvas:
      "bg-paper-canvas border-hairline text-ink-primary dark:bg-obsidian-void dark:border-obsidian-border dark:text-bone",
  };

  return (
    <div
      className={cn(
        "border rounded-none relative transition-all duration-200",
        variantStyles[variant],
        interactive &&
          "cursor-pointer hover:border-ink-primary dark:hover:border-bone hover:shadow-planar dark:hover:shadow-planar-dark hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-3 space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  as: Component = "h3",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }) {
  return (
    <Component
      className={cn(
        "font-serif text-xl sm:text-2xl font-medium tracking-tight text-ink-primary dark:text-bone",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-sans text-ink-secondary dark:text-bone-secondary leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-6 pt-3 border-t border-hairline-subtle dark:border-obsidian-border flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DossierCardProps extends CardProps {
  specRef?: string;
  statusBadge?: React.ReactNode;
  title: string;
  subtitle?: string;
  metrics?: Array<{ label: string; value: string }>;
  tags?: string[];
}

/**
 * Specialized engineering case study dossier card:
 * Displays document reference header, title, technical metrics strip, and tags.
 */
export function DossierCard({
  className,
  specRef,
  statusBadge,
  title,
  subtitle,
  metrics,
  tags,
  children,
  interactive = true,
  ...props
}: DossierCardProps) {
  return (
    <Card
      variant="default"
      interactive={interactive}
      className={cn("overflow-hidden group", className)}
      {...props}
    >
      {/* Top Meta Bar */}
      {(specRef || statusBadge) && (
        <div className="flex items-center justify-between px-6 py-2.5 bg-paper-canvas/80 dark:bg-obsidian-void/80 border-b border-hairline dark:border-obsidian-border text-[11px] font-mono">
          <span className="text-ink-muted dark:text-bone-muted uppercase tracking-wider">
            {specRef ?? "SPEC REF: ARCHIVAL"}
          </span>
          {statusBadge && <div>{statusBadge}</div>}
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-medium tracking-tight text-ink-primary dark:text-bone group-hover:text-terracotta dark:group-hover:text-telemetry-cyan transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-ink-secondary dark:text-bone-secondary leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Metrics Strip */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-hairline-subtle dark:border-obsidian-border">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="p-2 bg-paper-canvas dark:bg-obsidian-void border border-hairline-subtle dark:border-obsidian-border font-mono"
              >
                <div className="text-[10px] text-ink-muted dark:text-bone-muted uppercase">
                  {m.label}
                </div>
                <div className="text-sm font-semibold text-ink-primary dark:text-bone tabular-nums">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Body Content */}
        {children}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 bg-paper-elevated dark:bg-obsidian-card border border-hairline-subtle dark:border-obsidian-border text-ink-secondary dark:text-bone-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
