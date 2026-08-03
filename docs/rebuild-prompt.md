# Rebuild prompt: unikota.com (v2)

Paste this whole document as the task brief for another AI coding tool that
needs to reproduce or extend the current site from scratch.

## What you're building

A bilingual-ready (EN live now; BM/ZH translation keys exist) B2B marketing
site for Unikota Holdings Sdn. Bhd., a Malaysian tissue-paper manufacturer.
It sells three things: (1) its own tissue/hygiene brands to retail and
food-service buyers, (2) OEM/private-label manufacturing to corporate
clients, (3) export capability. No e-commerce, no cart, no checkout — every
call to action is "talk to our team" / "request a quotation," routing to a
lead-capture form.

## Stack

- Next.js 16.2.10, App Router, React 19.2.7, TypeScript 5.6
- Tailwind CSS 3.4 (utility classes, no CSS-in-JS)
- Supabase (`@supabase/ssr` + `@supabase/supabase-js`) for content storage
  and auth — see "Content layer" below for exactly how this is used and how
  to avoid its main failure mode
- Fonts: self-hosted via `@fontsource/source-sans-3` (body) and
  `@fontsource/barlow-condensed` (headings) — imported in `app/layout.tsx`,
  not loaded from Google Fonts CDN
- Icons: `@phosphor-icons/react` plus a small hand-rolled
  `components/marketing-icons.tsx` for a few bespoke marks
- Testing: Playwright for e2e (`e2e/*.spec.ts`)
- Deploy: Vercel, auto-deploy on push to `main` on GitHub. Node hosting is
  required — this app will NOT run on typical shared/cPanel hosting, which
  is why it's on Vercel rather than the company's existing shared host.

## Route map

```
/                       home
/about                  company story
/products               brand & product portfolio (see detail below)
/products/[brand]       one page per brand: cili, wasabi, unisoft, aimishu,
                        babylike, sumo
/manufacturing          facility / capability
/oem                    OEM & private-label entry point
/oem/wizard             guided OEM inquiry flow
/oem/design-studio      OEM design tooling
/oem/retail-launch      OEM retail-launch pathway
/export                 export markets & capability
/solutions              B2B solution groupings
/brands                 (secondary/legacy brands listing — /products is
                        the primary brand surface, confirm before touching)
/contact                lead form
/quotation              quotation request flow
/account                customer account
/cart, /shop,
/subscriptions          present in the routes but NOT part of the current
                        commerce-free strategy — confirm intent before
                        building these out; they may be dead scaffolding
/admin/*                internal content/lead/user management, gated by
                        Supabase auth (sign-in, users, leads, content editor)
/api/content/[key]      content read/write API backing the admin editor
/api/lead               lead-form submission endpoint
```

## Design tokens (`tailwind.config.ts`)

```ts
colors.brand: { 50:"#f2f6fc" 100:"#dde9f7" 200:"#b9d0ee" 300:"#8db1e0"
                500:"#2360b0" 600:"#1b4f95" 700:"#153f78" 800:"#10315e" 900:"#0b2344" }
colors.paper: "#f7f9fc"   // page background
colors.ink:   "#101d33"   // body text color
maxWidth.page: "82rem"    // the container width used everywhere
fontFamily.sans:    ['"Source Sans 3"', '"Noto Sans"', "system-ui", "Arial", "sans-serif"]
fontFamily.display: ['"Barlow Condensed"', '"Arial Narrow"', "system-ui", "sans-serif"]
```

**Load-bearing detail:** family names containing a space or a digit
(`"Source Sans 3"`) MUST be quoted as literal strings inside the array.
Tailwind emits the array items verbatim into `font-family: <items>`, and an
unquoted `Source Sans 3` produces invalid CSS (a bare `3` is not a legal
CSS identifier) — every browser silently drops the whole declaration and
falls back to Times New Roman. This exact bug shipped to production once
already; don't reintroduce it.

`body` in `app/globals.css` applies `bg-paper font-sans text-ink antialiased`
at 16px/1.6 line-height. `.focus-ring` is the shared focus style utility.

## Brand portfolio (`lib/brand-portfolio.ts`)

Single source of truth for all six owned brands, consumed by `/products`
and every `/products/[brand]` page:

```ts
type BrandPortfolioItem = {
  slug: string; name: string; category: string; tagline: string;
  summary: string; story: string[];         // 2 paragraphs, brand history
  logo: string; image?: string;              // paths under /public/images/unikota/brands/
  accent: string; tint: string;              // hex — per-brand color pair
  products: string[];                        // plain product-line names, no specs
  subBrand?: { name: string; logo: string; description: string };
};
```

