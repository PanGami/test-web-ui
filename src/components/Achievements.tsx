/**
 * Achievements.tsx
 * Animations:
 *   1. SectionHeading: label fade, h2 rise, rule draw.
 *   2. Certificate rows: staggered fade + rise (each row as it enters).
 *   3. "View all" link: fades up after rows.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/registerGsap";
import { revealHeading, revealFrom } from "../animations/reveal";
import { achievements, certificatesLink } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Achievements.module.css";

gsap.registerPlugin(useGSAP);

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const labelEl  = section.querySelector<Element>("[data-heading-label]")!;
      const titleEl  = section.querySelector<Element>("[data-heading-title]")!;
      const ruleEl   = section.querySelector<Element>("[data-heading-rule]")!;
      const rows     = section.querySelectorAll<Element>("[data-achievement-row]");
      const viewAll  = section.querySelector<Element>("[data-achievement-viewall]")!;

      const mm = gsap.matchMedia();
      mm.add(
        { full: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const rm = !(ctx.conditions as { full: boolean }).full;

          revealHeading(labelEl, titleEl, ruleEl, section, rm);

          // Rows stagger in — each row triggers itself so long lists
          // animate progressively as the user scrolls, not all at once
          revealFrom(Array.from(rows), section, {
            y: 16,
            stagger: 0.06,
            start: "top 85%",
            reducedMotion: rm,
          });

          // "View all" link fades in after the list
          revealFrom(viewAll, section, {
            y: 12,
            start: "top 90%",
            reducedMotion: rm,
          });
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section id="achievements" ref={sectionRef} aria-label="Achievements and certificates">
      <div className="container">
        <SectionHeading label="Achievements" title="Certificates &amp; recognition" />

        <ul className={styles.list} aria-label="Certificate and award list">
          {achievements.map((item, i) => {
            const hasTodo = item.date.includes("TODO") || item.issuer.includes("TODO");
            return (
              <li key={i} className={styles.row} data-achievement-row="">
                <div>
                  <p className={styles.title}>{item.title}</p>
                  {hasTodo && (
                    <span className={styles.todoMark} aria-label="Incomplete — fill in before launch">
                      TODO
                    </span>
                  )}
                </div>
                <div className={styles.meta}>
                  <span className={styles.issuer}>{item.issuer}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <a
          href={certificatesLink}
          className={styles.viewAll}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View all certificates on Google Drive (opens in new tab)"
          data-achievement-viewall=""
        >
          View all 50+ certificates
        </a>
      </div>
    </section>
  );
}
