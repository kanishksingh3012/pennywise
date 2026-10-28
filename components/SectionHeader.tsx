import styles from "./SectionHeader.module.css";

/** Section title with an optional trailing action ("See all"). */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className={styles.header}>
      <h2 className="t-heading">{title}</h2>
      {action && (
        <button type="button" className={`t-body-14m c-muted ${styles.action}`} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
