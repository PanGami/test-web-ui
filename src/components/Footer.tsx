/**
 * Footer.tsx
 * Minimal footer: copyright left, LinkedIn link right.
 */

import { footer } from "../data/content";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>{footer.copy}</p>
        <a
          href={footer.linkedin}
          className={styles.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LinkedIn profile (opens in new tab)"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
