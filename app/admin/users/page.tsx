import { requireStaff, type StaffRoleName } from "@/lib/auth";
import { createUserServerClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin-shell";
import { Card } from "@/components/ui";
import { RoleManager, type UserRowData } from "./role-manager";

export const metadata = { title: "Users & roles — Unikota Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const ctx = await requireStaff(["administrator", "super_administrator"]);
  const actorIsSuper = ctx.roles.includes("super_administrator");
  const supabase = await createUserServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .order("email");
  const { data: roles } = await supabase.from("staff_roles").select("id, user_id, role");

  const users: UserRowData[] = (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    display_name: p.display_name,
    roles: (roles ?? [])
      .filter((r) => r.user_id === p.id)
      .map((r) => ({ rowId: r.id, role: r.role as StaffRoleName })),
  }));

  return (
    <AdminShell ctx={ctx} title="Users & roles">
      <p className="mb-4 text-sm text-stone-600">
        Accounts are created in the Supabase Dashboard (Authentication → Invite). Grant roles here.
        {actorIsSuper
          ? " You are a super administrator and may grant any role."
          : " As an administrator you may grant sales_employee and content_editor only — administrator/super grants are database-blocked."}
      </p>
      {error ? (
        <Card><p className="text-sm text-red-700">Failed to load users: {error.message}</p></Card>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <RoleManager key={u.id} user={u} actorIsSuper={actorIsSuper} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
