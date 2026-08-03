import { DM_Serif_Display, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import { BRAND_LINE, SERVICE_LINE, SUPPORTING_STATEMENT, PATHWAYS, PROOF_POINTS, FINAL_CTA } from "../_lib/content";
import { LabBackLink } from "../_lib/LabBackLink";
import styles from "./quiet-coastal.module.css";

export const metadata: Metadata = { title: "Quiet Coastal Studio" };

const display = DM_Serif_Display({ subsets: ["latin"], style: ["normal", "italic"], weight: "400", variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const NAV_LINKS = ["Products", "OEM", "Manufacturing", "Export", "Contact"];

export default function QuietCoastalPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${styles.root}`}>
      <LabBackLink />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.wordmark}>Unikota</span>

          <input type="checkbox" id="coastal-nav-toggle" className={styles.navToggle} aria-label="Toggle navigation" />
          <label htmlFor="coastal-nav-toggle" className={styles.navToggleLabel}>
            <span /><span /><span />
          </label>

          <nav aria-label="Primary" className={styles.nav}>
            {NAV_LINKS.map((label) => (
              <span key={label} className={styles.navItem}>{label}</span>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-label="Introduction">
          <div className={styles.heroText}>
            <p className={styles.heroKicker}>Malaysian tissue &amp; hygiene manufacturer, since 1983</p>
            <h1 className={styles.heroTitle}>{BRAND_LINE}</h1>
            <p className={styles.heroService}>{SERVICE_LINE}</p>
            <p className={styles.heroBody}>{SUPPORTING_STATEMENT}</p>
          </div>

          <div className={styles.heroWindow} role="img" aria-label="Future asset region: soft morning light, product resting on a warm surface">
            <span className={styles.plateLabel}>Fig. 01 — Morning light study</span>
          </div>
        </section>

        <div className={styles.transition} aria-hidden="true" />

        <section className={styles.pathways} aria-label="Choose your path">
          <p className={styles.sectionLabel}>Find your way in</p>
          <div className={styles.pathwayGrid}>
            {PATHWAYS.map((p) => (
              <div key={p.title} className={styles.pathwayCard}>
                <span className={styles.pathwayIndex}>{p.eyebrow}</span>
                <h2 className={styles.pathwayTitle}>{p.title}</h2>
                <p className={styles.pathwayBody}>{p.body}</p>
                <button type="button" className={styles.pathwayCta}>{p.cta}</button>
              </div>
            ))}
          </div>
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
        <span>Concept C — Quiet Coastal Studio</span>
        <span>Design Lab prototype, not a live page</span>
      </footer>
    </div>
  );
}
