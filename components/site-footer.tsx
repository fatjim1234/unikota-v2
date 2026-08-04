"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export type FooterFacts = {
  legalName?: string;
  companyRegistrationNumber?: string;
  addressLines?: string[];
  landline?: string;
  email?: string;
  tagline?: string;
};

export function SiteFooter({ facts }: { facts?: FooterFacts }) {
  const { t } = useI18n();
  const telHref = facts?.landline ? `tel:${facts.landline.replace(/[^\d+]/g, "")}` : null;

  return (
    <footer className="bg-brand-900 text-white">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.8fr_1.1fr] lg:px-8">
        <div>
          <Image
            src="/images/unikota/unikota-logo-white.png"
            alt="Unikota — We're More Than Paper"
            width={181}
            height={67}
            className="h-auto w-[170px]"
          />
          <p className="mt-4 max-w-sm text-sm leading-6 text-brand-100">
            {t("site.footer.tagline")}
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-semibold uppercase tracking-[0.15em] text-brand-200">{t("site.common.explore")}</p>
          <ul className="space-y-2 text-brand-100">
            <li><Link className="hover:text-white" href="/">{t("nav.home")}</Link></li>
            <li><Link className="hover:text-white" href="/about">{t("nav.about")}</Link></li>
            <li><Link className="hover:text-white" href="/products">{t("nav.brandsProducts")}</Link></li>
            <li><Link className="hover:text-white" href="/oem">{t("nav.oemExport")}</Link></li>
            <li><Link className="hover:text-white" href="/contact">{t("nav.contact")}</Link></li>
          </ul>
        </nav>

        <address className="text-sm not-italic leading-6 text-brand-100">
          {facts?.legalName ? <p className="font-semibold text-white">{facts.legalName}</p> : null}
          {facts?.companyRegistrationNumber ? <p>{t("site.contact.registration")} {facts.companyRegistrationNumber}</p> : null}
          {(facts?.addressLines ?? []).map((line) => <p key={line}>{line}</p>)}
          {facts?.landline && telHref ? (
            <p className="mt-3"><a className="hover:text-white" href={telHref}>{facts.landline}</a></p>
          ) : null}
          {facts?.email ? <p><a className="hover:text-white" href={`mailto:${facts.email}`}>{facts.email}</a></p> : null}
        </address>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-brand-200">
        © 2026 {facts?.legalName ?? "Unikota"}. {t("footer.rights")}
      </div>
    </footer>
  );
}
