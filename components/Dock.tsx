"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import styles from "./Dock.module.css";

const TABS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/activity", label: "Activity", icon: "activity" },
  { href: "/plan", label: "Plan", icon: "plan" },
  { href: "/learn", label: "Learn", icon: "learn" },
];

/** Floating dock: four tabs plus the Penny button. Place it outside the scrolling `.screen`. */
export function Dock({ onPenny }: { onPenny?: () => void }) {
  const path = usePathname();
  return (
    <nav className={styles.dock} aria-label="Main">
      <div className={styles.tabs}>
        {TABS.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={`${styles.tab} ${active ? styles.active : ""}`} aria-current={active ? "page" : undefined}>
              <Icon name={t.icon} size={22} />
              <span className="t-tab">{t.label}</span>
            </Link>
          );
        })}
      </div>
      <button type="button" className={styles.penny} onClick={onPenny} aria-label="Ask Penny">
        <Icon name="coin" size={26} />
      </button>
    </nav>
  );
}
