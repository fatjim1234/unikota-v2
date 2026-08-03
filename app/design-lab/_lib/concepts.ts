export type AssetBrief = {
  subject: string;
  composition: string;
  negativeSpace: string;
  aspectRatio: string;
  minResolution: string;
  format: "Still" | "Short motion loop-out (no loop)";
  compositingNote: string;
};

export type Concept = {
  slug: string;
  letter: string;
  name: string;
  rationale: string;
  mood: string;
  typography: { display: string; body: string; label: string };
  palette: { name: string; hex: string }[];
  heroStrategy: string;
  motionStrategy: string;
  assetBrief: AssetBrief;
};

export const CONCEPTS: Concept[] = [
  {
    slug: "paper-atelier",
    letter: "A",
    name: "Paper Atelier",
    rationale:
      "Positions Unikota as an established Malaysian paper house run like a modern editorial studio — the safest, most credible-first direction for a 40-year manufacturer. Best if the priority is trust and craft, not spectacle.",
    mood: "An established paper house presented as a modern editorial and manufacturing studio.",
    typography: { display: "Fraunces", body: "IBM Plex Sans", label: "IBM Plex Mono" },
    palette: [
      { name: "Warm paper", hex: "#F5F1E8" },
      { name: "Ink navy", hex: "#102A46" },
      { name: "Corporate blue", hex: "#2360B0" },
      { name: "Kraft edge", hex: "#D7C9B4" },
    ],
    heroStrategy: "Asymmetrical editorial split: italic Fraunces headline against a torn-kraft-edged product still-life plate, mono field labels doing the technical talking.",
    motionStrategy: "Restrained — hover-only lifts on the pathway index and nav underlines. No entrance choreography; the page is confident sitting still.",
    assetBrief: {
      subject: "A single hero product still life (tissue box or roll) styled like an editorial product plate.",
      composition: "Off-center, right two-fifths of frame, generous negative space to the left for the headline overlay.",
      negativeSpace: "60%+ left of frame kept clear for type; avoid busy backgrounds behind the product.",
      aspectRatio: "4:5 portrait",
      minResolution: "2400 × 3000px",
      format: "Still",
      compositingNote: "Real product packshots must be composited in afterward — the current plate is a labelled placeholder only.",
    },
  },
  {
    slug: "cinematic-paper",
    letter: "B",
    name: "Cinematic Paper World",
    rationale:
      "Leads with atmosphere and reveal — best if Unikota wants to feel premium and aspirational on first load rather than immediately transactional. Highest emotional impact, highest execution risk if the motion isn't restrained.",
    mood: "Atmospheric paper clouds, light, transformation and product emergence.",
    typography: { display: "Bodoni Moda", body: "Instrument Sans", label: "IBM Plex Mono" },
    palette: [
      { name: "Cinematic navy", hex: "#0B1D33" },
      { name: "White tissue", hex: "#FBFBFA" },
      { name: "Silver mist", hex: "#C7CDD6" },
      { name: "Warm light accent", hex: "#E7B975" },
    ],
    heroStrategy: "A single darkened stage: soft paper-cloud forms resolve into the wordmark, brand line, service line and two settling product panels, then the motion stops for good.",
    motionStrategy: "One scripted, non-looping ~4.5s CSS sequence on load (clouds → wordmark → brand line → service line → product settle). Nav is exempt and interactive from frame one.",
    assetBrief: {
      subject: "Two products caught mid-emergence from soft paper/fibre forms, as if surfacing through light.",
      composition: "Vertical duo, centred beneath the wordmark, symmetrical, both panels same eye-line.",
      negativeSpace: "Dark negative space above and around the products for the type stack and cloud forms to breathe in.",
      aspectRatio: "3:4 portrait (×2 panels)",
      minResolution: "1800 × 2400px per panel",
      format: "Short motion loop-out (no loop)",
      compositingNote: "Real product packshots must be composited into the settling panels once art-directed; current panels are glass placeholders.",
    },
  },
  {
    slug: "quiet-coastal",
    letter: "C",
    name: "Quiet Coastal Studio",
    rationale:
      "The calmest, most premium-everyday direction — closest to the approved Unisoft design world. Best if the goal is warmth and quality-of-life rather than manufacturing muscle. Risk: can read as too soft if the visitor came for B2B credibility.",
    mood: "Soft morning light, calm modern Asian interiors and premium everyday comfort.",
    typography: { display: "DM Serif Display", body: "Plus Jakarta Sans", label: "IBM Plex Mono" },
    palette: [
      { name: "Powder blue", hex: "#D9E6EE" },
      { name: "Seafoam", hex: "#DCE9E1" },
      { name: "Pale sand", hex: "#EDE3D3" },
      { name: "Restrained gold", hex: "#B8935A" },
    ],
    heroStrategy: "A framed 'window' of soft light and product sits right of a calm, generously spaced headline block — architectural, not beach or spa.",
    motionStrategy: "Gentle one-time drift-up on hero elements; soft card lift on hover. Nothing plays continuously.",
    assetBrief: {
      subject: "A tissue product resting in soft, indirect morning light on a warm neutral surface, near a window frame.",
      composition: "Framed like a small interior photograph — product lower third, light source upper-left, architectural line in the background.",
      negativeSpace: "Even, soft negative space throughout; avoid hard shadows or high contrast.",
      aspectRatio: "3:4 portrait",
      minResolution: "2000 × 2667px",
      format: "Still",
      compositingNote: "Real product packshots must be composited in once approved; current frame is a gradient placeholder.",
    },
  },
  {
    slug: "retail-energy",
    letter: "D",
    name: "Malaysian Retail Energy",
    rationale:
      "The most commercially confident direction — leads with the multi-brand portfolio and packaging. Best if the priority is retail-buyer energy over manufacturer heritage. Risk: colour discipline has to be enforced hard or it tips into clutter.",
    mood: "Confident, colourful, packaging-led and commercially energetic.",
    typography: { display: "Bricolage Grotesque", body: "IBM Plex Sans", label: "Space Mono" },
    palette: [
      { name: "Corporate blue", hex: "#2360B0" },
      { name: "Cili red", hex: "#D8342A" },
      { name: "Wasabi green", hex: "#8BAE3A" },
      { name: "Aimishu teal", hex: "#1E9E93" },
      { name: "Unisoft ocean", hex: "#2E9BD6" },
    ],
    heroStrategy: "Split hero: a bold corporate-blue statement panel opposite a packshot region and a brand-colour chip row — the portfolio, stated up front.",
    motionStrategy: "One-time settle and colour-stripe wipe on load; controlled hover lifts with colour-matched shadows. No bounce or elastic easing.",
    assetBrief: {
      subject: "A single hero packshot representing the portfolio (household tissue), front-facing.",
      composition: "Centred, product-forward, enough headroom for a caption line beneath.",
      negativeSpace: "Moderate — this direction is packaging-led, so negative space is tighter than the other four concepts.",
      aspectRatio: "4:5 portrait",
      minResolution: "2200 × 2750px",
      format: "Still",
      compositingNote: "Do not invent packaging art. Every packshot region must be filled with an approved real product photograph before this direction can ship.",
    },
  },
  {
    slug: "industrial-ledger",
    letter: "E",
    name: "Industrial Paper Ledger",
    rationale:
      "The most technically credible direction — reads as a manufacturer that exports and can be diligenced. Best for procurement and export-buyer audiences. Risk: least warm of the five, needs the photography to carry the emotional weight.",
    mood: "Manufacturing precision, packaging systems, export readiness and technical credibility.",
    typography: { display: "Space Grotesk", body: "IBM Plex Sans", label: "IBM Plex Mono" },
    palette: [
      { name: "Off-white", hex: "#F4F2EE" },
      { name: "Ink navy", hex: "#131E2E" },
      { name: "Blueprint blue", hex: "#274D80" },
      { name: "Kraft cardboard", hex: "#C9B08A" },
      { name: "Signal cobalt", hex: "#2F5FDE" },
    ],
    heroStrategy: "A faint technical grid, corner-registration marks and a carton-geometry line diagram sit opposite the headline — precision without turning into a software dashboard.",
    motionStrategy: "Near-static. Only a hairline-inset highlight on hover; no entrance choreography at all.",
    assetBrief: {
      subject: "A line-diagram-style carton/sheet geometry render — technical, not photographic.",
      composition: "Isolated on a light ground, registration marks at the corners, room for a measurement callout on one edge.",
      negativeSpace: "Wide, evenly lit margin around the diagram so it reads as a technical plate, not a lifestyle shot.",
      aspectRatio: "4:5 portrait",
      minResolution: "2000 × 2500px",
      format: "Still",
      compositingNote: "This concept can ship with a technical render alone; real packshots are optional secondary assets, not required for the hero.",
    },
  },
];

