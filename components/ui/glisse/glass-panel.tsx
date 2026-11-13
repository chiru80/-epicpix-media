import React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassPanel({
  glow = false,
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl relative overflow-hidden transition-all duration-300",
        glow && "shadow-[0_0_50px_-10px_rgba(56,189,248,0.2)]",
        className
      )}
      {...props}
    >
      {/* Specular Edge Highlight */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

