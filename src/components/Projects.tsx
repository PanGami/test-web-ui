/**
 * Projects.tsx
 * Project grid — up to 3 cards from content.ts.
 * Layout degrades gracefully: 1 col (mobile) → 2 col (tablet) → 3 col (desktop).
 * TODO placeholder cards are visually distinguished with an accent border tag.
 */

import { projects } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="projects" aria-label="Selected projects">
      <div className="container">
        <SectionHeading label="Work" title="Selected projects" />

        <div className={styles.grid}>
          {projects.map((project, i) => {
            const isTodo = project.title.startsWith("TODO");
            return (
              <article key={i} className={styles.card} aria-label={project.title}>
                <span className={styles.cardNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className={styles.cardTitle}>{project.title}</h3>

                {isTodo && (
                  <span className={styles.todo} aria-label="Placeholder — replace with real project">
                    TODO
                  </span>
                )}

                <p className={styles.cardProblem}>{project.problem}</p>

                <p className={styles.cardRole}>{project.role}</p>

                <div className={styles.stack} aria-label="Technology stack">
                  {project.stack.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title}`}
                  >
                    View project
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
