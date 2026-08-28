import type { Metadata } from "next";
import { Button, Card, PageHero, PlaceholderBlock, Section } from "@/components/ui";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { T } from "@/components/translated-text";
import { getContent, type ManufacturingContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Manufacturing & Quality — Unikota",
  description:
    "Unikota's tissue-paper manufacturing and quality control. Capability presentation with facility, production line and capacity details available on request.",
};

export default async function ManufacturingPage() {
  const c = await getContent<ManufacturingContent>("manufacturing");
  return (
    <>
      <PageHero title={<T k="site.manufacturing.heroTitle" fallback={c.hero.title} />} lead={<T k="site.manufacturing.heroLead" fallback={c.hero.lead} />}>
        <Button href="/contact"><T k="site.oem.proposal" fallback="Request a Proposal" /></Button>
        <WhatsAppButton context="Manufacturing capabilities enquiry" />
      </PageHero>
      <Section title={<T k="site.manufacturing.facility" fallback="Facility" />}>
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="text-sm text-stone-700">{c.facility.overview}</p>
          <PlaceholderBlock label="facility" />
        </div>
      </Section>
      {c.lines.length > 0 ? (
        <Section title="Production lines" muted>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.lines.map((l) => (
              <Card key={l.name}>
                <p className="text-sm font-semibold">{l.name}</p>
                <p className="mt-2 text-xs text-stone-500">{l.detail}</p>
              </Card>
            ))}
          </div>
          {c.linesNote ? <p className="mt-4 text-xs text-stone-500">{c.linesNote}</p> : null}
        </Section>
      ) : null}
      <Section title={<T k="site.manufacturing.quality" fallback="Quality" />}>
        <p className="max-w-2xl text-sm text-stone-700">{c.qc.body}</p>
      </Section>
    </>
  );
}
