import type { Metadata } from "next";
import { BRAND_LINE, SERVICE_LINE, SUPPORTING_STATEMENT } from "./_lib/content";
import { CONCEPTS, COMPARISON_ROWS } from "./_lib/concepts";
import styles from "./design-lab.module.css";

export const metadata: Metadata = { title: "Design Lab" };

export default function DesignLabIndexPage() {
  return (
    <div className={styles.root}>
      <header className={styles.pageHeader}>
        <p className={styles.kicker}>Internal · Not for public indexing</p>
        <h1 className={styles.title}>Unikota Design Lab</h1>
        <p className={styles.intro}>
          Five genuinely distinct homepage directions for comparison before a visual identity is chosen. Every
          concept below renders the exact same business message — only the typography, colour, composition and
          motion differ, so the comparison is visual, not content-driven.
        </p>
        <div className={styles.sharedMessage}>
          <span className={styles.sharedLabel}>Shared message</span>
          <p><strong>{BRAND_LINE}</strong> — {SERVICE_LINE}</p>
          <p className={styles.sharedStatement}>{SUPPORTING_STATEMENT}</p>
        </div>
      </header>

      <main className={styles.grid}>
        {CONCEPTS.map((c) => (
          <article key={c.slug} className={styles.card} id={c.slug}>
            <div className={styles.cardHead}>
              <span className={styles.letter}>{c.letter}</span>
              <div>
                <h2 className={styles.cardTitle}>{c.name}</h2>
                <p className={styles.cardMood}>{c.mood}</p>
              </div>
            </div>

            <p className={styles.rationale}>{c.rationale}</p>

            <div className={styles.previewOuter}>
              <input type="checkbox" id={`${c.slug}-mode`} className={styles.modeToggle} />
              <iframe
                className={styles.frameDesktop}
                src={`/design-lab/${c.slug}`}
                title={`${c.name} — desktop preview`}
                loading="lazy"
              />
              <iframe
                className={styles.frameMobile}
                src={`/design-lab/${c.slug}`}
                title={`${c.name} — mobile preview`}
                loading="lazy"
              />
              <label htmlFor={`${c.slug}-mode`} className={styles.modeToggleLabel}>
                <span className={styles.modeOption} data-mode="desktop">Desktop</span>
                <span className={styles.modeOption} data-mode="mobile">Mobile</span>
              </label>
            </div>

            <div className={styles.previewLinks}>
              <a className={styles.previewLink} href={`/design-lab/${c.slug}`}>Open full concept →</a>
              <a className={styles.previewLinkGhost} href={`/design-lab/${c.slug}`} target="_blank" rel="noopener noreferrer">
                Open in new tab ↗
              </a>
            </div>

            <dl className={styles.specList}>
              <div>
                <dt>Typography</dt>
                <dd>{c.typography.display} · {c.typography.body} · {c.typography.label}</dd>
              </div>
              <div>
                <dt>Hero strategy</dt>
                <dd>{c.heroStrategy}</dd>
              </div>
              <div>
                <dt>Motion strategy</dt>
                <dd>{c.motionStrategy}</dd>
              </div>
            </dl>

            <div className={styles.palette}>
              {c.palette.map((p) => (
                <span key={p.hex} className={styles.swatch} title={`${p.name} — ${p.hex}`}>
                  <span className={styles.swatchColor} style={{ background: p.hex }} />
                  <span className={styles.swatchName}>{p.name}</span>
                </span>
              ))}
            </div>

            <details className={styles.assetBrief}>
              <summary>Future Higgsfield asset brief</summary>
              <dl>
                <div><dt>Subject</dt><dd>{c.assetBrief.subject}</dd></div>
                <div><dt>Composition</dt><dd>{c.assetBrief.composition}</dd></div>
                <div><dt>Negative space</dt><dd>{c.assetBrief.negativeSpace}</dd></div>
                <div><dt>Aspect ratio</dt><dd>{c.assetBrief.aspectRatio}</dd></div>
                <div><dt>Minimum resolution</dt><dd>{c.assetBrief.minResolution}</dd></div>
                <div><dt>Format</dt><dd>{c.assetBrief.format}</dd></div>
                <div><dt>Compositing</dt><dd>{c.assetBrief.compositingNote}</dd></div>
              </dl>
            </details>
          </article>
        ))}
      </main>

      <section className={styles.comparison} aria-label="Comparison table">
        <h2 className={styles.comparisonTitle}>At a glance</h2>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Concept</th>
                <th>Emotional character</th>
                <th>Strongest audience</th>
                <th>Potential weakness</th>
                <th>Production complexity</th>
                <th>Higgsfield requirement</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => {
                const concept = CONCEPTS.find((c) => c.slug === row.slug)!;
                return (
                  <tr key={row.slug}>
                    <td><a href={`#${row.slug}`}>{concept.letter}. {concept.name}</a></td>
                    <td>{row.emotionalCharacter}</td>
                    <td>{row.strongestAudience}</td>
                    <td>{row.weakness}</td>
                    <td>{row.productionComplexity}</td>
                    <td>{row.higgsfieldRequirement}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className={styles.pageFooter}>
        Design Lab prototype — isolated from production routes, no Supabase connection, no seeding, no deployment.
      </footer>
    </div>
  );
}
