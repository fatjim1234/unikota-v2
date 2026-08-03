import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Unikota Design Lab", template: "%s · Unikota Design Lab" },
  description: "Internal comparison lab for candidate Unikota homepage directions. Not for public indexing.",
  robots: { index: false, follow: false },
};

export default function DesignLabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
