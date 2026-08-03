import type { Metadata } from "next";
import { Button, Card, PageHero, PlaceholderBlock, Section } from "@/components/ui";
import { WhatsAppButton } from "@/components/whatsapp-button";
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
      <PageHero title={c.hero.title} lead={c.hero.lead}>
        <Button href="/contact">Request a Proposal</Button>
        <WhatsAppButton context="Manufacturing capabilities enquiry" />
      </PageHero>
      <Section title="Facility">
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
      <Section title="Quality">
        <p className="max-w-2xl text-sm text-stone-700">{c.qc.body}</p>
      </Section>
    </>
  );
}
