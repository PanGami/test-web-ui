/**
 * Preloader.tsx
 * The overlay div is exposed via forwardRef so App.tsx can drive the
 * master entrance timeline without breaking the component boundary.
 *
 * Static state: overlay is hidden (visibility:hidden / opacity:0 in CSS).
 * GSAP immediately sets autoAlpha=1 before the timeline plays.
 */

import { forwardRef } from "react";
import styles from "./Preloader.module.css";

const Preloader = forwardRef<HTMLDivElement>(function Preloader(_props, ref) {
  return (
    <div ref={ref} className={styles.overlay} aria-hidden="true">
      <span className={styles.name} data-preloader-name="">
        Panca Nugraha Wicaksana
      </span>
    </div>
  );
});

Preloader.displayName = "Preloader";
export default Preloader;
