import type { MetadataRoute } from "next";
import { brandPortfolio } from "@/lib/brand-portfolio";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/products",
    ...brandPortfolio.map((brand) => `/products/${brand.slug}`),
    "/oem",
    "/export",
    "/contact",
  ];
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
