import { requireStaff } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
import { Card } from "@/components/ui";
import Link from "next/link";

export const metadata = { title: "Admin — Unikota", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * Admin dashboard — Phase 2A. Replaces the M0 role-switcher demo with real
 * role-scoped modules. Guarded by middleware (routing), requireStaff (server)
 * and RLS (database).
 */
export default async function AdminDashboard() {
  const ctx = await requireStaff();
  const isAdmin = ctx.roles.includes("administrator") || ctx.roles.includes("super_administrator");
  const modules = [
    ...(isAdmin || ctx.roles.includes("content_editor")
      ? [{ href: "/admin/content", title: "Content", body: "Edit public page copy. Every save creates a revision and an audit entry." }]
      : []),
    ...(isAdmin || ctx.roles.includes("sales_employee")
      ? [{ href: "/admin/leads", title: "Leads", body: "Enquiries from the public site. Claim, progress and note leads per the assignment policy." }]
      : []),
    ...(isAdmin
      ? [{ href: "/admin/users", title: "Users & roles", body: "Grant or revoke staff roles. Administrators cannot grant administrator/super roles — database-enforced." }]
      : []),
  ];

  return (
    <AdminShell ctx={ctx} title="Admin dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Card key={m.href}>
            <h2 className="font-semibold">{m.title}</h2>
            <p className="mt-2 text-sm text-stone-600">{m.body}</p>
            <Link href={m.href} className="focus-ring mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">
              Open →
            </Link>
          </Card>
        ))}
        {modules.length === 0 ? (
          <Card>
            <p className="text-sm text-stone-600">Your account has no modules yet — ask an administrator to grant you a role.</p>
          </Card>
        ) : null}
      </div>
    </AdminShell>
  );
}
