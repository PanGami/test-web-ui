/**
 * About.tsx
 * Animations (all inside useReveal / useGSAP, cleaned up on unmount):
 *   1. SectionHeading: label fade, h2 rise, rule scaleX draw.
 *   2. Bio paragraphs: staggered fade + rise.
 *   3. Highlight numbers: count-up from 0 → target on first scroll-into-view.
 *      Uses gsap.to({ val }, { val: target, onUpdate }) so React state is
 *      never touched — the DOM span is mutated directly (no re-render overhead).
 *   4. Highlight labels: fade up.
 *
 * Count-up is disabled in reduced-motion mode (numbers just fade in).
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/registerGsap";
import { revealHeading, revealFrom } from "../animations/reveal";
import { about } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./About.module.css";

// Register useGSAP once at module level (safe to call multiple times)
gsap.registerPlugin(useGSAP);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  // One ref per highlight number span, indexed to match about.highlights
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Query heading elements by data attribute (no CSS-module class leakage)
      const labelEl  = section.querySelector<Element>("[data-heading-label]")!;
      const titleEl  = section.querySelector<Element>("[data-heading-title]")!;
      const ruleEl   = section.querySelector<Element>("[data-heading-rule]")!;
      const paras    = section.querySelectorAll<Element>("[data-about-para]");
      const location = section.querySelector<Element>("[data-about-location]")!;
      const highlights = section.querySelectorAll<Element>("[data-about-highlight]");

      const mm = gsap.matchMedia();

      mm.add(
        {
          full:    "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { full } = ctx.conditions as { full: boolean };
          const rm = !full;

          // 1. Section heading
          revealHeading(labelEl, titleEl, ruleEl, section, rm);

          // 2. Bio paragraphs + location — stagger 0.08s
          revealFrom([...Array.from(paras), location], section, {
            stagger: 0.08,
            reducedMotion: rm,
          });

          // 3. Highlight blocks fade up
          revealFrom(Array.from(highlights), section, {
            y: 16,
            stagger: 0.1,
            start: "top 80%",
            reducedMotion: rm,
          });

          // 4. Count-up — runs only in full-motion mode
          if (!rm) {
            about.highlights.forEach((h, i) => {
              const span = numberRefs.current[i];
              if (!span) return;

              // Use an intermediate object so GSAP can tween a number value.
              // onUpdate writes directly to the DOM — zero React re-renders.
              const counter = { val: 0 };
              gsap.to(counter, {
                val: h.value,
                duration: 1.2,
                ease: "power2.out",
                // Count-up fires once the highlight block enters view
                scrollTrigger: {
                  trigger: span,
                  start: "top 85%",
                  once: true,
                },
                onUpdate() {
                  // Round to integer; suffix is rendered as static JSX
                  span.textContent = String(Math.round(counter.val));
                },
              });
            });
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section id="about" ref={sectionRef} aria-label="About Panca">
      <div className="container">
        <SectionHeading label="About" title="Who I am" />

        <div className={styles.grid}>
          {/* Biography + location */}
          <div className={styles.body}>
            {about.body.map((para, i) => (
              <p key={i} className={styles.paragraph} data-about-para="">
                {para}
              </p>
            ))}
            <p className={styles.location} data-about-location="">{about.location}</p>
          </div>

          {/* Highlight numbers */}
          <div className={styles.highlights}>
            {about.highlights.map((h, i) => (
              <div key={i} className={styles.highlight} data-about-highlight="">
                {/*
                  The span holds the animated number text.
                  ref callback populates numberRefs so the count-up tween
                  can write directly to the DOM node.
                */}
                <div className={styles.number}>
                  <span
                    ref={(el) => { numberRefs.current[i] = el; }}
                    aria-label={`${h.value}${h.suffix}`}
                  >
                    {h.value}
                  </span>
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
