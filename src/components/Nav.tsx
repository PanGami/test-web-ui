/**
 * Nav.tsx — Fixed navigation with GSAP animations.
 *
 * ── Hide-on-scroll-down / show-on-scroll-up ───────────────────────────────────
 * Uses a single ScrollTrigger with onEnterBack / onLeave callbacks to translate
 * the nav -100% (hide) and 0% (show). A small threshold (100px) prevents the
 * nav from hiding on tiny scroll jitter at the top.
 *
 * Not hidden when: the mobile menu is open (closing the menu would disorient
 * the user if the nav snaps back mid-animation).
 *
 * ── Active indicator (GSAP scaleX) ────────────────────────────────────────────
 * Each nav link has a `::after` pseudo-element. When the active section changes,
 * GSAP tweens the outgoing link's scaleX 1→0 (0.3s power3.out) then the
 * incoming link's scaleX 0→1 (0.4s power3.out). This is more reliable than
 * measuring absolute pixel positions to move a single indicator bar, which
 * would break on resize.
 *
 * ── Smooth-scroll anchors ─────────────────────────────────────────────────────
 * Anchor `<a href="#id">` clicks are intercepted. GSAP ScrollToPlugin scrolls
 * `window` to the target element's offsetTop with a 0.9s ease.
 *
 * Why NOT ScrollSmoother:
 *   1. ScrollSmoother wraps the body in a fixed-height scroll container, which
 *      breaks `position:fixed` elements (the nav would scroll with content).
 *   2. It conflicts with the Projects gallery's `pin:true` ScrollTrigger —
 *      the GSAP docs note that ScrollSmoother + pins require careful wrapper
 *      setup that would require restructuring the entire App DOM.
 *   3. It has known issues with iOS Safari momentum scrolling and touch events.
 *   4. The free 3.15 package includes it but activates it with a
 *      console warning in production — not acceptable for Lighthouse.
 *   Native scroll + ScrollToPlugin provides smooth anchor clicks with zero
 *   side-effects.
 *
 * ── Reduced motion ────────────────────────────────────────────────────────────
 * gsap.matchMedia: in reduced-motion mode the nav never hides (always visible),
 * the indicator changes instantly (no animation), and anchor scrolls jump
 * immediately (no smooth tween).
 */

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../animations/registerGsap";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./Nav.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const NAV_ITEMS: { label: string; href: string; sectionId: string }[] = [
  { label: "Work",        href: "#projects",     sectionId: "projects"     },
  { label: "About",       href: "#about",        sectionId: "about"        },
  { label: "Experience",  href: "#experience",   sectionId: "experience"   },
  { label: "Skills",      href: "#skills",       sectionId: "skills"       },
  { label: "Contact",     href: "#contact",      sectionId: "contact"      },
];

// How many px the user must scroll before the nav hides
const HIDE_THRESHOLD = 100;

