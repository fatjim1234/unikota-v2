"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

type Errors = Partial<Record<"name" | "email" | "type" | "message" | "consent", string>>;

// Maps the canonical English enquiry-type values (from content/contact.json) to
// their translation keys. The submitted <option> value stays English.
const typeLabelKeys: Record<string, string> = {
  General: "site.contact.form.types.general",
  "OEM / private label": "site.contact.form.types.oemPrivateLabel",
  Export: "site.contact.form.types.export",
  "Retail support": "site.contact.form.types.retailSupport",
};

/**
 * Accessible lead/enquiry form.
 * - Every input has a visible <label>; errors are announced via role="alert"
 *   and linked with aria-describedby; invalid fields get aria-invalid.
 * - Honeypot field ("website") is visually hidden from humans.
 * - Posts to /api/lead (file-backed in Phase 1; export_enquiries table later).
 */
export function LeadForm({
  types,
  consentLabel,
  successMessage,
}: {
  types: string[];
  consentLabel: string;
  successMessage: string;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      type: String(fd.get("type") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      sourcePage: pathname,
    };

    const next: Errors = {};
    if (!payload.name.trim()) next.name = t("site.contact.form.nameError");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) next.email = t("site.contact.form.emailError");
    if (!payload.type) next.type = t("site.contact.form.typeError");
    if (!payload.message.trim()) next.message = t("site.contact.form.messageError");
    if (!payload.consent) next.consent = t("site.contact.form.consentError");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        const d = await res.json().catch(() => null);
        if (d?.fields) setErrors(d.fields as Errors);
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  }

  if (state === "success") {
    return (
      <div role="status" data-testid="lead-success" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
        {t("site.contact.form.success") || successMessage}
      </div>
    );
  }

  const field = "focus-ring w-full rounded-md border px-3 py-2";
  const err = (k: keyof Errors) => (errors[k] ? "border-red-500" : "border-stone-300");

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Enquiry form" className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="mb-1 block text-sm font-medium">{t("site.contact.form.name")} *</label>
          <input id="lead-name" name="name" autoComplete="name" className={`${field} ${err("name")}`}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "lead-name-error" : undefined} />
          {errors.name ? <p id="lead-name-error" role="alert" className="mt-1 text-xs text-red-700">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-1 block text-sm font-medium">{t("site.contact.form.email")} *</label>
          <input id="lead-email" name="email" type="email" autoComplete="email" className={`${field} ${err("email")}`}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "lead-email-error" : undefined} />
          {errors.email ? <p id="lead-email-error" role="alert" className="mt-1 text-xs text-red-700">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor="lead-company" className="mb-1 block text-sm font-medium">{t("site.contact.form.company")}</label>
          <input id="lead-company" name="company" autoComplete="organization" className={`${field} border-stone-300`} />
        </div>
        <div>
          <label htmlFor="lead-type" className="mb-1 block text-sm font-medium">{t("site.contact.form.type")} *</label>
          <select id="lead-type" name="type" defaultValue={types[0]} className={`${field} ${err("type")}`}
            aria-invalid={!!errors.type} aria-describedby={errors.type ? "lead-type-error" : undefined}>
            {types.map((opt) => {
              // Value stays the canonical English string so lead categorisation is
              // locale-independent; only the visible label is translated.
              const labelKey = typeLabelKeys[opt];
              const label = labelKey ? t(labelKey) : opt;
              return <option key={opt} value={opt}>{label}</option>;
            })}
          </select>
          {errors.type ? <p id="lead-type-error" role="alert" className="mt-1 text-xs text-red-700">{errors.type}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className="mb-1 block text-sm font-medium">{t("site.contact.form.message")} *</label>
        <textarea id="lead-message" name="message" rows={4} className={`${field} ${err("message")}`}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "lead-message-error" : undefined} />
        {errors.message ? <p id="lead-message-error" role="alert" className="mt-1 text-xs text-red-700">{errors.message}</p> : null}
      </div>

      {/* Honeypot — hidden from humans, tab order excluded */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-2 text-xs text-stone-600">
          <input type="checkbox" name="consent" className="mt-0.5"
            aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "lead-consent-error" : undefined} />
          <span>{t("site.contact.form.consent") || consentLabel}</span>
        </label>
        {errors.consent ? <p id="lead-consent-error" role="alert" className="mt-1 text-xs text-red-700">{errors.consent}</p> : null}
      </div>

      {state === "failed" ? (
        <p role="alert" className="text-sm text-red-700">{t("site.contact.form.failed")}</p>
      ) : null}

      <div>
        <Button type="submit">{state === "submitting" ? t("site.contact.form.sending") : t("site.contact.form.send")}</Button>
      </div>
    </form>
  );
}
