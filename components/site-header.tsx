"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/products", key: "nav.brandsProducts" },
  { href: "/oem", key: "nav.oemExport" },
];

export function SiteHeader() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-brand-700 text-white shadow-[0_1px_0_rgba(4,24,55,0.16)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:text-brand-800"
      >
        {t("site.common.skipToContent")}
      </a>

      <div className="mx-auto flex min-h-[78px] max-w-page items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring block shrink-0" aria-label="Unikota home">
          <Image
            src="/images/unikota/unikota-logo-white.png"
            alt="Unikota — We're More Than Paper"
            width={181}
            height={67}
            priority
            className="h-auto w-[145px] sm:w-[166px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-stretch gap-1 lg:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring flex items-center border-b-2 px-3 py-6 text-[0.95rem] font-semibold leading-none transition-colors xl:px-4 ${
                  active
                    ? "border-white text-white"
                    : "border-transparent text-brand-100 hover:border-brand-200 hover:text-white"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="focus-ring hidden min-h-11 items-center border border-white/70 px-4 py-2 text-[0.95rem] font-semibold leading-none text-white transition-colors hover:bg-white hover:text-brand-800 sm:inline-flex"
          >
            {t("nav.talk")}
          </Link>
          <label className="sr-only" htmlFor="lang">Language</label>
          <select
            id="lang"
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            className="focus-ring min-h-11 border border-white/35 bg-brand-700 px-3 py-2 text-[0.95rem] font-semibold text-white"
          >
            <option className="text-ink" value="en">EN</option>
            <option className="text-ink" value="ms">BM</option>
            <option className="text-ink" value="zh">中文</option>
          </select>
          <button
            type="button"
            className="focus-ring border border-white/40 px-3 py-2 text-sm font-semibold lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-white/15 bg-brand-800 px-4 py-3 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="focus-ring block border-b border-white/10 px-3 py-4 text-base font-semibold text-white last:border-b-0"
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="focus-ring mt-3 block border border-white/60 px-3 py-3 text-center font-semibold text-white"
          >
            {t("nav.talk")}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
