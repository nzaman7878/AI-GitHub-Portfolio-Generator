"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TelemetryDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Telemetry status color */
  status?: "emerald" | "cyan" | "amber" | "rose" | "muted";
  /** Pulse halo animation active */
  pulse?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export function TelemetryDot({
  status = "emerald",
  pulse = true,
  size = "md",
  className,
  ...props
}: TelemetryDotProps) {
  const sizeClass = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  }[size];

  const colorClass = {
    emerald: "bg-telemetry-emerald text-telemetry-emerald",
    cyan: "bg-telemetry-cyan text-telemetry-cyan",
    amber: "bg-telemetry-amber text-telemetry-amber",
    rose: "bg-telemetry-rose text-telemetry-rose",
    muted: "bg-ink-muted/50 dark:bg-bone-muted text-ink-muted",
  }[status];

  const pulseAnimationClass = pulse
    ? status === "cyan"
      ? "telemetry-pulse-cyan"
      : status === "emerald"
        ? "telemetry-pulse-emerald"
        : "animate-pulse"
    : "";

  return (
    <span
      className={cn(
        "relative inline-block rounded-full flex-shrink-0 transition-colors duration-200",
        sizeClass,
        colorClass,
        pulseAnimationClass,
        className,
      )}
      {...props}
    />
  );
}

export interface HairlineExpandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction from which the hairline line expands */
  origin?: "left" | "center" | "right";
  /** Delay in milliseconds before expansion begins */
  delay?: number;
  /** Duration in milliseconds (default: 600) */
  duration?: number;
}

export function HairlineExpand({
  origin = "left",
  delay = 100,
  duration = 600,
  className,
  style,
  ...props
}: HairlineExpandProps) {
  const [expanded, setExpanded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setExpanded(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setExpanded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const originClass = {
    left: "origin-left",
    center: "origin-center",
    right: "origin-right",
  }[origin];

  const dynamicStyle: React.CSSProperties = {
    ...style,
    transform: expanded ? "scaleX(1)" : "scaleX(0)",
    transitionProperty: "transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full h-px bg-hairline dark:bg-hairline-dark will-change-transform",
        originClass,
        className,
      )}
      style={dynamicStyle}
      {...props}
    />
  );
}

export interface InteractiveLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export function InteractiveLink({ children, className, ...props }: InteractiveLinkProps) {
  return (
    <a
      className={cn(
        "hover-editorial-line font-medium text-ink-primary dark:text-bone hover:text-terracotta dark:hover:text-telemetry-cyan transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