export type ComparisonRow = {
  slug: string;
  emotionalCharacter: string;
  strongestAudience: string;
  weakness: string;
  productionComplexity: "Low" | "Medium" | "Medium-High" | "High";
  higgsfieldRequirement: "Low" | "Medium" | "High";
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    slug: "paper-atelier",
    emotionalCharacter: "Credible, crafted, quietly confident",
    strongestAudience: "Retail buyers, distributors, new B2B contacts",
    weakness: "Can feel safe rather than distinctive next to more visual directions",
    productionComplexity: "Low",
    higgsfieldRequirement: "Low",
  },
  {
    slug: "cinematic-paper",
    emotionalCharacter: "Premium, aspirational, cinematic",
    strongestAudience: "Brand-conscious retail partners, investors",
    weakness: "Motion has to be flawless or it reads as a template intro",
    productionComplexity: "Medium-High",
    higgsfieldRequirement: "High",
  },
  {
    slug: "quiet-coastal",
    emotionalCharacter: "Calm, warm, everyday-premium",
    strongestAudience: "Household/consumer-facing retail, hospitality buyers",
    weakness: "Softest tone — may undersell manufacturing scale",
    productionComplexity: "Low",
    higgsfieldRequirement: "Medium",
  },
  {
    slug: "retail-energy",
    emotionalCharacter: "Bold, commercial, portfolio-forward",
    strongestAudience: "Retail chains, private-label and OEM prospects",
    weakness: "Multi-brand palette needs strict discipline to avoid clutter",
    productionComplexity: "Medium",
    higgsfieldRequirement: "Medium",
  },
  {
    slug: "industrial-ledger",
    emotionalCharacter: "Precise, technical, export-ready",
    strongestAudience: "Export buyers, procurement, corporate/OEM due diligence",
    weakness: "Least emotionally warm of the five",
    productionComplexity: "Low",
    higgsfieldRequirement: "Low",
  },
];
