import { Icon } from "./Icon";
import styles from "./CategoryIcon.module.css";

const VARS: Record<string, string> = {
  Rent: "var(--cat-rent)",
  Food: "var(--cat-food)",
  Shopping: "var(--cat-shopping)",
  Bills: "var(--cat-bills)",
  Transport: "var(--cat-transport)",
  Other: "var(--cat-other)",
};

/** Category line icon on a 30% tint of its colour. Identity only: always sits next to a label or number. */
export function CategoryIcon({ category, size = 40 }: { category: string; size?: number }) {
  const color = VARS[category] ?? VARS.Other;
  return (
    <span className={styles.tile} style={{ "--cat": color, width: size, height: size } as React.CSSProperties}>
      <Icon name={category.toLowerCase()} size={Math.round(size * 0.5)} />
    </span>
  );
}
