import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders with default variant and size", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("h-10 py-2 px-4 text-sm rounded");
    expect(button).toHaveClass("bg-primary text-primary-foreground");
  });

  it("renders with outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button", { name: /outline/i });
    expect(button).toHaveClass("border border-primary text-primary");
    expect(button).not.toHaveClass("bg-primary");
  });

  it("renders with ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button", { name: /ghost/i });
    expect(button).toHaveClass("hover:bg-primary/20");
  });

  it("renders with secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("bg-secondary text-secondary-foreground");
  });

  it("renders sm size", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("h-8 py-1 px-3 text-sm rounded");
  });

  it("renders lg size", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button", { name: /large/i });
    expect(button).toHaveClass("h-12 py-3 px-6 text-base rounded");
  });

  it("renders icon size", () => {
    render(<Button size="icon">Zap</Button>);
    const button = screen.getByRole("button", { name: /zap/i });
    expect(button).toHaveClass("h-10 w-10 rounded-md");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button", { name: /custom/i });
    expect(button).toHaveClass("custom-class");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});
