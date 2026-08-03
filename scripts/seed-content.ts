/**
 * Seed script: imports the 8 JSON content files into Supabase content_entries.
 *
 * Usage:  npm run seed:content            (idempotent; refuses to overwrite edited keys)
 *         npm run seed:content -- --force (overwrite even if edited — creates revisions)
 *
 * Runs LOCALLY with SUPABASE_SECRET_KEY from web/.env.local — a controlled
 * server-side script, never part of the running app. It verifies its own work:
 * every key is re-fetched and deep-compared against the JSON source.
 * The JSON files remain in the repo (local-dev fallback + seed source).
 */
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import { config as dotenv } from "dotenv";

dotenv({ path: path.join(process.cwd(), ".env.local") });

const KEYS = ["settings", "home", "about", "manufacturing", "brands", "oem", "export", "contact", "products", "solutions"];
const FORCE = process.argv.includes("--force");

/**
 * PostgreSQL jsonb does not preserve object key order, so a naive
 * JSON.stringify comparison produces false mismatches. Canonicalize first:
 * arrays keep their order (elements canonicalized recursively), plain-object
 * keys are sorted alphabetically (values canonicalized recursively),
 * primitives and null pass through unchanged.
 */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => [k, canonicalize(v)]),
    );
  }
  return value;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(canonicalize(a)) === JSON.stringify(canonicalize(b));
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY in web/.env.local");
    process.exit(1);
  }
  const supabase = createClient(url, secret, { auth: { persistSession: false } });

  const results: { key: string; action: string; verified: boolean }[] = [];

  for (const key of KEYS) {
    const raw = await fs.readFile(path.join(process.cwd(), "content", `${key}.json`), "utf8");
    const value = JSON.parse(raw);

    const { data: existing, error: readErr } = await supabase
      .from("content_entries")
      .select("key, version, value")
      .eq("key", key)
      .maybeSingle();
    if (readErr) throw new Error(`read ${key}: ${readErr.message}`);

    let action: string;
    if (!existing) {
      const { error } = await supabase.from("content_entries").insert({ key, value });
      if (error) throw new Error(`insert ${key}: ${error.message}`);
      action = "inserted";
    } else if (deepEqual(existing.value, value)) {
      action = "unchanged";
    } else if (existing.version > 1 && !FORCE) {
      action = `SKIPPED (version ${existing.version} has manual edits — use --force to overwrite)`;
    } else {
      const { error } = await supabase.from("content_entries").update({ value }).eq("key", key);
      if (error) throw new Error(`update ${key}: ${error.message}`);
      action = "updated";
    }

    // Verify (a failed read is a verification FAILURE, never silently ignored)
    const { data: check, error: checkErr } = await supabase
      .from("content_entries")
      .select("value")
      .eq("key", key)
      .single();
    let verified: boolean;
    if (action.startsWith("SKIPPED")) {
      verified = true;
    } else if (checkErr) {
      verified = false;
      action += ` [verification read failed: ${checkErr.message}]`;
    } else {
      verified = deepEqual(check?.value, value);
    }
    results.push({ key, action, verified });
  }

  console.log("\nSeed results:");
  for (const r of results) {
    console.log(`  ${r.verified ? "✓" : "✗"} ${r.key.padEnd(14)} ${r.action}`);
  }
  const failed = results.filter((r) => !r.verified);
  if (failed.length > 0) {
    console.error(`\n✗ Verification FAILED for: ${failed.map((f) => f.key).join(", ")}`);
    process.exit(1);
  }
  console.log("\n✓ All content keys verified against JSON source. JSON files remain as fallback.");
}

main().catch((e) => {
  console.error("Seed failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
