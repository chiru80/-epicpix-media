"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * StatCard - Dashboard KPI tile
 *
 * Displays a single metric with optional trend indicator.
 * All styling comes from design tokens (globals.css variables).
 */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
  href,
}: StatCardProps) {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: "text-success",
      label: "up",
    },
    down: {
      icon: TrendingDown,
      color: "text-destructive",
      label: "down",
    },
    neutral: {
      icon: Minus,
      color: "text-muted-foreground",
      label: "no change",
    },
  };

  const TrendIcon = trend ? trendConfig[trend].icon : null;
  const trendColor = trend ? trendConfig[trend].color : "";

  const content = (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-5 shadow-sm transition-all",
        "hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          {trend && trendValue && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium mt-1",
                trendColor
              )}
              aria-label={`trend ${trendConfig[trend].label}`}
            >
              <TrendIcon className="h-3 w-3" />
              {trendValue}
            </span>
          )}
        </div>
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-xl"
        aria-label={`${title}: ${value}`}
      >
        {content}
      </a>
    );
  }

  return content;
}