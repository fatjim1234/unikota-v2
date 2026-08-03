import { Badge, Button, Card, PageHero, RequiredInput, Section } from "@/components/ui";

export default function RetailLaunchPage() {
  return (
    <>
      <PageHero
        title="Retail Launch Support"
        lead="Retail readiness and distribution support for your private-label product. We prepare you for retail — we do not sell guaranteed shelf space."
      />
      <Section title="What we help with">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { t: "Packaging compliance guidance", b: "Labelling requirements, mandatory marks and content checks for your target market. [Checklist content — REQUIRED INPUT Q28 legal review]" },
            { t: "Barcode & labelling setup", b: "GS1 barcode registration guidance and artwork placement checks." },
            { t: "Retail readiness review", b: "Carton configuration, shelf-ready packaging options and trade presentation." },
            { t: "Distribution support", b: "Introductions and support in conversations with our distribution network. [Partner network scope — REQUIRED INPUT]" },
          ].map((s) => (
            <Card key={s.t}>
              <h3 className="font-semibold text-sm">{s.t}</h3>
              <p className="mt-2 text-sm text-stone-600">{s.b}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section muted>
        <Card>
          <h2 className="font-semibold">What we don't promise</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="stone">No guaranteed supermarket listings</Badge>
            <Badge tone="stone">No guaranteed delivery times</Badge>
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Listing decisions belong to retailers. Our commitment is <strong>retail readiness and distribution support</strong> —
            honest wording that this platform enforces everywhere.
          </p>
          <div className="mt-4">
            <Button href="/quotation">Discuss your launch — Request a Quotation</Button>
          </div>
        </Card>
        <div className="mt-4">
          <RequiredInput label="scope of support services actually offered + any fees" qref="Q — confirm with sales" />
        </div>
      </Section>
    </>
  );
}
