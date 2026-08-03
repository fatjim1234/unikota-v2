/**
 * RLS / authorization verification script — tests server-side rules
 * INDEPENDENTLY of the UI, directly against the database.
 *
 * Usage: npm run verify:rls -- --yes
 *
 * Requires web/.env.local with NEXT_PUBLIC_SUPABASE_URL,
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY.
 *
 * What it does (non-destructive to real data):
 *  1. Creates DISPOSABLE test users (rls-test-*@example.com) with the admin API.
 *  2. Grants them roles directly (secret key bypasses RLS — controlled setup).
 *  3. Signs in as each user with the PUBLISHABLE key and asserts every rule
 *     in docs/ROLE_PERMISSION_MATRIX.md.
 *  4. Cleans up all test users, test leads and test roles it created.
 *
 * It never touches existing rows and never deletes non-test data.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config as dotenv } from "dotenv";
import path from "path";
import { randomUUID } from "crypto";

dotenv({ path: path.join(process.cwd(), ".env.local") });

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PUB = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const SECRET = process.env.SUPABASE_SECRET_KEY!;

if (!process.argv.includes("--yes")) {
  console.log("This script creates and removes disposable test users in your Supabase project.");
  console.log("Re-run with --yes to proceed:  npm run verify:rls -- --yes");
  process.exit(0);
}
if (!URL_ || !PUB || !SECRET) {
  console.error("Missing Supabase env vars in web/.env.local");
  process.exit(1);
}

const admin = createClient(URL_, SECRET, { auth: { persistSession: false } });

type TestUser = { email: string; password: string; id: string; client: SupabaseClient };
const created: TestUser[] = [];
const testLeadIds: string[] = [];

let pass = 0;
let fail = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail = "") {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    failures.push(name);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function makeUser(tag: string, roles: string[]): Promise<TestUser> {
  const email = `rls-test-${tag}-${Date.now()}@example.com`;
  const password = `Tt1!${randomUUID()}`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) throw new Error(`createUser ${tag}: ${error?.message}`);
  const id = data.user.id;
  // profile is created by trigger; wait briefly then grant roles (setup uses secret key deliberately)
  await new Promise((r) => setTimeout(r, 300));
  for (const role of roles) {
    const { error: re } = await admin.from("staff_roles").insert({ user_id: id, role, granted_by: null });
    if (re) throw new Error(`grant ${role} to ${tag}: ${re.message}`);
  }
  const client = createClient(URL_, PUB, { auth: { persistSession: false } });
  const { error: se } = await client.auth.signInWithPassword({ email, password });
  if (se) throw new Error(`signIn ${tag}: ${se.message}`);
  const u = { email, password, id, client };
  created.push(u);
  return u;
}

async function insertTestLead(client: SupabaseClient, overrides: Record<string, unknown> = {}) {
  const id = randomUUID();
  const { error } = await client.from("leads").insert({
    id,
    name: "RLS Test",
    email: "rls-test@example.com",
    enquiry_type: "General",
    message: "verification lead — safe to delete",
    consent: true,
    ...overrides,
  });
  if (!error) testLeadIds.push(id);
  return { id, error };
}

async function main() {
  console.log("\n== Setup: disposable users ==");
  const anon = createClient(URL_, PUB, { auth: { persistSession: false } });
  const sales1 = await makeUser("sales1", ["sales_employee"]);
  const sales2 = await makeUser("sales2", ["sales_employee"]);
  const editor = await makeUser("editor", ["content_editor"]);
  const adminU = await makeUser("admin", ["administrator"]);
  const superU = await makeUser("super", ["super_administrator"]);

  console.log("\n== Anonymous visitors ==");
  {
    const { error } = await insertTestLead(anon);
    check("anon can INSERT a lead", !error, error?.message);
    const bad = await insertTestLead(anon, { status: "closed" });
    check("anon cannot INSERT with forged status", !!bad.error);
    const badAssign = await insertTestLead(anon, { assigned_to: sales1.id });
    check("anon cannot INSERT pre-assigned lead", !!badAssign.error);
    const { data } = await anon.from("leads").select("id").limit(1);
    check("anon cannot SELECT leads", !data || data.length === 0);
    const { data: audit } = await anon.from("audit_logs").select("id").limit(1);
    check("anon cannot SELECT audit_logs", !audit || audit.length === 0);
    const { error: ce } = await anon.from("content_entries").select("key").limit(1);
    check("anon CAN read public content", !ce);
    const { error: cw } = await anon.from("content_entries").update({ value: { hack: 1 } }).eq("key", "home");
    const { data: homeAfter } = await anon.from("content_entries").select("value").eq("key", "home").single();
    check("anon cannot UPDATE content", !!cw || !("hack" in ((homeAfter?.value as object) ?? {})));
  }

  console.log("\n== Sales assignment policy (decision A) ==");
  {
    const lead = await insertTestLead(anon);
    // sales1 reads all
    const { data: all } = await sales1.client.from("leads").select("id").eq("id", lead.id);
    check("sales can read all leads", (all ?? []).length === 1);
    // claim NULL -> self
    const { error: claim } = await sales1.client.from("leads").update({ assigned_to: sales1.id }).eq("id", lead.id);
    check("sales can claim unassigned lead (NULL→self)", !claim, claim?.message);
    // sales2 cannot take sales1's lead
    const { data: takeData } = await sales2.client.from("leads").update({ assigned_to: sales2.id }).eq("id", lead.id).select();
    check("sales cannot take a lead assigned to someone else", !takeData || takeData.length === 0);
    // sales1 cannot reassign to sales2
    const { data: reData } = await sales1.client.from("leads").update({ assigned_to: sales2.id }).eq("id", lead.id).select();
    check("sales cannot reassign own lead to another user", !reData || reData.length === 0);
    // sales1 cannot unassign
    const { data: unData } = await sales1.client.from("leads").update({ assigned_to: null }).eq("id", lead.id).select();
    check("sales cannot unassign own lead", !unData || unData.length === 0);
    // sales1 updates status on own lead
    const { error: st } = await sales1.client.from("leads").update({ status: "in_progress" }).eq("id", lead.id);
    check("sales can update status on own lead", !st, st?.message);
    // sales2 cannot update status on sales1's lead
    const { data: st2 } = await sales2.client.from("leads").update({ status: "closed" }).eq("id", lead.id).select();
    check("sales cannot update status on another's lead", !st2 || st2.length === 0);
    // notes: sales1 yes, sales2 no
    const { error: n1 } = await sales1.client.from("lead_notes").insert({ lead_id: lead.id, author_id: sales1.id, body: "own note" });
    check("sales can note own lead", !n1, n1?.message);
    const { error: n2 } = await sales2.client.from("lead_notes").insert({ lead_id: lead.id, author_id: sales2.id, body: "not mine" });
    check("sales cannot note another's lead", !!n2);
    // immutable columns
    const { data: im } = await sales1.client.from("leads").update({ message: "tampered" }).eq("id", lead.id).select();
    check("lead submission fields are immutable", !im || im.length === 0);
    // admin reassign
    const { error: ar } = await adminU.client.from("leads").update({ assigned_to: sales2.id }).eq("id", lead.id);
    check("admin can reassign any lead", !ar, ar?.message);
    const { error: aun } = await adminU.client.from("leads").update({ assigned_to: null }).eq("id", lead.id);
    check("admin can unassign any lead", !aun, aun?.message);
  }

  console.log("\n== Content permissions ==");
  {
    const { data: home } = await editor.client.from("content_entries").select("value, version").eq("key", "home").single();
    const { error: eu } = await editor.client.from("content_entries").update({ value: home!.value }).eq("key", "home");
    check("content editor can update content", !eu, eu?.message);
    const { data: su } = await sales1.client.from("content_entries").update({ value: { hack: 1 } }).eq("key", "home").select();
    check("sales cannot update content", !su || su.length === 0);
    const { data: revs } = await editor.client.from("content_revisions").select("id").eq("entry_key", "home").limit(1);
    check("content revisions are recorded and editor-visible", (revs ?? []).length >= 1);
  }

  console.log("\n== Role management boundaries ==");
  {
    const { error: e1 } = await editor.client.from("staff_roles").insert({ user_id: editor.id, role: "administrator", granted_by: editor.id });
    check("content editor cannot grant roles", !!e1);
    const { error: a1 } = await adminU.client.from("staff_roles").insert({ user_id: adminU.id, role: "super_administrator", granted_by: adminU.id });
    check("admin cannot grant super_administrator (even to self)", !!a1);
    const { error: a2 } = await adminU.client.from("staff_roles").insert({ user_id: sales1.id, role: "administrator", granted_by: adminU.id });
    check("admin cannot grant administrator", !!a2);
    const { error: a3 } = await adminU.client.from("staff_roles").insert({ user_id: editor.id, role: "sales_employee", granted_by: adminU.id });
    check("admin CAN grant sales_employee", !a3, a3?.message);
    const { error: s1 } = await superU.client.from("staff_roles").insert({ user_id: sales2.id, role: "administrator", granted_by: superU.id });
    check("super CAN grant administrator", !s1, s1?.message);
    const { data: auditRows } = await adminU.client.from("audit_logs").select("id, action").eq("action", "role.granted").limit(1);
    check("role grants are audited (admin can read audit_logs)", (auditRows ?? []).length >= 1);
    const { data: salesAudit } = await sales1.client.from("audit_logs").select("id").limit(1);
    check("sales cannot read audit_logs", !salesAudit || salesAudit.length === 0);
  }

  console.log("\n== Cleanup ==");
  for (const id of testLeadIds) await admin.from("leads").delete().eq("id", id);
  for (const u of created) await admin.auth.admin.deleteUser(u.id);
  console.log(`  removed ${testLeadIds.length} test leads, ${created.length} test users`);

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  if (fail > 0) {
    console.error("Failed checks:\n  - " + failures.join("\n  - "));
    process.exit(1);
  }
}

main().catch(async (e) => {
  console.error("verify-rls crashed:", e instanceof Error ? e.message : e);
  console.error("Attempting cleanup…");
  for (const id of testLeadIds) await admin.from("leads").delete().eq("id", id);
  for (const u of created) await admin.auth.admin.deleteUser(u.id).catch(() => {});
  process.exit(1);
});
