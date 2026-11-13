"use client";

import React from "react";
import Link from "next/link";
import { Button as GlisseNativeButton } from "glisse";
import { cn } from "@/lib/utils";

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "glass" | "filled" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  tint?: string;
  className?: string;
  children?: React.ReactNode;
}

export function GlassButton({
  variant = "glass",
  size = "default",
  href,
  icon,
  destructive = false,
  tint,
  className,
  children,
  onClick,
  disabled,
  type = "button",
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    default: "h-10 px-5 text-sm",
    sm: "h-8 px-3.5 text-xs",
    lg: "h-12 px-7 text-base font-semibold",
    icon: "h-10 w-10 p-0 justify-center",
  };

  // If href is provided, render an accessible Next.js Link styled with Glisse liquid glass
  if (href) {
    const isFilled = variant === "filled";
    const isOutline = variant === "outline";

    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none",
          sizeClasses[size],
          isFilled
            ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25 border border-primary/40"
            : isOutline
            ? "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 backdrop-blur-md"
            : "glass-card text-foreground hover:border-primary/40 hover:text-primary backdrop-blur-lg hover:shadow-lg hover:shadow-primary/10",
          destructive && "bg-destructive text-destructive-foreground border-destructive",
          disabled && "opacity-40 pointer-events-none",
          className
        )}
      >
        {icon && <span className="flex-none">{icon}</span>}
        {children && <span>{children}</span>}
      </Link>
    );
  }

  // If native Glisse button is applicable
  const glisseVariant = variant === "filled" ? "filled" : "glass";

  return (
    <GlisseNativeButton
      variant={glisseVariant}
      destructive={destructive}
      tint={tint}
      icon={icon}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(
        size === "lg" && "!h-12 !px-7 !text-base !rounded-3xl",
        size === "sm" && "!h-8 !px-3.5 !text-xs !rounded-xl",
        size === "icon" && "!h-10 !w-10 !p-0 !rounded-full",
        variant === "filled" && "!bg-primary !text-primary-foreground hover:!brightness-110",
        className
      )}
      {...props}
    >
      {children}
    </GlisseNativeButton>
  );
}

