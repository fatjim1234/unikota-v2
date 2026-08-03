import type { Config } from "tailwindcss";

/**
 * Batch 1 design tokens — corporate blue derived from the Unikota "U" mark,
 * white/neutral surfaces, dark navy typography. Scale keys are unchanged so
 * existing components restyle automatically.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f6fc",
          100: "#dde9f7",
          200: "#b9d0ee",
          300: "#8db1e0",
          500: "#2360b0",
          600: "#1b4f95",
          700: "#153f78",
          800: "#10315e",
          900: "#0b2344",
        },
        paper: "#f7f9fc",
        ink: "#101d33",
      },
      maxWidth: { page: "82rem" },
      fontFamily: {
        sans: ["Source Sans 3", "Noto Sans", "Arial", "sans-serif"],
        display: ["Barlow Condensed", "Arial Narrow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
