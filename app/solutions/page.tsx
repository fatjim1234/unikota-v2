import type { Metadata } from "next";
import { Button, Eyebrow, PageHero, Section } from "@/components/ui";
import { ProductVisual } from "@/components/product-visual";
import { T } from "@/components/translated-text";
import { getContent, type SolutionsContent } from "@/lib/content";
import solutionsFallback from "@/content/solutions.json";

export const metadata: Metadata = {
  title: "Solutions for Every Market — Unikota",
  description:
    "Tissue, hygiene and customised product solutions for households, retailers, hospitality, corporate organisations, events, private-label brands and export buyers.",
};

const VISUALS = ["box", "sheet", "roll", "box", "sheet", "box"] as const;

export default async function SolutionsPage() {
  let c: SolutionsContent;
  try {
    c = await getContent<SolutionsContent>("solutions");
  } catch {
    c = solutionsFallback as SolutionsContent;
  }

  return (
    <>
      <PageHero eyebrow={<T k="site.common.brandLine" fallback="We're More Than Paper" />} title={<T k="site.solutions.heroTitle" fallback={c.hero.title} />} lead={<T k="site.solutions.heroLead" fallback={c.hero.lead} />}>
        <Button href="/contact" className="!bg-white !text-brand-800 hover:!bg-brand-50">
          <T k="site.oem.proposal" fallback="Request a Proposal" />
        </Button>
      </PageHero>

      <Section>
        <div className="grid gap-14">
          {c.groups.map((g, i) => (
            <article
              key={g.slug}
              id={g.slug}
              className={`grid items-center gap-6 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              {/* Future lifestyle/project image slot — see docs/website-asset-manifest.md (solutions.<slug>) */}
              <ProductVisual slot={`solutions.${g.slug}`} variant={VISUALS[i % VISUALS.length]} />
              <div>
                <Eyebrow><T k="site.solutions.eyebrow" fallback="Solutions" /></Eyebrow>
                <h2 className="text-2xl font-bold text-ink"><T k={`site.solutions.groups.${g.slug}.title`} fallback={g.title} /></h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base"><T k={`site.solutions.groups.${g.slug}.body`} fallback={g.body} /></p>
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-stone-700 sm:grid-cols-2">
                  {g.items.map((item, ii) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <T k={`site.solutions.groups.${g.slug}.items.${ii}`} fallback={item} />
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Button href="/contact" variant="secondary"><T k="site.solutions.discuss" fallback="Discuss your requirements" /></Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-brand-800 text-white">
        <div className="mx-auto flex max-w-page flex-col items-start gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold"><T k="site.solutions.notSure" fallback="Not sure where your project fits?" /></h2>
          <Button href="/contact" className="shrink-0 !bg-white !text-brand-800 hover:!bg-brand-50">
            <T k="site.oem.proposal" fallback="Request a Proposal" />
          </Button>
        </div>
      </section>
    </>
  );
}
