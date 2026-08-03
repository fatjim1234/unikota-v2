import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients.
 *
 * Key rules (docs/SECURITY_AND_PRIVACY.md):
 *  - The PUBLISHABLE key is used for all user-session and anonymous requests;
 *    RLS is the authority.
 *  - SUPABASE_SECRET_KEY is server-only, never logged, never used for ordinary
 *    browser or authenticated-user requests. In the app it is reserved for
 *    nothing today (scripts use it directly); the accessor below exists so any
 *    future use is a deliberate, greppable act.
 */

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

function requirePublicEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)");
  return { url, key };
}

/** Cookie-bound client: acts as the signed-in user; RLS applies. (async since Next 16: cookies() must be awaited) */
export async function createUserServerClient() {
  const { url, key } = requirePublicEnv();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component where cookies are read-only — safe to ignore;
          // middleware refreshes the session.
        }
      },
    },
  });
}

/** Anonymous client (no session): used by /api/lead so the anon RLS INSERT policy is the backstop. */
export function createAnonServerClient(): SupabaseClient {
  const { url, key } = requirePublicEnv();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/**
 * Secret-key client. SERVER-ONLY, RLS-bypassing — do not use for request-path
 * logic. Reserved for controlled operations (none in Phase 2A app code;
 * seed/verification scripts construct their own client from env directly).
 */
export function createSecretServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("SUPABASE_SECRET_KEY not configured");
  return createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
}
