"use client";

import React from "react";
import { Switch as GlisseSwitch } from "glisse";
import { cn } from "@/lib/utils";

export interface GlassSwitchProps {
  id?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function GlassSwitch({
  id,
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: GlassSwitchProps) {
  const switchElement = (
    <GlisseSwitch
      id={id}
      aria-label={ariaLabel || label}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    />
  );

  if (!label && !description) {
    return switchElement;
  }

  return (
    <div className={cn("flex items-center justify-between gap-4 select-none", className)}>
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium text-foreground cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      {switchElement}
    </div>
  );
}

