"use client";

import {
  ArrowRight,
  Buildings,
  CalendarBlank,
  ChartLineUp,
  Factory,
  GlobeHemisphereWest,
  Package,
  PaintBrush,
  Storefront,
  Truck,
  type IconProps,
} from "@phosphor-icons/react";

const icons = {
  arrow: ArrowRight,
  buildings: Buildings,
  calendar: CalendarBlank,
  chart: ChartLineUp,
  factory: Factory,
  globe: GlobeHemisphereWest,
  package: Package,
  paint: PaintBrush,
  storefront: Storefront,
  truck: Truck,
};

export type MarketingIconName = keyof typeof icons;

export function MarketingIcon({ name, ...props }: IconProps & { name: MarketingIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden weight="regular" {...props} />;
}
