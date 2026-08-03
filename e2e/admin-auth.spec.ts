import { test, expect } from "@playwright/test";

/**
 * Admin access control — UI level. These tests assert that an ANONYMOUS
 * visitor can never reach admin functionality, in BOTH runtime modes:
 *  - Supabase configured  → redirect to /admin/sign-in
 *  - not configured       → /admin/not-configured notice
 * Database-level rules are tested independently by scripts/verify-rls.ts.
 */

const ADMIN_PAGES = ["/admin", "/admin/content", "/admin/leads", "/admin/users"];

for (const path of ADMIN_PAGES) {
  test(`anonymous visitor cannot access ${path}`, async ({ page }) => {
    await page.goto(path);
    const url = page.url();
    const blocked =
      url.includes("/admin/sign-in") ||
      (await page.getByText("Admin area unavailable").count()) > 0;
    expect(blocked, `expected sign-in redirect or not-configured notice, got ${url}`).toBe(true);
    // Never render actual admin widgets
    await expect(page.locator("#content-json")).toHaveCount(0);
    await expect(page.getByText("Users & roles", { exact: true })).toHaveCount(0);
  });
}

test("anonymous PUT /api/content is rejected", async ({ request }) => {
  const res = await request.put("/api/content/home", { data: { hacked: true } });
  expect([401, 403, 503]).toContain(res.status());
});

test("GET /api/lead does not expose leads", async ({ request }) => {
  const res = await request.get("/api/lead");
  expect(res.status()).toBe(404);
});

test("public lead submission still works end-to-end", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name *").fill("Auth Spec Tester");
  await page.getByLabel("Email *").fill("auth-spec@test.com");
  await page.getByLabel("Enquiry type *").selectOption("General");
  await page.getByLabel("Message *").fill("Testing lead path after Phase 2A.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByTestId("lead-success")).toBeVisible();
});
