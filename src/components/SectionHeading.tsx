/**
 * SectionHeading.tsx
 * Reusable section header: label + h2 + hairline rule.
 *
 * Data attributes let the parent section's GSAP context query individual
 * elements without needing refs threaded through props:
 *   [data-heading-label]  — the small uppercase label
 *   [data-heading-title]  — the h2
 *   [data-heading-rule]   — the hairline <hr> (scaleX draw animation)
 */

import styles from "./SectionHeading.module.css";

type Props = {
  label: string;
  title: string;
};

export default function SectionHeading({ label, title }: Props) {
  return (
    <div className={styles.heading}>
      <span className={styles.label} data-heading-label="">{label}</span>
      <h2 className={styles.title} data-heading-title="">{title}</h2>
      <hr className={styles.rule} data-heading-rule="" />
    </div>
  );
}
