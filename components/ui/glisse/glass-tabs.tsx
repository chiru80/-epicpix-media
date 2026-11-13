"use client";

import React from "react";
import { SegmentedControl } from "glisse";
import { cn } from "@/lib/utils";

export interface GlassTabItem {
  value: string;
  label: React.ReactNode;
}

export interface GlassTabsProps {
  items: GlassTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function GlassTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: GlassTabsProps) {
  return (
    <div className={cn("inline-flex p-1 rounded-full glass-card", className)}>
      <SegmentedControl
        items={items}
        value={value}
        defaultValue={defaultValue || items[0]?.value}
        onValueChange={onValueChange}
      />
    </div>
  );
}

