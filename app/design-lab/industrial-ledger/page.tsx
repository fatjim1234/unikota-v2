import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import { BRAND_LINE, SERVICE_LINE, SUPPORTING_STATEMENT, PATHWAYS, PROOF_POINTS, FINAL_CTA } from "../_lib/content";
import { LabBackLink } from "../_lib/LabBackLink";
import styles from "./industrial-ledger.module.css";

export const metadata: Metadata = { title: "Industrial Paper Ledger" };

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const NAV_LINKS = ["Products", "OEM", "Manufacturing", "Export", "Contact"];
const SECTION_INDEX = ["Hero", "Pathways", "Credibility", "Contact"];

export default function IndustrialLedgerPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${styles.root}`}>
      <LabBackLink />

      <nav className={styles.sectionIndex} aria-label="Section index">
        {SECTION_INDEX.map((label, i) => (
          <span key={label} className={styles.sectionIndexItem}>
            <span className={styles.sectionIndexTick} aria-hidden="true" />
            {String(i + 1).padStart(2, "0")} / {label}
          </span>
        ))}
      </nav>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.wordmark}>
            UNIKOTA<span className={styles.wordmarkSpec}> / EST. 1983</span>
          </span>

          <input type="checkbox" id="ledger-nav-toggle" className={styles.navToggle} aria-label="Toggle navigation" />
          <label htmlFor="ledger-nav-toggle" className={styles.navToggleLabel}>
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

      <main className={styles.main}>
        <section className={styles.hero} aria-label="Introduction">
          <div className={styles.heroGrid} aria-hidden="true" />

          <div className={styles.heroText}>
            <p className={styles.heroKicker}>Manufacturing · Packaging Systems · Export Readiness</p>
            <h1 className={styles.heroTitle}>{BRAND_LINE}</h1>
            <p className={styles.heroService}>{SERVICE_LINE}</p>
            <p className={styles.heroBody}>{SUPPORTING_STATEMENT}</p>
          </div>

          <div className={styles.heroDiagram} role="img" aria-label="Future asset region: carton and sheet geometry line diagram">
            <div className={styles.diagramBox}>
              <span className={styles.diagramCorner} data-pos="tl" />
              <span className={styles.diagramCorner} data-pos="tr" />
              <span className={styles.diagramCorner} data-pos="bl" />
              <span className={styles.diagramCorner} data-pos="br" />
              <span className={styles.plateLabel}>Fig. 01 — Carton geometry, pending asset</span>
            </div>
            <span className={styles.diagramTick} data-pos="w">W</span>
            <span className={styles.diagramTick} data-pos="h">H</span>
          </div>
        </section>

        <div className={styles.transition} aria-hidden="true">
          <span className={styles.transitionLabel}>— Section 02 / Pathways —</span>
        </div>

        <section className={styles.pathways} aria-label="Choose your path">
          <div className={styles.pathwayGrid}>
            {PATHWAYS.map((p) => (
              <div key={p.title} className={styles.pathwayColumn}>
                <span className={styles.pathwayIndex}>P.{p.eyebrow}</span>
                <h2 className={styles.pathwayTitle}>{p.title}</h2>
                <p className={styles.pathwayBody}>{p.body}</p>
                <button type="button" className={styles.pathwayCta}>{p.cta} →</button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.credibility} aria-label="Company facts">
          <div className={styles.credibilityInner}>
            <p className={styles.sectionLabel}>Spec sheet / verified facts</p>
            <dl className={styles.specTable}>
              {PROOF_POINTS.map((f) => (
                <div key={f.label} className={styles.specRow}>
                  <dt className={styles.specLabel}>
                    <span className={styles.specBullet} aria-hidden="true" />
                    {f.label}
                  </dt>
                  <dd className={styles.specValue}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={styles.finalCta} aria-label="Get in touch">
          <div className={styles.finalCtaGrid} aria-hidden="true" />
          <h2 className={styles.finalCtaTitle}>{FINAL_CTA.title}</h2>
          <p className={styles.finalCtaBody}>{FINAL_CTA.body}</p>
          <div className={styles.finalCtaActions}>
            <button type="button" className={styles.ctaPrimary}>{FINAL_CTA.primary}</button>
            <button type="button" className={styles.ctaSecondary}>{FINAL_CTA.secondary}</button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Concept E — Industrial Paper Ledger</span>
        <span>Design Lab prototype, not a live page</span>
      </footer>
    </div>
  );
}
