/**
 * reveal.ts
 * Shared ScrollTrigger reveal factory.
 * Call `revealFrom(targets, trigger)` to attach a "fade + rise" entrance
 * animation to any element. Used by every section component.
 *
 * Why these values:
 *  - y: 24 keeps movement tight enough to feel precise, not floaty.
 *  - start "top 85%" fires early so elements are already animating by the
 *    time they reach the visual center, which feels natural on mobile.
 *  - once: true prevents re-triggering on scroll-up (cleaner UX).
 */

import { gsap, EASE_ENTER, DUR_ENTRANCE, STAGGER } from "./registerGsap";

export type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  delay?: number;
};

/**
 * Creates a ScrollTrigger-powered reveal for `targets`.
 * `scope` should be the component's container ref (passed from useGSAP).
 */
export function revealFrom(
  targets: gsap.TweenTarget,
  triggerEl: Element,
  opts: RevealOptions = {}
): gsap.core.Tween {
  const {
    y = 24,
    duration = DUR_ENTRANCE,
    stagger = STAGGER,
    start = "top 85%",
    delay = 0,
  } = opts;

  return gsap.from(targets, {
    autoAlpha: 0, // sets visibility:hidden + opacity:0 before play (prevents FOUC)
    y,
    duration,
    stagger,
    delay,
    ease: EASE_ENTER,
    scrollTrigger: {
      trigger: triggerEl,
      start,
      once: true, // fire once; no re-animation on scroll-up
    },
  });
}
