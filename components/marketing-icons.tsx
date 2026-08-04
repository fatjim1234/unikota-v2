"use client";

import {
  ArrowRight,
  Buildings,
  CalendarBlank,
  ChartLineUp,
  ClipboardText,
  Factory,
  GlobeHemisphereWest,
  Package,
  PaintBrush,
  Ruler,
  SealCheck,
  ShieldCheck,
  Storefront,
  Truck,
  type IconProps,
} from "@phosphor-icons/react";

const icons = {
  arrow: ArrowRight,
  buildings: Buildings,
  calendar: CalendarBlank,
  chart: ChartLineUp,
  clipboard: ClipboardText,
  factory: Factory,
  globe: GlobeHemisphereWest,
  package: Package,
  paint: PaintBrush,
  ruler: Ruler,
  seal: SealCheck,
  shield: ShieldCheck,
  storefront: Storefront,
  truck: Truck,
};

export type MarketingIconName = keyof typeof icons;

export function MarketingIcon({ name, ...props }: IconProps & { name: MarketingIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden weight="regular" {...props} />;
}
