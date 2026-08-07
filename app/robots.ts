import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "https://www.unikota.com" : "http://localhost:3000");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account", "/cart", "/shop", "/subscriptions", "/quotation", "/oem/wizard", "/oem/design-studio"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
