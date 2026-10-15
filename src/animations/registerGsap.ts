/**
 * registerGsap.ts
 * Register all GSAP plugins exactly once at app startup.
 * Import this module before any component that uses GSAP.
 *
 * GSAP 3.x requires plugin registration; doing it here keeps
 * every component clean and avoids duplicate registration warnings.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ── Global GSAP defaults ────────────────────────────────────────────────────
// These are the "house rules" every animation should follow.
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

// ── Named ease aliases ──────────────────────────────────────────────────────
// Use these constants in timeline code to stay consistent with the spec.
export const EASE_ENTER = "power3.out";
export const EASE_TRANSITION = "power2.inOut";
export const EASE_SCRUB = "none";
export const EASE_HOVER = "power2.out";

export const DUR_ENTRANCE = 0.8;
export const DUR_FAST = 0.6;
export const DUR_HOVER = 0.22;
export const STAGGER = 0.08;

export { gsap, ScrollTrigger, ScrollToPlugin };
