"use client";
import { useState } from "react";
import { Card } from "@/components/Card";
import { Row } from "@/components/Row";
import { Chip, ChipRow } from "@/components/Chip";
import { SectionHeader } from "@/components/SectionHeader";
import { BottomSheet } from "@/components/BottomSheet";
import { useToast } from "@/components/Toast";
import { Dock } from "@/components/Dock";
import { CategoryIcon } from "@/components/CategoryIcon";
import { inr, time, shortDate } from "@/lib/format";
import styles from "./ComponentCheck.module.css";

interface Props {
  today: { id: string; merchant: string; category: string; amount: number; ts: string; mode: string }[];
  spent: number;
  left: number;
  foodLine: string;
}

const FILTERS = ["All", "UPI", "Cash", "Card"];
const CATS = ["Rent", "Food", "Shopping", "Bills", "Transport", "Other"];

export function ComponentCheck({ today, spent, left, foodLine }: Props) {
  const [filter, setFilter] = useState("All");
  const [sheet, setSheet] = useState(false);
  const [capped, setCapped] = useState(false);
  const toast = useToast();

  const shown = today.filter((t) => filter === "All" || t.mode === filter.toUpperCase());

  const setCap = () => {
    setCapped(true);
    toast({ message: "Delivery cap set to ₹1,500/month", actionLabel: "Undo", onAction: () => setCapped(false) });
  };

  return (
    <>
      <main className="screen">
        <header className={styles.header}>
          <p className="t-meta-13 c-muted">{shortDate("2026-10-22")}</p>
          <h1 className="t-title-24">Good evening, Amit</h1>
        </header>

        <Card>
          <p className="t-label c-muted">Today</p>
          <div className={styles.split}>
            <div>
              <p className="t-figure">{inr(spent)}</p>
              <p className="t-meta-13 c-muted">spent</p>
            </div>
            <div className={styles.right}>
              <p className="t-figure c-copper">{inr(left)}</p>
              <p className="t-meta-13 c-muted">left of {inr(spent + left)}</p>
            </div>
          </div>
        </Card>

        <SectionHeader title="Today's payments" action="See all" onAction={() => setSheet(true)} />
        <ChipRow>
          {FILTERS.map((f) => (
            <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
          ))}
        </ChipRow>
        <Card flush className={styles.list}>
          {shown.map((t) => (
            <Row
              key={t.id}
              leading={<CategoryIcon category={t.category} />}
              title={t.merchant}
              subtitle={`${t.category} · ${t.mode === "CASH" ? "Cash" : t.mode === "CARD" ? "Card" : t.mode}`}
              value={inr(t.amount)}
              meta={time(t.ts)}
              onClick={() => setSheet(true)}
            />
          ))}
          {shown.length === 0 && <p className={`t-body-14 c-muted ${styles.empty}`}>No {filter.toLowerCase()} payments today.</p>}
        </Card>

        <SectionHeader title="Category icons" />
        <div className={styles.cats}>
          {CATS.map((c) => (
            <span key={c} className={styles.cat}>
              <CategoryIcon category={c} />
              <span className="t-meta-12 c-muted">{c}</span>
            </span>
          ))}
        </div>

        <SectionHeader title="Sheet and toast" />
        <Card>
          <p className="t-body-15">Food this month: {foodLine}</p>
          <p className="t-meta-13 c-muted">{capped ? "Delivery cap is on." : "No delivery cap yet."}</p>
          <div className={styles.buttons}>
            <button type="button" className={styles.primary} onClick={setCap} disabled={capped}>Set cap</button>
            <button type="button" className={styles.secondary} onClick={() => setSheet(true)}>Open sheet</button>
          </div>
        </Card>
      </main>

      <Dock onPenny={() => setSheet(true)} />

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Today, in detail">
        <p className="t-body-15 c-muted">Drag the handle down, flick, tap outside or press Esc to close.</p>
        {today.map((t) => (
          <div key={t.id} className={styles.sheetRow}>
            <span className="t-body-15">{t.merchant}</span>
            <span className="t-value-16">{inr(t.amount)}</span>
          </div>
        ))}
      </BottomSheet>
    </>
  );
}
