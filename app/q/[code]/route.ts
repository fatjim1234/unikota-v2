import { NextResponse, type NextRequest } from "next/server";
import { resolveQr } from "@/lib/qr-links";

// Every scan must be resolved fresh so destination changes apply immediately.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const { code, destination } = resolveQr(raw);

  let target: URL;
  if (destination.startsWith("/")) {
    target = new URL(destination, request.nextUrl.origin);
    target.searchParams.set("utm_source", "packaging");
    target.searchParams.set("utm_medium", "qr");
    target.searchParams.set("utm_campaign", code ?? "unknown-qr");
  } else {
    target = new URL(destination);
  }

  // 307 = temporary: browsers and phones must not remember the destination,
  // otherwise later changes would not reach people who scanned before.
  const response = NextResponse.redirect(target, 307);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
