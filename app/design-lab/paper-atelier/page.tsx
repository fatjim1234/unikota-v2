import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import { BRAND_LINE, SERVICE_LINE, SUPPORTING_STATEMENT, PATHWAYS, PROOF_POINTS, FINAL_CTA } from "../_lib/content";
import { LabBackLink } from "../_lib/LabBackLink";
import styles from "./paper-atelier.module.css";

export const metadata: Metadata = { title: "Paper Atelier" };

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const NAV_LINKS = ["Products", "OEM", "Manufacturing", "Export", "Contact"];

export default function PaperAtelierPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${styles.root}`}>
      <LabBackLink />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.wordmark}>UNIKOTA</span>

          <input type="checkbox" id="atelier-nav-toggle" className={styles.navToggle} aria-label="Toggle navigation" />
          <label htmlFor="atelier-nav-toggle" className={styles.navToggleLabel}>
            <span /><span /><span />
          </label>

          <nav aria-label="Primary" className={styles.nav}>
            {NAV_LINKS.map((label, i) => (
              <span key={label} className={styles.navItem}>
                <span className={styles.navIndex}>{String(i + 1).padStart(2, "0")}</span>
                {label}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-label="Introduction">
          <p className={styles.heroKicker}>Malaysian tissue &amp; hygiene manufacturer — est. 1983</p>
          <h1 className={styles.heroTitle}>
            {BRAND_LINE.split(" ").slice(0, -1).join(" ")} <em>{BRAND_LINE.split(" ").slice(-1)}</em>
          </h1>
          <p className={styles.heroService}>{SERVICE_LINE}</p>
          <p className={styles.heroBody}>{SUPPORTING_STATEMENT}</p>

          <div className={styles.heroPlate} role="img" aria-label="Future asset region: product still-life photograph">
            <span className={styles.plateLabel}>Fig. 01 — Product still life</span>
          </div>
        </section>

        <div className={styles.transition} aria-hidden="true">
          <span className={styles.transitionMark}>— Concept to Market —</span>
        </div>

        <section className={styles.pathways} aria-label="Choose your path">
          <p className={styles.sectionLabel}>Where would you like to start</p>
          <ol className={styles.pathwayList}>
            {PATHWAYS.map((p) => (
              <li key={p.title} className={styles.pathwayRow}>
                <span className={styles.pathwayIndex}>{p.eyebrow}</span>
                <div className={styles.pathwayText}>
                  <h2 className={styles.pathwayTitle}>{p.title}</h2>
                  <p className={styles.pathwayBody}>{p.body}</p>
                </div>
                <button type="button" className={styles.pathwayCta}>
                  {p.cta} <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.credibility} aria-label="Company facts">
          <div className={styles.credibilityInner}>
            {PROOF_POINTS.map((f) => (
              <div key={f.label} className={styles.fact}>
                <span className={styles.factValue}>{f.value}</span>
                <span className={styles.factLabel}>{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.finalCta} aria-label="Get in touch">
          <h2 className={styles.finalCtaTitle}>{FINAL_CTA.title}</h2>
          <p className={styles.finalCtaBody}>{FINAL_CTA.body}</p>
          <div className={styles.finalCtaActions}>
            <button type="button" className={styles.ctaPrimary}>{FINAL_CTA.primary}</button>
            <button type="button" className={styles.ctaSecondary}>{FINAL_CTA.secondary}</button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Concept A — Paper Atelier</span>
        <span>Design Lab prototype, not a live page</span>
      </footer>
    </div>
  );
}
