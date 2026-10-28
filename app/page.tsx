// Placeholder Home: a component check page fed by real data. Session 2 replaces it with the real Home.
import { transactions, isSpend, isOn, sum, profile, TODAY, budgets, istParts } from "@/lib/data";
import { inr } from "@/lib/format";
import { ComponentCheck } from "./ComponentCheck";

export default function HomePage() {
  const today = transactions.filter((t) => isSpend(t) && isOn(TODAY)(t));
  const spent = sum(today);
  const perDay = profile.safe_to_spend.per_day;
  const octFood = sum(transactions.filter((t) => isSpend(t) && t.category === "Food" && istParts(t.ts).m === 10));
  const foodBudget = budgets.categories.find((b) => b.category === "Food")!.limit;

  return (
    <ComponentCheck
      today={today.map((t) => ({ id: t.id, merchant: t.merchant, category: t.category, amount: t.amount, ts: t.ts, mode: t.mode }))}
      spent={spent}
      left={perDay - spent}
      foodLine={`${inr(octFood)} of ${inr(foodBudget)}`}
    />
  );
}
