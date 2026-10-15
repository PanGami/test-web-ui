/**
 * Contact.tsx
 * Simple contact section with email and LinkedIn links.
 * Large link values with underline-wipe hover effect.
 */

import { contact } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact information">
      <div className="container">
        <SectionHeading label="Contact" title="Get in touch" />

        <div className={styles.inner}>
          <p className={styles.body}>{contact.body}</p>

          <div className={styles.links}>
            {/* Email */}
            <a
              href={`mailto:${contact.email}`}
              className={styles.link}
              aria-label={`Send email to ${contact.email}`}
            >
              <span className={styles.linkLabel}>Email</span>
              <span className={styles.linkValue}>{contact.email}</span>
            </a>

            {/* LinkedIn */}
            <a
              href={contact.linkedin}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Panca's LinkedIn profile (opens in new tab)"
            >
              <span className={styles.linkLabel}>LinkedIn</span>
              <span className={styles.linkValue}>panca-nugraha-wicaksana</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
