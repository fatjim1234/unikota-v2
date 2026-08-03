import { NextRequest, NextResponse } from "next/server";
import { getContentStore, isContentKey } from "@/lib/content";
import { requireStaffApi } from "@/lib/auth";

/**
 * Content API — Phase 2A.
 * GET: public (content is world-readable by design; same data renders on the site).
 * PUT: staff auth REQUIRED (content_editor / administrator / super_administrator),
 *      enforced here (server) AND by RLS (database). The Phase 1
 *      CONTENT_EDIT_ENABLED flag is gone — auth + RLS replaced it.
 *      In local fallback mode (no Supabase), writes are dev-only file writes.
 */

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isContentKey(key)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }
  const value = await getContentStore().get(key);
  return NextResponse.json({ key, value });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const store = getContentStore();

  if (store.backend === "supabase") {
    const auth = await requireStaffApi(["content_editor", "administrator", "super_administrator"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  } else {
    // Local fallback: no auth system exists without Supabase, so writes are
    // CLOSED BY DEFAULT. A developer must explicitly opt in per machine
    // (dev server only — production always refuses).
    if (process.env.NODE_ENV === "production" || process.env.LOCAL_CONTENT_EDIT !== "true") {
      return NextResponse.json(
        { error: "Content editing requires the Supabase backend (or LOCAL_CONTENT_EDIT=true on a dev machine)." },
        { status: 503 },
      );
    }
  }

  const { key } = await params;
  if (!isContentKey(key)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }
  try {
    await store.set(key, body);
  } catch (e) {
    // RLS denial surfaces here for authenticated-but-unauthorized users.
    return NextResponse.json({ error: e instanceof Error ? e.message : "Write failed" }, { status: 403 });
  }
  return NextResponse.json({ ok: true, key });
}

export const dynamic = "force-dynamic";
