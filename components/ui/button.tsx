"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-primary text-primary hover:bg-primary/10",
  ghost: "hover:bg-primary/20",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/10",
};

const sizes = {
  default: "h-10 py-2 px-4 text-sm rounded",
  sm: "h-8 py-1 px-3 text-sm rounded",
  lg: "h-12 py-3 px-6 text-base rounded",
  icon: "h-10 w-10 rounded-md",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const VariantClass = variants[variant] || variants.default;
  const SizeClass = sizes[size] || sizes.default;

  return (
    <button
      className={cn(SizeClass, VariantClass, className)}
      {...props}
    />
  );
}