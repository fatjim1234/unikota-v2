/**
 * Dynamic QR codes printed on packaging and marketing material.
 *
 * Each printed QR code contains a fixed address: https://www.unikota.com/q/<code>
 * The printed address can never change, but where it sends people can:
 * edit `destination` below and redeploy.
 *
 * Rules:
 * - Never remove or rename a code once it has been printed. Old packaging stays
 *   on shelves for years. Point a retired code somewhere sensible instead.
 * - Unknown codes go to the homepage (see FALLBACK), never to a "not found" page.
 * - Internal destinations (starting with "/") get campaign tags added
 *   automatically, so Google Analytics can report visits per code.
 */

export type QrLink = {
  /** Where the code sends people today: a site path ("/brands/unisoft") or a full URL. */
  destination: string;
  /** What is printed and where, for whoever edits this file later. */
  note: string;
};

export const QR_LINKS: Record<string, QrLink> = {
  "unisoft-signature": {
    destination: "/brands/unisoft",
    note: "Unisoft Signature bathroom tissue, individual roll wrap (4-ply, 200 sheets) — QR 1, website. Seen at home after purchase. Artwork supplied to designer 10 Nov 2026.",
  },
  "unisoft-signature-ig": {
    // TODO: switch to the Instagram account URL once it exists.
    destination: "/",
    note: "Unisoft Signature bathroom tissue, individual roll wrap (4-ply, 200 sheets) — QR 2, captioned for Instagram. Seen at home after purchase. Artwork supplied to designer 10 Nov 2026.",
  },
  "unisoft-signature-pack": {
    destination: "/brands/unisoft",
    note: "Unisoft Signature bathroom tissue, outer 10-roll bag — QR 3. Seen in store before purchase. Artwork supplied to designer 10 Nov 2026.",
  },
};

export const QR_FALLBACK = "/";

export function resolveQr(code: string): { code: string | null; destination: string } {
  const key = code.trim().toLowerCase();
  const link = QR_LINKS[key];
  return link ? { code: key, destination: link.destination } : { code: null, destination: QR_FALLBACK };
}
