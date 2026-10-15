/**
 * Experience.tsx — Vertical timeline with scrubbed progress line.
 *
 * ── Animation logic ──────────────────────────────────────────────────────────
 *
 * 1. SECTION HEADING: label fade, h2 rise, rule scaleX draw (same as all sections).
 *
 * 2. PROGRESS LINE (desktop md+ only — the track column is `display:none` on mobile,
 *    but the ScrollTrigger still runs harmlessly):
 *    - Element: `.progressLine` div inside the sticky `.progressWrap`
 *    - Animation: scaleY 0 → 1, transform-origin top
 *    - Trigger: the `<ol>` items list (not the whole section) so the scrub
 *      maps 0% when the first item enters the viewport top, 100% when the
 *      last item exits the viewport bottom.
 *    - scrub: true (1:1, no lag) — physical ruler feel
 *    - ease: "none" — mandatory for scrub to feel linear
 *
 * 3. PER-ITEM ACTIVATION:
 *    - Each `<li>` starts at opacity 0.35 (set in CSS).
 *    - A separate ScrollTrigger per item scrubs opacity 0.35 → 1 as the item's
 *      center crosses the viewport center.
 *      start: "center center", end: "center center"
 *      scrub: true → reverses automatically on scroll-up. No separate reverse logic.
 *    - Mobile: same triggers, same opacity logic — the simplified single-column
 *      layout means items are taller so the center-crossing feels natural.
 *
 * 4. ITEM ENTRANCE (first reveal):
 *    - Each item also gets a one-time fade + rise via ScrollTrigger (once: true,
 *      start: "top 85%"). This gives the initial reveal; after that the scrub
 *      opacity takes over.
 *    - The entrance uses `autoAlpha` (visibility + opacity) so the item is
 *      properly hidden before it enters view.
 *
 * 5. REDUCED MOTION:
 *    - Skip scrub entirely. Items simply fade in (autoAlpha 0 → 1, once:true).
 *    - Progress line shown statically at full scaleY (handled in CSS).
 *
 * ── No pin ───────────────────────────────────────────────────────────────────
 * A pinned column is skipped per the spec note ("no pin unless perfectly smooth").
 * The sticky `.progressWrap` in CSS provides the visual effect of a line that
 * grows as the section scrolls — the GSAP scrub drives it.
 *
 * ── Education block ──────────────────────────────────────────────────────────
 * Shares the same `.layout` / `.track` structure and gets the same animations
 * (progress line + per-item activation) via a separate `setupTimeline()` call.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../animations/registerGsap";
import { revealHeading, revealFrom } from "../animations/reveal";
import { experience, education } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Experience.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          full:    "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { full } = ctx.conditions as { full: boolean };
          const rm = !full;

          // ── 1. Section heading reveal ───────────────────────────────────────
          const labelEl = section.querySelector<Element>("[data-heading-label]")!;
          const titleEl = section.querySelector<Element>("[data-heading-title]")!;
          const ruleEl  = section.querySelector<Element>("[data-heading-rule]")!;
          revealHeading(labelEl, titleEl, ruleEl, section, rm);

          // ── 2 & 3. Timeline for experience items ────────────────────────────
          const expLineEl = section.querySelector<HTMLElement>("[data-exp-line]");
          const expItems  = Array.from(
            section.querySelectorAll<HTMLElement>("[data-exp-item]")
          );
          const expList   = section.querySelector<HTMLElement>("[data-exp-list]");

          if (expLineEl && expList) {
            setupTimeline(expLineEl, expItems, expList, rm);
          }

          // ── 4. Education timeline ───────────────────────────────────────────
          const eduLineEl = section.querySelector<HTMLElement>("[data-edu-line]");
          const eduItems  = Array.from(
            section.querySelectorAll<HTMLElement>("[data-edu-item]")
          );
          const eduList   = section.querySelector<HTMLElement>("[data-edu-list]");

          if (eduLineEl && eduList) {
            setupTimeline(eduLineEl, eduItems, eduList, rm);
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section id="experience" ref={sectionRef} aria-label="Work experience">
      <div className="container">
        <SectionHeading label="Experience" title="Where I've worked" />

        <div className={styles.layout}>
          {/* Progress track — visible md+, aria-hidden */}
          <div className={styles.track} aria-hidden="true">
            <div className={styles.progressWrap}>
              {/* data-exp-line: GSAP scrubs scaleY on this element */}
              <div className={styles.progressLine} data-exp-line="" />
            </div>
          </div>

          {/* Timeline items */}
          <ol
            className={styles.items}
            aria-label="Work history"
            data-exp-list=""
          >
            {experience.map((job, i) => (
              <li key={i} className={styles.item} data-exp-item="">
                <div className={styles.itemMeta}>
                  <span className={styles.period}>{job.period}</span>
                  {job.duration && (
                    <span className={styles.period}>{job.duration}</span>
                  )}
                  <span className={styles.type}>{job.type}</span>
                </div>

                <div>
                  <h3 className={styles.role}>{job.role}</h3>
                  <p className={styles.company}>{job.company}</p>

                  <ul
                    className={styles.bullets}
                    aria-label={`Responsibilities at ${job.company}`}
                  >
                    {job.bullets.map((b, j) => (
                      <li key={j} className={styles.bullet}>{b}</li>
                    ))}
                  </ul>

                  <div className={styles.stack} aria-label="Technologies used">
                    {job.stack.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Education — shares the same layout and animation logic */}
        <div style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
          <SectionHeading label="Education" title="Academic background" />
          <div className={styles.layout}>
            <div className={styles.track} aria-hidden="true">
              <div className={styles.progressWrap}>
                {/* data-edu-line: separate progress line for the education block */}
                <div className={styles.progressLine} data-edu-line="" />
              </div>
            </div>
            <ol
              className={styles.items}
              aria-label="Education history"
              data-edu-list=""
            >
              {education.map((edu, i) => (
                <li key={i} className={styles.item} data-edu-item="">
                  <div className={styles.itemMeta}>
                    <span className={styles.period}>{edu.period}</span>
                  </div>
                  <div>
                    <h3 className={styles.role}>{edu.degree}</h3>
                    <p className={styles.company}>{edu.institution}</p>
                    <p className={styles.type}>{edu.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Sets up progress-line scrub + per-item activation for one timeline block
 * (shared between experience and education).
 *
 * @param lineEl   - the `.progressLine` div (scaleY scrub target)
 * @param items    - array of `<li>` elements
 * @param listEl   - the `<ol>` that wraps all items (used as trigger bounds)
 * @param rm       - reducedMotion flag
 */
function setupTimeline(
  lineEl: HTMLElement,
  items: HTMLElement[],
  listEl: HTMLElement,
  rm: boolean
): void {
  if (rm) {
    // ── Reduced-motion path ──────────────────────────────────────────────────
    // Items were set to opacity 0.35 in CSS. Fade them all to 1 immediately
    // on scroll-into-view (once, no scrub, no opacity ping-pong).
    revealFrom(items, listEl, {
      y: 0,           // no vertical movement in reduced-motion
      stagger: 0.06,
      start: "top 85%",
      reducedMotion: true,
    });
    // Note: progressLine is already scaleY(1) via the CSS @media rule — nothing to do.
    return;
  }

  // ── Full animation path ────────────────────────────────────────────────────

  // 2. Progress line: scrubs scaleY 0 → 1 across the full height of the list.
  //    ease:"none" is required for a 1:1 scrub — any other ease would make the
  //    line jump ahead or lag behind as the user scrolls.
  gsap.fromTo(
    lineEl,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: listEl,
        start: "top center",   // line begins drawing when list top hits viewport center
        end:   "bottom center",// line fully drawn when list bottom hits viewport center
        scrub: true,           // 1:1 mapping with scroll position (no lag)
      },
    }
  );

  // 3. Per-item activation: each item has its own scrub trigger.
  //    The item starts at opacity 0.35 (CSS default) and tweens to 1 when
  //    its center crosses the viewport center, then reverses on scroll-up.
  //
  //    Why fromTo instead of to:
  //    Using fromTo guarantees the start value (0.35) is enforced by GSAP
  //    even if CSS specificity or inheritance changes it.
  //
  //    Why scrub:true (not once:true):
  //    The spec says items should "activate" and "deactivate" as they cross
  //    the center. scrub:true handles the reverse automatically.
  items.forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0.35 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          // "center center" means: start AND end are both when the item's
          // center crosses the viewport's center — a single instant toggle.
          // scrub:true interpolates across the trigger's distance, but since
          // start===end the full transition happens at the crossing point.
          // To give a small scrub window (feels smoother), we use a 20vh range:
          start: "top 60%",    // begins brightening as item top passes 60% down
          end:   "top 40%",    // fully bright when item top is 40% down (near center)
          scrub: true,
        },
      }
    );
  });

  // 4. One-time entrance: items also get a single fade+rise on first appearance.
  //    autoAlpha hides items before they enter so there's no flash of the
  //    dimmed state. Once revealed, GSAP removes autoAlpha and the scrub
  //    opacity takes over cleanly.
  //
  //    Stagger staggers them by 0.06s so a long list doesn't all pop at once.
  gsap.from(items, {
    autoAlpha: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.06,
    ease: "power3.out",
    scrollTrigger: {
      trigger: listEl,
      start: "top 85%",
      once: true,
    },
  });
}
