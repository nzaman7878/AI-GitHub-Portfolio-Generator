import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "success" | "warning" | "destructive";
  title?: string;
  icon?: React.ReactNode;
}

export function Alert({
  className,
  variant = "default",
  title,
  icon,
  children,
  ...props
}: AlertProps) {
  const variantStyles: Record<
    NonNullable<AlertProps["variant"]>,
    { container: string; icon: React.ReactNode }
  > = {
    default: {
      container:
        "bg-paper-sheet border-hairline text-ink-primary dark:bg-obsidian-panel dark:border-obsidian-border dark:text-bone",
      icon: <Info className="w-4 h-4 text-ink-secondary dark:text-bone-secondary shrink-0" />,
    },
    info: {
      container:
        "bg-cyan-50/50 border-cyan-200 text-cyan-950 dark:bg-cyan-950/20 dark:border-cyan-900/40 dark:text-cyan-200",
      icon: <Info className="w-4 h-4 text-telemetry-cyan shrink-0" />,
    },
    success: {
      container:
        "bg-emerald-50/50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-200",
      icon: <CheckCircle2 className="w-4 h-4 text-telemetry-emerald shrink-0" />,
    },
    warning: {
      container:
        "bg-amber-50/50 border-amber-200 text-amber-950 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-200",
      icon: <AlertTriangle className="w-4 h-4 text-telemetry-amber shrink-0" />,
    },
    destructive: {
      container:
        "bg-terracotta-surface border-terracotta/40 text-terracotta-dark dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-200",
      icon: <AlertCircle className="w-4 h-4 text-terracotta dark:text-telemetry-rose shrink-0" />,
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full border p-4 font-sans text-sm rounded-none space-y-1 transition-colors",
        current.container,
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon ?? current.icon}
        <div className="min-w-0 flex-1">
          {title && (
            <h5 className="font-mono font-medium uppercase tracking-wider text-xs mb-1">{title}</h5>
          )}
          <div className="text-xs leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}
