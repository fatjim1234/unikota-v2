import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, Eyebrow, PageHero, Section, Stat } from "@/components/ui";
import { MarketingIcon } from "@/components/marketing-icons";
import { T } from "@/components/translated-text";
import { getContent, type AboutContent } from "@/lib/content";
import { brandPortfolio } from "@/lib/brand-portfolio";

export const metadata: Metadata = {
  title: "Company Profile — Unikota Holdings Sdn. Bhd.",
  description:
    "Unikota Holdings Sdn. Bhd. — established Malaysian tissue and hygiene solutions company since 1983. Own brands, OEM, customised packaging and export experience.",
};

export default async function AboutPage() {
  const c = await getContent<AboutContent>("about");

  return (
    <>
      {/* 1 — HERO */}
      <PageHero eyebrow={<T k="site.common.brandLine" fallback={c.brandLine ?? "We're More Than Paper"} />} title={<T k="site.about.heroTitle" fallback={c.hero.title} />} lead={<T k="site.about.heroLead" fallback={c.hero.lead} />}>
        <Button href="/contact" className="!bg-white !text-brand-800 hover:!bg-brand-50">
          <T k="site.oem.proposal" fallback="Request a Proposal" />
        </Button>
      </PageHero>

      {/* 2 — COMPANY OVERVIEW */}
      <Section title={<T k="site.about.overview" />}>
        <p className="max-w-3xl text-base leading-relaxed text-stone-700">{c.overview ?? c.story[0]}</p>
      </Section>

      {/* 3 — HERITAGE */}
      {c.heritage && c.heritage.length > 0 ? (
        <Section muted>
          <Eyebrow><T k="site.about.heritage" /></Eyebrow>
          <h2 className="mb-8 font-display text-4xl font-bold text-brand-900"><T k="site.about.heritageTitle" /></h2>
          <ol className="relative space-y-8 border-l-2 border-brand-200 pl-6">
            {c.heritage.map((h) => (
              <li key={h.label} className="relative">
                <span aria-hidden className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-600" />
                <p className="font-bold text-brand-800">{h.label}</p>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">{h.body}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* 4 — WHAT WE DO */}
      {c.lanes && c.lanes.length > 0 ? (
        <Section title={<T k="site.about.what" />}>
          <div className="grid gap-6 lg:grid-cols-2">
            {c.lanes.map((lane) => (
              <Card key={lane.title} className="h-full border-t-4 border-t-brand-600">
                <h3 className="font-display text-2xl font-bold text-ink">{lane.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{lane.body}</p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 5 — FROM CONCEPT TO MARKET */}
      {c.conceptToMarket ? (
        <section className="bg-brand-900 text-white">
          <div className="mx-auto max-w-page px-4 py-12 sm:px-6">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-200"><T k="site.about.concept" /></p>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-brand-50 sm:text-2xl">{c.conceptToMarket}</p>
          </div>
        </section>
      ) : null}

      {/* 6 — CUSTOMISED SOLUTIONS */}
      {c.customised && c.customised.length > 0 ? (
        <Section title={<T k="site.about.customised" />}>
          {c.customisedIntro ? (
            <p className="mb-6 max-w-2xl text-base leading-relaxed text-stone-600">{c.customisedIntro}</p>
          ) : null}
          <ul className="grid max-w-4xl gap-x-8 gap-y-2 text-sm text-stone-700 sm:grid-cols-2 lg:grid-cols-3">
            {c.customised.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* 6.5 — PROGRAMME STANDARDS. Built with raw markup rather than the
          shared Section wrapper so it can carry a supporting image — this was
          the only fully text-only, image-free page on the site. */}
      {c.qualityStatement ? (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <div className="mx-auto grid max-w-page items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h2 className="font-display text-4xl font-bold text-brand-900">
                <T k="site.about.quality" fallback="Programme Standards" />
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-700">{c.qualityStatement}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-stone-200 shadow-sm">
              <Image
                src="/images/unikota/about-quality-review.webp"
                alt="Specification review meeting in a Kuala Lumpur office"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* 7 — TISSUE, HYGIENE & PERSONAL CARE */}
      {c.broaderCapability ? (
        <Section title={<T k="site.about.broader" />} muted>
          <p className="max-w-3xl text-base leading-relaxed text-stone-700">{c.broaderCapability}</p>
        </Section>
      ) : null}

      {/* 8 — FACTS & REACH */}
      {c.facts && c.facts.length > 0 ? (
        <Section title={<T k="site.about.facts" />}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.facts.map((f, index) => {
              // Reuse the existing proof labels (Home/OEM stats band) rather than
              // duplicating — same four concepts in the same order.
              const proofKeys = ["site.common.proof.since", "site.common.proof.capital", "site.common.proof.outlets", "site.common.proof.markets"];
              return <Stat key={f.label} value={f.value} label={<T k={proofKeys[index] ?? ""} fallback={f.label} />} />;
            })}
          </div>
        </Section>
      ) : null}

      {/* 9 — OWN BRANDS */}
      <Section title={<T k="site.about.brands" />} muted>
        <p className="mb-8 max-w-3xl text-lg leading-7 text-stone-600"><T k="site.about.brandsIntro" /></p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandPortfolio.map((brand) => (
            <Link
              key={brand.slug}
              href={`/products/${brand.slug}`}
              className="focus-ring group flex min-h-[250px] flex-col border border-stone-200 bg-white p-7"
              style={{ borderTop: `5px solid ${brand.accent}` }}
            >
              <div className="relative h-20 w-full">
                <Image src={brand.logo} alt={`${brand.name} logo`} fill sizes="300px" className="object-contain object-left" />
              </div>
              <p className="mt-6 text-sm font-bold" style={{ color: brand.accent }}><T k={`site.brands.${brand.slug}.category`} fallback={brand.category} /></p>
              <h3 className="mt-1 font-display text-2xl font-bold text-brand-900"><T k={`site.brands.${brand.slug}.tagline`} fallback={brand.tagline} /></h3>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold" style={{ color: brand.accent }}>
                <T k="site.common.explore" /> {brand.name} <MarketingIcon name="arrow" size={17} />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 10 — OEM & SUPPLY EXPERIENCE */}
      {c.oemExperience ? (
        <Section title={<T k="site.about.experience" />}>
          <p className="max-w-3xl text-base leading-relaxed text-stone-700">{c.oemExperience}</p>
        </Section>
      ) : null}

      {/* 11 — CTA */}
      <section className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-page flex-col items-start gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-3xl font-bold"><T k="site.about.cta" /></h2>
          <Button href="/contact" className="shrink-0 !bg-white !text-brand-800 hover:!bg-brand-50">
            <T k="site.oem.proposal" />
          </Button>
        </div>
      </section>
    </>
  );
}
