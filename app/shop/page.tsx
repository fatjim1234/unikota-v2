import { Badge, Button, Card, PageHero, PlaceholderBlock, Section } from "@/components/ui";
import { shopProducts } from "@/lib/data";

export default function ShopPage() {
  return (
    <>
      <PageHero title="Member Shop" lead="Retail packs and household bundles. Prices and SKUs are required business input (Q9, Q31) — placeholders shown.">
        <Button href="/subscriptions" variant="secondary" className="!text-white !border-white hover:!bg-brand-700">
          Prefer a subscription?
        </Button>
      </PageHero>
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shopProducts.map((p) => (
            <Card key={p.id}>
              <PlaceholderBlock label={p.name} />
              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <Badge tone={p.tag === "Bundle" ? "green" : "brand"}>{p.tag}</Badge>
              </div>
              <p className="mt-1 text-lg font-bold text-brand-700">{p.price}</p>
              <p className="text-xs text-amber-800">{p.note}</p>
              <Button href="/cart" className="mt-3 w-full">Add to cart (demo)</Button>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-xs text-stone-500">
          Delivery coverage and fees are required business input (Q24). Delivery times are always shown as estimates, never guarantees.
        </p>
      </Section>
    </>
  );
}
