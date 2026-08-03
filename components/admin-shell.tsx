import Link from "next/link";
import type { StaffContext } from "@/lib/auth";
import { Badge } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";

/** Shared chrome for authenticated admin pages. Pages are individually guarded by requireStaff(). */
export function AdminShell({ ctx, title, children }: { ctx: StaffContext; title: string; children: React.ReactNode }) {
  const isAdmin = ctx.roles.includes("administrator") || ctx.roles.includes("super_administrator");
  const canContent = isAdmin || ctx.roles.includes("content_editor");
  const canLeads = isAdmin || ctx.roles.includes("sales_employee");
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-xs text-stone-500">
            {ctx.email} · {ctx.roles.map((r) => <Badge key={r} tone="brand">{r}</Badge>)}
          </p>
        </div>
        <SignOutButton />
      </div>
      <nav aria-label="Admin" className="mb-6 flex flex-wrap gap-2 border-b border-stone-200 pb-3 text-sm">
        <Link className="focus-ring rounded px-2 py-1 font-medium text-brand-700 hover:bg-brand-50" href="/admin">Dashboard</Link>
        {canContent ? <Link className="focus-ring rounded px-2 py-1 font-medium text-brand-700 hover:bg-brand-50" href="/admin/content">Content</Link> : null}
        {canLeads ? <Link className="focus-ring rounded px-2 py-1 font-medium text-brand-700 hover:bg-brand-50" href="/admin/leads">Leads</Link> : null}
        {isAdmin ? <Link className="focus-ring rounded px-2 py-1 font-medium text-brand-700 hover:bg-brand-50" href="/admin/users">Users & roles</Link> : null}
      </nav>
      {children}
    </div>
  );
}
