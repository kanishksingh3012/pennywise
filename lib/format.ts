const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹52,400 · ₹1,00,000 (Indian grouping) */
export const inr = (n: number) => `₹${inrFmt.format(Math.round(n))}`;

/** "08:42" from an IST ISO timestamp */
export const time = (ts: string) => ts.slice(11, 16);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Thu 22 Oct" from "2026-10-22" or an ISO timestamp */
export function shortDate(iso: string) {
  const y = +iso.slice(0, 4), m = +iso.slice(5, 7), d = +iso.slice(8, 10);
  return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d} ${MONTHS[m - 1]}`;
}
