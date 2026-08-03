import { requireStaff } from "@/lib/auth";
import { createUserServerClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin-shell";
import { Card } from "@/components/ui";
import { LeadRow, type LeadRowData } from "./lead-row";

export const metadata = { title: "Leads — Unikota Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const ctx = await requireStaff(["sales_employee", "administrator", "super_administrator"]);
  const isAdmin = ctx.roles.includes("administrator") || ctx.roles.includes("super_administrator");
  const supabase = await createUserServerClient();

  // RLS scopes these queries to what this user may see.
  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, created_at, name, email, company, enquiry_type, message, source_page, status, assigned_to")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: notes } = await supabase
    .from("lead_notes")
    .select("id, lead_id, body, created_at, author_id")
    .order("created_at", { ascending: true });

  const { data: profiles } = await supabase.from("profiles").select("id, display_name, email");
  const nameOf = (id: string | null) =>
    profiles?.find((p) => p.id === id)?.display_name ?? profiles?.find((p) => p.id === id)?.email ?? "staff";

  const staffOptions = (profiles ?? []).map((p) => ({ id: p.id, label: p.display_name ?? p.email }));

  const rows: LeadRowData[] = (leads ?? []).map((l) => ({
    ...l,
    notes: (notes ?? [])
      .filter((n) => n.lead_id === l.id)
      .map((n) => ({ id: n.id, body: n.body, created_at: n.created_at, author: nameOf(n.author_id) })),
  }));

  return (
    <AdminShell ctx={ctx} title="Leads">
      <p className="mb-4 text-sm text-stone-600">
        Assignment policy: claim an unassigned lead to work it; status and notes only on your own leads.
        {isAdmin ? " As an administrator you can also assign, unassign and reassign." : ""}
      </p>
      {error ? (
        <Card><p className="text-sm text-red-700">Failed to load leads: {error.message}</p></Card>
      ) : rows.length === 0 ? (
        <Card><p className="text-sm text-stone-600">No leads yet.</p></Card>
      ) : (
        <div className="space-y-3">
          {rows.map((l) => (
            <LeadRow key={l.id} lead={l} meId={ctx.userId} isAdmin={isAdmin} staff={staffOptions} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
