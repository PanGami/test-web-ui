/**
 * Hero.tsx
 * Full-viewport hero section.
 * Static markup — GSAP line-mask reveal and scroll hint animation added in Stage 3.
 *
 * Layout:
 *   - Left col: large h1 display name
 *   - Right col (md+): job title, tagline, CTA
 *   - Scroll hint at the bottom
 */

import { hero } from "../data/content";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.section} aria-label="Introduction">
      <div className="container">
        <div className={styles.inner}>
          {/* Display name — split into lines by GSAP in Stage 3 */}
          <h1 className={styles.title}>{hero.name}</h1>

          {/* Right column: role + tagline + CTA */}
          <div className={styles.meta}>
            <p className={styles.jobTitle}>{hero.title}</p>
            <p className={styles.tagline}>{hero.tagline}</p>
            <a href={hero.cta.href} className={styles.cta}>
              {hero.cta.label}
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span>{hero.scrollHint}</span>
        </div>
      </div>
    </section>
  );
}
