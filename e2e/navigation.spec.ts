import { test, expect } from "@playwright/test";

const pages = [
  { path: "/about", h1: "Company Profile" },
  { path: "/products", h1: "Products" },
  { path: "/manufacturing", h1: "Manufacturing & Quality" },
  { path: "/oem", h1: "OEM, Customisation & Export" },
  { path: "/solutions", h1: "Solutions for Every Market" },
  { path: "/export", h1: "Export Supply" },
  { path: "/contact", h1: "Contact / Request a Proposal" },
];

test.describe("Public page navigation", () => {
  for (const p of pages) {
    test(`renders ${p.path} with correct h1 and SEO metadata`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(p.h1);
      // SEO: title and meta description present
      await expect(page).toHaveTitle(/.+/);
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute("content", /.+/);
    });
  }

  test("header navigation reaches OEM page from home", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "OEM & Customisation" }).click();
    } else {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "OEM & Customisation" }).click();
    }
    await expect(page).toHaveURL(/\/oem$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("OEM, Customisation & Export");
  });

  test("no prototype or placeholder signals on public pages", async ({ page }) => {
    for (const path of ["/", "/about", "/manufacturing", "/products", "/oem", "/contact"]) {
      await page.goto(path);
      await expect(page.getByText("REQUIRED INPUT", { exact: false })).toHaveCount(0);
      await expect(page.getByText("placeholder data only", { exact: false })).toHaveCount(0);
      await expect(page.getByText("PLACEHOLDER", { exact: false })).toHaveCount(0);
    }
  });

  test("quotation route redirects to contact", async ({ page }) => {
    await page.goto("/quotation");
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("WhatsApp CTA carries pre-filled enquiry context", async ({ page }) => {
    await page.goto("/contact");
    const cta = page.getByTestId("whatsapp-cta").first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toContain("https://wa.me/60123456789");
    expect(href).toContain(encodeURIComponent("Enquiry:"));
    expect(href).toContain(encodeURIComponent("/contact"));
  });
});
