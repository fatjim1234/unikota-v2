"use client";

import { usePathname } from "next/navigation";

/**
 * WhatsApp click-to-chat CTA with pre-filled enquiry context.
 * Number comes from NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code,
 * e.g. 60123456789 — REQUIRED INPUT Q33). Until it is set, the button renders
 * a clearly-labelled disabled state instead of a broken link.
 */
export function WhatsAppButton({
  context,
  label = "Chat on WhatsApp",
  className = "",
  number: numberProp,
}: {
  context: string;
  label?: string;
  className?: string;
  /** Public WhatsApp number from site settings content; env var is the fallback. */
  number?: string;
}) {
  const pathname = usePathname();
  const number = (numberProp ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const base =
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors";

  if (!number) {
    // No number configured yet: render nothing rather than a dead control.
    return null;
  }

  const message = `Hello Unikota! Enquiry: ${context} — via ${pathname}`;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-cta"
      className={`${base} bg-emerald-600 text-white hover:bg-emerald-700 ${className}`}
    >
      {label}
    </a>
  );
}
