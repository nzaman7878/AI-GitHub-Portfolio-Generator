"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Direction from which the element slides into view */
  direction?: RevealDirection;
  /** Delay in milliseconds before reveal starts once in viewport */
  delay?: number;
  /** Duration of reveal in milliseconds (default: 500) */
  duration?: number;
  /** Distance in pixels for the slide offset (default: 20) */
  distance?: number;
  /** Viewport intersection threshold (0 to 1, default: 0.15) */
  threshold?: number;
  /** Root margin for triggering ahead of scroll (e.g. "0px 0px -50px 0px") */
  rootMargin?: string;
  /** Trigger animation only once (default: true) */
  once?: boolean;
  /** HTML tag to render (default: 'div') */
  as?: React.ElementType;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 500,
  distance = 20,
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
  once = true,
  as: Component = "div",
  className,
  style,
  ...props
}: RevealProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion or if IntersectionObserver is unavailable
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  // Compute transform based on direction and visibility
  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "none":
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  const dynamicStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <Component
      ref={ref}
      className={cn("reveal-element", className)}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
