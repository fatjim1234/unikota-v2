import Link from "next/link";
import type { ReactNode } from "react";

/** shadcn-style primitives, hand-rolled to keep the M0 prototype dependency-light. */

export function Button({
  href,
  children,
  variant = "primary",
  type,
  onClick,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-none px-5 py-2.5 text-sm font-semibold transition-colors";
  const styles = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "border border-brand-600 text-brand-700 hover:bg-brand-50",
    ghost: "text-brand-700 hover:bg-brand-50",
    whatsapp: "bg-emerald-600 text-white hover:bg-emerald-700",
  }[variant];
  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`border border-stone-200 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "amber" | "red" | "stone" | "green";
}) {
  const tones = {
    brand: "bg-brand-100 text-brand-900",
    amber: "bg-amber-100 text-amber-900",
    red: "bg-red-100 text-red-900",
    stone: "bg-stone-200 text-stone-800",
    green: "bg-emerald-100 text-emerald-900",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones}`}>{children}</span>;
}

/** Marks content that must come from the business — never invented. */
export function RequiredInput({ label, qref }: { label: string; qref?: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 rounded-md border border-dashed border-amber-400 bg-amber-50 px-2 py-1 text-xs text-amber-900">
      <strong>REQUIRED INPUT:</strong> {label}
      {qref ? <span className="text-amber-700">({qref})</span> : null}
    </span>
  );
}

export function PlaceholderBlock({ label }: { label: string }) {
  // Neutral decorative panel until real imagery is supplied (label kept for
  // future alt-text wiring; intentionally not rendered).
  void label;
  return <div aria-hidden="true" className="aspect-video w-full rounded-lg bg-gradient-to-br from-brand-50 via-stone-100 to-brand-100" />;
}

export function PageHero({
  title,
  lead,
  eyebrow,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
}) {
  return (
    // brand-700, matching the homepage hero — this used to be brand-900, a full
    // shade darker, so every page using PageHero (About, Contact, Solutions,
    // Manufacturing...) read as a visibly different blue from Home and OEM.
    <section className="bg-brand-700 text-white">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">{eyebrow}</p> : null}
        <h1 className="max-w-3xl font-display text-5xl font-bold uppercase leading-[0.94] sm:text-7xl">{title}</h1>
        {lead ? <p className="mt-5 max-w-2xl text-base leading-7 text-brand-100 sm:text-lg">{lead}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

/** Small uppercase section label. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">{children}</p>;
}

/** Verified-fact stat tile (values must always be verified facts, never invented). */
export function Stat({ value, label }: { value: ReactNode; label: ReactNode }) {
  return (
    <div className="border border-stone-200 bg-white p-5">
      <p className="font-display text-2xl font-bold text-brand-700 sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-stone-600">{label}</p>
    </div>
  );
}

export function Section({ title, children, muted = false }: { title?: ReactNode; children: ReactNode; muted?: boolean }) {
  return (
    <section className={muted ? "bg-stone-50" : ""}>
      <div className="mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        {title ? <h2 className="mb-7 font-display text-4xl font-bold text-brand-900">{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
