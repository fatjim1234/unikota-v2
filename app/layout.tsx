import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import { I18nProvider } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, type FooterFacts } from "@/components/site-footer";
import { getContent, type SettingsContent } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Unikota — Tissue Manufacturing, OEM & Retail",
    template: "%s",
  },
  description: "Unikota — Malaysian tissue-paper manufacturer, OEM partner and retail supplier.",
  openGraph: { siteName: "Unikota", locale: "en_MY", type: "website" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // /design-lab is an isolated prototyping surface (see proxy.ts): it never
  // renders the production chrome and never reaches the content backend, so
  // it cannot contact Supabase and each concept can own its own navigation.
  const isDesignLab = (await headers()).get("x-design-lab") === "1";

  if (isDesignLab) {
    return (
      <html lang="en">
        <body className="flex min-h-screen flex-col">
          <I18nProvider>{children}</I18nProvider>
        </body>
      </html>
    );
  }

  let facts: FooterFacts | undefined;
  try {
    const s = await getContent<SettingsContent>("settings");
    facts = {
      legalName: s.legalName,
      companyRegistrationNumber: s.companyRegistrationNumber,
      addressLines: s.addressLines,
      landline: s.landline,
      email: s.email,
      tagline: s.tagline,
    };
  } catch (error) {
    // If Supabase is unavailable, render without footer facts
    // Content will still display correctly
    facts = undefined;
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <I18nProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter facts={facts} />
        </I18nProvider>
      </body>
    </html>
  );
}
