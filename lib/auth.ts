import "server-only";
import { redirect } from "next/navigation";
import { createUserServerClient, supabaseConfigured } from "@/lib/supabase/server";

export const STAFF_ROLES = ["sales_employee", "content_editor", "administrator", "super_administrator"] as const;
export type StaffRoleName = (typeof STAFF_ROLES)[number];

export type StaffContext = {
  userId: string;
  email: string;
  displayName: string | null;
  roles: StaffRoleName[];
};

/** Returns the signed-in user's staff context, or null (not signed in / not staff / not configured). */
export async function getStaffContext(): Promise<StaffContext | null> {
  if (!supabaseConfigured()) return null;
  const supabase = await createUserServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS: user can always read their own staff_roles rows.
  const { data: roles } = await supabase.from("staff_roles").select("role").eq("user_id", user.id);
  const roleNames = (roles ?? []).map((r) => r.role as StaffRoleName);
  if (roleNames.length === 0) return null;

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
  return {
    userId: user.id,
    email: user.email ?? "",
    displayName: profile?.display_name ?? null,
    roles: roleNames,
  };
}

/**
 * Server-side guard for pages, server actions and route handlers.
 * NEVER rely on middleware or client UI alone — every privileged action calls
 * this AND the database enforces the same rule via RLS (defense in depth).
 */
export async function requireStaff(allowed?: StaffRoleName[]): Promise<StaffContext> {
  if (!supabaseConfigured()) redirect("/admin/not-configured");
  const ctx = await getStaffContext();
  if (!ctx) redirect("/admin/sign-in");
  if (allowed && allowed.length > 0 && !ctx.roles.some((r) => allowed.includes(r))) {
    redirect("/admin?denied=1");
  }
  return ctx;
}

/** Variant for API route handlers: returns a status code instead of redirecting. */
export async function requireStaffApi(
  allowed?: StaffRoleName[],
): Promise<{ ok: true; ctx: StaffContext } | { ok: false; status: number; error: string }> {
  if (!supabaseConfigured()) return { ok: false, status: 503, error: "Auth backend not configured" };
  const ctx = await getStaffContext();
  if (!ctx) return { ok: false, status: 401, error: "Authentication required" };
  if (allowed && allowed.length > 0 && !ctx.roles.some((r) => allowed.includes(r))) {
    return { ok: false, status: 403, error: "Insufficient role" };
  }
  return { ok: true, ctx };
}
