import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle" | "interactive";
  specular?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  variant = "default",
  specular = true,
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "glass-card",
    elevated: "glass-card-elevated",
    subtle: "bg-epicpix-glass-subtle backdrop-blur-md border border-white/5",
    interactive: "glass-card glass-card-interactive cursor-pointer",
  };

  return (
    <div
      className={cn(
        "rounded-2xl relative overflow-hidden transition-all duration-300",
        variantStyles[variant],
        specular && "glass-specular",
        glow && "shadow-[0_0_30px_-5px_rgba(56,189,248,0.25)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

