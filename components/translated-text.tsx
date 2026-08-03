"use client";

import { useI18n } from "@/lib/i18n";

export function T({ k, fallback }: { k: string; fallback?: string }) {
  const { t } = useI18n();
  const value = t(k);
  return <>{value === k && fallback ? fallback : value}</>;
}
