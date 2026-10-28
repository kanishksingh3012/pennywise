import styles from "./Row.module.css";

interface RowProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  value?: React.ReactNode;
  meta?: React.ReactNode;
  onClick?: () => void;
}

/** List row: leading icon, title + subtitle, trailing value + meta. Becomes a button when onClick is set. */
export function Row({ leading, title, subtitle, value, meta, onClick }: RowProps) {
  const body = (
    <>
      {leading}
      <span className={styles.text}>
        <span className={`t-body-15m ${styles.title}`}>{title}</span>
        {subtitle && <span className="t-meta-13 c-muted">{subtitle}</span>}
      </span>
      {(value || meta) && (
        <span className={styles.trail}>
          {value && <span className="t-value-16">{value}</span>}
          {meta && <span className="t-meta-12 c-faint">{meta}</span>}
        </span>
      )}
    </>
  );
  return onClick ? (
    <button type="button" className={`${styles.row} ${styles.tappable}`} onClick={onClick}>{body}</button>
  ) : (
    <div className={styles.row}>{body}</div>
  );
}
