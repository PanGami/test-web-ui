/**
 * Contact.tsx
 * Animations:
 *   1. SectionHeading: label fade, h2 rise, rule draw.
 *   2. Body paragraph: fades up.
 *   3. Contact links: staggered fade + rise.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/registerGsap";
import { revealHeading, revealFrom } from "../animations/reveal";
import { contact } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Contact.module.css";

gsap.registerPlugin(useGSAP);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const labelEl = section.querySelector<Element>("[data-heading-label]")!;
      const titleEl = section.querySelector<Element>("[data-heading-title]")!;
      const ruleEl  = section.querySelector<Element>("[data-heading-rule]")!;
      const bodyEl  = section.querySelector<Element>("[data-contact-body]")!;
      const links   = section.querySelectorAll<Element>("[data-contact-link]");

      const mm = gsap.matchMedia();
      mm.add(
        { full: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const rm = !(ctx.conditions as { full: boolean }).full;

          revealHeading(labelEl, titleEl, ruleEl, section, rm);

          revealFrom(bodyEl, section, {
            y: 16,
            start: "top 85%",
            reducedMotion: rm,
          });

          revealFrom(Array.from(links), section, {
            y: 24,
            stagger: 0.1,
            start: "top 85%",
            reducedMotion: rm,
          });
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section id="contact" ref={sectionRef} aria-label="Contact information">
      <div className="container">
        <SectionHeading label="Contact" title="Get in touch" />

        <div className={styles.inner}>
          <p className={styles.body} data-contact-body="">{contact.body}</p>

          <div className={styles.links}>
            {/* Email */}
            <a
              href={`mailto:${contact.email}`}
              className={styles.link}
              aria-label={`Send email to ${contact.email}`}
              data-contact-link=""
            >
              <span className={styles.linkLabel}>Email</span>
              <span className={styles.linkValue}>{contact.email}</span>
            </a>

            {/* LinkedIn */}
            <a
              href={contact.linkedin}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Panca's LinkedIn profile (opens in new tab)"
              data-contact-link=""
            >
              <span className={styles.linkLabel}>LinkedIn</span>
              <span className={styles.linkValue}>panca-nugraha-wicaksana</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
