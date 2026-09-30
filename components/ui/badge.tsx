import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "terracotta"
    | "success"
    | "cyan"
    | "warning"
    | "destructive";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  dotColor?: string;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-mono font-medium rounded-none uppercase transition-colors select-none";

  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "bg-paper-elevated text-ink-primary border border-hairline dark:bg-obsidian-card dark:text-bone dark:border-obsidian-border",
    secondary:
      "bg-paper-sheet text-ink-secondary border border-hairline-subtle dark:bg-obsidian-panel dark:text-bone-secondary dark:border-obsidian-border",
    outline:
      "bg-transparent text-ink-secondary border border-hairline dark:text-bone-secondary dark:border-obsidian-border",
    terracotta:
      "bg-terracotta-surface text-terracotta border border-terracotta/30 dark:bg-terracotta/20 dark:text-terracotta-light dark:border-terracotta/40",
    success:
      "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-telemetry-emerald dark:border-telemetry-emerald/30",
    cyan: "bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/40 dark:text-telemetry-cyan dark:border-telemetry-cyan/30",
    warning:
      "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-telemetry-amber dark:border-telemetry-amber/30",
    destructive:
      "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-telemetry-rose dark:border-telemetry-rose/30",
  };

  const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
    sm: "text-[10px] px-1.5 py-0.5 tracking-wider gap-1",
    md: "text-[11px] px-2 py-0.5 tracking-wider gap-1.5",
    lg: "text-xs px-2.5 py-1 tracking-wider gap-2",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor ? "" : "bg-current")}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export interface TechBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  category?: "language" | "framework" | "database" | "tool" | "infrastructure";
  percentage?: number;
  color?: string;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
}

/**
 * Specialized Badge component for displaying tech stack items and programming languages
 * with optional byte percentage and color dot.
 */
export function TechBadge({
  name,
  category,
  percentage,
  color,
  onRemove,
  size = "md",
  className,
  ...props
}: TechBadgeProps) {
  // Predefined standard colors for common technologies
  const techColor =
    color ??
    (name.toLowerCase() === "typescript"
      ? "#3178C6"
      : name.toLowerCase() === "javascript"
        ? "#F7DF1E"
        : name.toLowerCase() === "python"
          ? "#3776AB"
          : name.toLowerCase() === "rust"
            ? "#DEA584"
            : name.toLowerCase() === "go"
              ? "#00ADD8"
              : name.toLowerCase() === "c++"
                ? "#F34B7D"
                : name.toLowerCase() === "html"
                  ? "#E34F26"
                  : name.toLowerCase() === "css"
                    ? "#563D7C"
                    : "#8B8F9A");

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium border bg-paper-canvas dark:bg-obsidian-card border-hairline dark:border-obsidian-border text-ink-primary dark:text-bone transition-colors select-none",
        size === "sm" && "text-[10px] px-1.5 py-0.5 gap-1.5",
        size === "md" && "text-xs px-2.5 py-1 gap-2",
        size === "lg" && "text-sm px-3 py-1.5 gap-2.5",
        className,
      )}
      {...props}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: techColor }}
        aria-hidden="true"
      />
      <span className="font-semibold">{name}</span>

      {percentage !== undefined && (
        <span className="text-ink-muted dark:text-bone-muted tabular-nums text-[10px]">
          {percentage.toFixed(1)}%
        </span>
      )}

      {category && (
        <span className="text-ink-ghost dark:text-bone-muted uppercase text-[9px]">
          [{category}]
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 p-0.5 text-ink-muted hover:text-terracotta dark:hover:text-telemetry-rose transition-colors cursor-pointer"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
