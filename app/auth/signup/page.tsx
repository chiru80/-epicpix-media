"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Sparkles, Check, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { GlassPanel, GlassBadge, GlassCard } from "@/components/ui/glisse";

function SignUpContent() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "FREELANCER">("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If auto-confirmed
      if (data.session) {
        if (role === "FREELANCER") {
          router.push("/freelancer");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <GlassBadge variant="primary" size="default" className="mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Join EpicPix Platform</span>
          </GlassBadge>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <GlassPanel glow className="p-8 sm:p-10 shadow-2xl">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">Check Your Email</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Please click the link to activate your EpicPix account.
              </p>
              <div className="pt-4">
                <Link
                  href="/auth/signin"
                  className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:brightness-110"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-relaxed">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    I am joining as a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("CLIENT")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === "CLIENT"
                          ? "bg-primary/15 border-primary/50 text-foreground ring-1 ring-primary/30"
                          : "bg-black/30 border-white/5 text-muted-foreground hover:border-white/15"
                      }`}
                    >
                      <User className="w-4 h-4 mb-1 text-primary" />
                      <strong className="block text-xs font-semibold text-foreground">Client / Brand</strong>
                      <span className="text-[10px] text-muted-foreground">Order creative media</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("FREELANCER")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === "FREELANCER"
                          ? "bg-primary/15 border-primary/50 text-foreground ring-1 ring-primary/30"
                          : "bg-black/30 border-white/5 text-muted-foreground hover:border-white/15"
                      }`}
                    >
                      <Briefcase className="w-4 h-4 mb-1 text-primary" />
                      <strong className="block text-xs font-semibold text-foreground">Creator</strong>
                      <span className="text-[10px] text-muted-foreground">Deliver projects & earn</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-muted-foreground pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                      placeholder="e.g. Maya Iyer"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-muted-foreground pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-muted-foreground pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 shadow-lg shadow-primary/25 border border-primary/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Creating account...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automatic Role Provisioning & Profiles</span>
                </span>
              </div>
            </>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading registration...</p>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
