/**
 * Shared business message for the Design Lab.
 *
 * Every concept imports from here so the five directions differ only in
 * visual treatment — never in what is actually said. Do not fork this copy
 * per concept.
 */

export const BRAND_LINE = "We’re More Than Paper";
export const SERVICE_LINE = "From Concept to Market";

export const SUPPORTING_STATEMENT =
  "Unikota turns tissue and hygiene product ideas into market-ready products — from concept and packaging development through manufacturing, fulfilment, retail support, distribution and export coordination.";

export type Pathway = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
};

export const PATHWAYS: Pathway[] = [
  {
    eyebrow: "01",
    title: "Discover Unikota",
    body: "Four decades of Malaysian tissue and hygiene experience.",
    cta: "View Company Profile",
  },
  {
    eyebrow: "02",
    title: "Explore Our Products",
    body: "Tissue products for households, retailers, hospitality, corporate buyers and export.",
    cta: "Explore Products",
  },
  {
    eyebrow: "03",
    title: "Create With Unikota",
    body: "Private label, customised packaging, corporate, event and export projects.",
    cta: "OEM & Customisation",
  },
];

export type ProofPoint = {
  value: string;
  label: string;
};

export const PROOF_POINTS: ProofPoint[] = [
  { value: "1983", label: "Operating since" },
  { value: "RM2.9M", label: "Paid-up capital" },
  { value: "RM20M+", label: "Annual revenue" },
  { value: "1,000s", label: "Malaysian retail outlets" },
  { value: "9", label: "Export markets" },
];

export const FINAL_CTA = {
  title: "Ready to move from concept to market?",
  body: "Tell us what you’re trying to build — a retail line, a private-label run, or an export order — and we’ll tell you what it takes to get there.",
  primary: "Start a Conversation",
  secondary: "View Company Profile",
};
