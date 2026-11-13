"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X as MenuX, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const supabase = createClient();

    // Check initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const role = (user?.user_metadata?.role || "CLIENT").toUpperCase();
  const dashboardLink = role === "ADMIN" ? "/admin" : role === "FREELANCER" ? "/freelancer" : "/dashboard";

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-primary">EpicPix</span>
            <span className="text-base text-foreground">Media</span>
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
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="/services" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="/portfolio" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Portfolio
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-4 border-l border-border pl-6">
                <Link
                  href={dashboardLink}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {role === "ADMIN" ? "Admin Panel" : role === "FREELANCER" ? "Creator Hub" : "Dashboard"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-border pl-6">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Join Us
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col h-full p-6 pt-20 gap-6">
              <button
                onClick={toggleMenu}
                className="absolute top-6 right-6 p-2"
                aria-label="Close navigation menu"
              >
                <MenuX className="w-6 h-6" />
              </button>
              <nav className="flex flex-col gap-4">
                <Link href="/" onClick={toggleMenu} className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors font-medium">
                  Home
                </Link>
                <Link href="/about" onClick={toggleMenu} className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors font-medium">
                  About
                </Link>
                <Link href="/services" onClick={toggleMenu} className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors font-medium">
                  Services
                </Link>
                <Link href="/portfolio" onClick={toggleMenu} className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors font-medium">
                  Portfolio
                </Link>
                <Link href="/contact" onClick={toggleMenu} className="block py-2 px-4 hover:bg-primary/10 text-primary transition-colors font-medium">
                  Contact
                </Link>

                <div className="border-t border-border pt-4 mt-2">
                  {user ? (
                    <>
                      <Link
                        href={dashboardLink}
                        onClick={toggleMenu}
                        className="block py-2 px-4 font-medium text-primary"
                      >
                        {role === "ADMIN" ? "Admin Panel" : role === "FREELANCER" ? "Creator Hub" : "Dashboard"}
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          toggleMenu();
                        }}
                        className="block w-full text-left py-2 px-4 text-muted-foreground"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        onClick={toggleMenu}
                        className="block py-2 px-4 font-medium text-primary"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={toggleMenu}
                        className="block py-2 px-4 font-medium text-muted-foreground"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
