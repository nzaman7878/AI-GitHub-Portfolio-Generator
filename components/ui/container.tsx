import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full" | "editorial";
  as?: React.ElementType;
  gutter?: boolean;
}

/**
 * Standard page container enforcing max-width constraints, responsive padding,
 * and editorial alignment across screen sizes.
 */
export function Container({
  className,
  size = "lg",
  as: Component = "div",
  gutter = true,
  children,
  ...props
}: ContainerProps) {
  const sizeStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1360px]",
    editorial: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <Component
      className={cn(
        "mx-auto w-full",
        gutter && "px-4 sm:px-6 md:px-8 lg:px-12",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
