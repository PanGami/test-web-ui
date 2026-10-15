/**
 * About.tsx
 * Two-column section: biography on the left, highlight numbers on the right.
 * Count-up animation on the numbers is added in Stage 3.
 */

import { about } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" aria-label="About Panca">
      <div className="container">
        <SectionHeading label="About" title="Who I am" />

        <div className={styles.grid}>
          {/* Biography + location */}
          <div className={styles.body}>
            {about.body.map((para, i) => (
              <p key={i} className={styles.paragraph}>
                {para}
              </p>
            ))}
            <p className={styles.location}>{about.location}</p>
          </div>

          {/* Highlight numbers */}
          <div className={styles.highlights}>
            {about.highlights.map((h, i) => (
              <div key={i} className={styles.highlight}>
                <div className={styles.number}>
                  {h.value}
                  {h.suffix}
                </div>
                <span className={styles.highlightLabel}>{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
