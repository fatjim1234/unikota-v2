import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MarketingIcon, type MarketingIconName } from "@/components/marketing-icons";
import { T } from "@/components/translated-text";
import { getContent, type OemContent } from "@/lib/content";
import oemFallback from "@/content/oem.json";

export const metadata: Metadata = {
  title: "OEM & Export — Unikota",
  description:
    "Build tissue and hygiene products with Unikota—from product definition and packaging development to production, fulfilment and export coordination.",
};

const stages: {
  number: string;
  key: string;
  title: string;
  body: string;
  image: string;
  position: string;
  icon: MarketingIconName;
}[] = [
  {
    number: "01",
    key: "define",
    title: "Define",
    body: "Clarify the product, specification, quantity, intended audience and target market.",
    image: "/images/unikota/oem-workbench.webp",
    position: "object-[25%_25%]",
    icon: "package",
  },
  {
    number: "02",
    key: "design",
    title: "Design",
    body: "Develop the packaging format, visual direction and production-ready requirements.",
    image: "/images/unikota/oem-design-studio.webp",
    position: "object-center",
    icon: "paint",
  },
  {
    number: "03",
    key: "manufacture",
    title: "Manufacture",
    body: "Coordinate production and packing through Unikota's capabilities and manufacturing network.",
    image: "/images/unikota/home-factory.webp",
    position: "object-[50%_35%]",
    icon: "factory",
  },
  {
    number: "04",
    key: "deliver",
    title: "Deliver",
    body: "Coordinate warehousing, delivery and export requirements for the agreed destination.",
    image: "/images/unikota/oem-export-loading.webp",
    position: "object-center",
    icon: "truck",
  },
];

const proof: { value: string; label: string; labelKey: string; icon: MarketingIconName }[] = [
  { value: "1983", label: "Operating since", labelKey: "site.common.proof.since", icon: "calendar" },
  { value: "RM2.9M", label: "Paid-up capital", labelKey: "site.common.proof.capital", icon: "chart" },
  { value: "3,300+", label: "Malaysian retail outlets", labelKey: "site.common.proof.outlets", icon: "storefront" },
  { value: "9", label: "Exporting markets", labelKey: "site.common.proof.markets", icon: "globe" },
];

const markets: { name: string; key: string }[] = [
  { name: "Hong Kong", key: "site.oem.markets.hongkong" },
  { name: "United States", key: "site.oem.markets.unitedstates" },
  { name: "Nigeria", key: "site.oem.markets.nigeria" },
  { name: "Singapore", key: "site.oem.markets.singapore" },
  { name: "Madagascar", key: "site.oem.markets.madagascar" },
  { name: "Thailand", key: "site.oem.markets.thailand" },
  { name: "Indonesia", key: "site.oem.markets.indonesia" },
  { name: "Mauritius", key: "site.oem.markets.mauritius" },
  { name: "India", key: "site.oem.markets.india" },
];

