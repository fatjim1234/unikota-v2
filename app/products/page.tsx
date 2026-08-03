import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MarketingIcon, type MarketingIconName } from "@/components/marketing-icons";
import { T } from "@/components/translated-text";
import { brandPortfolio } from "@/lib/brand-portfolio";

export const metadata: Metadata = {
  title: "Brands & Products — Unikota",
  description:
    "Explore Cili, Wasabi, Unisoft, Aimishu, BabyLike and SUMO alongside Unikota's Malaysian tissue and hygiene portfolio.",
};

const tissueBrands = brandPortfolio.slice(0, 4);
const careBrands = brandPortfolio.slice(4);

const productFamilies: {
  title: string;
  brands: string;
  description: string;
  image?: string;
  icon?: MarketingIconName;
  href: string;
  accent: string;
  tint: string;
}[] = [
  {
    title: "Facial Tissue",
    brands: "Unisoft",
    description: "Box and soft-pack formats for homes, offices, retail and institutional use.",
    image: "/images/unikota/product-facial.webp",
    href: "/products/unisoft",
    accent: "#298dc8",
    tint: "#edf8fd",
  },
  {
    title: "Hanging Tissue",
    brands: "Aimishu",
    description: "Space-saving packs made for convenient everyday access.",
    image: "/images/unikota/product-hanging.webp",
    href: "/products/aimishu",
    accent: "#168f88",
    tint: "#edf9f7",
  },
  {
    title: "Serviettes & Napkins",
    brands: "Cili · Wasabi · Cili Padi",
    description: "Practical paper serviettes for mamaks, restaurants, street food and catering.",
    image: "/images/unikota/product-serviettes.webp",
    href: "/products/cili",
    accent: "#e3292f",
    tint: "#fff3f2",
  },
  {
    title: "Toilet Rolls",
    brands: "Unisoft",
    description: "Multi-pack and bulk options for households, washrooms and institutions.",
    icon: "package",
    href: "/products/unisoft",
    accent: "#174a91",
    tint: "#eef5ff",
  },
  {
    title: "Kitchen Towels",
    brands: "Unisoft",
    description: "Absorbent everyday rolls for kitchens, food service and cleaning routines.",
    icon: "storefront",
    href: "/products/unisoft",
    accent: "#174a91",
    tint: "#f4f8fb",
  },
  {
    title: "Baby Care",
    brands: "BabyLike",
    description: "Everyday diapers for daily baby care and growing little ones.",
    icon: "package",
    href: "/products/babylike",
    accent: "#4c3d95",
    tint: "#f4f1ff",
  },
  {
    title: "Adult Care",
    brands: "SUMO",
    description: "High-absorbency adult diapers built for a secure, confident everyday fit.",
    icon: "package",
    href: "/products/sumo",
    accent: "#174a91",
    tint: "#eef5ff",
  },
  {
    title: "Custom & OEM",
    brands: "Your brand, our capability",
    description: "Product format, artwork, packaging and supply developed around your project.",
    image: "/images/unikota/product-oem.webp",
    href: "/oem",
    accent: "#174a91",
    tint: "#eef5ff",
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className="relative min-h-[680px] overflow-hidden bg-white">
        <Image
          src="/images/unikota/products-everyday.webp"
          alt="Tissue products used in a Malaysian home, neighbourhood shop and casual restaurant"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative mx-auto flex min-h-[680px] max-w-page items-end px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <div className="max-w-[47rem] border-l-4 border-brand-600 bg-white/95 p-7 shadow-[0_18px_50px_rgba(12,35,72,0.12)] backdrop-blur-sm sm:p-10">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-700"><T k="site.products.hero.eyebrow" fallback="OUR MALAYSIAN PORTFOLIO" /></p>
            <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.92] text-brand-900 sm:text-7xl">
              <T k="site.products.hero.title" fallback="BRANDS MADE FOR EVERYDAY MALAYSIA." />
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-stone-700">
              <T k="site.products.hero.body" fallback="From the dining table to daily care, Unikota brands are built around how Malaysians live, work and eat." />
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="#brands"><T k="site.products.hero.cta" fallback="Explore the portfolio" /></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="brands" className="bg-white">
        <div className="mx-auto max-w-page">
          {tissueBrands.map((brand, idx) => (
            <article key={brand.slug} className={`grid gap-0 border-b border-stone-200 last:border-b-0 lg:grid-cols-2 ${idx % 2 === 0 ? "" : "lg:[direction:rtl]"}`}>
              <div className="relative min-h-[320px] overflow-hidden bg-stone-100 lg:min-h-[420px]">
                {brand.image ? (
                  <Image src={brand.image} alt={`${brand.name} products`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                ) : null}
              </div>
              <div className={`flex flex-col justify-center px-5 py-10 sm:px-8 lg:px-10 lg:py-14 ${idx % 2 === 0 ? "" : "lg:[direction:ltr]"}`}>
                <h2 className="font-display text-4xl font-bold text-brand-900 sm:text-5xl"><T k={`site.brands.${brand.slug}.name`} fallback={brand.name} /></h2>
                <p className="mt-3 font-display text-lg font-semibold" style={{ color: brand.accent }}><T k={`site.brands.${brand.slug}.tagline`} fallback={brand.tagline} /></p>
                <p className="mt-4 max-w-lg text-base leading-7 text-stone-600"><T k={`site.brands.${brand.slug}.summary`} fallback={brand.summary} /></p>
                <p className="mt-4 text-sm font-semibold text-stone-500"><T k={`site.brands.${brand.slug}.spec`} fallback={`${brand.name} specification`} /></p>
                <Link href={`/products/${brand.slug}`} className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: brand.accent }}>
                  <T k="site.common.explore" fallback="Explore" /> {brand.name} <MarketingIcon name="arrow" size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-page">
          <h2 className="font-display text-4xl font-bold text-brand-900 sm:text-5xl"><T k="site.products.careTitle" fallback="Personal care under Unikota Holdings" /></h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {careBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/products/${brand.slug}`}
                className="focus-ring group grid min-h-[280px] border border-stone-200 p-8 sm:grid-cols-[40%_60%] sm:p-10"
                style={{ backgroundColor: brand.tint, borderTop: `6px solid ${brand.accent}` }}
              >
                <div className="relative min-h-24 sm:min-h-full">
                  <Image src={brand.logo} alt={`${brand.name} logo`} fill sizes="280px" className="object-contain object-left" />
                </div>
                <div className="flex flex-col pt-6 sm:pl-8 sm:pt-0">
                  <h3 className="font-display text-2xl font-bold leading-tight text-brand-900"><T k={`site.brands.${brand.slug}.name`} fallback={brand.name} /></h3>
                  <p className="mt-1 text-sm font-semibold text-stone-500"><T k={`site.brands.${brand.slug}.category`} fallback={brand.category} /></p>
                  <p className="mt-3 leading-6 text-stone-600"><T k={`site.brands.${brand.slug}.summary`} fallback={brand.summary} /></p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold" style={{ color: brand.accent }}>
                    <T k="site.common.explore" fallback="Explore" /> {brand.name} <MarketingIcon name="arrow" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-page">
          <h2 className="font-display text-2xl font-bold text-brand-900"><T k="site.products.productsTitle" fallback="Product families" /></h2>
          <div className="mt-8 flex flex-wrap gap-6 sm:gap-8">
            {productFamilies.slice(0, 6).map((family) => (
              <Link
                key={family.title}
                href={family.href}
                className="focus-ring group flex flex-col items-center gap-3 text-center hover:opacity-70 transition-opacity"
              >
                <div className="rounded-full p-4" style={{ backgroundColor: family.tint }}>
                  {family.image ? (
                    <div className="relative h-12 w-12 overflow-hidden">
                      <Image src={family.image} alt={family.title} fill className="object-cover rounded-full" sizes="48px" />
                    </div>
                  ) : (
                    <MarketingIcon name={family.icon ?? "package"} size={48} style={{ color: family.accent }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-900"><T k={`site.products.family${productFamilies.indexOf(family) + 1}.title`} fallback={family.title} /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-page flex-col gap-7 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl"><T k="site.products.cta.title" fallback="BUILT FOR MALAYSIA. TRUSTED EVERY DAY." /></h2>
            <p className="mt-3 max-w-2xl text-brand-100"><T k="site.products.cta.body" fallback="Partner with Unikota for quality brands and reliable supply across every channel." /></p>
          </div>
          <Button href="/contact" className="shrink-0 !bg-white !text-brand-800 hover:!bg-brand-50"><T k="site.common.talk" fallback="Talk to Our Team" /></Button>
        </div>
      </section>
    </>
  );
}