Six brands, each with a distinct accent/tint pair:

| slug | name | category | accent | tint |
|---|---|---|---|---|
| cili | Cili | Food-service tissue | #e3292f | #fff3f2 |
| wasabi | Wasabi | Value food-service tissue | #6d9d31 | #f4f8e9 |
| unisoft | Unisoft | Family tissue | #298dc8 | #edf8fd |
| aimishu | Aimishu | Hanging tissue | #168f88 | #edf9f7 |
| babylike | BabyLike | Baby care | #4c3d95 | #f4f1ff |
| sumo | SUMO | Adult care | #174a91 | #eef5ff |

Cili additionally carries a `subBrand` (Cili Padi — a value range launched
during the MCO period). All copy in this file has an EN fallback baked in
and is also addressable via translation keys (`site.brands.<slug>.*`) for
BM/ZH — see i18n below.

**Product line accuracy matters commercially.** These are real manufactured
SKUs a distributor will quote against. Confirmed so far: Cili includes a
100g×6-pack serviette AND a 150-sheet 2-ply luncheon napkin (the luncheon
napkin has been missing from `products: []` and should be added). Aimishu's
confirmed spec is 1180 sheets, 4-ply. Do not invent specs for any brand not
listed here — ask before publishing a number.

## `/products/[brand]` page structure

Five stacked sections per brand, in `app/products/[brand]/page.tsx`:

1. **Hero** — split layout, tinted background (`brand.tint`), left column
   has back-link + category label (in `brand.accent`) + logo + tagline
   (H1) + summary + CTA button; right column is the product photo
   (`brand.image`, `object-cover`, full bleed) or, if no photo exists yet,
   a centered logo card fallback.
2. **Story** — two-column: label/heading left, `brand.story` paragraphs
   right, white background.
3. **Product range grid** — heading "Products under {name}", grid of cards
   from `brand.products`. **Column count must be computed from
   `products.length`, never hardcoded to 4** — five of six brands have
   fewer than four products, and a fixed 4-col grid with a shared-divider
   background trick renders unfilled cells as solid grey boxes (a bug that
   shipped once already). Use per-card borders, not a shared-background
   gap trick, so an empty cell has nothing to paint.
4. **Sub-brand strip** — renders only if `brand.subBrand` is set (Cili
   only, for Cili Padi).
5. **"More Unikota brands"** — dark band, 3 related-brand cards (all
   brands except the current one, `.slice(0, 3)`).

## `/products` (portfolio index) — current state vs. target

**This page is mid-redesign against an approved ChatGPT-generated mockup.**
If you're extending this page, the target visual direction (not yet fully
implemented) is:

- Hero: text left / 3-photo collage right, cream background — NOT the
  current full-bleed photo with a floating white card
- One alternating-layout band per tissue brand (Cili, Wasabi, Unisoft,
  Aimishu), each tinted to `brand.tint`, brand name rendered large in
  `brand.accent`, with the actual packshot — NOT a flat grey card with a
  cropped photo
- Brand logos wired in via `brand.logo` (as of this writing, none render
  on `/products` itself, only on the brand subpages)
- Personal-care band (BabyLike, SUMO) below the tissue brands
- **No spec chips on this page** — deliberately decided against, see
  "Product spec presentation" below
- Footer: 4 columns (currently 3 — confirm target column content before
  building)

Do not add per-brand spec details (grammage, ply count, sheet count) to
this top-level portfolio page. See next section for where specs belong.

## Product spec presentation — deliberate decision, don't relitigate

Early direction called for a small "spec chip" (icon + spec string, e.g.
"100g × 6 packs") on each brand band on `/products`. This was rejected:

1. Reference brands at this scale (Kleenex, Tork, Scott) don't put specs
   on brand-story pages — specs belong where a buyer is actually
   evaluating SKUs, not where they're being introduced to a brand.
2. The mockup's own spec data was internally inconsistent (mixed units —
   grammage, ply, count) and factually wrong in at least one case (it
   attributed a spec to the wrong brand).

**Correct home for specs:** the "Products under {brand}" grid on each
`/products/[brand]` page, as part of each product line's own card —
e.g. "Luncheon napkins — 150 sheets, 2-ply" as a subtitle under the
product name, not as a standalone chip in the hero. Only publish specs
that have been explicitly confirmed; do not infer or estimate.

## i18n (`lib/i18n.tsx`, `messages/*.json`)

