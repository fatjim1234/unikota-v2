import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui";
import { MarketingIcon } from "@/components/marketing-icons";
import { T } from "@/components/translated-text";
import { brandPortfolio, getBrandBySlug } from "@/lib/brand-portfolio";

type BrandPageProps = { params: Promise<{ brand: string }> };

export function generateStaticParams() {
  return brandPortfolio.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} — Unikota Brands`,
    description: `${brand.tagline} ${brand.summary}`,
  };
}

export default async function BrandFeaturePage({ params }: BrandPageProps) {
  const { brand: slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const related = brandPortfolio.filter((item) => item.slug !== brand.slug).slice(0, 3);

  // Column count must track the product count, otherwise a fixed 4-up grid
  // leaves empty cells that render as blank boxes (every brand except Unisoft
  // ships fewer than four products). Static strings so Tailwind can see them.
  const productColumns =
    brand.products.length >= 4 ? "lg:grid-cols-4" : brand.products.length === 3 ? "lg:grid-cols-3" : "";

  return (
    <>
      <section className="relative overflow-hidden" style={{ backgroundColor: brand.tint }}>
        <div className="mx-auto grid min-h-[620px] max-w-page lg:grid-cols-[48%_52%]">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
            <Link href="/products#our-brands" className="focus-ring inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-700">
              <MarketingIcon name="arrow" size={17} className="rotate-180" /> <T k="site.common.allBrands" />
            </Link>
            <p className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: brand.accent }}><T k={`site.brands.${brand.slug}.category`} fallback={brand.category} /></p>
            <div className="relative mt-5 h-24 w-full max-w-[26rem] sm:h-32">
              <Image src={brand.logo} alt={`${brand.name} logo`} fill priority sizes="420px" className="object-contain object-left" />
            </div>
            <h1 className="mt-8 max-w-xl font-display text-5xl font-bold leading-[0.95] text-brand-900 sm:text-6xl"><T k={`site.brands.${brand.slug}.tagline`} fallback={brand.tagline} /></h1>
            <p className="mt-5 max-w-lg text-xl leading-8 text-stone-700"><T k={`site.brands.${brand.slug}.summary`} fallback={brand.summary} /></p>
            <div className="mt-8">
              <Button href="/contact"><T k="site.brandPage.askAbout" /> {brand.name}</Button>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden lg:min-h-full" style={{ backgroundColor: brand.accent }}>
            {brand.image ? (
              <Image
                src={brand.image}
                alt={`${brand.name} product range`}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center p-12">
                <div className="relative h-52 w-full max-w-xl rounded-none bg-white/95 p-10 shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
                  <Image src={brand.logo} alt="" fill sizes="520px" className="object-contain p-10" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-page gap-12 lg:grid-cols-[38%_62%] lg:gap-20">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: brand.accent }}><T k="site.brandPage.storyLabel" /></p>
            <h2 className="mt-3 font-display text-4xl font-bold text-brand-900 sm:text-5xl"><T k="site.brandPage.storyTitle" /></h2>
          </div>
          <div className="space-y-6 text-lg leading-8 text-stone-700">
            {brand.story.map((paragraph, index) => <p key={paragraph}><T k={`site.brands.${brand.slug}.story${index + 1}`} fallback={paragraph} /></p>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20" style={{ backgroundColor: brand.tint }}>
        <div className="mx-auto max-w-page">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: brand.accent }}><T k="site.brandPage.range" /></p>
          <h2 className="mt-3 font-display text-4xl font-bold text-brand-900 sm:text-5xl"><T k="site.brandPage.productsUnder" /> {brand.name}</h2>
          <div className={`mt-10 grid gap-5 sm:grid-cols-2 ${productColumns}`}>
            {brand.products.map((product, index) => (
              <article key={product} className="flex min-h-[210px] flex-col border border-stone-200 bg-white p-7">
                <p className="font-display text-3xl font-bold" style={{ color: brand.accent }}>{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-10 font-display text-2xl font-bold text-brand-900">{product}</h3>
                <Link href="/contact" className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: brand.accent }}>
                  <T k="site.common.enquire" /> <MarketingIcon name="arrow" size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {brand.subBrand ? (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-page items-center gap-10 border-y border-stone-200 py-12 lg:grid-cols-[35%_65%] lg:gap-16">
            <div>
              <div className="relative h-24 w-full">
                <Image src={brand.subBrand.logo} alt={`${brand.subBrand.name} logo`} fill sizes="360px" className="object-contain object-left" />
              </div>
              {brand.subBrand.image ? (
                <div className="relative mt-4 aspect-square w-full max-w-[16rem]" style={{ backgroundColor: brand.tint }}>
                  <Image src={brand.subBrand.image} alt={`${brand.subBrand.name} products`} fill sizes="260px" className="object-contain p-4" />
                </div>
              ) : null}
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: brand.accent }}><T k="site.brandPage.underCili" /></p>
              <h2 className="mt-2 font-display text-4xl font-bold text-brand-900"><T k="site.brandPage.valueTitle" /></h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-700">{brand.subBrand.description}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-brand-900 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-page">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-200"><T k="site.brandPage.keepExploring" /></p>
              <h2 className="mt-2 font-display text-4xl font-bold"><T k="site.brandPage.moreBrands" /></h2>
            </div>
            <Link href="/products" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-white"><T k="site.brandPage.fullPortfolio" /> <MarketingIcon name="arrow" size={17} /></Link>
          </div>
          <div className="mt-9 grid gap-px bg-white/20 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/products/${item.slug}`} className="focus-ring group bg-brand-900 p-7">
                {/* A compact chip, not a full-width slab: Unisoft's wordmark is near-black
                    ink, so a light backing stays necessary for legibility on this dark
                    section — going fully transparent here would make that logo vanish. */}
                <div className="relative h-14 w-40 max-w-full rounded-md bg-white/95 p-2.5 shadow-sm">
                  <Image src={item.logo} alt={`${item.name} logo`} fill sizes="160px" className="object-contain p-2" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold"><T k={`site.brands.${item.slug}.tagline`} fallback={item.tagline} /></h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-200"><T k="site.common.explore" /> {item.name} <MarketingIcon name="arrow" size={17} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
