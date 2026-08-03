import { Bricolage_Grotesque, IBM_Plex_Sans, Space_Mono } from "next/font/google";
import type { Metadata } from "next";
import { BRAND_LINE, SERVICE_LINE, SUPPORTING_STATEMENT, PATHWAYS, PROOF_POINTS, FINAL_CTA } from "../_lib/content";
import { LabBackLink } from "../_lib/LabBackLink";
import styles from "./retail-energy.module.css";

export const metadata: Metadata = { title: "Malaysian Retail Energy" };

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

const NAV_LINKS = ["Products", "OEM", "Manufacturing", "Export", "Contact"];
const BRAND_CHIPS = [
  { name: "Corporate", swatch: "blue" },
  { name: "Cili", swatch: "red" },
  { name: "Wasabi", swatch: "green" },
  { name: "Aimishu", swatch: "teal" },
  { name: "Unisoft", swatch: "ocean" },
] as const;

export default function RetailEnergyPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${styles.root}`}>
      <LabBackLink />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.wordmark}>UNIKOTA</span>

          <input type="checkbox" id="retail-nav-toggle" className={styles.navToggle} aria-label="Toggle navigation" />
          <label htmlFor="retail-nav-toggle" className={styles.navToggleLabel}>
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
          <div className={styles.heroPanel}>
            <p className={styles.heroKicker}>Malaysian tissue &amp; hygiene manufacturer, since 1983</p>
            <h1 className={styles.heroTitle}>{BRAND_LINE}</h1>
            <p className={styles.heroService}>{SERVICE_LINE}</p>
            <p className={styles.heroBody}>{SUPPORTING_STATEMENT}</p>
          </div>

          <div className={styles.heroAside}>
            <div className={styles.heroPack} role="img" aria-label="Future asset region: hero packshot, front-facing">
              <span className={styles.plateLabel}>Fig. 01 — Packshot</span>
            </div>
            <div className={styles.chipRow} aria-label="Brand palette">
              {BRAND_CHIPS.map((c) => (
                <span key={c.name} className={styles.chip} data-swatch={c.swatch}>{c.name}</span>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.transition} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <section className={styles.pathways} aria-label="Choose your path">
          <p className={styles.sectionLabel}>Three ways to work with us</p>
          <div className={styles.pathwayGrid}>
            {PATHWAYS.map((p, i) => (
              <div key={p.title} className={styles.pathwayCard} data-swatch={["blue", "red", "teal"][i]}>
                <span className={styles.pathwayIndex}>{p.eyebrow}</span>
                <div className={styles.pathwayAsset} role="img" aria-label="Future asset region: labelled product placeholder">
                  <span className={styles.assetLabel}>Asset region</span>
                </div>
                <h2 className={styles.pathwayTitle}>{p.title}</h2>
                <p className={styles.pathwayBody}>{p.body}</p>
                <button type="button" className={styles.pathwayCta}>{p.cta} →</button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.credibility} aria-label="Company facts">
          <div className={styles.credibilityInner}>
            {PROOF_POINTS.map((f, i) => (
              <div key={f.label} className={styles.fact} data-swatch={["blue", "red", "green", "teal", "ocean"][i]}>
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
        <span>Concept D — Malaysian Retail Energy</span>
        <span>Design Lab prototype, not a live page</span>
      </footer>
    </div>
  );
}
