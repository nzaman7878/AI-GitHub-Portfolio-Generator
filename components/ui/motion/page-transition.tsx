"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * The animation style of the transition
   * - 'aperture': subtle blur and scale expansion (editorial magazine feel)
   * - 'lift': crisp vertical translateY slide-up with opacity
   * - 'slide': horizontal directional entrance
   */
  variant?: "aperture" | "lift" | "slide";
  /** Optional delay before triggering animation in ms */
  delay?: number;
}

export function PageTransition({
  children,
  variant = "aperture",
  delay = 0,
  className,
  style,
  ...props
}: PageTransitionProps) {
  const variantClass = {
    aperture: "animate-page-aperture",
    lift: "animate-page-enter",
    slide: "animate-reveal-right",
  }[variant];

  const inlineStyle: React.CSSProperties = {
    ...style,
    animationDelay: delay > 0 ? `${delay}ms` : undefined,
    animationFillMode: "both",
  };

  return (
    <div
      className={cn("w-full transition-opacity duration-300", variantClass, className)}
      style={inlineStyle}
      {...props}
    >
      {children}
    </div>
  );
}
