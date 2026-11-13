import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Warn in development if keys are missing
if (
  typeof window !== "undefined" &&
  (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
) {
  console.warn(
    "Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

/**
 * Creates a Supabase client for client-side (browser) usage.
 * In the browser, it uses @supabase/ssr createBrowserClient which sets cookies
 * for seamless session sharing with Next.js Server Components and Middleware.
 * Falls back to standard Supabase client in non-browser contexts.
 */
export const createClient = () => {
  if (typeof window !== "undefined") {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * Uses cookies from next/headers to read and write the user's authenticated session.
 */
export async function createServerSupabaseClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can happen in Server Components; ignored because middleware refreshes cookies.
        }
      },
    },
  });
}

/**
 * Creates a Supabase client for server-side administrative usage (webhooks, internal jobs).
 * Uses SUPABASE_SERVICE_ROLE_KEY - full database bypass, no RLS restrictions.
 * NEVER expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export const createServiceClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: createServiceClient cannot be called from the browser.");
  }

  const key = supabaseServiceKey || supabaseAnonKey;
  if (!supabaseServiceKey && process.env.NODE_ENV !== "test") {
    console.warn(
      "[Supabase Security] SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon key. Admin operations may be restricted by RLS."
    );
  }

  return createSupabaseClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

/**
 * Creates a Supabase client with a specified key (backwards compatibility).
 */
export const createClientWithKey = (key: string, options?: any) => {
  return createSupabaseClient(supabaseUrl, key, options);
};

// ========================================================
// Storage Utilities (media-deliveries & public-portfolio)
// ========================================================

/**
 * Generates a signed temporary URL for downloading private delivery files.
 * @param filePath - The path to the file inside the media-deliveries bucket
 * @param expiresInSeconds - Expiration time in seconds (default: 3600 = 1 hour)
 */
export async function getSignedDeliveryUrl(filePath: string, expiresInSeconds = 3600): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from("media-deliveries")
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }

    return data?.signedUrl || null;
  } catch (err) {
    console.error("Storage error:", err);
    return null;
  }
}

/**
 * Gets the public URL for assets stored in the public-portfolio bucket.
 */
export function getPublicPortfolioUrl(filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from("public-portfolio").getPublicUrl(filePath);
  return data.publicUrl;
}
