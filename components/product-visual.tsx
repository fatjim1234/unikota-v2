/**
 * ProductVisual — intentional image slot for real product photography.
 *
 * Until an approved packshot exists, this renders a restrained paper-form
 * composition in flat brand tones (no grey boxes, no placeholder labels).
 * When the real asset arrives, replace the inner composition with next/image
 * using the `data-image-slot` id from docs/website-asset-manifest.md.
 *
 * Recommended packshot spec: 4:3, minimum 1200×900 px, clean white or light
 * neutral background, consistent lighting across the range.
 */
export function ProductVisual({
  slot,
  variant = "box",
  className = "",
}: {
  /** Asset-manifest id, e.g. "products.facial-tissue" */
  slot: string;
  variant?: "box" | "roll" | "sheet";
  className?: string;
}) {
  return (
    <div
      data-image-slot={slot}
      aria-hidden="true"
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-50 ${className}`}
    >
      {variant === "box" ? (
        <>
          <div className="absolute left-1/2 top-1/2 h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-brand-200 bg-white shadow-sm" />
          <div className="absolute left-1/2 top-[34%] h-3 w-[34%] -translate-x-1/2 rounded-full bg-brand-100" />
          <div className="absolute bottom-4 right-4 h-10 w-10 rounded-lg border border-brand-200 bg-brand-100/60" />
        </>
      ) : variant === "roll" ? (
        <>
          <div className="absolute left-[30%] top-1/2 h-[52%] w-[26%] -translate-y-1/2 rounded-full border border-brand-200 bg-white shadow-sm" />
          <div className="absolute left-[37%] top-1/2 h-[20%] w-[11%] -translate-y-1/2 rounded-full bg-brand-100" />
          <div className="absolute left-[52%] top-[30%] h-[52%] w-[26%] rounded-full border border-brand-200 bg-white/90" />
        </>
      ) : (
        <>
          <div className="absolute left-1/2 top-1/2 h-[52%] w-[56%] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] rounded-md border border-brand-200 bg-white shadow-sm" />
          <div className="absolute left-1/2 top-1/2 h-[52%] w-[56%] -translate-x-1/2 -translate-y-1/2 rotate-[3deg] rounded-md border border-brand-100 bg-brand-100/50" />
        </>
      )}
    </div>
  );
}
