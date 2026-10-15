/**
 * Projects.tsx
 * Animations:
 *   1. SectionHeading: label fade, h2 rise, rule draw.
 *   2. Cards: staggered fade + rise, triggered on the grid container.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/registerGsap";
import { revealHeading, revealFrom } from "../animations/reveal";
import { projects } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Projects.module.css";

gsap.registerPlugin(useGSAP);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const labelEl = section.querySelector<Element>("[data-heading-label]")!;
      const titleEl = section.querySelector<Element>("[data-heading-title]")!;
      const ruleEl  = section.querySelector<Element>("[data-heading-rule]")!;
      const cards   = section.querySelectorAll<Element>("[data-project-card]");

      const mm = gsap.matchMedia();
      mm.add(
        { full: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const rm = !(ctx.conditions as { full: boolean }).full;

          revealHeading(labelEl, titleEl, ruleEl, section, rm);

          // Cards stagger in as the grid enters view
          revealFrom(Array.from(cards), section, {
            y: 32,
            stagger: 0.08,
            start: "top 80%",
            reducedMotion: rm,
          });
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section id="projects" ref={sectionRef} aria-label="Selected projects">
      <div className="container">
        <SectionHeading label="Work" title="Selected projects" />

        <div className={styles.grid}>
          {projects.map((project, i) => {
            const isTodo = project.title.startsWith("TODO");
            return (
              <article
                key={i}
                className={styles.card}
                aria-label={project.title}
                data-project-card=""
              >
                <span className={styles.cardNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className={styles.cardTitle}>{project.title}</h3>

                {isTodo && (
                  <span className={styles.todo} aria-label="Placeholder — replace with real project">
                    TODO
                  </span>
                )}

                <p className={styles.cardProblem}>{project.problem}</p>

                <p className={styles.cardRole}>{project.role}</p>

                <div className={styles.stack} aria-label="Technology stack">
                  {project.stack.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title}`}
                  >
                    View project
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
