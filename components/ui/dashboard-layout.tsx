"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * DashboardLayout - Consistent dashboard shell
 *
 * Provides a centered, responsive container with a header slot and
 * content area. All sizing is fluid (no fixed px widths that break
 * on mobile).
 */
interface DashboardLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardLayout({
  children,
  header,
  className,
  contentClassName,
}: DashboardLayoutProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-background",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        {header && (
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {header}
          </header>
        )}
        <div className={cn("flex flex-col gap-6", contentClassName)}>
          {children}
        </div>
      </div>
    </main>
  );
}