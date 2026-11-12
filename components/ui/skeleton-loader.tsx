"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Skeleton loader for async states
 * Premium animated skeleton with pulse effect
 */
export function SkeletonLoader({
  lines = 6,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("animate-bounce", className)}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-6 w-full rounded-md mb-3 bg-gray-100/50 animate-pulse" // ds-allow-hardcode
          style={{ transitionDelay: `${i * 0.1}s` } as CSSProperties} // ds-allow-hardcode
        />
      ))}
    </div>
  );
}

/**
 * Skeleton text line for paragraph loading
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 w-full rounded-md my-2 bg-gray-100/50 animate-pulse" // ds-allow-hardcode
        />
      ))}
    </div>
  );
}

/**
 * Skeleton image placeholder
 */
export function SkeletonImage({
  className,
  size = "square",
}: {
  className?: string;
  size?: "square" | "rectangle";
}) {
  const sizeClasses = {
    square: "h-24 w-24", // ds-allow-hardcode
    rectangle: "h-48 w-full", // ds-allow-hardcode
  };

  return (
    <div
      className={cn(
        `h-24 w-24 rounded-md bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center`, // ds-allow-hardcode
        sizeClasses[size],
        className
      )}
    >
      <span className="w-8 h-8 rounded-md bg-gray-300" /> {/* ds-allow-hardcode */}
    </div>
  );
}