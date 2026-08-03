"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createUserServerClient } from "@/lib/supabase/server";

/**
 * Lead server actions. Every action:
 *  1. re-checks the caller's staff role server-side (requireStaff), and
 *  2. mutates through the USER'S OWN session client, so RLS — not this file —
 *     is the final authority on the approved assignment policy.
 * UI is never the enforcement layer.
 */

type ActionResult = { ok: boolean; error?: string };

export async function claimLead(leadId: string): Promise<ActionResult> {
  const ctx = await requireStaff(["sales_employee", "administrator", "super_administrator"]);
  const supabase = await createUserServerClient();
  // Sales RLS: allowed only when assigned_to IS NULL and new value = own uid.
  const { error } = await supabase.from("leads").update({ assigned_to: ctx.userId }).eq("id", leadId).is("assigned_to", null);
  revalidatePath("/admin/leads");
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateLeadStatus(leadId: string, status: "new" | "in_progress" | "closed" | "spam"): Promise<ActionResult> {
  await requireStaff(["sales_employee", "administrator", "super_administrator"]);
  const supabase = await createUserServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  revalidatePath("/admin/leads");
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function assignLead(leadId: string, userId: string | null): Promise<ActionResult> {
  // Admin-only in RLS as well; this server check just gives a friendlier error.
  await requireStaff(["administrator", "super_administrator"]);
  const supabase = await createUserServerClient();
  const { error } = await supabase.from("leads").update({ assigned_to: userId }).eq("id", leadId);
  revalidatePath("/admin/leads");
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function addLeadNote(leadId: string, body: string): Promise<ActionResult> {
  const ctx = await requireStaff(["sales_employee", "administrator", "super_administrator"]);
  const trimmed = body.trim();
  if (!trimmed || trimmed.length > 5000) return { ok: false, error: "Note must be 1–5000 characters." };
  const supabase = await createUserServerClient();
  const { error } = await supabase.from("lead_notes").insert({ lead_id: leadId, author_id: ctx.userId, body: trimmed });
  revalidatePath("/admin/leads");
  return error ? { ok: false, error: error.message } : { ok: true };
}
