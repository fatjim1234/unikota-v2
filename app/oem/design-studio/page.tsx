import { Badge, Button, Card, PageHero, PlaceholderBlock, Section } from "@/components/ui";

export default function DesignStudioPage() {
  return (
    <>
      <PageHero
        title="Packaging Design Studio"
        lead="Collaborate on packaging concepts with our designers. Every image here is a concept preview — never a print-ready file."
      />
      <Section>
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge tone="red">CONCEPT PREVIEW — NOT PRINT-READY</Badge>
          <Badge tone="stone">Sign-in required in production (OEM / export buyers)</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((v) => (
            <Card key={v}>
              <div className="relative">
                <PlaceholderBlock label={`packaging concept v${v}`} />
                <span className="absolute left-2 top-2 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                  CONCEPT PREVIEW
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Concept v{v}</p>
                <Badge tone={v === 3 ? "green" : "stone"}>{v === 3 ? "latest" : "superseded"}</Badge>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                [Placeholder concept. In production: watermarked preview stored in the private oem-assets bucket, versioned, with comments.]
              </p>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <h2 className="font-semibold">Project brief (demo form — nothing is saved)</h2>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" aria-label="Design brief demo">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Brand name</span>
              <input className="focus-ring w-full rounded-md border border-stone-300 px-3 py-2" placeholder="Your brand" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Style direction</span>
              <select className="focus-ring w-full rounded-md border border-stone-300 px-3 py-2">
                <option>Clean & minimal</option>
                <option>Family & warm</option>
                <option>Premium</option>
                <option>Playful</option>
              </select>
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">Brand assets</span>
              <div className="rounded-md border border-dashed border-stone-300 p-6 text-center text-xs text-stone-500">
                [Upload area — in production: private storage, allowlisted file types, project-member access only]
              </div>
            </label>
            <div className="sm:col-span-2">
              <Button type="button">Request concepts (demo)</Button>
            </div>
          </form>
          <p className="mt-3 text-xs text-stone-500">
            Whether AI-assisted concept generation is used is a business decision (Q23). If enabled, AI outputs are watermarked
            previews only and never used for pricing.
          </p>
        </Card>
      </Section>
    </>
  );
}
