// Typed access to Amit's dataset in /data. Regenerate with `npm run data`, verify with `npm run check`.
import transactionsJson from "@/data/transactions.json";
import accountsJson from "@/data/accounts.json";
import budgetsJson from "@/data/budgets.json";
import goalsJson from "@/data/goals.json";
import billsJson from "@/data/bills.json";
import peopleJson from "@/data/people.json";
import profileJson from "@/data/profile.json";

export type Category = "Rent" | "Food" | "Shopping" | "Bills" | "Transport" | "Other";
export type TxnCategory = Category | "Transfer" | "Savings" | "Income";
export type Mode = "UPI" | "CARD" | "CASH" | "ATM" | "TRANSFER";

export interface Transaction {
  id: string;
  ts: string; // ISO with +05:30 (IST)
  amount: number; // rupees, always positive
  direction: "debit" | "credit";
  mode: Mode;
  account: string; // id from accounts.json
  merchant: string;
  payee_vpa: string | null;
  category: TxnCategory;
  subcategory: string;
  note: string;
  location: { area: string; lat: number; lng: number };
}

export const transactions = transactionsJson as Transaction[];
export const accounts = accountsJson;
export const budgets = budgetsJson;
export const goals = goalsJson;
export const bills = billsJson;
export const people = peopleJson;
export const profile = profileJson;

export const CATEGORIES: Category[] = ["Rent", "Food", "Shopping", "Bills", "Transport", "Other"];

/** Spending excludes money moving between Amit's own pots (ATM, card bill, SIP) and income. */
export const isSpend = (t: Transaction) =>
  t.direction === "debit" && (CATEGORIES as string[]).includes(t.category);

/** IST parts read straight from the timestamp string, so results never depend on the server's timezone. */
export function istParts(ts: string) {
  const y = +ts.slice(0, 4), m = +ts.slice(5, 7), d = +ts.slice(8, 10);
  return { y, m, d, h: +ts.slice(11, 13), min: +ts.slice(14, 16), weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}

export const TODAY = profile.today; // "2026-10-22"
export const isOn = (date: string) => (t: Transaction) => t.ts.startsWith(date);
export const sum = (list: Transaction[]) => list.reduce((s, t) => s + t.amount, 0);
