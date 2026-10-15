/**
 * Hero.tsx
 * Full-viewport hero section.
 *
 * Exposes a ref (forwardRef) to the section root so the master entrance
 * timeline in App.tsx can scope its GSAP selectors inside it.
 *
 * Data attributes used by the animation (no CSS-module class leakage):
 *   [data-hero-title]    — the h1 container whose children are line-inners
 *   [data-hero-meta]     — the right-column wrapper (job title, tagline, CTA)
 *   [data-hero-scroll]   — the scroll hint row
 *
 * No-JS / reduced-motion fallback:
 *   All elements have full visibility in CSS. GSAP hides them via gsap.set()
 *   synchronously on mount before the first paint, then reveals them in the
 *   timeline. If JS never runs, everything is already visible.
 */

import { forwardRef } from "react";
import { hero } from "../data/content";
import styles from "./Hero.module.css";

const Hero = forwardRef<HTMLElement>(function Hero(_props, ref) {
  return (
    <section
      ref={ref}
      id="hero"
      className={styles.section}
      aria-label="Introduction"
    >
      <div className="container">
        <div className={styles.inner}>
          {/* h1 — splitLines.ts will replace its children with line-mask spans */}
          <h1 className={styles.title} data-hero-title="">
            {hero.name}
          </h1>

          {/* Right column */}
          <div className={styles.meta} data-hero-meta="">
            <p className={styles.jobTitle}>{hero.title}</p>
            <p className={styles.tagline}>{hero.tagline}</p>
            <a href={hero.cta.href} className={styles.cta}>
              {hero.cta.label}
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint} aria-hidden="true" data-hero-scroll="">
          <span className={styles.scrollLine} />
          <span>{hero.scrollHint}</span>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
