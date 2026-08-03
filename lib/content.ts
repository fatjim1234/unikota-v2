/**
 * Content layer — Phase 2A.
 *
 * The ContentStore interface is unchanged since Phase 1; pages call
 * getContent() and never know which backend serves them.
 *
 * Implementations:
 *  - SupabaseContentRepository — DEFAULT when Supabase is configured.
 *    Reads via the publishable key (content is world-readable by RLS design);
 *    writes via the signed-in user's session so RLS (content_editor/
 *    administrator/super_administrator) is the final authority.
 *  - LocalJsonContentRepository — local-development fallback ONLY
 *    (no Supabase env, or CONTENT_BACKEND=local). The JSON files under
 *    /content are also the seed source and stay in the repo until the
 *    Supabase migration is verified.
 */
import { promises as fs } from "fs";
import path from "path";

export const CONTENT_KEYS = [
  "settings",
  "home",
  "about",
  "manufacturing",
  "brands",
  "oem",
  "export",
  "contact",
  "products",
  "solutions",
] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export function isContentKey(key: string): key is ContentKey {
  return (CONTENT_KEYS as readonly string[]).includes(key);
}

export interface ContentStore {
  get(key: ContentKey): Promise<unknown>;
  /** Write as the CURRENT USER (RLS-enforced in Supabase mode). */
  set(key: ContentKey, value: unknown): Promise<void>;
  list(): Promise<ContentKey[]>;
  readonly backend: "supabase" | "local";
}

const contentDir = path.join(process.cwd(), "content");

class LocalJsonContentRepository implements ContentStore {
  readonly backend = "local" as const;

  async get(key: ContentKey): Promise<unknown> {
    const raw = await fs.readFile(path.join(contentDir, `${key}.json`), "utf8");
    return JSON.parse(raw);
  }

  async set(key: ContentKey, value: unknown): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Local content writes are disabled in production builds. Configure Supabase.");
    }
    await fs.writeFile(path.join(contentDir, `${key}.json`), JSON.stringify(value, null, 2) + "\n", "utf8");
  }

  async list(): Promise<ContentKey[]> {
    return [...CONTENT_KEYS];
  }
}

class SupabaseContentRepository implements ContentStore {
  readonly backend = "supabase" as const;

  async get(key: ContentKey): Promise<unknown> {
    // Anonymous read — content_select_public RLS policy.
    try {
      const { createAnonServerClient } = await import("@/lib/supabase/server");
      const supabase = createAnonServerClient();

      // Timeout after 2 seconds to prevent page hangs
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const { data, error } = await supabase.from("content_entries").select("value").eq("key", key).maybeSingle();
      clearTimeout(timeoutId);

      if (error) throw new Error(`content read failed for "${key}": ${error.message}`);
      if (!data) throw new Error(`content key "${key}" not found — run the seed script (npm run seed:content)`);
      return data.value;
    } catch (err) {
      // If Supabase unavailable, return null — pages handle missing content gracefully
      console.warn(`Content unavailable for "${key}": ${err instanceof Error ? err.message : 'unknown error'}`);
      return null;
    }
  }

  async set(key: ContentKey, value: unknown): Promise<void> {
    // User-session write — RLS decides whether this user may edit content.
    const { createUserServerClient } = await import("@/lib/supabase/server");
    const supabase = await createUserServerClient();
    const { error } = await supabase.from("content_entries").update({ value }).eq("key", key);
    if (error) throw new Error(`content write failed for "${key}": ${error.message}`);
  }

  async list(): Promise<ContentKey[]> {
    return [...CONTENT_KEYS];
  }
}

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getContentStore(): ContentStore {
  if (process.env.CONTENT_BACKEND === "local") return new LocalJsonContentRepository();
  if (supabaseConfigured()) return new SupabaseContentRepository();
  return new LocalJsonContentRepository();
}

export async function getContent<T>(key: ContentKey): Promise<T> {
  return (await getContentStore().get(key)) as T;
}

/* ---- Shared content types used by pages (unchanged since Phase 1) ---- */

export type Hero = { title: string; lead: string };
export type RequiredInputRef = { label: string; qref: string };

export type SettingsContent = {
  siteName: string;
  tagline: string;
  metaDescription: string;
  address: string;
  businessHours: string;
  registrationNote: string;
  whatsappDefaultContext: string;
  // Verified company facts (optional for backward compatibility with
  // previously seeded rows; render only when present).
  legalName?: string;
  companyRegistrationNumber?: string;
  incorporationDate?: string;
  addressLines?: string[];
  landline?: string;
  email?: string;
  whatsappNumber?: string;
};

export type FactStat = { value: string; label: string };

export type HomeContent = {
  hero: Hero;
  pillars: { href: string; title: string; body: string }[];
  trust: { note: string; requiredInputs: RequiredInputRef[] };
  ctaBand: { title: string; body: string };
  // Batch 1 additions (optional for backward compatibility with earlier
  // seeded rows; sections render only when present).
  brandLine?: string;
  credibility?: FactStat[];
  buyers?: { title: string; items: { title: string; body: string }[] };
  lanes?: { title: string; body: string; points: string[] }[];
  process?: { title: string; steps: { title: string; body: string }[]; note?: string };
  compactProcess?: { title: string; steps: { title: string; body: string }[] };
  corporate?: { title: string; intro: string; items: string[] };
  broaderCapability?: string;
  exportExperience?: { body: string; markets: string[] };
  finalCta?: { title: string; body: string };
};

export type AboutContent = {
  hero: Hero;
  story: string[];
  milestones: { year: string; event: string }[];
  leaders: { name: string; role: string }[];
  // Batch 1 additions (optional; render only when present).
  brandLine?: string;
  overview?: string;
  heritage?: { label: string; body: string }[];
  lanes?: { title: string; body: string }[];
  conceptToMarket?: string;
  customised?: string[];
  customisedIntro?: string;
  broaderCapability?: string;
  facts?: FactStat[];
  oemExperience?: string;
  qualityStatement?: string;
};

export type ManufacturingContent = {
  hero: Hero;
  facility: { overview: string; requiredInputs: RequiredInputRef[] };
  lines: { name: string; detail: string }[];
  linesNote: string;
  qc: { body: string; certNote: string };
};

export type BrandsContent = {
  hero: Hero;
  brands: { name: string; description: string }[];
};

export type OemContent = {
  hero: Hero;
  steps: { title: string; body: string }[];
  capabilities: { body: string; requiredInputs: RequiredInputRef[] };
  promises: { title: string; body: string };
  // Batch 1.1 additions (optional; render only when present).
  customisable?: { title: string; items: string[] };
  projectTypes?: { title: string; items: string[] };
  qualification?: string;
  qualityStatement?: string;
  qualityPoints?: { title: string; body: string }[];
};

export type ProductCategory = {
  slug: string;
  name: string;
  visual: "box" | "roll" | "sheet";
  description: string;
  brands: string[];
  markets: string[];
};

export type ProductsContent = {
  hero: Hero;
  browseBy: { product: string[]; brand: string[]; market: string[] };
  categories: ProductCategory[];
  note: string;
};

export type SolutionGroup = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  items: string[];
};

export type SolutionsContent = {
  hero: Hero;
  groups: SolutionGroup[];
};

export type ExportContent = {
  hero: Hero;
  requiredInputs: RequiredInputRef[];
  items: { name: string; carton: string; container: string }[];
  disclaimer: string;
};

export type ContactContent = {
  hero: Hero;
  whatsapp: { body: string };
  office: { body: string };
  form: { title: string; consentLabel: string; successMessage: string; types: string[] };
};
