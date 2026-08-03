/**
 * Environment-variable validation — runs once at server startup via
 * instrumentation.ts. Dependency-free by design.
 *
 * Philosophy:
 *  - Fail FAST (throw) on configurations that are dangerous or definitely broken.
 *  - Warn on configurations that are incomplete but safe (features degrade
 *    gracefully, e.g. WhatsApp CTA renders its labelled disabled state, admin
 *    area shows "not configured" until Supabase env vars exist).
 *
 * SECURITY: never log environment VALUES here — only variable names.
 */

type Check = { ok: true } | { ok: false; fatal: boolean; message: string };

function checkSiteUrl(): Check {
  const v = process.env.NEXT_PUBLIC_SITE_URL;
  if (!v) return { ok: false, fatal: false, message: "NEXT_PUBLIC_SITE_URL not set — sitemap/robots/OG URLs fall back to http://localhost:3000." };
  try {
    const u = new URL(v);
    if (process.env.NODE_ENV === "production" && u.protocol !== "https:" && u.hostname !== "localhost") {
      return { ok: false, fatal: false, message: `NEXT_PUBLIC_SITE_URL (${v}) is not https — fix before public launch.` };
    }
    return { ok: true };
  } catch {
    return { ok: false, fatal: true, message: `NEXT_PUBLIC_SITE_URL is not a valid URL: "${v}"` };
  }
}

function checkWhatsApp(): Check {
  const v = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!v) return { ok: false, fatal: false, message: "NEXT_PUBLIC_WHATSAPP_NUMBER not set (REQUIRED INPUT Q33) — WhatsApp CTAs render a labelled disabled state." };
  if (!/^\d{8,15}$/.test(v.replace(/\D/g, ""))) {
    return { ok: false, fatal: true, message: `NEXT_PUBLIC_WHATSAPP_NUMBER should be 8–15 digits incl. country code (e.g. 60123456789).` };
  }
  return { ok: true };
}

function checkSupabase(): Check {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url && !pub) {
    return { ok: false, fatal: false, message: "Supabase not configured — running in local-fallback mode (file content, file leads, admin disabled). Fine for local dev; required for Phase 2A features." };
  }
  if (!url || !pub) {
    return { ok: false, fatal: true, message: "Supabase partially configured: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must both be set." };
  }
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return { ok: false, fatal: true, message: "NEXT_PUBLIC_SUPABASE_URL must be https." };
  } catch {
    return { ok: false, fatal: true, message: "NEXT_PUBLIC_SUPABASE_URL is not a valid URL." };
  }
  // The publishable key must never actually be a secret key.
  if (/^sb_secret_/i.test(pub) || /service_role/i.test(pub)) {
    return { ok: false, fatal: true, message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contains a SECRET/service key. Replace it with the publishable key and ROTATE the leaked secret immediately." };
  }
  if (!secret) {
    return { ok: false, fatal: false, message: "SUPABASE_SECRET_KEY not set — only needed for seed/verification scripts, not for serving the app." };
  }
  return { ok: true };
}

/** Refuse to start if a secret leaked into any NEXT_PUBLIC_* variable (name or value). */
function checkNoLeakedSecrets(): Check {
  const secret = process.env.SUPABASE_SECRET_KEY;
  const offenders: string[] = [];
  for (const [name, value] of Object.entries(process.env)) {
    if (!name.startsWith("NEXT_PUBLIC_")) continue;
    const bare = name.replace("NEXT_PUBLIC_", "");
    if (/(SERVICE_ROLE|SECRET|PASSWORD|PRIVATE_KEY|WEBHOOK)/i.test(bare)) offenders.push(`${name} (name pattern)`);
    else if (value && /^sb_secret_/i.test(value)) offenders.push(`${name} (secret-key value pattern)`);
    else if (secret && value === secret) offenders.push(`${name} (equals SUPABASE_SECRET_KEY)`);
  }
  if (offenders.length > 0) {
    return { ok: false, fatal: true, message: `Secret exposed via NEXT_PUBLIC_ variable(s): ${offenders.join(", ")}. Remove and ROTATE the key(s) now.` };
  }
  return { ok: true };
}

function checkObsoleteFlags(): Check {
  if (process.env.CONTENT_EDIT_ENABLED !== undefined) {
    return {
      ok: false,
      fatal: process.env.NODE_ENV === "production",
      message: "CONTENT_EDIT_ENABLED is obsolete since Phase 2A (content editing is auth+RLS protected). Remove it from the environment.",
    };
  }
  return { ok: true };
}

export function validateEnv(): void {
  const checks: [string, Check][] = [
    ["site-url", checkSiteUrl()],
    ["whatsapp", checkWhatsApp()],
    ["supabase", checkSupabase()],
    ["secret-exposure", checkNoLeakedSecrets()],
    ["obsolete-flags", checkObsoleteFlags()],
  ];

  const fatals: string[] = [];
  for (const [name, c] of checks) {
    if (!c.ok) {
      if (c.fatal) fatals.push(`[env:${name}] ${c.message}`);
      else console.warn(`⚠ [env:${name}] ${c.message}`);
    }
  }
  if (fatals.length > 0) {
    throw new Error(`Environment validation failed:\n${fatals.join("\n")}`);
  }
  console.log("✓ Environment validation passed");
}
