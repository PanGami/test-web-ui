/**
 * Experience.tsx
 * Vertical timeline of work history.
 * The progress line scaleY scrub and per-item activation are added in Stage 3.
 *
 * Structure:
 *   - Left column (md+): sticky vertical line (track)
 *   - Right column: ordered list of experience items
 *
 * Also includes Education entries below the timeline.
 */

import { experience, education } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section id="experience" aria-label="Work experience">
      <div className="container">
        <SectionHeading label="Experience" title="Where I've worked" />

        <div className={styles.layout}>
          {/* Progress track — visible md+ */}
          <div className={styles.track} aria-hidden="true">
            <div className={styles.progressWrap}>
              <div className={styles.progressLine} />
            </div>
          </div>

          {/* Timeline items */}
          <ol className={styles.items} aria-label="Work history">
            {experience.map((job, i) => (
              <li key={i} className={styles.item}>
                {/* Meta: period + type */}
                <div className={styles.itemMeta}>
                  <span className={styles.period}>{job.period}</span>
                  {job.duration && (
                    <span className={styles.period}>{job.duration}</span>
                  )}
                  <span className={styles.type}>{job.type}</span>
                </div>

                {/* Content */}
                <div>
                  <h3 className={styles.role}>{job.role}</h3>
                  <p className={styles.company}>{job.company}</p>

                  <ul className={styles.bullets} aria-label={`Responsibilities at ${job.company}`}>
                    {job.bullets.map((b, j) => (
                      <li key={j} className={styles.bullet}>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.stack} aria-label="Technologies used">
                    {job.stack.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Education — below the main timeline */}
        <div style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
          <SectionHeading label="Education" title="Academic background" />
          <div className={styles.layout}>
            <div className={styles.track} aria-hidden="true" />
            <ol className={styles.items} aria-label="Education history">
              {education.map((edu, i) => (
                <li key={i} className={styles.item}>
                  <div className={styles.itemMeta}>
                    <span className={styles.period}>{edu.period}</span>
                  </div>
                  <div>
                    <h3 className={styles.role}>{edu.degree}</h3>
                    <p className={styles.company}>{edu.institution}</p>
                    <p className={styles.type}>{edu.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
