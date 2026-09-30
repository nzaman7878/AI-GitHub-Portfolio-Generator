"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      id,
      disabled,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const [charCount, setCharCount] = React.useState<number>(() => {
      const initial = value ?? defaultValue ?? "";
      return typeof initial === "string" ? initial.length : 0;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-mono font-medium uppercase tracking-wider text-ink-secondary dark:text-bone-secondary"
            >
              {label}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-[11px] font-mono text-ink-muted dark:text-bone-muted tabular-nums">
              {charCount} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "w-full min-h-[100px] p-3 text-sm font-sans bg-paper-canvas dark:bg-obsidian-void text-ink-primary dark:text-bone placeholder:text-ink-ghost dark:placeholder:text-bone-muted border rounded-none transition-colors outline-none resize-y",
            error
              ? "border-terracotta dark:border-telemetry-rose focus:ring-1 focus:ring-terracotta"
              : "border-hairline dark:border-obsidian-border focus:border-ink-primary dark:focus:border-telemetry-cyan focus:ring-1 focus:ring-ink-primary dark:focus:ring-telemetry-cyan",
            disabled && "opacity-50 cursor-not-allowed bg-paper-sheet dark:bg-obsidian-panel",
            className,
          )}
          {...props}
        />

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

Textarea.displayName = "Textarea";
