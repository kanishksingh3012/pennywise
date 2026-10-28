// Checks that /data reproduces the numbers in SPEC.md. Exits 1 if any check fails.
// Run: npm run check
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const txns = JSON.parse(readFileSync(join(DATA, "transactions.json"), "utf8"));
const profile = JSON.parse(readFileSync(join(DATA, "profile.json"), "utf8"));

// Spending = debits that aren't money moving between Amit's own pots (ATM, card bill, SIP).
const NOT_SPEND = new Set(["Transfer", "Savings", "Income"]);
const isSpend = (t) => t.direction === "debit" && !NOT_SPEND.has(t.category);

// ts is IST ("2026-10-06T22:40:00+05:30"), so read the local parts straight from the string.
const parts = (t) => ({ m: +t.ts.slice(5, 7), d: +t.ts.slice(8, 10), h: +t.ts.slice(11, 13) });
const dow = (t) => { const { m, d } = parts(t); return new Date(Date.UTC(2026, m - 1, d)).getUTCDay(); };
const inWindow = (m, from, to) => (t) => { const p = parts(t); return p.m === m && p.d >= from && p.d <= to; };
const sum = (list) => list.reduce((s, t) => s + t.amount, 0);

const spend = txns.filter(isSpend);
const oct = spend.filter(inWindow(10, 1, 22));
const usualOf = (pred) => (sum(spend.filter(inWindow(8, 1, 22)).filter(pred)) + sum(spend.filter(inWindow(9, 1, 22)).filter(pred))) / 2;
const usualCount = (pred) => (spend.filter(inWindow(8, 1, 22)).filter(pred).length + spend.filter(inWindow(9, 1, 22)).filter(pred).length) / 2;

const all = () => true;
const cat = (c) => (t) => t.category === c;
const delivery = (t) => t.subcategory === "delivery";
const late = (t) => parts(t).h >= 22;
const tueThu = (t) => [2, 3, 4].includes(dow(t));

const spent = sum(oct);
const usual = usualOf(all);
const food = sum(oct.filter(cat("Food")));
const foodUsual = usualOf(cat("Food"));
const octDelivery = oct.filter(delivery);
const lateTueThu = octDelivery.filter((t) => late(t) && tueThu(t));
const sinceOct6 = lateTueThu.filter((t) => parts(t).d >= 6);

const allLate = spend.filter((t) => delivery(t) && late(t));
const beforeLate = allLate.filter((t) => parts(t).m < 10 || parts(t).d < 6).length;
const weeksBefore = (31 + 30 + 5) / 7; // 1 Aug – 5 Oct
const weeksSince = 17 / 7; // 6 – 22 Oct
const today = spend.filter(inWindow(10, 22, 22));
const perDay = profile.safe_to_spend.per_day;

const checks = [
  ["Oct 1–22 spent", spent, 52400],
  ["Usual by now (Aug/Sep 1–22 avg)", usual, 45600],
  ["Over usual", spent - usual, 6800],
  ["Food Oct", food, 14600],
  ["Food usual", foodUsual, 8800],
  ["Food share of jump (%)", Math.round(((food - foodUsual) / (spent - usual)) * 100), 85],
  ["Delivery Oct", sum(octDelivery), 9400],
  ["Delivery usual", usualOf(delivery), 4000],
  ["Delivery orders Oct", octDelivery.length, 22],
  ["Delivery orders usual", usualCount(delivery), 10],
  ["After 10 pm Tue–Thu, Oct", lateTueThu.length, 14],
  ["  …of those from 6 Oct", sinceOct6.length, 13],
  ["Shopping Oct", sum(oct.filter(cat("Shopping"))), 7200],
  ["Transport Oct", sum(oct.filter(cat("Transport"))), 4300],
  ["Bills Oct", sum(oct.filter(cat("Bills"))), 5500],
  ["Today spent", sum(today), 380],
  ["Today left", perDay - sum(today), 660],
];

const inr = (n) => (Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(1));
let failed = 0;
for (const [label, got, want] of checks) {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${label.padEnd(34)} ${inr(got).padStart(8)}${ok ? "" : `  (want ${inr(want)})`}`);
}
const octCount = txns.filter(inWindow(10, 1, 22)).length;
console.log(`\nInfo: ${txns.length} transactions Aug 1 – Oct 22, ${octCount} in Oct 1–22 ("Checking ${octCount} payments…")`);
console.log(`Info: late delivery orders per week — before 6 Oct ${(beforeLate / weeksBefore).toFixed(1)}, since ${(sinceOct6.length / weeksSince).toFixed(1)} (Mon–Sun weeks from 5 Oct: 4, 5, 4)`);
console.log(`Info: today = ${today.map((t) => `${t.merchant} ₹${t.amount}`).join(", ")}`);
console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks pass");
process.exit(failed ? 1 : 0);
