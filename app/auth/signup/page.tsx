"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

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

      // Check if session was returned immediately (email confirmation disabled in Supabase)
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

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow-sm border border-border sm:rounded-xl sm:px-10 text-center">
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">Account Created!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Please check your email ({email}) to confirm your account before signing in.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block py-2.5 px-6 rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-display font-bold text-foreground">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-sm border border-border sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Alex Morgan"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="•••••••• (minimum 6 characters)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                I am joining as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("CLIENT")}
                  className={`py-2 px-3 text-sm font-medium rounded-lg border text-center transition-all ${
                    role === "CLIENT"
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  Client / Business
                </button>
                <button
                  type="button"
                  onClick={() => setRole("FREELANCER")}
                  className={`py-2 px-3 text-sm font-medium rounded-lg border text-center transition-all ${
                    role === "FREELANCER"
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  Creator / Freelancer
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
