/**
 * App.tsx — Root component and master entrance timeline.
 *
 * ── Why the timeline lives here ──────────────────────────────────────────────
 * The Preloader and Hero are siblings, so neither can "own" the combined
 * timeline. App.tsx holds refs to both and drives the full sequence in one
 * GSAP context, which means a single cleanup on unmount and no cross-component
 * state sharing.
 *
 * ── FOUC prevention strategy ─────────────────────────────────────────────────
 * CSS leaves all hero elements fully visible (no-JS fallback).
 * The very first thing useGSAP does is `gsap.set(targets, { autoAlpha: 0 })`,
 * which fires synchronously during the same React commit that mounted the DOM,
 * before the browser has a chance to paint. The timeline then reveals each
 * element in order. If JS is disabled, the CSS-visible state is what the user
 * sees — correct content, no blank screen.
 *
 * ── Reduced-motion handling ───────────────────────────────────────────────────
 * gsap.matchMedia() runs two contexts:
 *   "(prefers-reduced-motion: no-preference)" → full animation
 *   "(prefers-reduced-motion: reduce)"        → instant fade-in only (0.3s)
 * Both contexts share the same cleanup lifecycle via useGSAP.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "./animations/registerGsap";
import { splitIntoLines } from "./animations/splitLines";
import {
  EASE_ENTER,
  EASE_TRANSITION,
  DUR_ENTRANCE,
  DUR_FAST,
} from "./animations/registerGsap";

// Global styles
import "./styles/tokens.css";
import "./styles/base.css";

// Components
import Nav from "./components/Nav";
import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Register @gsap/react so useGSAP works
gsap.registerPlugin(useGSAP);

export default function App() {
  // Refs to the two components the entrance timeline touches
  const preloaderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // ── Refresh ScrollTrigger once fonts are stable ─────────────────────
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      // ── Grab elements ────────────────────────────────────────────────────
      const overlay = preloaderRef.current;
      const heroSection = heroRef.current;
      if (!overlay || !heroSection) return;

      const nameEl = overlay.querySelector<HTMLElement>("[data-preloader-name]")!;
      const titleEl = heroSection.querySelector<HTMLElement>("[data-hero-title]")!;
      const metaEl = heroSection.querySelector<HTMLElement>("[data-hero-meta]")!;
      const scrollHintEl = heroSection.querySelector<HTMLElement>("[data-hero-scroll]")!;

      // ── Split the h1 into line-mask spans ────────────────────────────────
      // Must happen before we hide the lines, so measurements are correct.
      const { lines, cleanup: cleanupSplit } = splitIntoLines(titleEl);

      // ── gsap.matchMedia: two motion contexts ─────────────────────────────
      const mm = gsap.matchMedia();

      mm.add(
        {
          // Full animation — user has no motion preference set
          full: "(prefers-reduced-motion: no-preference)",
          // Reduced animation — user requested less motion
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { full } = context.conditions as { full: boolean; reduced: boolean };

          if (full) {
            // ── FOUC prevention: hide everything before first paint ─────────
            // autoAlpha = { opacity: 0, visibility: hidden }
            // This fires synchronously during the commit phase.
            gsap.set(overlay, { autoAlpha: 1 }); // overlay starts hidden in CSS; make it visible immediately
            gsap.set(nameEl, { autoAlpha: 0, y: 8 });
            gsap.set(lines, { y: "110%" }); // line-inners start below their overflow-hidden masks
            gsap.set(metaEl, { autoAlpha: 0, y: 24 });
            gsap.set(scrollHintEl, { autoAlpha: 0, y: 16 });

            // ── Master entrance timeline ─────────────────────────────────────
            // Total: ~1.15s preloader + 0.7s overlap into hero = ~1.9s total
            //
            // Step 1 | t=0.00 → t=0.50 | Preloader name fades + rises in (0.5s)
            // Step 2 | t=0.65 → t=1.35 | Preloader name wipes up and out (0.7s)
            //                            Hero entrance begins at t=1.05 (70% overlap)
            // Step 3 | t=1.05 → t=1.95 | H1 lines slide in from y:110% (0.8s + stagger 0.1s)
            // Step 4 | t=1.35 → t=2.00 | Overlay fades out (0.3s)
            //                            (overlay is gone before hero finishes — clean handoff)
            // Step 5 | t=1.55 → t=2.15 | Meta block fades up (0.6s, starts after first line)
            // Step 6 | t=1.95 → t=2.55 | Scroll hint fades up (0.6s, after last line)
            const tl = gsap.timeline({ defaults: { ease: EASE_ENTER } });

            // Step 1 — preloader name reveal
            tl.to(nameEl, {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: EASE_ENTER,
            });

            // Step 2 — name wipes up (exits view upward).
            // The tween position "+=0.15" starts 0.15s after step 1 ends.
            // We label that exact start moment "preloaderOut" for downstream offsets.
            tl.to(
              nameEl,
              {
                y: "-120%",
                autoAlpha: 0,
                duration: 0.7,
                ease: EASE_TRANSITION,
              },
              "+=0.15" // 0.15s hold after name appears
            );
            // Label placed at the START of step 2 (current end-of-step1 + 0.15s)
            tl.addLabel("preloaderOut", "<"); // "<" = start of previous tween = step 2 start

            // Step 3 — H1 line-by-line reveal.
            // Hero entrance begins at 70% overlap: preloaderOut+0.3
            // (0.3s into the 0.7s wipe-out = 43% into step 2, giving generous overlap)
            tl.to(
              lines,
              {
                y: "0%",
                duration: DUR_ENTRANCE,        // 0.8s per line
                stagger: 0.1,                  // spec: 0.1s between lines
                ease: EASE_ENTER,
              },
              "preloaderOut+=0.3" // explicit label-relative position
            );
            // Label the moment lines start for downstream offsets
            tl.addLabel("linesStart", "preloaderOut+=0.3");

            // Step 4 — overlay fades out once the first two lines are visible
            tl.to(
              overlay,
              {
                autoAlpha: 0,
                duration: 0.35,
                ease: "power2.inOut",
              },
              "linesStart+=0.4" // 0.4s after lines begin — overlay is gone cleanly
            );

            // Step 5 — meta block (job title + tagline + CTA) fades up
            tl.to(
              metaEl,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR_FAST,            // 0.6s
                ease: EASE_ENTER,
              },
              "linesStart+=0.35" // slightly after lines start, overlaps nicely
            );

            // Step 6 — scroll hint fades up last, after all lines have settled
            tl.to(
              scrollHintEl,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR_FAST,
                ease: EASE_ENTER,
              },
              "linesStart+=0.85" // after the last line (DUR_ENTRANCE + stagger * n_lines)
            );
          } else {
            // ── Reduced-motion path ─────────────────────────────────────────
            // Skip preloader entirely. Fade in hero content in 0.3s.
            gsap.set(overlay, { autoAlpha: 0, display: "none" }); // remove preloader
            gsap.set([lines, metaEl, scrollHintEl], { autoAlpha: 0 });

            gsap.to([lines, metaEl, scrollHintEl], {
              autoAlpha: 1,
              duration: 0.3,
              stagger: 0.04,
              ease: "none",
            });
          }

          // Return cleanup: restore the split DOM when context is killed
          return () => {
            cleanupSplit();
          };
        }
      );
    },
    { dependencies: [] } // run once on mount; refs are stable
  );

  return (
    <>
      {/* Skip to main content — first focusable element for keyboard users */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Preloader ref={preloaderRef} />
      <Nav />

      <main id="main-content">
        <Hero ref={heroRef} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
