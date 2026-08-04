import type { Config } from "tailwindcss";

/**
 * Corporate blue, official scale — anchored on the exact navy from the
 * approved Unikota Company Profile PDF (#00297A). Every other step is
 * mathematically re-derived from the previous scale so each step keeps
 * the same structural role (badges, buttons, ink, CTA bands) it always
 * had; only the hue/saturation source changed, not the design.
 * Previous anchor (brand-700) was #153f78 — noticeably lighter and less
 * saturated than the approved document. Do not hand-edit individual
 * steps; regenerate the whole scale from the new anchor if it ever
 * needs to change again, so the steps stay internally consistent.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#dee8fd",
          100: "#c6d8fb",
          200: "#9cbbf8",
          300: "#6a97f0",
          500: "#0542bb",
          600: "#01359c",
          700: "#00297A",
          800: "#001f5b",
          900: "#00143c",
        },
        paper: "#f7f9fc",
        ink: "#101d33",
      },
      maxWidth: { page: "82rem" },
      // Family names containing spaces or digits MUST stay quoted here.
      // Unquoted, Tailwind emits `font-family: Source Sans 3, ...` and the
      // bare `3` is an invalid CSS identifier, so the browser discards the
      // whole declaration and body text silently falls back to Times New Roman.
      fontFamily: {
        sans: ['"Source Sans 3"', '"Noto Sans"', "system-ui", "Arial", "sans-serif"],
        display: ['"Barlow Condensed"', '"Arial Narrow"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
