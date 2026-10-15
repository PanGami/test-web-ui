/**
 * SectionHeading.tsx
 * Reusable section header: label + h2 + hairline rule.
 * The rule element is returned as a ref so GSAP can scrub scaleX later.
 */

import styles from "./SectionHeading.module.css";

type Props = {
  label: string;
  title: string;
};

export default function SectionHeading({ label, title }: Props) {
  return (
    <div className={styles.heading}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.title}>{title}</h2>
      <hr className={styles.rule} />
    </div>
  );
}
