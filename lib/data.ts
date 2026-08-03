/**
 * PLACEHOLDER DATA — M0 prototype only.
 * Nothing in this file is a real Unikota fact. Every value that must come from
 * the business is marked REQUIRED INPUT and cross-referenced in
 * docs/OPEN_BUSINESS_QUESTIONS.md. Do not ship any of this to production.
 */

export const REQUIRED = "REQUIRED INPUT";

export const productCategories = [
  { slug: "facial-tissue", name: "Facial Tissue", note: `Specs, SKUs, images — ${REQUIRED} (Q9–10)` },
  { slug: "toilet-roll", name: "Toilet Rolls", note: `Specs, SKUs, images — ${REQUIRED} (Q9–10)` },
  { slug: "kitchen-towel", name: "Kitchen Towels", note: `Specs, SKUs, images — ${REQUIRED} (Q9–10)` },
  { slug: "napkins", name: "Serviettes & Napkins", note: `Specs, SKUs, images — ${REQUIRED} (Q9–10)` },
  { slug: "household", name: "Household Products", note: `Confirm final category list — ${REQUIRED} (Q10)` },
];

export const shopProducts = [
  { id: "p1", name: "[PLACEHOLDER] Facial Tissue 4-Box Pack", price: "RM —", tag: "Retail", note: `Price ${REQUIRED} (Q9)` },
  { id: "p2", name: "[PLACEHOLDER] Toilet Roll 10-Roll Pack", price: "RM —", tag: "Retail", note: `Price ${REQUIRED} (Q9)` },
  { id: "p3", name: "[PLACEHOLDER] Kitchen Towel Twin Pack", price: "RM —", tag: "Retail", note: `Price ${REQUIRED} (Q9)` },
  { id: "p4", name: "[PLACEHOLDER] Household Essentials Bundle", price: "RM —", tag: "Bundle", note: `Bundle contents & price ${REQUIRED} (Q31)` },
  { id: "p5", name: "[PLACEHOLDER] Serviettes Family Pack", price: "RM —", tag: "Retail", note: `Price ${REQUIRED} (Q9)` },
  { id: "p6", name: "[PLACEHOLDER] Monthly Restock Bundle", price: "RM —", tag: "Bundle", note: `Bundle contents & price ${REQUIRED} (Q31)` },
];

export const subscriptionPlans = [
  { id: "s1", name: "[PLACEHOLDER] Solo Plan", freq: "Monthly", contents: `Contents ${REQUIRED} (Q29)`, price: "RM — / month" },
  { id: "s2", name: "[PLACEHOLDER] Family Plan", freq: "Monthly", contents: `Contents ${REQUIRED} (Q29)`, price: "RM — / month" },
  { id: "s3", name: "[PLACEHOLDER] Office Plan", freq: "Every 2 weeks", contents: `Contents ${REQUIRED} (Q29)`, price: "RM — / cycle" },
];

export const exportItems = [
  { id: "e1", name: "[PLACEHOLDER] Facial Tissue — export carton", carton: `Units/carton ${REQUIRED} (Q11)`, container: `20ft/40ft qty ${REQUIRED} (Q11)` },
  { id: "e2", name: "[PLACEHOLDER] Toilet Roll — export carton", carton: `Units/carton ${REQUIRED} (Q11)`, container: `20ft/40ft qty ${REQUIRED} (Q11)` },
  { id: "e3", name: "[PLACEHOLDER] Kitchen Towel — export carton", carton: `Units/carton ${REQUIRED} (Q11)`, container: `20ft/40ft qty ${REQUIRED} (Q11)` },
];

export const wizardOptions = {
  productTypes: ["Facial tissue", "Toilet roll", "Kitchen towel", "Napkin"], // final list REQUIRED INPUT (Q14)
  ply: ["2-ply", "3-ply", "4-ply"], // valid ranges REQUIRED INPUT (Q14)
  packaging: ["Soft pack", "Box", "Bundle wrap", "Individual wrap"], // REQUIRED INPUT (Q14)
  printing: ["No print (stock design)", "1–2 colours", "3–4 colours", "Full colour"], // REQUIRED INPUT (Q14)
  markets: ["Malaysia", "Singapore", "Other ASEAN", "Middle East", "Other"], // REQUIRED INPUT (Q12)
  quantities: ["Below MOQ — ask sales", "1 container", "2–5 containers", "Recurring monthly"], // MOQ tiers REQUIRED INPUT (Q15)
};

/**
 * DEMO rate card — structure demonstration ONLY.
 * All numbers are obviously fake (1.00 units) so no one mistakes them for real
 * pricing. Real rate cards are REQUIRED INPUT (Q17) and live in the database,
 * versioned. Same inputs + same rate card version => same output (pure function).
 */
export const demoRateCard = {
  version: 0,
  status: "DEMO — NOT REAL PRICING",
  currency: "MYR",
  baseUnitCost: 1.0,
  plyMultiplier: { "2-ply": 1.0, "3-ply": 1.0, "4-ply": 1.0 } as Record<string, number>,
  packagingCost: { "Soft pack": 1.0, Box: 1.0, "Bundle wrap": 1.0, "Individual wrap": 1.0 } as Record<string, number>,
  printingCost: { "No print (stock design)": 0.0, "1–2 colours": 1.0, "3–4 colours": 1.0, "Full colour": 1.0 } as Record<string, number>,
};

/** Deterministic estimate: pure function of spec + rate card. No AI, no randomness. */
export function computeDemoEstimate(spec: { ply?: string; packaging?: string; printing?: string }) {
  const rc = demoRateCard;
  if (!spec.ply || !spec.packaging || !spec.printing) return null;
  const unit =
    rc.baseUnitCost * (rc.plyMultiplier[spec.ply] ?? 1) +
    (rc.packagingCost[spec.packaging] ?? 0) +
    (rc.printingCost[spec.printing] ?? 0);
  return { unitCost: unit, rateCardVersion: rc.version, currency: rc.currency };
}

export const accountOrders = [
  { id: "UO-2026-0001", date: "2026-07-01", status: "Delivered", total: "RM —", payment: "Stripe (demo)" },
  { id: "UO-2026-0002", date: "2026-07-08", status: "Awaiting verification", total: "RM —", payment: "Bank transfer (receipt uploaded)" },
];

export const adminQueues = {
  enquiries: [
    { id: "ENQ-101", type: "Export", from: "[placeholder buyer]", status: "New" },
    { id: "ENQ-102", type: "OEM", from: "[placeholder brand owner]", status: "In progress" },
  ],
  quotations: [
    { id: "Q-2026-014", buyer: "[placeholder]", status: "under_review", rateCard: "v— (REQUIRED INPUT)" },
    { id: "Q-2026-015", buyer: "[placeholder]", status: "quoted", rateCard: "v— (REQUIRED INPUT)" },
  ],
  payments: [
    { id: "PAY-330", order: "UO-2026-0002", method: "Bank transfer", status: "awaiting_verification", receipt: "receipt-330.pdf" },
  ],
  orders: [
    { id: "UO-2026-0001", status: "delivered" },
    { id: "UO-2026-0002", status: "awaiting_verification" },
  ],
};

export const staffRoles = [
  "sales_employee",
  "designer",
  "operations_employee",
  "finance_admin",
  "super_admin",
] as const;
export type StaffRole = (typeof staffRoles)[number];
