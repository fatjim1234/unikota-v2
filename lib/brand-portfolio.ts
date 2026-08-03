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
  products: string[];
  subBrand?: {
    name: string;
    logo: string;
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
    products: ["100g paper serviettes", "Cocktail napkins", "Food-service tissue"],
    subBrand: {
      name: "Cili Padi",
      logo: "/images/unikota/brands/cili-padi-logo.png",
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
    image: "/images/unikota/brands/wasabi-product.png",
    accent: "#6d9d31",
    tint: "#f4f8e9",
    products: ["50g paper serviettes", "Street-food napkins", "Value food-service tissue"],
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
    products: ["Box facial tissue", "Soft-pack facial tissue", "Toilet rolls", "Kitchen towels"],
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
    products: ["Hanging facial tissue", "Space-saving tissue packs", "Everyday household tissue"],
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
    accent: "#4c3d95",
    tint: "#f4f1ff",
    products: ["Baby diapers", "Everyday baby care"],
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
    products: ["Adult diapers", "High-absorbency protection", "Larger-size care products"],
  },
];

export function getBrandBySlug(slug: string) {
  return brandPortfolio.find((brand) => brand.slug === slug);
}
