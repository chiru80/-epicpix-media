import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { GlassCard, GlassBadge, GlassPanel, GlassButton, GlassInput, GlassSwitch } from "@/components/ui/glisse";

describe("EpicPix Glisse Liquid Glass Design System", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("GlassCard", () => {
    it("renders with glass-card base class and specular highlight", () => {
      render(<GlassCard>Card Content</GlassCard>);
      const card = screen.getByText("Card Content");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("glass-card");
      expect(card).toHaveClass("glass-specular");
    });

    it("renders elevated variant", () => {
      render(<GlassCard variant="elevated">Elevated Content</GlassCard>);
      const card = screen.getByText("Elevated Content");
      expect(card).toHaveClass("glass-card-elevated");
    });
  });

  describe("GlassBadge", () => {
    it("renders primary variant with expected styling", () => {
      render(<GlassBadge variant="primary">Verified Pro</GlassBadge>);
      const badge = screen.getByText("Verified Pro");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("bg-primary/10");
    });

    it("renders success variant", () => {
      render(<GlassBadge variant="success">Completed</GlassBadge>);
      const badge = screen.getByText("Completed");
      expect(badge).toHaveClass("bg-emerald-500/10");
    });
  });

  describe("GlassPanel", () => {
    it("renders glass-panel container with specular highlight", () => {
      render(<GlassPanel>Panel Content</GlassPanel>);
      const panel = screen.getByText("Panel Content");
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveClass("glass-panel");
    });
  });

  describe("GlassButton", () => {
    it("renders as an accessible Link when href is provided", () => {
      render(
        <GlassButton href="/explore" variant="filled">
          Explore Creators
        </GlassButton>
      );
      const link = screen.getByRole("link", { name: /explore creators/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/explore");
      expect(link).toHaveClass("bg-primary");
    });
  });

  describe("GlassInput", () => {
    it("renders input field with label and placeholder", () => {
      render(<GlassInput id="test-input" label="Full Name" placeholder="Enter name" />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
    });

    it("displays error message when error prop is provided", () => {
      render(<GlassInput id="err-input" label="Email" error="Invalid email address" />);
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  describe("GlassSwitch", () => {
    it("renders switch with accessible label and description", () => {
      render(
        <GlassSwitch
          id="rush-switch"
          label="Rush Delivery"
          description="Reduces delivery time"
          defaultChecked={true}
        />
      );
      expect(screen.getByText("Rush Delivery")).toBeInTheDocument();
      expect(screen.getByText("Reduces delivery time")).toBeInTheDocument();
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toBeInTheDocument();
    });
  });
});

