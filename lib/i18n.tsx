"use client";

/**
 * Lightweight i18n for the M0 prototype.
 * English is complete; ms/zh dictionaries cover shared chrome as proof of structure.
 * At M1 this is replaced by URL-prefix locale routing (/en, /ms, /zh).
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "@/messages/en.json";
import ms from "@/messages/ms.json";
import zh from "@/messages/zh.json";
import { siteCopy } from "@/messages/site-copy";

export type Locale = "en" | "ms" | "zh";
const dictionaries = {
  en: { ...en, site: siteCopy.en },
  ms: { ...ms, site: siteCopy.ms },
  zh: { ...zh, site: siteCopy.zh },
} as const;

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("unikota-locale");
    if (saved === "en" || saved === "ms" || saved === "zh") setLocale(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("unikota-locale", locale);
    document.documentElement.lang = locale === "ms" ? "ms" : locale === "zh" ? "zh-Hans" : "en";
  }, [locale]);
  const t = (key: string): string => {
    const parts = key.split(".");
    let node: unknown = dictionaries[locale];
    for (const p of parts) {
      if (typeof node === "object" && node !== null && p in node) {
        node = (node as Record<string, unknown>)[p];
      } else {
        node = undefined;
        break;
      }
    }
    if (typeof node === "string") return node;
    // Fallback to English
    let fallback: unknown = dictionaries.en;
    for (const p of parts) {
      fallback = typeof fallback === "object" && fallback !== null ? (fallback as Record<string, unknown>)[p] : undefined;
    }
    return typeof fallback === "string" ? fallback : key;
  };
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
