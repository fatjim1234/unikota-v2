import { test, expect } from "@playwright/test";

test.describe("Lead submission", () => {
  test("submits a valid enquiry and shows confirmation", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name *").fill("Playwright Tester");
    await page.getByLabel("Email *").fill("tester@example.com");
    await page.getByLabel("Company (optional)").fill("E2E Test Sdn Bhd");
    await page.getByLabel("Enquiry type *").selectOption("Export");
    await page.getByLabel("Message *").fill("Automated test enquiry — please ignore.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByTestId("lead-success")).toBeVisible();
  });

  test("shows accessible validation errors for empty submit", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    const nameError = page.locator("#lead-name-error");
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveAttribute("role", "alert");
    // Field is linked to its error for screen readers
    await expect(page.getByLabel("Name *")).toHaveAttribute("aria-describedby", "lead-name-error");
    await expect(page.getByLabel("Name *")).toHaveAttribute("aria-invalid", "true");
    // No success state
    await expect(page.getByTestId("lead-success")).toHaveCount(0);
  });

  test("rejects invalid email client-side", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name *").fill("Tester");
    await page.getByLabel("Email *").fill("not-an-email");
    await page.getByLabel("Message *").fill("Hello");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("#lead-email-error")).toBeVisible();
  });

  test("lead API validates server-side", async ({ request }) => {
    const res = await request.post("/api/lead", {
      data: { name: "", email: "bad", message: "", type: "Nope", consent: false, website: "" },
    });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.fields).toHaveProperty("name");
    expect(body.fields).toHaveProperty("email");
    expect(body.fields).toHaveProperty("consent");
  });

  test("unauthenticated content API write is rejected", async ({ request }) => {
    const res = await request.put("/api/content/home", { data: { hacked: true } });
    // 401 unauthenticated (Supabase mode), 403 unauthorized, 503 backend unavailable
    expect([401, 403, 503]).toContain(res.status());
  });
});
