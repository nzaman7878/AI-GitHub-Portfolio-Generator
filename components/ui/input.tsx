"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixText?: string;
  prefixIcon?: React.ReactNode;
  suffixText?: string;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      prefixText,
      prefixIcon,
      suffixText,
      suffixIcon,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-medium uppercase tracking-wider text-ink-secondary dark:text-bone-secondary"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center w-full border bg-paper-canvas dark:bg-obsidian-void transition-colors",
            error
              ? "border-terracotta dark:border-telemetry-rose focus-within:ring-1 focus-within:ring-terracotta"
              : "border-hairline dark:border-obsidian-border focus-within:border-ink-primary dark:focus-within:border-telemetry-cyan focus-within:ring-1 focus-within:ring-ink-primary dark:focus-within:ring-telemetry-cyan",
            disabled && "opacity-50 cursor-not-allowed bg-paper-sheet dark:bg-obsidian-panel",
          )}
        >
          {prefixIcon && (
            <div className="pl-3 pr-2 text-ink-muted dark:text-bone-muted shrink-0">
              {prefixIcon}
            </div>
          )}

          {prefixText && (
            <span className="pl-3 pr-1 text-xs font-mono text-ink-muted dark:text-bone-muted shrink-0 select-none">
              {prefixText}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full h-10 px-3 text-sm font-sans bg-transparent text-ink-primary dark:text-bone placeholder:text-ink-ghost dark:placeholder:text-bone-muted outline-none disabled:cursor-not-allowed",
              prefixIcon && "pl-0",
              prefixText && "pl-1",
              suffixIcon && "pr-0",
              suffixText && "pr-1",
              className,
            )}
            {...props}
          />

          {suffixText && (
            <span className="pr-3 pl-1 text-xs font-mono text-ink-muted dark:text-bone-muted shrink-0 select-none">
              {suffixText}
            </span>
          )}

          {suffixIcon && (
            <div className="pr-3 pl-2 text-ink-muted dark:text-bone-muted shrink-0">
              {suffixIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-mono text-terracotta dark:text-telemetry-rose tracking-wide">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="text-xs text-ink-muted dark:text-bone-secondary">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
