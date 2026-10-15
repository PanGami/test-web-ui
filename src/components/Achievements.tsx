/**
 * Achievements.tsx
 * List of certifications and competition results.
 * Each row: title on left, issuer + date on right (md+).
 * TODO entries flagged with accent-colored marker.
 * "View all certificates" external link at the bottom.
 */

import { achievements, certificatesLink } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Achievements.module.css";

export default function Achievements() {
  return (
    <section id="achievements" aria-label="Achievements and certificates">
      <div className="container">
        <SectionHeading label="Achievements" title="Certificates &amp; recognition" />

        <ul className={styles.list} aria-label="Certificate and award list">
          {achievements.map((item, i) => {
            const hasTodo = item.date.includes("TODO") || item.issuer.includes("TODO");
            return (
              <li key={i} className={styles.row}>
                <div>
                  <p className={styles.title}>{item.title}</p>
                  {hasTodo && (
                    <span className={styles.todoMark} aria-label="Incomplete — fill in before launch">
                      TODO
                    </span>
                  )}
                </div>
                <div className={styles.meta}>
                  <span className={styles.issuer}>{item.issuer}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <a
          href={certificatesLink}
          className={styles.viewAll}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View all certificates on Google Drive (opens in new tab)"
        >
          View all 50+ certificates
        </a>
      </div>
    </section>
  );
}
