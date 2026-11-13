import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. If user is signed in and visits /auth/signin or /auth/signup, redirect to home or role dashboard
  if (user && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
    const role = (user.user_metadata?.role || "CLIENT").toUpperCase();
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "FREELANCER") {
      return NextResponse.redirect(new URL("/freelancer", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Protected Route: /admin and /admin/*
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check user role from metadata or users table
    const metaRole = (user.user_metadata?.role || "").toUpperCase();

    if (metaRole === "ADMIN") {
      return response;
    }

    // Verify against public.users table
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const dbRole = (userData?.role || "").toUpperCase();
    if (dbRole !== "ADMIN") {
      // Forbidden: redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Protected Route: /dashboard (Client Dashboard)
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 4. Protected Route: /freelancer (Freelancer Dashboard)
  if (pathname.startsWith("/freelancer")) {
    if (!user) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const metaRole = (user.user_metadata?.role || "").toUpperCase();
    if (metaRole === "FREELANCER" || metaRole === "ADMIN") {
      return response;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const dbRole = (userData?.role || "").toUpperCase();
    if (dbRole !== "FREELANCER" && dbRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/freelancer/:path*",
    "/auth/:path*",
  ],
};
