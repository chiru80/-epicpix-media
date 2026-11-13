"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X as MenuX, Menu as MenuIcon, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/glisse";
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
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-5 sm:px-6 h-16 flex items-center justify-between shadow-lg shadow-black/20 border border-white/10 backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-bold text-primary group-hover:brightness-110 transition-all">
              EpicPix
            </span>
            <span className="text-sm font-medium tracking-wider uppercase text-foreground/80">
              Media
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              <span>Explore</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </Link>
            <Link
              href="/services"
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <GlassButton
                  href={dashboardLink}
                  size="sm"
                  variant="outline"
                  className="!text-xs font-semibold"
                >
                  {role === "ADMIN" ? "Admin Panel" : role === "FREELANCER" ? "Creator Hub" : "Dashboard"}
                </GlassButton>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <GlassButton
                  href="/auth/signup"
                  size="sm"
                  variant="filled"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  className="!text-xs font-semibold"
                >
                  Get Started
                </GlassButton>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl glass-card text-foreground hover:text-primary transition-colors"
            aria-label="Open navigation menu"
          >
            {isMenuOpen ? <MenuX className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 p-5 rounded-2xl glass-card-elevated border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={toggleMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-foreground font-medium text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                href="/explore"
                onClick={toggleMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-primary font-medium text-sm transition-colors flex items-center justify-between"
              >
                <span>Explore Creators</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">Marketplace</span>
              </Link>
              <Link
                href="/services"
                onClick={toggleMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-foreground font-medium text-sm transition-colors"
              >
                Services
              </Link>
              <Link
                href="/portfolio"
                onClick={toggleMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-foreground font-medium text-sm transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                onClick={toggleMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-foreground font-medium text-sm transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={toggleMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-foreground font-medium text-sm transition-colors"
              >
                Contact
              </Link>

              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                {user ? (
                  <>
                    <GlassButton
                      href={dashboardLink}
                      variant="filled"
                      size="sm"
                      className="w-full justify-center"
                    >
                      {role === "ADMIN" ? "Admin Panel" : role === "FREELANCER" ? "Creator Hub" : "Dashboard"}
                    </GlassButton>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      className="py-2 px-3 text-center text-xs text-muted-foreground hover:text-foreground"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <GlassButton
                      href="/auth/signin"
                      variant="glass"
                      size="sm"
                      className="w-full justify-center"
                    >
                      Sign In
                    </GlassButton>
                    <GlassButton
                      href="/auth/signup"
                      variant="filled"
                      size="sm"
                      className="w-full justify-center"
                    >
                      Get Started
                    </GlassButton>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
