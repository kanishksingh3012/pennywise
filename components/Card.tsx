import styles from "./Card.module.css";

/** Surface for things that last. `flush` drops the padding (for lists of Rows that bring their own). */
export function Card({ children, flush, className = "" }: { children: React.ReactNode; flush?: boolean; className?: string }) {
  return <section className={`${styles.card} ${flush ? styles.flush : ""} ${className}`}>{children}</section>;
}
