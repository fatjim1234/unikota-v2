export type BrandPortfolioItem = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  story: string[];
  logo: string;
  image?: string;
  accent: string;
  tint: string;
  products: { name: string; image: string }[];
  subBrand?: {
    name: string;
    logo: string;
    image?: string;
    description: string;
  };
};

export const brandPortfolio: BrandPortfolioItem[] = [
  {
    slug: "cili",
    name: "Cili",
    category: "Food-service tissue",
    tagline: "Bold by nature. Made for the Malaysian table.",
    summary: "The everyday serviette for Malaysian food.",
    story: [
      "Cili takes its name from something instantly familiar at the Malaysian table: bold flavour, everyday energy and food that brings people together.",
      "Its 100g serviette pack is made for regular, high-volume use across Malay eateries, mamaks, food courts and catering tables where a practical, dependable serviette is always needed.",
    ],
    logo: "/images/unikota/brands/cili-logo.png",
    image: "/images/unikota/brands/cili-product.png",
    accent: "#e3292f",
    tint: "#fff3f2",
    products: [
      { name: "100g paper serviettes, case of 6", image: "/images/unikota/brands/cili-product.png" },
      { name: "Paper serviette, single pack", image: "/images/unikota/brands/cili-serviette-single.png" },
      { name: "Luncheon napkin", image: "/images/unikota/brands/cili-luncheon.png" },
      { name: "Pull-up napkin tissue, 200 sheets", image: "/images/unikota/brands/cili-pullup.png" },
      { name: "Hanging kitchen towel", image: "/images/unikota/brands/cili-hangingkitchen.png" },
      { name: "Kitchen towel, 1 roll", image: "/images/unikota/brands/cili-kitchentowel-1r.png" },
      { name: "Jumbo roll, 8 rolls x 200m", image: "/images/unikota/brands/cili-jumboroll.png" },
      { name: "Facial tissue, 180 sheets", image: "/images/unikota/brands/cili-facialtissue.png" },
    ],
    subBrand: {
      name: "Cili Padi",
      logo: "/images/unikota/brands/cili-padi-logo.png",
      image: "/images/unikota/brands/cilipadi-product.png",
      description:
        "Cili Padi is the accessible value range introduced during the MCO period, when Malaysian households and small businesses needed a simple RM2 option that remained useful and dependable.",
    },
  },
  {
    slug: "wasabi",
    name: "Wasabi",
    category: "Value food-service tissue",
    tagline: "A lighter pack with the same kick.",
    summary: "Spicy character. Practical everyday value.",
    story: [
      "Wasabi shares Cili's memorable, spicy character in a lighter 50g pack made for customers who need a more economical choice.",
      "It fits naturally into Thai restaurants, street-food stalls, night markets and casual dining—more affordable than Cili, without giving up dependable everyday quality.",
    ],
    logo: "/images/unikota/brands/wasabi-logo.png",
    // 200gm angled pack, matching the approved mockup's Wasabi band. The flat-on
    // 50pcs shot lives at wasabi-product.png if a second angle is ever needed.
    image: "/images/unikota/brands/wasabi-product-200gm.png",
    accent: "#6d9d31",
    tint: "#f4f8e9",
    products: [
      { name: "50g paper serviette", image: "/images/unikota/brands/wasabi-product.png" },
      { name: "200gm paper serviette", image: "/images/unikota/brands/wasabi-product-200gm.png" },
      { name: "50gm serviette, 12-pack value case", image: "/images/unikota/brands/wasabi-12pack.png" },
    ],
  },
  {
    slug: "unisoft",
    name: "Unisoft",
    category: "Family tissue",
    tagline: "Softness for U & I.",
    summary: "Gentle care for every age.",
    story: [
      "Unisoft is built around a simple idea: softness for U & I. The name carries a sense of universal comfort—something gentle enough for daily life and for people across every age.",
      "From facial tissues to toilet rolls and kitchen towels, Unisoft brings dependable softness into homes, offices and shared spaces.",
    ],
    logo: "/images/unikota/brands/unisoft-logo.png",
    image: "/images/unikota/brands/unisoft-product.png",
    accent: "#298dc8",
    tint: "#edf8fd",
    products: [
      { name: "3-ply marble toilet roll, 10-roll pack", image: "/images/unikota/brands/unisoft-product.png" },
      { name: "3-ply toilet roll, single", image: "/images/unikota/brands/unisoft-toiletroll-single.png" },
      { name: "Facial tissue box, 2-ply 70s x 2", image: "/images/unikota/brands/unisoft-facialbox.png" },
    ],
  },
  {
    slug: "aimishu",
    name: "Aimishu",
    category: "Hanging tissue",
    tagline: "A little care, always within reach.",
    summary: "Cute, convenient care for daily life.",
    story: [
      "Aimishu is a playful, Japanese-inspired take on the words 'I miss you'—a catchy name with a little warmth and personality.",
      "Its hanging tissue format is designed for easy everyday use in Malaysian homes and small spaces: convenient, cheerful and always close at hand.",
    ],
    logo: "/images/unikota/brands/aimishu-logo.png",
    image: "/images/unikota/brands/aimishu-product.png",
    accent: "#168f88",
    tint: "#edf9f7",
    products: [
      { name: "Hanging tissue, 1180 4-ply", image: "/images/unikota/brands/aimishu-product.png" },
      { name: "Hanging tissue, 1048 4-ply", image: "/images/unikota/brands/aimishu-1048.png" },
    ],
  },
  {
    slug: "babylike",
    name: "BabyLike",
    category: "Baby care",
    tagline: "Everyday comfort for growing little ones.",
    summary: "Practical, dependable diapers for daily baby care.",
    story: [
      "BabyLike is made for the everyday rhythm of caring for a growing baby—comfortable, practical and dependable through busy days and restful nights.",
      "The brand keeps the promise uncomplicated: daily-use baby diapers that help families care with confidence.",
    ],
    logo: "/images/unikota/brands/babylike-logo.png",
    image: "/images/unikota/brands/babylike-product.png",
    accent: "#4c3d95",
    tint: "#f4f1ff",
    products: [
      { name: "Super Pants, M/L/XL/XXL range", image: "/images/unikota/brands/babylike-product.png" },
      { name: "Tape diaper, size M", image: "/images/unikota/brands/babylike-tape-m.png" },
    ],
  },
  {
    slug: "sumo",
    name: "SUMO",
    category: "Adult care",
    tagline: "Big on protection. Made for confident comfort.",
    summary: "Strong absorbency and a generous, secure fit.",
    story: [
      "SUMO turns a bold, memorable name into a reassuring promise: strong absorbency, generous sizing and dependable protection.",
      "Designed for adult care, the range focuses on a secure fit and everyday dignity—comfortable enough for daily routines and dependable when protection matters most.",
    ],
    logo: "/images/unikota/brands/sumo-logo.png",
    image: "/images/unikota/brands/sumo-product.png",
    accent: "#174a91",
    tint: "#eef5ff",
    products: [
      { name: "Adult diapers, size L & M", image: "/images/unikota/brands/sumo-product.png" },
      { name: "Adult diaper, size L", image: "/images/unikota/brands/sumo-l.png" },
    ],
  },
];

export function getBrandBySlug(slug: string) {
  return brandPortfolio.find((brand) => brand.slug === slug);
}
