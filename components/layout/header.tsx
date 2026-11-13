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
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="apple-frosted-nav rounded-full px-6 h-14 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-apple-blue-vibrant shadow-[0_0_10px_#2997ff] group-hover:scale-125 transition-transform" />
            <span className="text-xl font-display font-semibold tracking-tight text-white group-hover:text-apple-blue-vibrant transition-colors">
              EpicPix
            </span>
            <span className="text-xs font-medium tracking-widest uppercase text-apple-gray">
              Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-apple-lightgray hover:text-white transition-colors text-xs font-medium tracking-tight px-2 py-1 rounded-md hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-apple-lightgray hover:text-white transition-colors text-xs font-medium tracking-tight px-2 py-1 rounded-md hover:bg-white/5 flex items-center gap-1.5"
            >
              <span>Explore</span>
              <span className="w-1.5 h-1.5 rounded-full bg-apple-blue shadow-[0_0_6px_#0071e3]" />
            </Link>
            <Link
              href="/services"
              className="text-apple-lightgray hover:text-white transition-colors text-xs font-medium tracking-tight px-2 py-1 rounded-md hover:bg-white/5"
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              className="text-apple-lightgray hover:text-white transition-colors text-xs font-medium tracking-tight px-2 py-1 rounded-md hover:bg-white/5"
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className="text-apple-lightgray hover:text-white transition-colors text-xs font-medium tracking-tight px-2 py-1 rounded-md hover:bg-white/5"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-apple-lightgray hover:text-white transition-colors text-xs font-medium tracking-tight px-2 py-1 rounded-md hover:bg-white/5"
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-3 border-l border-white/10 pl-5">
                <Link
                  href={dashboardLink}
                  className="apple-pill-btn apple-pill-secondary text-xs px-4 py-1.5 font-medium"
                >
                  {role === "ADMIN" ? "Admin Panel" : role === "FREELANCER" ? "Creator Studio" : "Dashboard"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-apple-gray hover:text-white transition-colors px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-white/10 pl-5">
                <Link
                  href="/auth/signin"
                  className="text-xs font-medium text-apple-lightgray hover:text-white transition-colors px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="apple-pill-btn apple-pill-primary text-xs px-4 py-1.5 font-medium flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Open navigation menu"
          >
            {isMenuOpen ? <MenuX className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 p-5 rounded-3xl apple-bento-card border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={toggleMenu}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 text-white font-medium text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                href="/explore"
                onClick={toggleMenu}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 text-apple-blue-vibrant font-medium text-sm transition-colors flex items-center justify-between"
              >
                <span>Explore Creators</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-apple-blue/20 text-apple-blue-vibrant">Marketplace</span>
              </Link>
              <Link
                href="/services"
                onClick={toggleMenu}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 text-white font-medium text-sm transition-colors"
              >
                Services
              </Link>
              <Link
                href="/portfolio"
                onClick={toggleMenu}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 text-white font-medium text-sm transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                onClick={toggleMenu}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 text-white font-medium text-sm transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={toggleMenu}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 text-white font-medium text-sm transition-colors"
              >
                Contact
              </Link>

              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href={dashboardLink}
                      onClick={toggleMenu}
                      className="apple-pill-btn apple-pill-primary text-xs py-2.5 w-full text-center"
                    >
                      {role === "ADMIN" ? "Admin Panel" : role === "FREELANCER" ? "Creator Studio" : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      className="py-2 text-center text-xs text-apple-gray hover:text-white"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/auth/signin"
                      onClick={toggleMenu}
                      className="apple-pill-btn apple-pill-secondary text-xs py-2 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={toggleMenu}
                      className="apple-pill-btn apple-pill-primary text-xs py-2 text-center"
                    >
                      Get Started
                    </Link>
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
