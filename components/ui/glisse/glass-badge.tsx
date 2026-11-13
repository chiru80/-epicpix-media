import React from "react";
import { cn } from "@/lib/utils";

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "destructive" | "gold";
  size?: "default" | "sm";
  children: React.ReactNode;
}

export function GlassBadge({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: GlassBadgeProps) {
  const variantStyles = {
    default: "bg-white/5 border-white/10 text-foreground",
    primary: "bg-primary/10 border-primary/30 text-primary shadow-sm shadow-primary/10",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    destructive: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    gold: "bg-amber-400/10 border-amber-400/30 text-amber-300 shadow-sm shadow-amber-400/10",
  };

  const sizeStyles = {
    default: "px-3 py-1 text-xs font-medium",
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

