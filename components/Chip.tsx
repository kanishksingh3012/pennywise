import styles from "./Chip.module.css";

/** Pill button for filters, follow-ups and answer choices. Visual 36px, hit area 44px. */
export function Chip({ children, selected, onClick }: { children: React.ReactNode; selected?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={`t-body-14m ${styles.chip} ${selected ? styles.selected : ""}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

/** Horizontal row of chips that scrolls sideways past the screen edge. */
export function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
