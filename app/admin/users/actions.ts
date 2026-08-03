"use server";

import { revalidatePath } from "next/cache";
import { requireStaff, type StaffRoleName } from "@/lib/auth";
import { createUserServerClient } from "@/lib/supabase/server";

/**
 * Role management server actions.
 * DEFENSE IN DEPTH: the server check below is a courtesy; the REAL rule lives
 * in RLS — administrators' INSERT/DELETE policies only match
 * sales_employee/content_editor rows, so an admin granting administrator or
 * super_administrator (to anyone, including themselves) is rejected by the
 * database even if this file had a bug.
 */

type ActionResult = { ok: boolean; error?: string };

export async function grantRole(userId: string, role: StaffRoleName): Promise<ActionResult> {
  const ctx = await requireStaff(["administrator", "super_administrator"]);
  const isSuper = ctx.roles.includes("super_administrator");
  if (!isSuper && (role === "administrator" || role === "super_administrator")) {
    return { ok: false, error: "Only a super administrator may grant administrator or super-administrator roles." };
  }
  const supabase = await createUserServerClient();
  const { error } = await supabase.from("staff_roles").insert({ user_id: userId, role, granted_by: ctx.userId });
  revalidatePath("/admin/users");
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function revokeRole(roleRowId: string): Promise<ActionResult> {
  await requireStaff(["administrator", "super_administrator"]);
  const supabase = await createUserServerClient();
  // RLS: admins can only delete basic-role rows; super can delete any
  // (except the last super_administrator — trigger lockout guard).
  const { error } = await supabase.from("staff_roles").delete().eq("id", roleRowId);
  revalidatePath("/admin/users");
  return error ? { ok: false, error: error.message } : { ok: true };
}
