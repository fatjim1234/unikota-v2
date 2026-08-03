"use client";

import { useState } from "react";
import { Badge, Button, Card, Section } from "@/components/ui";
import { computeDemoEstimate, wizardOptions } from "@/lib/data";

type Spec = {
  productType?: string;
  ply?: string;
  packaging?: string;
  printing?: string;
  market?: string;
  quantity?: string;
};

const steps = ["Product", "Construction", "Packaging", "Printing", "Market & Quantity", "Summary"] as const;

function OptionGrid({ options, value, onSelect }: { options: string[]; value?: string; onSelect: (v: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onSelect(o)}
          aria-pressed={value === o}
          className={`focus-ring rounded-lg border p-4 text-left text-sm font-medium transition-colors ${
            value === o ? "border-brand-600 bg-brand-50 text-brand-900" : "border-stone-300 bg-white hover:border-brand-400"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [spec, setSpec] = useState<Spec>({});
  const [submitted, setSubmitted] = useState(false);

  const estimate = computeDemoEstimate(spec);
  const canNext = [spec.productType, spec.ply, spec.packaging, spec.printing, spec.market && spec.quantity, true][step];

  return (
    <>
      <Section title="OEM Planning Wizard">
        <p className="mb-2 max-w-2xl text-sm text-stone-600">
          Six steps to a structured product spec. Option lists below are <strong>placeholders</strong> — the factory's real
          capability ranges are REQUIRED INPUT (Q14–15).
        </p>

        <nav aria-label="Wizard progress" className="mb-6 flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <span
              key={s}
              aria-current={i === step ? "step" : undefined}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                i === step ? "bg-brand-600 text-white" : i < step ? "bg-brand-100 text-brand-900" : "bg-stone-200 text-stone-600"
              }`}
            >
              {i + 1}. {s}
            </span>
          ))}
        </nav>

        <Card>
          {step === 0 && (
            <>
              <h2 className="mb-4 font-semibold">What product do you want to manufacture?</h2>
              <OptionGrid options={wizardOptions.productTypes} value={spec.productType} onSelect={(v) => setSpec({ ...spec, productType: v })} />
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="mb-4 font-semibold">Choose construction (ply)</h2>
              <p className="mb-3 text-xs text-amber-800">GSM, sheet count and size options will appear here once the factory supplies valid ranges (Q14).</p>
              <OptionGrid options={wizardOptions.ply} value={spec.ply} onSelect={(v) => setSpec({ ...spec, ply: v })} />
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="mb-4 font-semibold">Packaging format</h2>
              <OptionGrid options={wizardOptions.packaging} value={spec.packaging} onSelect={(v) => setSpec({ ...spec, packaging: v })} />
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="mb-4 font-semibold">Printing</h2>
              <OptionGrid options={wizardOptions.printing} value={spec.printing} onSelect={(v) => setSpec({ ...spec, printing: v })} />
            </>
          )}
          {step === 4 && (
            <>
              <h2 className="mb-4 font-semibold">Target market</h2>
              <OptionGrid options={wizardOptions.markets} value={spec.market} onSelect={(v) => setSpec({ ...spec, market: v })} />
              <h2 className="mb-4 mt-6 font-semibold">Indicative quantity</h2>
              <OptionGrid options={wizardOptions.quantities} value={spec.quantity} onSelect={(v) => setSpec({ ...spec, quantity: v })} />
            </>
          )}
          {step === 5 && (
            <>
              <h2 className="mb-4 font-semibold">Your specification draft</h2>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                {Object.entries({
                  "Product type": spec.productType,
                  Construction: spec.ply,
                  Packaging: spec.packaging,
                  Printing: spec.printing,
                  "Target market": spec.market,
                  Quantity: spec.quantity,
                }).map(([k, v]) => (
                  <div key={k} className="rounded-md bg-stone-50 p-3">
                    <dt className="text-xs text-stone-500">{k}</dt>
                    <dd className="font-medium">{v ?? "—"}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="amber">Deterministic estimate demo</Badge>
                  <Badge tone="red">Rate card v0 — DEMO, NOT REAL PRICING</Badge>
                </div>
                {estimate ? (
                  <p className="mt-2 text-sm">
                    Demo unit cost: <strong>{estimate.currency} {estimate.unitCost.toFixed(2)}</strong> — computed as a pure
                    function of your spec + rate card v{estimate.rateCardVersion}. With a real published rate card (REQUIRED
                    INPUT Q17), this becomes the indicative estimate. If any rate is missing, no number is shown.
                  </p>
                ) : (
                  <p className="mt-2 text-sm">Estimate unavailable — complete all steps. (In production: "our sales team will respond".)</p>
                )}
                <p className="mt-2 text-xs text-amber-800">
                  Indicative estimate only. Final pricing is confirmed by our sales team in a formal quotation. No AI-generated numbers.
                </p>
              </div>

              {submitted ? (
                <div role="status" className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
                  Spec submitted (prototype only — no data is saved). In production this creates an <code>oem_project</code> +
                  <code> oem_product_specs</code> row and notifies the sales team.
                </div>
              ) : (
                <Button className="mt-4" onClick={() => setSubmitted(true)}>Submit spec & request quotation</Button>
              )}
            </>
          )}

          <div className="mt-6 flex justify-between border-t border-stone-100 pt-4">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))}>← Back</Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => canNext && setStep(step + 1)} className={canNext ? "" : "opacity-50"}>
                Next →
              </Button>
            ) : null}
          </div>
        </Card>
      </Section>
    </>
  );
}