export default function Nav() {
  const navRef       = useRef<HTMLElement>(null);
  const linksRef     = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const active       = useActiveSection();
  const prevActive   = useRef<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  // Track reduced-motion preference for indicator + scroll
  const isReduced    = useRef(false);

  // ── GSAP: hide/show on scroll ──────────────────────────────────────────────
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          full:    "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { full } = ctx.conditions as { full: boolean };
          isReduced.current = !full;

          if (!full) {
            // Hide nav when scrolling down past threshold; show on scroll up.
            // We create a ScrollTrigger that watches direction rather than position.
            let hidden = false;

            ScrollTrigger.create({
              start: `${HIDE_THRESHOLD}px top`,
              end: "max",
              onUpdate(self) {
                // Only act when menu is closed
                if (menuOpen) return;

                if (self.direction === 1 && !hidden) {
                  // Scrolling down — hide
                  hidden = true;
                  gsap.to(nav, {
                    yPercent: -100,
                    duration: 0.35,
                    ease: "power2.inOut",
                    overwrite: "auto",
                  });
                } else if (self.direction === -1 && hidden) {
                  // Scrolling up — show
                  hidden = false;
                  gsap.to(nav, {
                    yPercent: 0,
                    duration: 0.4,
                    ease: "power3.out",
                    overwrite: "auto",
                  });
                }
              },
            });
          }
          // Reduced: nav is always visible (no hide/show)
        }
      );
    },
    { scope: navRef, dependencies: [] }
  );

  // ── Active indicator: GSAP scaleX wipe ────────────────────────────────────
  // Runs in a plain useEffect because it touches elements across multiple links.
  // linksRef.current maps sectionId → <a> element.
  // Each <a> contains a child <span class={styles.indicator}> that is the real
  // DOM node GSAP animates (cannot animate ::after pseudo-elements directly).
  useEffect(() => {
    const prev = prevActive.current;
    const next = active;
    if (prev === next) return;

    // Helper: get the .indicator span inside a link
    const getIndicator = (id: string): HTMLElement | null =>
      (linksRef.current.get(id)?.querySelector(`.${styles.indicator}`) as HTMLElement) ?? null;

    const prevIndicator = getIndicator(prev);
    const nextIndicator = getIndicator(next);

    if (isReduced.current) {
      // Instant swap — no animation in reduced-motion mode
      if (prevIndicator) gsap.set(prevIndicator, { scaleX: 0 });
      if (nextIndicator) gsap.set(nextIndicator, { scaleX: 1, transformOrigin: "left center" });
      prevActive.current = next;
      return;
    }

    const tl = gsap.timeline();

    // Outgoing: wipe the underline out from right → left
    if (prevIndicator && prev !== "") {
      tl.to(prevIndicator, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.3,
        ease: "power3.out",
      });
    }

    // Incoming: wipe the underline in from left → right
    if (nextIndicator) {
      tl.fromTo(
        nextIndicator,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, transformOrigin: "left center", duration: 0.4, ease: "power3.out" },
        prevIndicator && prev !== "" ? "-=0.2" : 0  // overlap if there was an outgoing
      );
    }

    prevActive.current = next;
  }, [active]);

  // ── Smooth-scroll click handler ────────────────────────────────────────────
  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    e.preventDefault();
    setMenuOpen(false);

    if (isReduced.current) {
      // Jump immediately — no smooth scroll in reduced-motion
      targetEl.scrollIntoView();
      targetEl.focus({ preventScroll: true });
      return;
    }

    // GSAP ScrollToPlugin smooth scroll
    // offsetTop accounts for the fixed nav height (56px = 3.5rem)
    const navHeight = navRef.current?.offsetHeight ?? 56;
    gsap.to(window, {
      scrollTo: {
        y: targetEl,
        offsetY: navHeight,
      },
      duration: 0.9,
      ease: "power3.inOut",
    });
  }

  function toggleMenu() {
    // If nav is hidden, show it first before opening menu
    if (navRef.current) {
      gsap.to(navRef.current, {
        yPercent: 0,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    setMenuOpen((prev) => !prev);
  }

  return (
    <header role="banner" ref={navRef as React.RefObject<HTMLElement>}>
      <nav className={styles.nav} aria-label="Primary navigation">
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <a
            href="#hero"
            className={styles.logo}
            aria-label="Back to top"
            onClick={(e) => handleAnchorClick(e, "#hero")}
          >
            PNW
          </a>

          {/* Mobile toggle */}
          <button
            className={styles.menuBtn}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="nav-list"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Nav links */}
          <ul
            id="nav-list"
            className={`${styles.list}${menuOpen ? ` ${styles.open}` : ""}`}
            role="list"
          >
            {NAV_ITEMS.map(({ label, href, sectionId }) => {
              const isActive = active === sectionId;
              return (
                <li key={sectionId}>
                  <a
                    href={href}
                    className={`${styles.link}${isActive ? ` ${styles.active}` : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    ref={(el) => {
                      if (el) linksRef.current.set(sectionId, el);
                      else linksRef.current.delete(sectionId);
                    }}
                    onClick={(e) => handleAnchorClick(e, href)}
                  >
                    {label}
                    {/* Real DOM element for the indicator — GSAP animates scaleX */}
                    <span
                      className={styles.indicator}
                      aria-hidden="true"
                      style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}

