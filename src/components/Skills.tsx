/**
 * Skills.tsx
 * Grouped skill lists in a responsive grid.
 * Each group has a label, hairline top border, and a flex-wrapped item list.
 */

import { skills } from "../data/content";
import SectionHeading from "./SectionHeading";
import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <section id="skills" aria-label="Technical skills">
      <div className="container">
        <SectionHeading label="Skills" title="What I work with" />

        <div className={styles.grid} role="list" aria-label="Skill groups">
          {skills.map((group) => (
            <div key={group.label} className={styles.group} role="listitem">
              <span className={styles.groupLabel}>{group.label}</span>
              <ul className={styles.items} aria-label={group.label}>
                {group.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
