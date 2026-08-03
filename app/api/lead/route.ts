import { NextRequest, NextResponse } from "next/server";
import { leadInputSchema, getLeadRepository } from "@/lib/leads";
import { getLeadRateLimiter } from "@/lib/rate-limit";
import { getContent, type ContactContent } from "@/lib/content";
import { notifyNewLead } from "@/lib/lead-notify";

/**
 * Public lead submission (decision B, 2026-07-13):
 * browser → this endpoint → validation/honeypot/rate-limit/consent snapshot →
 * INSERT via publishable key (anon). RLS anon insert policy is the database
 * backstop; anon has no SELECT policy so leads are never publicly readable.
 * SUPABASE_SECRET_KEY is never used here. There is NO public lead-read endpoint.
 */
export async function POST(req: NextRequest) {
  // Rate limit by IP (in-memory in dev; Upstash Redis documented for production).
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const { success } = await getLeadRateLimiter().limit(`lead:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many submissions — please try again later." }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots that fill the hidden field get a fake success, store nothing.
  if (typeof raw === "object" && raw !== null && typeof (raw as Record<string, unknown>).website === "string" && ((raw as Record<string, unknown>).website as string).length > 0) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fields[k]) fields[k] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed", fields }, { status: 422 });
  }
  const input = parsed.data;

  // Consent snapshot: store the exact consent wording shown at submission time (PDPA).
  let consentText: string | null = null;
  try {
    const contact = await getContent<ContactContent>("contact");
    consentText = contact.form.consentLabel ?? null;
  } catch {
    consentText = null;
  }

  try {
    const repo = getLeadRepository();
    const { id } = await repo.create({
      name: input.name,
      email: input.email,
      company: input.company ? input.company : null,
      enquiry_type: input.type,
      message: input.message,
      source_page: input.sourcePage ? input.sourcePage : null,
      consent: true,
      consent_text: consentText,
    });
    // Internal notification AFTER the lead is safely stored. Never blocks or
    // fails the user's response; recipients live only in server env vars.
    await notifyNewLead({
      id,
      name: input.name,
      email: input.email,
      company: input.company ? input.company : null,
      enquiryType: input.type,
      message: input.message,
      sourcePage: input.sourcePage ? input.sourcePage : null,
    }).catch(() => {});

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    console.error("lead submission failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Something went wrong storing your enquiry. Please try again or use WhatsApp." }, { status: 500 });
  }
}

// Explicitly no GET/PUT/DELETE: leads are never readable or mutable through
// public endpoints. Staff read leads in /admin/leads under auth + RLS.
export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export const dynamic = "force-dynamic";
