"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono font-medium transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none outline-none focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-telemetry-cyan focus-visible:ring-offset-2";

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-ink-primary text-paper-canvas border border-ink-primary hover:bg-terracotta hover:border-terracotta hover:shadow-planar active:translate-x-0.5 active:translate-y-0.5 dark:bg-bone dark:text-obsidian-void dark:border-bone dark:hover:bg-telemetry-cyan dark:hover:border-telemetry-cyan dark:hover:text-obsidian-void dark:hover:shadow-planar-dark",
      secondary:
        "bg-paper-sheet text-ink-primary border border-hairline hover:bg-paper-elevated hover:border-hairline-strong hover:shadow-planar active:translate-x-0.5 active:translate-y-0.5 dark:bg-obsidian-panel dark:text-bone dark:border-obsidian-border dark:hover:bg-obsidian-card dark:hover:border-bone-muted",
      outline:
        "bg-transparent text-ink-primary border border-hairline hover:bg-paper-sheet hover:border-ink-primary dark:text-bone dark:border-obsidian-border dark:hover:bg-obsidian-panel dark:hover:border-bone",
      ghost:
        "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-paper-sheet dark:text-bone-secondary dark:hover:text-bone dark:hover:bg-obsidian-panel",
      destructive:
        "bg-terracotta text-white border border-terracotta-dark hover:bg-terracotta-dark hover:shadow-planar active:translate-x-0.5 active:translate-y-0.5 dark:bg-telemetry-rose dark:text-white dark:border-telemetry-rose dark:hover:bg-red-600",
    };

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3 text-xs tracking-wider uppercase rounded-none gap-1.5",
      md: "h-10 px-4 text-xs tracking-wider uppercase rounded-none gap-2",
      lg: "h-12 px-6 text-sm tracking-wider uppercase rounded-none gap-2.5",
      icon: "h-10 w-10 p-0 rounded-none shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
