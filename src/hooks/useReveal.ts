/**
 * useReveal.ts
 * Thin wrapper that combines useGSAP + gsap.matchMedia + reveal helpers
 * into a single hook. Each section component calls this once.
 *
 * Usage:
 *   const { sectionRef } = useReveal((rm) => {
 *     revealHeading(labelEl, h2El, ruleEl, sectionEl, rm);
 *     revealFrom(bodyEls, sectionEl, { stagger: 0.08, reducedMotion: rm });
 *   });
 *
 * The callback receives `reducedMotion: boolean` from matchMedia so the
 * caller can pass it down to reveal helpers without any extra hook calls.
 *
 * Cleanup: useGSAP kills all tweens + ScrollTriggers in the context on
 * unmount automatically.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/registerGsap";

type SetupFn = (reducedMotion: boolean) => void;

export function useReveal<T extends HTMLElement = HTMLElement>(setup: SetupFn) {
  const sectionRef = useRef<T>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      // matchMedia creates two contexts; GSAP reverts the inactive one
      // automatically when the media query changes (e.g. user toggles OS setting).
      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { full } = ctx.conditions as { full: boolean };
          setup(!full); // reducedMotion = !full
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return { sectionRef };
}
