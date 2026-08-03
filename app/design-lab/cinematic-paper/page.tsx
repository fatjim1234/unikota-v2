import { Bodoni_Moda, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import { BRAND_LINE, SERVICE_LINE, SUPPORTING_STATEMENT, PATHWAYS, PROOF_POINTS, FINAL_CTA } from "../_lib/content";
import { LabBackLink } from "../_lib/LabBackLink";
import styles from "./cinematic-paper.module.css";

export const metadata: Metadata = { title: "Cinematic Paper World" };

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const NAV_LINKS = ["Products", "OEM", "Manufacturing", "Export", "Contact"];

export default function CinematicPaperPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${styles.root}`}>
      <LabBackLink />

      {/* Nav is not part of the scripted sequence — fully interactive from t=0 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.wordmarkSmall}>UNIKOTA</span>

          <input type="checkbox" id="cinema-nav-toggle" className={styles.navToggle} aria-label="Toggle navigation" />
          <label htmlFor="cinema-nav-toggle" className={styles.navToggleLabel}>
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
          <div className={styles.cloud} data-layer="a" aria-hidden="true" />
          <div className={styles.cloud} data-layer="b" aria-hidden="true" />
          <div className={styles.cloud} data-layer="c" aria-hidden="true" />

          <div className={styles.heroContent}>
            <span className={styles.heroWordmark}>UNIKOTA</span>
            <h1 className={styles.heroBrandLine}>{BRAND_LINE}</h1>
            <p className={styles.heroServiceLine}>{SERVICE_LINE}</p>

            <div className={styles.productSettle}>
              <div className={styles.productPanel} role="img" aria-label="Future asset region: hero product emergence, portrait">
                <span className={styles.plateLabel}>Fig. 01</span>
              </div>
              <div className={styles.productPanel} role="img" aria-label="Future asset region: secondary product detail, portrait">
                <span className={styles.plateLabel}>Fig. 02</span>
              </div>
            </div>
          </div>

          <p className={styles.heroCaption}>{SUPPORTING_STATEMENT}</p>
        </section>

        <div className={styles.transition} aria-hidden="true" />

        <section className={styles.pathways} aria-label="Choose your path">
          <p className={styles.sectionLabel}>Three ways in</p>
          <div className={styles.pathwayStrip}>
            {PATHWAYS.map((p, i) => (
              <div key={p.title} className={styles.pathwayFrame}>
                <span className={styles.frameTag}>Scene {String(i + 1).padStart(2, "0")}</span>
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
        <span>Concept B — Cinematic Paper World</span>
        <span>Design Lab prototype, not a live page</span>
      </footer>
    </div>
  );
}
