import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MarketingIcon, type MarketingIconName } from "@/components/marketing-icons";
import { T } from "@/components/translated-text";

export const metadata: Metadata = {
  title: "Unikota — We're More Than Paper | From Concept to Market",
  description:
    "Malaysian tissue products, own brands, OEM solutions and export coordination from an established company operating since 1983.",
};

const proof: { value: string; valueKey?: string; label: string; labelKey: string; icon: MarketingIconName }[] = [
  { value: "1983", label: "Operating since", labelKey: "site.common.proof.since", icon: "calendar" },
  { value: "RM2.9M", label: "Paid-up capital", labelKey: "site.common.proof.capital", icon: "chart" },
  { value: "Thousands", valueKey: "site.common.proof.thousandsValue", label: "Malaysian retail outlets", labelKey: "site.common.proof.outlets", icon: "storefront" },
  { value: "9", label: "Exporting markets", labelKey: "site.common.proof.markets", icon: "globe" },
];

const pathways = [
  {
    number: "01",
    title: "Discover Unikota",
    titleKey: "site.home.discoverTitle",
    body: "Four decades of Malaysian tissue and hygiene experience—built on supply, service and long-term partnerships.",
    bodyKey: "site.home.discoverBody",
    href: "/about",
    action: "View company profile",
    actionKey: "site.home.discoverAction",
    image: "/images/unikota/home-factory.webp",
    position: "object-top",
    colour: "text-brand-700",
  },
  {
    number: "02",
    title: "Explore Our Brands & Products",
    titleKey: "site.home.brandsTitle",
    body: "Tissue products for homes, retailers, restaurants, hospitality, organisations and export markets.",
    bodyKey: "site.home.brandsBody",
    href: "/products",
    action: "Explore brands & products",
    actionKey: "site.home.brandsAction",
    image: "/images/unikota/products-everyday.webp",
    position: "object-top",
    colour: "text-teal-700",
  },
  {
    number: "03",
    title: "Create With Unikota",
    titleKey: "site.home.oemTitle",
    body: "Private label, customised packaging, bulk supply and export programmes—from idea to market readiness.",
    bodyKey: "site.home.oemBody",
    href: "/oem",
    action: "OEM & export",
    actionKey: "site.home.oemAction",
    image: "/images/unikota/oem-workbench.webp",
    position: "object-top",
    colour: "text-red-700",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="grid min-h-[680px] bg-brand-700 lg:grid-cols-[42%_58%]">
        <div className="relative z-10 flex items-center px-5 py-14 text-white sm:px-10 lg:px-[max(3rem,calc((100vw-82rem)/2))] lg:py-20">
          <div className="max-w-[34rem]">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
              <T k="site.home.eyebrow" />
            </p>
            <h1 className="mt-5 font-display text-[3.8rem] font-bold uppercase leading-[0.88] tracking-[-0.02em] sm:text-[5.2rem] lg:text-[6.1rem]">
              <T k="site.home.title" />
            </h1>
            <p className="mt-7 max-w-md text-lg leading-7 text-brand-50">
              <T k="site.home.intro" />
            </p>
            <p className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              <T k="site.common.fromConcept" />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products" className="!rounded-none !bg-white !text-brand-800 hover:!bg-brand-50">
                <T k="site.home.exploreProducts" /> <MarketingIcon name="arrow" size={18} />
              </Button>
              <Button href="/oem" variant="secondary" className="!rounded-none !border-white !text-white hover:!bg-white hover:!text-brand-800">
                <T k="site.home.create" /> <MarketingIcon name="arrow" size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[430px] overflow-hidden lg:min-h-full">
          <Image
            src="/images/unikota/home-factory.webp"
            alt="Tissue cartons being prepared for delivery at a Malaysian factory loading bay, with embossed tissue architecture in the foreground"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-bottom"
          />
        </div>
      </section>

      <section aria-label="Verified company facts" className="border-b border-stone-200 bg-white">
        <dl className="mx-auto grid max-w-[82rem] grid-cols-2 gap-y-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8 lg:py-12">
          {proof.map((item) => (
            <div key={item.label} className="border-stone-200 px-4 py-2 text-center md:border-r md:last:border-r-0">
              <MarketingIcon name={item.icon} size={24} className="mx-auto text-brand-600" />
              <dd className="mt-3 font-display text-3xl font-bold text-brand-800">{item.valueKey ? <T k={item.valueKey} fallback={item.value} /> : item.value}</dd>
              <dt className="mt-1.5 text-xs uppercase tracking-[0.1em] text-stone-500"><T k={item.labelKey} fallback={item.label} /></dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-[#fbfaf7] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[82rem]">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-600"><T k="site.home.start" /></p>
          <h2 className="mt-3 font-display text-4xl font-bold text-brand-900 sm:text-5xl"><T k="site.home.ways" /></h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            <T k="site.home.waysIntro" />
          </p>

          <div className="mt-10 border-y border-stone-300">
            {pathways.map((pathway) => (
              <article key={pathway.number} className="border-b border-stone-300 last:border-b-0">
                <div className="grid lg:grid-cols-[42%_58%]">
                  <div className="flex gap-5 px-1 py-9 sm:gap-8 sm:px-6 lg:items-center lg:px-8 lg:py-12">
                    <p className={`font-display text-4xl font-bold ${pathway.colour}`}>{pathway.number}</p>
                    <div>
                      <h3 className="font-display text-3xl font-bold text-brand-900"><T k={pathway.titleKey} fallback={pathway.title} /></h3>
                      <p className="mt-3 max-w-lg text-base leading-6 text-stone-600"><T k={pathway.bodyKey} fallback={pathway.body} /></p>
                      <Link href={pathway.href} className={`focus-ring mt-6 inline-flex items-center gap-2 text-sm font-semibold ${pathway.colour}`}>
                        <T k={pathway.actionKey} fallback={pathway.action} /> <MarketingIcon name="arrow" size={17} />
                      </Link>
                    </div>
                  </div>
                  <div className="relative min-h-[250px] overflow-hidden lg:min-h-[300px]">
                    <Image
                      src={pathway.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className={`object-cover ${pathway.position}`}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-[82rem] flex-col gap-7 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-5">
            <MarketingIcon name="factory" size={50} className="shrink-0 text-brand-200" />
            <div>
              <h2 className="font-display text-3xl font-bold"><T k="site.home.cta" /></h2>
              <p className="mt-1 text-brand-100"><T k="site.home.ctaBody" /></p>
            </div>
          </div>
          <Button href="/contact" variant="secondary" className="!rounded-none !border-white !text-white hover:!bg-white hover:!text-brand-800">
            <T k="site.common.talk" /> <MarketingIcon name="arrow" size={18} />
          </Button>
        </div>
      </section>
    </>
  );
}
