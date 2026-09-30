"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, children, id, disabled, ...props }, ref) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-mono font-medium uppercase tracking-wider text-ink-secondary dark:text-bone-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-10 pl-3 pr-10 text-sm font-sans bg-paper-canvas dark:bg-obsidian-void text-ink-primary dark:text-bone border rounded-none appearance-none cursor-pointer outline-none transition-colors",
              error
                ? "border-terracotta dark:border-telemetry-rose focus:ring-1 focus:ring-terracotta"
                : "border-hairline dark:border-obsidian-border focus:border-ink-primary dark:focus:border-telemetry-cyan focus:ring-1 focus:ring-ink-primary dark:focus:ring-telemetry-cyan",
              disabled && "opacity-50 cursor-not-allowed bg-paper-sheet dark:bg-obsidian-panel",
              className,
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted dark:text-bone-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = "Select";
