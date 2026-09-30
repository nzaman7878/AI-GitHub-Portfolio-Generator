import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  hairline?: boolean;
}

export function Section({
  className,
  as: Component = "section",
  hairline = true,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn("w-full py-12 md:py-16 relative", hairline && "hairline-t", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionNumber?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  className,
  sectionNumber,
  title,
  subtitle,
  action,
  children,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline dark:border-obsidian-border mb-8",
        className,
      )}
      {...props}
    >
      <div className="space-y-1.5">
        {sectionNumber && (
          <span className="text-terracotta dark:text-telemetry-cyan font-mono text-xs font-bold uppercase tracking-widest block">
            § {sectionNumber}
          </span>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink-primary dark:text-bone">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-ink-secondary dark:text-bone-secondary max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
      {children}
    </div>
  );
}
