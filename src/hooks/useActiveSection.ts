/**
 * useActiveSection.ts
 * Tracks which section is currently in the viewport using IntersectionObserver.
 * Returns the id string of the active section (e.g. "about", "experience").
 * Used by Nav to highlight the current item and slide the indicator.
 */

import { useEffect, useState } from "react";

const SECTION_IDS = ["hero", "about", "experience", "projects", "skills", "achievements", "contact"];

export function useActiveSection(): string {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    // rootMargin "-40% 0px -40% 0px" treats the middle 20% of the viewport
    // as the "active" zone — more precise than a simple top-of-viewport rule.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}
