import { requireStaff } from "@/lib/auth";
import { getContentStore } from "@/lib/content";
import { AdminShell } from "@/components/admin-shell";
import { ContentEditor } from "@/components/content-editor";

export const metadata = { title: "Content editor — Unikota Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  const ctx = await requireStaff(["content_editor", "administrator", "super_administrator"]);
  const backend = getContentStore().backend;
  return (
    <AdminShell ctx={ctx} title="Content editor">
      <ContentEditor backend={backend} />
    </AdminShell>
  );
}
