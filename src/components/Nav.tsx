/**
 * Nav.tsx
 * Fixed minimal navigation bar.
 * - Text-only links (no icons, no logo image)
 * - Active section underline driven by useActiveSection hook
 * - Hamburger menu for viewports < 600px
 * - Hide-on-scroll-down / show-on-scroll-up handled by GSAP in Stage 3;
 *   for now the bar is always visible.
 */

import { useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./Nav.module.css";

const NAV_ITEMS: { label: string; href: string; sectionId: string }[] = [
  { label: "Work",        href: "#projects",     sectionId: "projects" },
  { label: "About",       href: "#about",        sectionId: "about" },
  { label: "Experience",  href: "#experience",   sectionId: "experience" },
  { label: "Skills",      href: "#skills",       sectionId: "skills" },
  { label: "Contact",     href: "#contact",      sectionId: "contact" },
];

export default function Nav() {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header role="banner">
      <nav className={styles.nav} aria-label="Primary navigation">
        <div className={`container ${styles.inner}`}>
          {/* Logo / name mark */}
          <a href="#hero" className={styles.logo} aria-label="Back to top">
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
            {NAV_ITEMS.map(({ label, href, sectionId }) => (
              <li key={sectionId}>
                <a
                  href={href}
                  className={`${styles.link}${active === sectionId ? ` ${styles.active}` : ""}`}
                  aria-current={active === sectionId ? "true" : undefined}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
