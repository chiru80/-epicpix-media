"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, rightElement, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-foreground/90 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full h-11 rounded-xl bg-epicpix-glass/70 backdrop-blur-md border border-white/10 text-foreground text-sm px-4 transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-epicpix-glass-elevated shadow-inner",
              icon && "pl-10",
              rightElement && "pr-10",
              error && "border-destructive/60 focus:border-destructive focus:ring-destructive/20",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