Client-side dictionary swap via a `<T k="..." fallback="..." />` component
(`components/translated-text.tsx`). Three locale files exist:
`messages/en.json`, `ms.json` (Bahasa Malaysia), `zh.json` (Simplified
Chinese) — plus `messages/site-copy.ts` as a typed key registry. English is
the only locale currently populated with final approved copy end-to-end;
treat BM/ZH as scaffolded but unverified unless told otherwise. Every `<T>`
usage carries an English `fallback` prop, so the site is never blank if a
key is missing — preserve that pattern for any new copy.

## Content layer (`lib/content.ts`) — read this before touching Supabase

Two interchangeable backends behind one `ContentStore` interface:

- `SupabaseContentRepository` — default whenever
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are
  set. Reads are anonymous (RLS-gated public read); writes require a
  signed-in session (RLS decides who may edit).
- `LocalJsonContentRepository` — reads/writes `/content/*.json` on disk.
  Used automatically when Supabase env vars are absent, or forced via
  `CONTENT_BACKEND=local`. Local writes are blocked in production builds.

**`SupabaseContentRepository.get()` has a 2-second timeout and swallows
every error, returning `null` on any failure** (network issue, missing
row, RLS denial — all look identical to the caller). This is intentional:
a Supabase outage must degrade the page, not 500 it. Every call site that
reads content (`app/layout.tsx` for footer legal facts is the main one)
already wraps the call in try/catch and renders a reduced-but-working
page on `null`. Keep this pattern for any new content-backed section —
never let a Supabase read be able to break page render.

## Known-fixed bugs — context if you see old assets or issue reports

The following were found and fixed in the current codebase. If you're
reviewing an older bug report, older screenshots, or a stale deployment,
cross-check against this list before re-fixing:

- **Font fallback to Times New Roman sitewide** — see the quoting note
  under Design tokens above. Fixed by quoting family names in
  `tailwind.config.ts`.
- **Two brand image assets had a transparency checkerboard baked into
  their RGB pixels** (Wasabi packshot, Aimishu logo) — NOT actual alpha
  transparency, so CSS background-color fixes had no effect. Alpha
  channel read 255 (fully opaque) across the whole image in both cases;
  the checkerboard was literally painted in during a bad export. Both
  assets were replaced with clean re-exports. If a "transparent PNG isn't
  transparent" bug recurs, check the alpha channel with a real tool
  (e.g. `sharp`'s raw pixel stats) before assuming it's a CSS problem —
  don't trust visual inspection alone.
- **Cili logo had a clipped fragment of a "Serviette" banner baked into
  the same file**, causing an apparent layout collision with the wordmark
  below it at mobile widths. It was not a CSS/layout bug — no element
  overlap or horizontal overflow existed at 390px; the artwork itself was
  damaged. Fixed via connected-component isolation of the stray fragment
  from the source PNG.
- **Fixed-4-column product grid rendering empty grey boxes** — see
  "Product range grid" above.

**Pattern to take away:** when a visual bug looks like it should be a CSS
fix (background color, opacity, overflow) but the described fix doesn't
match the actual observed behavior, verify the source image asset's raw
pixel data before spending more time in CSS. Three separate bugs in this
codebase turned out to be damaged source images, not code defects.

## Images

`public/images/unikota/brands/` holds per-brand logos and packshots
(`{slug}-logo.png`, `{slug}-product.png`, plus a few brand-specific
variants like `wasabi-product-200gm.png` for a second pack size).
`public/images/unikota/` (parent folder) holds shared marketing photos
like `products-everyday.webp` (a 3-panel Malaysian home/shop/mamak
collage — this is the asset the target `/products` hero collage should
use) and per-category icons (`product-facial.webp`,
`product-hanging.webp`, `product-serviettes.webp`).

**Filenames must never contain spaces** — a space becomes `%20` in every
generated `<Image>` URL and is easy to miss when wiring up a new asset.
Rename on intake, don't work around it later.

## Deployment

- Repo: `github.com/fatjim1234/unikota-v2`, branch `main` → auto-deploys
  to Vercel project `unikota-v2` on every push.
- Production domain: `unikota.com` (redirects to `www.unikota.com`), DNS
  A record pointed at Vercel's `216.198.79.1`.
- The company's previous site (Joomla, on ServerFreak shared hosting)
  was not deleted — only the domain's DNS A record was repointed to
  Vercel. Joomla's files and database, and all company email (MX
  records, mailboxes), still live on ServerFreak untouched. Do not touch
  ServerFreak DNS, mail, or the Joomla install as part of any work on
  this repo.
