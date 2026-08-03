"use client";

import { useState } from "react";
import { Badge, Button, Card, Section } from "@/components/ui";
import { accountOrders } from "@/lib/data";

type Tab = "overview" | "orders" | "subscriptions" | "quotations" | "designs" | "addresses";
const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "quotations", label: "Quotations" },
  { id: "designs", label: "Design projects" },
  { id: "addresses", label: "Addresses" },
];

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <Section title="Account Dashboard">
      <p className="mb-4 text-sm text-stone-600">
        Demo view — in production this page requires sign-in (Supabase Auth) and shows only your own data via RLS.
      </p>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Account sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-medium ${tab === t.id ? "bg-brand-600 text-white" : "bg-stone-200 text-stone-700 hover:bg-stone-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><p className="text-xs text-stone-500">Open orders</p><p className="mt-1 text-2xl font-bold">1</p></Card>
          <Card><p className="text-xs text-stone-500">Active subscription</p><p className="mt-1 text-2xl font-bold">—</p><Badge tone="stone">Subscriber = member state, not a role</Badge></Card>
          <Card><p className="text-xs text-stone-500">Open quotations</p><p className="mt-1 text-2xl font-bold">2</p></Card>
        </div>
      )}

      {tab === "orders" && (
        <Card>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-stone-200 text-xs text-stone-500"><th className="py-2">Order</th><th>Date</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody>
              {accountOrders.map((o) => (
                <tr key={o.id} className="border-b border-stone-100">
                  <td className="py-3 font-medium">{o.id}</td>
                  <td>{o.date}</td>
                  <td><Badge tone={o.status === "Delivered" ? "green" : "amber"}>{o.status}</Badge></td>
                  <td className="text-stone-600">{o.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-stone-500">Bank-transfer orders stay "Awaiting verification" until finance confirms the receipt.</p>
        </Card>
      )}

      {tab === "subscriptions" && (
        <Card>
          <p className="text-sm text-stone-600">No active subscription (demo). Pause/skip/cancel controls will appear here; rules are REQUIRED INPUT (Q30).</p>
          <Button href="/subscriptions" className="mt-3">Browse plans</Button>
        </Card>
      )}

      {tab === "quotations" && (
        <Card>
          <ul className="divide-y divide-stone-100 text-sm">
            <li className="flex items-center justify-between py-3"><span>Q-2026-014 · [placeholder spec]</span><Badge tone="amber">under_review</Badge></li>
            <li className="flex items-center justify-between py-3"><span>Q-2026-015 · [placeholder spec]</span><Badge tone="green">quoted</Badge></li>
          </ul>
          <p className="mt-3 text-xs text-stone-500">Full status history is preserved (append-only) — you'll see every transition here.</p>
        </Card>
      )}

      {tab === "designs" && (
        <Card>
          <p className="text-sm text-stone-600">1 design project (demo) — concepts are watermarked previews, never print-ready files.</p>
          <Button href="/oem/design-studio" className="mt-3">Open Design Studio</Button>
        </Card>
      )}

      {tab === "addresses" && (
        <Card>
          <p className="text-sm font-medium">[PLACEHOLDER] Home — Jalan …, Kuala Lumpur</p>
          <p className="mt-1 text-xs text-stone-500">Address book with default selection; used for delivery estimates at checkout.</p>
        </Card>
      )}
    </Section>
  );
}
