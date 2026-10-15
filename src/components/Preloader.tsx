/**
 * Preloader.tsx
 * Static shell — shows the name centered on ivory background.
 * GSAP animation (fade-in → wipe-up → hero entrance) added in Stage 3.
 */

import styles from "./Preloader.module.css";

export default function Preloader() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <span className={styles.name}>Panca Nugraha Wicaksana</span>
    </div>
  );
}
