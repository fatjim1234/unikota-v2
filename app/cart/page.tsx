"use client";

import { useState } from "react";
import { Badge, Button, Card, Section } from "@/components/ui";

const demoLines = [
  { id: "p1", name: "[PLACEHOLDER] Facial Tissue 4-Box Pack", qty: 2 },
  { id: "p4", name: "[PLACEHOLDER] Household Essentials Bundle", qty: 1 },
];

export default function CartPage() {
  const [method, setMethod] = useState<"stripe" | "bank">("stripe");
  const [receiptChosen, setReceiptChosen] = useState(false);
  const [placed, setPlaced] = useState(false);

  return (
    <Section title="Cart & Checkout">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="font-semibold">Your cart (demo)</h2>
            <ul className="mt-3 divide-y divide-stone-100">
              {demoLines.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{l.name}</span>
                  <span className="flex items-center gap-4">
                    <span className="text-stone-500">× {l.qty}</span>
                    <span className="font-semibold text-amber-800">RM — (price REQUIRED INPUT Q9)</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="mt-4">
            <h2 className="font-semibold">Payment method</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("stripe")}
                aria-pressed={method === "stripe"}
                className={`focus-ring rounded-lg border p-4 text-left text-sm ${method === "stripe" ? "border-brand-600 bg-brand-50" : "border-stone-300"}`}
              >
                <strong>Card / online banking</strong>
                <p className="mt-1 text-xs text-stone-600">Stripe Checkout — test mode only until launch. Not implemented in this prototype.</p>
              </button>
              <button
                type="button"
                onClick={() => setMethod("bank")}
                aria-pressed={method === "bank"}
                className={`focus-ring rounded-lg border p-4 text-left text-sm ${method === "bank" ? "border-brand-600 bg-brand-50" : "border-stone-300"}`}
              >
                <strong>Manual bank transfer</strong>
                <p className="mt-1 text-xs text-stone-600">Transfer + upload your receipt. Order confirmed only after our finance team verifies it.</p>
              </button>
            </div>

            {method === "bank" ? (
              <div className="mt-4 rounded-lg bg-stone-50 p-4 text-sm">
                <p className="font-medium">Bank transfer instructions</p>
                <p className="mt-1 text-amber-800">[Bank name, account number, reference format — REQUIRED INPUT Q26]</p>
                <label className="mt-3 block text-xs">
                  <span className="mb-1 block font-medium">Upload receipt (pdf/jpg/png)</span>
                  <button
                    type="button"
                    onClick={() => setReceiptChosen(true)}
                    className="focus-ring w-full rounded-md border border-dashed border-stone-300 p-4 text-stone-500"
                  >
                    {receiptChosen ? "receipt-demo.pdf selected ✓" : "[Demo upload — in production: private receipts bucket, write-once]"}
                  </button>
                </label>
                <p className="mt-2 text-xs text-stone-500">
                  Status flow: pending_payment → awaiting_verification → paid (only after finance admin confirms — fully audited).
                </p>
              </div>
            ) : null}
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="font-semibold">Summary</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="text-amber-800">RM —</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd className="text-amber-800">RM — (rules Q24)</dd></div>
              <div className="flex justify-between border-t border-stone-100 pt-2 font-bold"><dt>Total</dt><dd>RM —</dd></div>
            </dl>
            <p className="mt-3 text-xs text-stone-500">Delivery timeframe shown at checkout is an estimate, not a guarantee.</p>
            {placed ? (
              <div role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
                Demo order placed — nothing saved. In production: order + payment rows created, audit trail started
                {method === "bank" ? ", awaiting finance verification" : ", redirect to Stripe Checkout (test)"}.
              </div>
            ) : (
              <Button className="mt-4 w-full" onClick={() => setPlaced(true)}>
                Place order (demo)
              </Button>
            )}
            <div className="mt-3">
              <Badge tone="stone">No real payments in M0</Badge>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