export default async function OemPage() {
  let content: OemContent;
  try {
    content = await getContent<OemContent>("oem");
  } catch {
    content = oemFallback as OemContent;
  }

  return (
    <>
      <section className="relative min-h-[680px] overflow-hidden bg-[#f8f6f1]">
        <Image
          src="/images/unikota/oem-hero-production.webp"
          alt="Tissue converting production floor with large paper rolls on active machinery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative mx-auto flex min-h-[680px] max-w-[82rem] items-start px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-[37rem] bg-white/90 p-6 shadow-[0_12px_36px_rgba(12,35,72,0.08)] sm:p-9">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-600"><T k="site.oem.eyebrow" /></p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] text-brand-800 sm:text-7xl">
              <T k="site.oem.title" />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-stone-700">
              <T k="site.oem.intro" />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" className="!rounded-none">
                <T k="site.oem.start" /> <MarketingIcon name="arrow" size={18} />
              </Button>
              <Button href="/products" variant="secondary" className="!rounded-none bg-white/90">
                <T k="site.oem.seeProducts" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[82rem] md:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <article key={stage.number} className="border-b border-r border-stone-200 last:border-r-0 lg:border-b-0">
              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <p className="font-display text-3xl font-bold text-brand-600">{stage.number}</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-brand-900"><T k={`site.oem.stages.${stage.key}.title`} fallback={stage.title} /></h2>
                </div>
                <MarketingIcon name={stage.icon} size={30} className="text-brand-400" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image src={stage.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className={`object-cover ${stage.position}`} />
              </div>
              <p className="px-5 py-5 text-sm leading-6 text-stone-600"><T k={`site.oem.stages.${stage.key}.body`} fallback={stage.body} /></p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Verified company facts" className="bg-brand-700 text-white">
        <p className="mx-auto max-w-[82rem] px-4 pt-8 text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand-100 sm:px-6 lg:px-8">
          The same operating scale behind every OEM and export programme
        </p>
        <dl className="mx-auto grid max-w-[82rem] grid-cols-2 gap-y-7 px-4 pb-10 pt-6 sm:px-6 md:grid-cols-4 lg:px-8 lg:pb-12">
          {proof.map((item) => (
            <div key={item.label} className="border-white/15 px-4 py-2 text-center md:border-r md:last:border-r-0">
              <MarketingIcon name={item.icon} size={22} className="mx-auto text-brand-200" />
              <dd className="mt-3 font-display text-3xl font-bold">{item.value}</dd>
              <dt className="mt-1.5 text-xs uppercase tracking-[0.1em] text-brand-100"><T k={item.labelKey} fallback={item.label} /></dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-[#fbfaf7] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-600"><T k="site.oem.customEyebrow" /></p>
            <h2 className="mt-3 font-display text-4xl font-bold text-brand-900 sm:text-5xl"><T k="site.oem.customTitle" /></h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">{content.capabilities.body}</p>
            <Button href="/contact" className="mt-7 !rounded-none"><T k="site.oem.proposal" /></Button>
          </div>
          <ul className="grid border-t border-stone-300 sm:grid-cols-2">
            {content.customisable?.items.map((item, index) => (
              <li key={item} className="flex gap-4 border-b border-stone-300 px-2 py-5 sm:odd:border-r sm:px-5">
                <span className="font-display text-lg font-bold text-brand-500">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-semibold text-brand-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {content.qualityStatement && content.qualityPoints?.length ? (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[82rem]">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              <T k="site.oem.qualityEyebrow" fallback="Standards" />
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold text-brand-900 sm:text-5xl">
              <T k="site.oem.qualityTitle" fallback="Quality & Programme Standards" />
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">{content.qualityStatement}</p>
            <div className="mt-10 grid gap-6 border-t border-stone-300 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {content.qualityPoints.map((point, index) => {
                // Icons are a fixed visual reinforcement in a fixed order — not a
                // certification badge. No ISO/FSC marks or accreditation-body logos.
                const qualityIcons: MarketingIconName[] = ["ruler", "shield", "seal", "clipboard"];
                // Titles are short structural labels (translated); bodies remain
                // English-only prose per the site's content-paragraph pattern.
                const titleKeys = [
                  "site.oem.qualityPoints.specification",
                  "site.oem.qualityPoints.hygiene",
                  "site.oem.qualityPoints.consistency",
                  "site.oem.qualityPoints.documentation",
                ];
                return (
                  <div key={point.title}>
                    <MarketingIcon name={qualityIcons[index] ?? "package"} size={28} className="text-brand-500" />
                    <h3 className="mt-3 font-display text-lg font-bold text-brand-900"><T k={titleKeys[index] ?? ""} fallback={point.title} /></h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{point.body}</p>
                  </div>
                );
              })}
            </div>
            <Button href="/contact" className="mt-10 !rounded-none">
              <T k="site.oem.proposal" />
            </Button>
          </div>
        </section>
      ) : null}

      <section id="export" className="bg-brand-900 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-200"><T k="site.oem.exportEyebrow" /></p>
              <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl"><T k="site.oem.exportTitle" /></h2>
            </div>
            <div>
              <p className="max-w-2xl text-base leading-7 text-brand-100">
                <T k="site.oem.exportBody" />
              </p>
              <Link href="/contact" className="focus-ring mt-6 inline-flex items-center gap-2 font-semibold text-white">
                <T k="site.oem.exportAction" /> <MarketingIcon name="arrow" size={18} />
              </Link>
            </div>
          </div>
          <ul className="mt-10 grid border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((market, index) => (
              <li
                key={market.name}
                className={`flex items-center gap-4 border-b border-white/20 py-4 sm:px-4 sm:odd:border-r lg:border-r ${
                  (index + 1) % 3 === 0 ? "lg:border-r-0" : ""
                }`}
              >
                <span className="font-display text-lg font-bold text-brand-300">{String(index + 1).padStart(2, "0")}</span>
                <span><T k={market.key} fallback={market.name} /></span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-5 text-brand-300">
            <T k="site.oem.exportNote" />
          </p>
        </div>
      </section>
    </>
  );
}
