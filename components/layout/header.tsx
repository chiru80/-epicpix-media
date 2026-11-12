"use client";

import { useState } from "react";
import Link from "next/link";
import { X as MenuX, Menu as MenuIcon, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-display font-bold text-primary">EpicPix</span>
            <span className="text-base">Media</span>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            onClick={toggleMenu}
            size="icon"
            className="md:hidden p-2"
            aria-label="Open navigation menu"
          >
            {isMenuOpen ? <MenuX className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a href="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a href="/services"
              className="text-foreground hover:text-primary transition-colors"
            >
              Services
            </a>
            <a href="/portfolio"
              className="text-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </a>
            <a href="/contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col h-full p-6 pt-20 gap-8">
              <button
                onClick={toggleMenu}
                className="absolute top-6 right-6 p-2"
                aria-label="Close navigation menu"
              >
                <MenuX className="w-6 h-6" />
              </button>
              <nav className="flex flex-col gap-6">
                <a href="/"
                  className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors"
                >
                  Home
                </a>
                <a href="/about"
                  className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors"
                >
                  About
                </a>
                <a href="/services"
                  className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors"
                >
                  Services
                </a>
                <a href="/portfolio"
                  className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors"
                >
                  Portfolio
                </a>
                <a href="/contact"
                  className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors"
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}