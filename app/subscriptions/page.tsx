import { Badge, Button, Card, PageHero, Section } from "@/components/ui";
import { subscriptionPlans } from "@/lib/data";

export default function SubscriptionsPage() {
  return (
    <>
      <PageHero
        title="Subscription Plans"
        lead="Never run out of tissue. Recurring deliveries on your schedule — tier contents, pricing and frequencies are required business input (Q29–30)."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptionPlans.map((s, i) => (
            <Card key={s.id} className={i === 1 ? "border-brand-500 ring-1 ring-brand-500" : ""}>
              {i === 1 ? <Badge tone="green">Most popular (placeholder)</Badge> : <span className="inline-block h-5" />}
              <h3 className="mt-2 font-semibold">{s.name}</h3>
              <p className="mt-1 text-2xl font-bold text-brand-700">{s.price}</p>
              <p className="text-xs text-stone-500">{s.freq}</p>
              <p className="mt-3 text-sm text-amber-800">{s.contents}</p>
              <ul className="mt-3 space-y-1 text-sm text-stone-600">
                <li>✓ Pause or skip anytime (rules — REQUIRED INPUT Q30)</li>
                <li>✓ Delivered on estimated schedule (no guaranteed dates)</li>
                <li>✓ Managed in your account</li>
              </ul>
              <Button href="/cart" className="mt-4 w-full">Choose plan (demo)</Button>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <h2 className="font-semibold">How billing will work</h2>
          <p className="mt-2 text-sm text-stone-600">
            Subscriptions are billed via Stripe Billing (test mode until launch). Payment, pause, skip and cancel events all
            flow through audited webhooks. This prototype implements none of it — see docs/TECHNICAL_ARCHITECTURE.md §4.
          </p>
        </Card>
      </Section>
    </>
  );
}
