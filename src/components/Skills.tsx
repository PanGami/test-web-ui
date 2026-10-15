/**
 * Skills.tsx
 * Animations:
 *   1. SectionHeading: label fade, h2 rise, rule draw.
 *   2. Skill groups: staggered fade + rise as the grid enters view.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/registerGsap";
import { revealHeading, revealFrom } from "../animations/reveal";
import { skills } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Skills.module.css";

gsap.registerPlugin(useGSAP);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const labelEl = section.querySelector<Element>("[data-heading-label]")!;
      const titleEl = section.querySelector<Element>("[data-heading-title]")!;
      const ruleEl  = section.querySelector<Element>("[data-heading-rule]")!;
      const groups  = section.querySelectorAll<Element>("[data-skill-group]");

      const mm = gsap.matchMedia();
      mm.add(
        { full: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const rm = !(ctx.conditions as { full: boolean }).full;

          revealHeading(labelEl, titleEl, ruleEl, section, rm);

          // Skill groups fade + rise in with a gentle stagger
          revealFrom(Array.from(groups), section, {
            y: 20,
            stagger: 0.06,
            start: "top 85%",
            reducedMotion: rm,
          });
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section id="skills" ref={sectionRef} aria-label="Technical skills">
      <div className="container">
        <SectionHeading label="Skills" title="What I work with" />

        <div className={styles.grid} role="list" aria-label="Skill groups">
          {skills.map((group) => (
            <div
              key={group.label}
              className={styles.group}
              role="listitem"
              data-skill-group=""
            >
              <span className={styles.groupLabel}>{group.label}</span>
              <ul className={styles.items} aria-label={group.label}>
                {group.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
