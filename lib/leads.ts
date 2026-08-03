import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";

/**
 * Lead repository — Phase 2A.
 * Supabase mode (default when configured): INSERT via the PUBLISHABLE key with
 * no session, so the anon RLS policy (status='new', assigned_to null,
 * consent=true, no SELECT) is the database-level backstop. The secret key is
 * never used on this path. Local mode: file store, dev fallback only.
 */

export const LEAD_TYPES = ["General", "OEM / private label", "Export", "Retail support"] as const;

export const leadInputSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  company: z.string().trim().max(300).optional().or(z.literal("")),
  type: z.enum(LEAD_TYPES, { errorMap: () => ({ message: "Please choose an enquiry type." }) }),
  message: z.string().trim().min(1, "Please enter a message.").max(5000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required so we may contact you." }) }),
  sourcePage: z.string().trim().max(500).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot must be empty (checked before parse too)
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export type NewLead = {
  name: string;
  email: string;
  company: string | null;
  enquiry_type: string;
  message: string;
  source_page: string | null;
  consent: true;
  consent_text: string | null;
};

export interface LeadRepository {
  create(lead: NewLead): Promise<{ id: string }>;
  readonly backend: "supabase" | "local";
}

class SupabaseLeadRepository implements LeadRepository {
  readonly backend = "supabase" as const;

  async create(lead: NewLead): Promise<{ id: string }> {
    const { createAnonServerClient } = await import("@/lib/supabase/server");
    const supabase = createAnonServerClient();
    // anon has no SELECT policy on leads, so we cannot use .select() after
    // insert — generate the id client-side instead.
    const id = randomUUID();
    const { error } = await supabase.from("leads").insert({ id, ...lead });
    if (error) throw new Error(`lead insert failed: ${error.message}`);
    return { id };
  }
}

class LocalJsonLeadRepository implements LeadRepository {
  readonly backend = "local" as const;

  async create(lead: NewLead): Promise<{ id: string }> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("File-based lead storage is disabled in production. Configure Supabase.");
    }
    const dataDir = path.join(process.cwd(), "data");
    const file = path.join(dataDir, "leads.json");
    await fs.mkdir(dataDir, { recursive: true });
    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(file, "utf8")) as unknown[];
    } catch {
      existing = [];
    }
    const id = randomUUID();
    existing.push({ id, at: new Date().toISOString(), status: "new", ...lead });
    await fs.writeFile(file, JSON.stringify(existing, null, 2) + "\n", "utf8");
    return { id };
  }
}

export function getLeadRepository(): LeadRepository {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return new SupabaseLeadRepository();
  }
  return new LocalJsonLeadRepository();
}
