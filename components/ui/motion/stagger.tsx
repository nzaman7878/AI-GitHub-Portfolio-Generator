"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal, type RevealDirection } from "./reveal";

interface StaggerContextValue {
  staggerDelay: number;
  baseDelay: number;
  direction: RevealDirection;
  duration: number;
  distance: number;
}

const StaggerContext = React.createContext<StaggerContextValue>({
  staggerDelay: 80,
  baseDelay: 0,
  direction: "up",
  duration: 500,
  distance: 20,
});

export interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Delay step between subsequent child items in ms (default: 80ms) */
  staggerDelay?: number;
  /** Base delay before the first item starts in ms (default: 0) */
  baseDelay?: number;
  /** Common direction for staggered children (default: 'up') */
  direction?: RevealDirection;
  /** Animation duration per child in ms (default: 500) */
  duration?: number;
  /** Slide distance per child in px (default: 20) */
  distance?: number;
}

export function StaggerContainer({
  children,
  staggerDelay = 80,
  baseDelay = 0,
  direction = "up",
  duration = 500,
  distance = 20,
  className,
  ...props
}: StaggerContainerProps) {
  const contextValue = React.useMemo(
    () => ({
      staggerDelay,
      baseDelay,
      direction,
      duration,
      distance,
    }),
    [staggerDelay, baseDelay, direction, duration, distance],
  );

  return (
    <StaggerContext.Provider value={contextValue}>
      <div className={cn("stagger-container", className)} {...props}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

export interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Explicit index for calculating delay offset */
  index: number;
  /** Override direction for this specific item */
  direction?: RevealDirection;
  /** Custom extra delay offset */
  extraDelay?: number;
}

export function StaggerItem({
  children,
  index,
  direction: overrideDirection,
  extraDelay = 0,
  className,
  ...props
}: StaggerItemProps) {
  const context = React.useContext(StaggerContext);

  const delay = context.baseDelay + index * context.staggerDelay + extraDelay;
  const direction = overrideDirection ?? context.direction;

  return (
    <Reveal
      direction={direction}
      delay={delay}
      duration={context.duration}
      distance={context.distance}
      className={className}
      {...props}
    >
      {children}
    </Reveal>
  );
}
