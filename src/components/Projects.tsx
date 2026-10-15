/**
 * Projects.tsx — Pinned horizontal gallery (desktop) / snap-scroll (mobile).
 *
 * ── How the pin/end distance is computed ─────────────────────────────────────
 * The track contains N slides, each 100vw wide.
 * Total track width = N × 100vw.
 * Distance to scroll = track.scrollWidth − window.innerWidth
 *   (this is exactly how many pixels the track must move leftward so that
 *    slide N's left edge is flush with the viewport left edge).
 * Both `x` and `end` are function-based so they re-run on resize (via
 * invalidateOnRefresh:true), keeping the gallery correct at any window width.
 *
 * ── Window resize ────────────────────────────────────────────────────────────
 * invalidateOnRefresh:true tells ScrollTrigger to call the function-based
 * values again after a resize+refresh cycle. GSAP also re-pins after resize.
 * The `<img>` elements have explicit width/height attributes (1600×1000)
 * so the browser reserves their space before they load, preventing layout
 * shift that would corrupt ScrollTrigger's measurements.
 *
 * ── Jank risks ───────────────────────────────────────────────────────────────
 * 1. Parallax (containerAnimation): each image moves at 92% of track speed,
 *    which creates an 8% lag. We use will-change:transform only on the
 *    image elements in gallery mode. If jank is observed, set PARALLAX_FACTOR=0.
 * 2. The pin spacer height = scrollWidth − innerWidth. For 3 slides at 1440px
 *    that's ~2880px of extra scroll space inserted above the next section.
 *    Sections below recompute their ScrollTrigger start positions via
 *    ScrollTrigger.refresh() (already called in App.tsx on fonts.ready and
 *    here again after all images load).
 * 3. `scrub:0.8` provides a 0.8s lag — enough to feel weighty without
 *    being sluggish.
 *
 * ── Cleanup ──────────────────────────────────────────────────────────────────
 * useGSAP's context kills all tweens, ScrollTriggers, and matchMedia
 * listeners when the component unmounts or when HMR hot-replaces the module.
 * The galleryMode class is also removed via the context's revert callback.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../animations/registerGsap";
import { projects } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Projects.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Parallax shift: images move at (1 - PARALLAX_FACTOR) × track speed.
// Set to 0 to disable parallax entirely.
const PARALLAX_FACTOR = 0.08;

export default function Projects() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const fillRef     = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track   = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          // Gallery only when viewport is wide enough AND user is OK with motion
          gallery: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          // Everything else → snap-scroll fallback
          snap: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { gallery } = ctx.conditions as { gallery: boolean };

          if (gallery) {
            // ── Activate gallery CSS overrides via class ──────────────────────
            section.classList.add(styles.galleryMode);

            // ── Parallax: prep image will-change ─────────────────────────────
            const images = track.querySelectorAll<HTMLElement>("[data-slide-img]");
            if (PARALLAX_FACTOR > 0) {
              images.forEach((img) => {
                img.style.willChange = "transform";
              });
            }

            // ── Main horizontal-scrub tween ───────────────────────────────────
            // x() and end() are functions → re-evaluated on invalidateOnRefresh.
            // ease:"none" is mandatory for a 1:1 scrub mapping.
            const mainTween = gsap.to(track, {
              x: () => -(track.scrollWidth - window.innerWidth),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 0.8,
                start: "top top",
                // end distance = total pixels the track must travel
                end: () => "+=" + (track.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate(self) {
                  // ── Counter ───────────────────────────────────────────────
                  // progress 0→1 maps to slide 1→N
                  const slideCount = projects.length;
                  const current = Math.min(
                    slideCount,
                    Math.floor(self.progress * slideCount) + 1
                  );
                  if (counterRef.current) {
                    counterRef.current.textContent =
                      String(current).padStart(2, "0") +
                      " / " +
                      String(slideCount).padStart(2, "0");
                  }
                  // ── Progress fill (transform only) ────────────────────────
                  if (fillRef.current) {
                    gsap.set(fillRef.current, {
                      scaleX: self.progress,
                      transformOrigin: "left center",
                    });
                  }
                },
              },
            });

            // ── Subtle parallax on images ─────────────────────────────────────
            // Each image moves slightly slower than the track.
            // We use containerAnimation so GSAP knows this tween is inside the
            // pinned scroll and syncs timing correctly — no separate trigger.
            if (PARALLAX_FACTOR > 0 && images.length > 0) {
              const totalDrift = (track.scrollWidth - window.innerWidth) * PARALLAX_FACTOR;
              gsap.to(Array.from(images), {
                x: () => totalDrift / images.length, // each image drifts proportionally
                ease: "none",
                scrollTrigger: {
                  containerAnimation: mainTween,  // sync with the main pin
                  trigger: track,
                  start: "left left",
                  end: "right right",
                  scrub: true,
                },
              });
            }

            // ── Refresh after images load (prevents wrong pin height) ─────────
            const imgs = section.querySelectorAll<HTMLImageElement>("img");
            let loaded = 0;
            const total = imgs.length;
            if (total === 0) return;
            imgs.forEach((img) => {
              if (img.complete) {
                loaded++;
                if (loaded === total) ScrollTrigger.refresh();
              } else {
                img.addEventListener("load", () => {
                  loaded++;
                  if (loaded === total) ScrollTrigger.refresh();
                }, { once: true });
              }
            });

            // ── Cleanup callback (runs on context revert) ─────────────────────
            return () => {
              section.classList.remove(styles.galleryMode);
              images.forEach((img) => { img.style.willChange = ""; });
            };

          } else {
            // ── Fallback: snap-scroll mode ────────────────────────────────────
            // No animation, just keyboard-friendly native scroll.
            // Ensure gallery class is not present (handles HMR edge case).
            section.classList.remove(styles.galleryMode);
          }
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={styles.section}
      aria-label="Selected projects"
    >
      {/*
        Fallback heading — only visible in snap-scroll mode.
        In gallery mode this is hidden via .galleryMode .fallbackHeading { display:none }.
      */}
      <div className={styles.fallbackHeading}>
        <SectionHeading label="Work" title="Selected projects" />
      </div>

      {/* Horizontal track — GSAP translates this in gallery mode */}
      <div ref={trackRef} className={styles.track} role="region" aria-label="Project slides">
        <ul style={{ display: "contents" }}>
          {projects.map((project, i) => {
            const isTodo = project.title.startsWith("TODO");
            const num = String(i + 1).padStart(2, "0");
            const total = String(projects.length).padStart(2, "0");

            return (
              <li
                key={i}
                className={styles.slide}
                // Slides are focusable for keyboard navigation
                tabIndex={0}
                aria-label={`Project ${num} of ${total}: ${project.title}`}
              >
                {/* Image */}
                <div className={styles.imageWrap}>
                  <img
                    src={project.image ?? "/placeholders/project-01.svg"}
                    alt={
                      isTodo
                        ? "Placeholder image — replace when project is added"
                        : `Screenshot of ${project.title}`
                    }
                    className={styles.slideImage}
                    width="1600"
                    height="1000"
                    loading="lazy"
                    data-slide-img=""
                  />
                </div>

                {/* Slide content */}
                <div className={styles.slideContent}>
                  <div className={styles.slideLeft}>
                    <h3 className={styles.slideTitle}>
                      {isTodo ? (
                        <>
                          <span className={styles.todo}>TODO</span>{" "}
                          {project.title.replace("TODO: ", "")}
                        </>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className={styles.slideProblem}>{project.problem}</p>
                  </div>

                  <div className={styles.slideRight}>
                    <span className={styles.slideRole}>{project.role}</span>
                    <div className={styles.stack} aria-label="Technologies">
                      {project.stack.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        className={styles.slideLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} (opens in new tab)`}
                      >
                        View project
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/*
        Gallery footer: counter + progress line.
        aria-hidden — purely decorative progress indicator.
        Displayed only in gallery mode via CSS (.section.galleryMode .galleryFooter).
      */}
      <div className={styles.galleryFooter} aria-hidden="true">
        <span ref={counterRef} className={styles.counter}>
          01 / {String(projects.length).padStart(2, "0")}
        </span>
        <div className={styles.progressTrack}>
          <div ref={fillRef} className={styles.progressFill} />
        </div>
      </div>
    </section>
  );
}
