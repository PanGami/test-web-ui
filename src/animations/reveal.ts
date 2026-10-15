/**
 * reveal.ts
 * Shared ScrollTrigger reveal helpers used by every section component.
 *
 * Two exported functions:
 *
 *   revealFrom(targets, triggerEl, opts?)
 *     Fade + translateY entrance. Use for body content, cards, rows, etc.
 *     Animates: autoAlpha 0→1, y offset→0.
 *     Using gsap.from() means GSAP sets the start state (autoAlpha:0)
 *     immediately when the tween is created — before ScrollTrigger fires —
 *     so below-fold elements are hidden at mount without any CSS hack.
 *
 *   revealHeading(labelEl, titleEl, ruleEl, triggerEl)
 *     Per spec §6: label fades, rule draws (scaleX 0→1, origin left),
 *     h2 fades up. All staggered in a tight timeline.
 *
 * Both respect prefers-reduced-motion via the `reducedMotion` flag:
 *   pass true → skip y movement, use short 0.3s fade only.
 *
 * Why once:true — re-triggering on scroll-up would feel janky on a
 * portfolio where the recruiter scrolls freely.
 */

import { gsap, EASE_ENTER, DUR_ENTRANCE, STAGGER } from "./registerGsap";

export type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  delay?: number;
  reducedMotion?: boolean;
};

/**
 * Fade + rise reveal, driven by ScrollTrigger.
 * Returns the tween so callers can add it to a timeline if needed.
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
    reducedMotion = false,
  } = opts;

  return gsap.from(targets, {
    autoAlpha: 0,
    y: reducedMotion ? 0 : y,       // no movement in reduced-motion mode
    duration: reducedMotion ? 0.3 : duration,
    stagger: reducedMotion ? 0 : stagger,
    delay,
    ease: reducedMotion ? "none" : EASE_ENTER,
    scrollTrigger: {
      trigger: triggerEl,
      start,
      once: true,
    },
  });
}

/**
 * Section heading animation per Motion Spec §6:
 *   1. Label fades in             (autoAlpha 0→1, y:8→0)
 *   2. H2 fades up simultaneously (autoAlpha 0→1, y:16→0)
 *   3. Rule draws left→right      (scaleX 0→1, transformOrigin "left center")
 *
 * Returns the timeline so callers can sequence after it.
 */
export function revealHeading(
  labelEl: Element,
  titleEl: Element,
  ruleEl: Element,
  triggerEl: Element,
  reducedMotion = false
): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 85%",
      once: true,
    },
  });

  if (reducedMotion) {
    // Simple fade-in only — no movement, no scaleX
    tl.from([labelEl, titleEl, ruleEl], {
      autoAlpha: 0,
      duration: 0.3,
      stagger: 0,
      ease: "none",
    });
    return tl;
  }

  // Label fades in first
  tl.from(labelEl, {
    autoAlpha: 0,
    y: 8,
    duration: DUR_ENTRANCE * 0.75,   // 0.6s — label is small, faster feels right
    ease: EASE_ENTER,
  });

  // H2 rises up, overlapping the label by 0.1s
  tl.from(
    titleEl,
    {
      autoAlpha: 0,
      y: 16,
      duration: DUR_ENTRANCE,        // 0.8s
      ease: EASE_ENTER,
    },
    `-=${DUR_ENTRANCE * 0.5}`        // overlap: start 0.4s after label begins
  );

  // Rule draws across left→right after h2 starts
  tl.from(
    ruleEl,
    {
      scaleX: 0,
      transformOrigin: "left center",
      duration: DUR_ENTRANCE,        // 0.8s
      ease: EASE_ENTER,
    },
    `-=${DUR_ENTRANCE * 0.5}`        // overlaps h2
  );

  return tl;
}

/**
 * Convenience: stagger reveal a NodeList or array of elements,
 * each triggered individually as they enter the viewport.
 * Good for lists of rows (Achievements) or cards (Projects).
 */
export function revealList(
  items: Element[],
  triggerEl: Element,
  opts: RevealOptions = {}
): gsap.core.Tween {
  return revealFrom(items, triggerEl, {
    stagger: opts.stagger ?? STAGGER,
    ...opts,
  });
}
