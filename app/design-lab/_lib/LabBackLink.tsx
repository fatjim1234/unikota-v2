import Link from "next/link";

/**
 * Lab-only wayfinding, deliberately styled outside each concept's own design
 * language so reviewers never mistake it for part of the pitch.
 */
export function LabBackLink() {
  return (
    <Link
      href="/design-lab"
      style={{
        position: "fixed",
        left: "12px",
        bottom: "12px",
        zIndex: 999,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: "11px",
        letterSpacing: "0.02em",
        color: "#f4f4f4",
        background: "rgba(20,20,20,0.82)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "999px",
        padding: "6px 12px",
        textDecoration: "none",
        backdropFilter: "blur(6px)",
      }}
    >
      ← Design Lab
    </Link>
  );
}
