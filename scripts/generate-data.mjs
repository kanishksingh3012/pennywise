// Generates Amit's synthetic dataset into /data. Deterministic (seeded), so re-running gives the same files.
// Category totals for days 1–22 of each month are fixed so "usual by now" and October reproduce SPEC.md exactly.
// Run: npm run data   then   npm run check
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data");

// ---------- seeded RNG ----------
let seed = 20261022;
function rand() {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const between = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const roundTo = (n, step) => Math.round(n / step) * step;
function pickWeighted(items) {
  const total = items.reduce((s, i) => s + (i.w ?? 1), 0);
  let r = rand() * total;
  for (const i of items) { r -= i.w ?? 1; if (r <= 0) return i; }
  return items[items.length - 1];
}

// ---------- places (Bengaluru) ----------
const PLACES = {
  home: { area: "HSR Layout", lat: 12.9116, lng: 77.6474 },
  office: { area: "Bellandur", lat: 12.9279, lng: 77.6784 },
  koramangala: { area: "Koramangala", lat: 12.9352, lng: 77.6245 },
  indiranagar: { area: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  mgroad: { area: "MG Road", lat: 12.9756, lng: 77.605 },
};
function loc(key) {
  const p = PLACES[key];
  const j = () => (rand() - 0.5) * 0.004;
  return { area: p.area, lat: +(p.lat + j()).toFixed(4), lng: +(p.lng + j()).toFixed(4) };
}

// ---------- dates (all IST) ----------
const pad = (n) => String(n).padStart(2, "0");
const weekday = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 Sun … 6 Sat
const daysIn = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const ts = (m, d, h, min) => `2026-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:00+05:30`;
const isWeekend = (m, d) => [0, 6].includes(weekday(2026, m, d));

// ---------- merchants ----------
// vpa null → card or cash only. "stranger" = a person's own UPI ID (autos, small shops).
const M = {
  swiggy: { merchant: "Swiggy", vpa: "swiggy@icici", place: "home" },
  zomato: { merchant: "Zomato", vpa: "zomato@hdfcbank", place: "home" },
  zepto: { merchant: "Zepto", vpa: "zepto@ybl", place: "home", min: 120, max: 450 },
  blinkit: { merchant: "Blinkit", vpa: "blinkit@axisbank", place: "home", min: 100, max: 420 },
  bigbasket: { merchant: "BigBasket", vpa: "bigbasket@icici", place: "home", min: 380, max: 900, w: 0.4 },
  provisions: { merchant: "Sri Lakshmi Provisions", vpa: "9845012345@ybl", place: "home", min: 50, max: 200, stranger: true },
  chaipoint: { merchant: "Chai Point", vpa: "chaipoint@icici", place: "office", min: 40, max: 70, note: "near office" },
  teastall: { merchant: "Manju Tea Stall", vpa: "manjunath.k88@okaxis", place: "office", min: 20, max: 40, stranger: true },
  thirdwave: { merchant: "Third Wave Coffee", vpa: "thirdwave@hdfcbank", place: "koramangala", min: 180, max: 260 },
  meghana: { merchant: "Meghana Foods", vpa: "meghanafoods@ybl", place: "koramangala", min: 280, max: 520, note: "biryani" },
  truffles: { merchant: "Truffles", vpa: "truffles@icici", place: "koramangala", min: 300, max: 600 },
  toit: { merchant: "Toit Brewpub", vpa: null, place: "indiranagar" },
  metro: { merchant: "Namma Metro", vpa: "bmrcl@sbi", place: "office", min: 30, max: 70, w: 5, sub: "metro" },
  rapido: { merchant: "Rapido", vpa: "rapido@ybl", place: "office", min: 50, max: 120, w: 2, sub: "bike taxi" },
  auto: { merchant: "Auto ride", vpa: null, place: "home", min: 60, max: 150, w: 2, sub: "auto", stranger: true },
  uber: { merchant: "Uber", vpa: "uber@axisbank", place: "office", min: 160, max: 320, w: 1, sub: "cab" },
  amazon: { merchant: "Amazon", vpa: null, place: "home", min: 300, max: 2400, w: 2, sub: "online" },
  myntra: { merchant: "Myntra", vpa: null, place: "home", min: 800, max: 2200, sub: "clothes" },
  decathlon: { merchant: "Decathlon", vpa: null, place: "mgroad", min: 600, max: 1800, sub: "sports" },
  nykaa: { merchant: "Nykaa", vpa: "nykaa@icici", place: "home", min: 300, max: 900, sub: "personal care" },
  apollo: { merchant: "Apollo Pharmacy", vpa: "apollopharmacy@hdfcbank", place: "home", min: 120, max: 450, sub: "health" },
  barber: { merchant: "Hair cut", vpa: "salim.barber@okicici", place: "home", min: 150, max: 300, sub: "personal care", stranger: true },
  laundry: { merchant: "Laundry", vpa: "9900876543@paytm", place: "home", min: 100, max: 250, sub: "laundry", stranger: true },
  urban: { merchant: "Urban Company", vpa: "urbancompany@icici", place: "home", min: 400, max: 800, sub: "home services", w: 0.5 },
  misc: { merchant: "Street shop", vpa: null, place: "koramangala", min: 50, max: 200, sub: "misc", stranger: true },
};
// Stranger VPAs for autos/shops vary per ride.
const STRANGER_VPAS = ["8123456790@ybl", "raju.auto@okaxis", "9741203344@paytm", "venkatesh.r@oksbi", "9008123456@ybl", "lokesh77@okhdfcbank"];

// ---------- transaction builder ----------
const txns = [];
const ATM_DAYS = {}; // month → day of ATM withdrawal (cash is used for a few days after)

function add(t) {
  txns.push({
    id: "",
    ts: t.ts,
    amount: t.amount,
    direction: t.direction ?? "debit",
    mode: t.mode ?? "UPI",
    account: t.account ?? "hdfc_sav",
    merchant: t.merchant,
    payee_vpa: t.payee_vpa ?? null,
    category: t.category,
    subcategory: t.subcategory,
    note: t.note ?? "",
    location: t.location ?? loc("home"),
  });
}

// Spending txn from a merchant def. Mode follows the merchant: card-only shops use the card,
// strangers can be paid in cash right after an ATM visit, a share of UPI goes through SBI.
function addSpend(def, { m, d, h, min, amount, category, subcategory, note, mode, account }) {
  let vpa = def.vpa;
  let md = mode;
  let acct = account;
  if (!md) {
    const atm = ATM_DAYS[m];
    const cashWindow = atm && d >= atm && d <= atm + 6;
    if (def.stranger && cashWindow && rand() < 0.5) md = "CASH";
    else if (!def.vpa && !def.stranger) md = "CARD";
    else md = "UPI";
  }
  if (md === "CASH") { vpa = null; acct = "cash"; }
  else if (md === "CARD") { vpa = null; acct = "hdfc_card"; }
  else {
    if (def.stranger && !vpa) vpa = pick(STRANGER_VPAS);
    acct = acct ?? (rand() < 0.2 ? "sbi_sav" : "hdfc_sav");
  }
  add({
    ts: ts(m, d, h, min), amount, mode: md, account: acct, merchant: def.merchant, payee_vpa: vpa,
    category, subcategory: subcategory ?? def.sub, note: note ?? def.note ?? "", location: loc(def.place),
  });
}

// Random amounts within each item's range, then nudged in ₹10 steps until they hit the exact total.
function fitToTotal(items, total) {
  let diff = total - items.reduce((s, i) => s + i.amount, 0);
  let guard = 0;
  while (diff !== 0 && guard++ < 100000) {
    const i = items[Math.floor(rand() * items.length)];
    const step = Math.sign(diff) * Math.min(10, Math.abs(diff));
    const next = i.amount + step;
    const lo = Math.round(i.min * 0.7), hi = Math.round(i.max * 1.3);
    if (next >= lo && next <= hi) { i.amount = next; diff -= step; }
  }
  if (diff !== 0) throw new Error(`could not fit total ${total}`);
}

// A bucket: `count` payments of one category/subcategory adding up to `total`, on allowed days and hours.
function bucket({ m, days, total, count, category, subcategory, merchants, hours = [8, 21], dayOk = () => true }) {
  const items = [];
  const okDays = days.filter((d) => dayOk(m, d));
  for (let k = 0; k < count; k++) {
    const def = pickWeighted(merchants);
    items.push({ def, d: pick(okDays), min: def.min, max: def.max, amount: roundTo(between(def.min, def.max), 10) });
  }
  fitToTotal(items, total);
  for (const it of items) {
    addSpend(it.def, { m, d: it.d, h: between(hours[0], hours[1]), min: between(0, 59), amount: it.amount, category, subcategory: subcategory ?? it.def.sub });
  }
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// ---------- fixed monthly items ----------
const BILLS = [
  { d: 1, merchant: "cult.fit", vpa: "cultfit@icici", amount: 2099, sub: "gym" },
  { d: 3, merchant: "Airtel Postpaid", vpa: "airtel@ybl", amount: 599, sub: "phone" },
  { d: 7, merchant: "ACT Fibernet", vpa: "actfibernet@hdfcbank", amount: 1049, sub: "internet" },
  { d: 10, merchant: "BESCOM", vpa: "bescom@sbi", amount: 1240, sub: "electricity" },
  { d: 15, merchant: "Netflix", vpa: null, amount: 199, sub: "subscriptions" },
  { d: 18, merchant: "Spotify", vpa: null, amount: 119, sub: "subscriptions" },
  { d: 20, merchant: "iCloud", vpa: null, amount: 195, sub: "subscriptions" },
]; // = ₹5,500

function monthFixed(m) {
  add({ ts: ts(m, 1, 9, 12), amount: 16000, mode: "TRANSFER", merchant: "Prakash Rao (landlord)", payee_vpa: "prakashrao@okhdfcbank", category: "Rent", subcategory: "rent", note: "rent" });
  for (const b of BILLS) {
    const card = !b.vpa;
    add({ ts: ts(m, b.d, 7, 30), amount: b.amount, mode: card ? "CARD" : "UPI", account: card ? "hdfc_card" : "hdfc_sav", merchant: b.merchant, payee_vpa: b.vpa, category: "Bills", subcategory: b.sub, note: card ? "autopay" : "" });
  }
  add({ ts: ts(m, 5, 10, 0), amount: 5000, mode: "TRANSFER", merchant: "Groww SIP", payee_vpa: "groww.sip@icici", category: "Savings", subcategory: "sip", note: "monthly SIP" });
}

// ---------- delivery ----------
function deliveries(m, list) {
  // list: [day, hour, minute, amount, note?]
  for (const [d, h, mi, amount, note] of list) {
    const def = rand() < 0.55 ? M.swiggy : M.zomato;
    const card = rand() < 0.25;
    add({ ts: ts(m, d, h, mi), amount, mode: card ? "CARD" : "UPI", account: card ? "hdfc_card" : "hdfc_sav", merchant: def.merchant, payee_vpa: card ? null : def.vpa, category: "Food", subcategory: "delivery", note: note ?? "", location: loc("home") });
  }
}

// ---------- Aug and Sep (the "usual") ----------
const FOOD_GROCERY = [M.zepto, M.blinkit, M.bigbasket, M.provisions];
const FOOD_CAFE_USUAL = [{ ...M.chaipoint, w: 3 }, { ...M.teastall, w: 3 }, { ...M.thirdwave, w: 0.5 }];
const FOOD_CAFE_OCT = [M.chaipoint, M.teastall];
const FOOD_DINING = [M.meghana, M.truffles];
const TRANSPORT = [M.metro, M.rapido, M.auto, M.uber];
const SHOPPING = [M.amazon, M.myntra, M.decathlon, M.nykaa];
const OTHER = [M.apollo, M.barber, M.laundry, M.urban, M.misc];

// Aug–Sep delivery: 10 orders = ₹4,000 by the 22nd, ~1 late order a week, all on varied days.
const USUAL_DELIVERY = {
  8: [[2, 20, 15, 380], [5, 13, 10, 420], [8, 22, 40, 350], [9, 21, 5, 410], [12, 13, 25, 390], [15, 20, 30, 440], [16, 22, 15, 360], [19, 13, 40, 400], [21, 22, 50, 430], [22, 20, 10, 420]],
  9: [[1, 13, 20, 420], [4, 22, 30, 400], [6, 20, 45, 380], [10, 13, 15, 350], [12, 22, 20, 440], [13, 20, 10, 360], [16, 13, 35, 410], [18, 22, 45, 390], [20, 21, 0, 430], [22, 13, 5, 420]],
};
const LATE_DELIVERY_REST = { 8: [[27, 22, 20, 390], [24, 20, 30, 450], [30, 13, 10, 380]], 9: [[24, 22, 35, 410], [27, 20, 15, 420], [29, 13, 30, 370]] };

for (const m of [8, 9]) {
  if (m === 9) ATM_DAYS[9] = 6;
  monthFixed(m);
  if (m === 9) add({ ts: ts(9, 6, 18, 40), amount: 2000, mode: "ATM", merchant: "HDFC ATM", category: "Transfer", subcategory: "atm", note: "cash", location: loc("koramangala") });
  add({ ts: ts(m, 8, 11, 0), amount: m === 8 ? 5870 : 6240, mode: "TRANSFER", merchant: "HDFC Millennia card bill", category: "Transfer", subcategory: "card bill", note: "card bill payment" });
  deliveries(m, USUAL_DELIVERY[m]);
  deliveries(m, LATE_DELIVERY_REST[m]);
  const first = range(1, 22);
  const rest = range(23, daysIn(2026, m));
  // Days 1–22: totals sum to ₹45,600 with rent, bills and delivery above. Food = ₹8,800.
  bucket({ m, days: first, total: 2600, count: 11, category: "Food", subcategory: "groceries", merchants: FOOD_GROCERY, hours: [9, 21] });
  bucket({ m, days: first, total: 1300, count: 3, category: "Food", subcategory: "dining", merchants: FOOD_DINING, hours: [13, 21], dayOk: isWeekend });
  bucket({ m, days: first, total: 900, count: 20, category: "Food", subcategory: "cafe", merchants: FOOD_CAFE_USUAL, hours: [10, 18], dayOk: (mm, d) => !isWeekend(mm, d) });
  bucket({ m, days: first, total: 4100, count: 44, category: "Transport", merchants: TRANSPORT, hours: [8, 20] });
  bucket({ m, days: first, total: 6600, count: 6, category: "Shopping", merchants: SHOPPING, hours: [11, 22] });
  bucket({ m, days: first, total: 4600, count: 15, category: "Other", merchants: OTHER, hours: [9, 20] });
  // Rest of month: ordinary background, totals not checked.
  bucket({ m, days: rest, total: 900, count: 4, category: "Food", subcategory: "groceries", merchants: FOOD_GROCERY, hours: [9, 21] });
  bucket({ m, days: rest, total: 320, count: 7, category: "Food", subcategory: "cafe", merchants: FOOD_CAFE_OCT, hours: [10, 18], dayOk: (mm, d) => !isWeekend(mm, d) });
  bucket({ m, days: rest, total: 1500, count: 16, category: "Transport", merchants: TRANSPORT, hours: [8, 20] });
  bucket({ m, days: rest, total: 1400, count: 2, category: "Shopping", merchants: SHOPPING, hours: [11, 22] });
  bucket({ m, days: rest, total: 900, count: 4, category: "Other", merchants: OTHER, hours: [9, 20] });
}
add({ ts: ts(9, 26, 19, 5), amount: 2000, direction: "credit", mode: "UPI", merchant: "Rahul Menon", payee_vpa: "rahul.menon@okaxis", category: "Transfer", subcategory: "loan", note: "lent for the month, return by 5 Nov" });
add({ ts: ts(8, 31, 9, 0), amount: 85000, direction: "credit", mode: "TRANSFER", merchant: "Brightlane Tech (salary)", category: "Income", subcategory: "salary", note: "salary Aug" });
add({ ts: ts(9, 30, 9, 0), amount: 85000, direction: "credit", mode: "TRANSFER", merchant: "Brightlane Tech (salary)", category: "Income", subcategory: "salary", note: "salary Sep" });

// ---------- October 1–22 ----------
// Spent ₹52,400: Rent 16,000 · Food 14,600 · Shopping 7,200 · Transport 4,300 · Bills 5,500 · Other 4,800.
ATM_DAYS[10] = 18;
monthFixed(10);
add({ ts: ts(10, 8, 11, 0), amount: 6100, mode: "TRANSFER", merchant: "HDFC Millennia card bill", category: "Transfer", subcategory: "card bill", note: "card bill payment" });
add({ ts: ts(10, 18, 11, 20), amount: 2000, mode: "ATM", merchant: "HDFC ATM", category: "Transfer", subcategory: "atm", note: "cash", location: loc("home") });

// Delivery: 22 orders = ₹9,400. 14 after 10 pm on Tue–Thu: one on Thu 1 Oct, then 13 from Tue 6 Oct (weeks of 5, 12, 19 Oct: 4, 5, 4).
deliveries(10, [
  [1, 22, 25, 380],
  [6, 22, 40, 420], [7, 22, 10, 360], [7, 23, 35, 440, "dessert"], [8, 22, 55, 410],
  [13, 23, 5, 390], [14, 22, 20, 450], [14, 23, 45, 370, "dessert"], [15, 22, 30, 400], [15, 23, 50, 430],
  [20, 22, 15, 350], [20, 23, 40, 420, "dessert"], [21, 22, 35, 390], [21, 23, 20, 410],
]);
deliveries(10, [
  [3, 20, 30, 520], [4, 13, 15, 460], [10, 20, 45, 610], [11, 13, 30, 380],
  [12, 20, 5, 540], [17, 13, 20, 290], [18, 20, 40, 480], [19, 21, 10, 500],
]);

const octDays = range(1, 21); // today (22nd) has only the three payments below
bucket({ m: 10, days: octDays, total: 2300, count: 10, category: "Food", subcategory: "groceries", merchants: FOOD_GROCERY, hours: [9, 21] });
// Dining ₹1,900: the birthday dinner (budget raised on 12 Oct for it) + 3 others.
add({ ts: ts(10, 16, 21, 30), amount: 1200, mode: "CARD", account: "hdfc_card", merchant: "Toit Brewpub", category: "Food", subcategory: "dining", note: "Priya's birthday dinner", location: loc("indiranagar") });
bucket({ m: 10, days: octDays, total: 700, count: 3, category: "Food", subcategory: "dining", merchants: FOOD_DINING, hours: [13, 21], dayOk: isWeekend });
// Cafe ₹1,000: 22 chai runs near office + today's ₹60 cash at Chai Point.
bucket({ m: 10, days: octDays, total: 940, count: 22, category: "Food", subcategory: "cafe", merchants: FOOD_CAFE_OCT, hours: [10, 18], dayOk: (mm, d) => !isWeekend(mm, d) });
// Transport ₹4,300: 43 rides + one cash auto on 18 Oct + today's Metro and Uber.
add({ ts: ts(10, 18, 12, 5), amount: 120, mode: "CASH", account: "cash", merchant: "Auto ride", category: "Transport", subcategory: "auto", location: loc("home") });
bucket({ m: 10, days: octDays, total: 3860, count: 43, category: "Transport", merchants: TRANSPORT, hours: [8, 20] });
bucket({ m: 10, days: octDays, total: 7200, count: 7, category: "Shopping", merchants: SHOPPING, hours: [11, 22] });
// Other ₹4,800: movie for two (Sarah owes ₹540) + 18 others.
add({ ts: ts(10, 10, 18, 15), amount: 1080, mode: "UPI", merchant: "PVR Cinemas", payee_vpa: "pvrcinemas@icici", category: "Other", subcategory: "entertainment", note: "2 tickets, Sarah owes 540", location: loc("koramangala") });
bucket({ m: 10, days: octDays, total: 3720, count: 18, category: "Other", merchants: OTHER, hours: [9, 20] });

// Today, Thu 22 Oct: ₹380.
add({ ts: ts(10, 22, 8, 42), amount: 140, mode: "UPI", merchant: "Namma Metro", payee_vpa: "bmrcl@sbi", category: "Transport", subcategory: "metro", location: loc("home") });
add({ ts: ts(10, 22, 16, 5), amount: 60, mode: "CASH", account: "cash", merchant: "Chai Point", category: "Food", subcategory: "cafe", note: "near office", location: loc("office") });
add({ ts: ts(10, 22, 18, 20), amount: 180, mode: "UPI", merchant: "Uber", payee_vpa: "uber@axisbank", category: "Transport", subcategory: "cab", location: loc("office") });

// ---------- write ----------
txns.sort((a, b) => a.ts.localeCompare(b.ts));
txns.forEach((t, i) => (t.id = `t_${String(i + 1).padStart(4, "0")}`));

const accounts = [
  { id: "hdfc_sav", name: "HDFC Savings", type: "savings", balance: 24800, masked: "XX4821" },
  { id: "sbi_sav", name: "SBI Savings", type: "savings", balance: 6400, masked: "XX1307" },
  { id: "cash", name: "Cash", type: "cash", balance: 1400, last_atm: { date: "2026-10-18", amount: 2000 }, unlogged: 520 },
  { id: "hdfc_card", name: "HDFC Millennia", type: "credit_card", balance: 5482, due: 5482, due_date: "2026-10-28", limit: 30000, masked: "XX9034" },
];

const budgets = {
  month: "2026-10",
  categories: [
    { category: "Food", limit: 10000 },
    { category: "Shopping", limit: 10000 },
    { category: "Transport", limit: 6000 },
    { category: "Bills", limit: 5500, fixed: true },
  ],
  history: [{ date: "2026-10-12", category: "Food", from: 9000, to: 10000, reason: "Friend's birthday dinner" }],
  caps: [],
};

const goals = [
  { id: "goa", name: "Goa trip", saved: 18600, target: 30000, by: "2027-03-15", monthly: 2500 },
  { id: "emergency", name: "Emergency fund", unit: "months", saved: 2.1, target: 3 },
  { id: "rahul", name: "Pay back Rahul", amount: 2000, by: "2026-11-05", person: "rahul" },
];

const bills = [
  { id: "card", name: "HDFC Millennia card", amount: 5482, due: "2026-10-28", account: "hdfc_card", category: "Bills" },
  { id: "rent", name: "Rent", amount: 16000, due: "2026-11-01", category: "Rent" },
  { id: "cultfit", name: "cult.fit", amount: 2099, due: "2026-11-01", category: "Bills" },
  { id: "airtel", name: "Airtel Postpaid", amount: 599, due: "2026-11-03", category: "Bills" },
  { id: "sip", name: "Groww SIP", amount: 5000, due: "2026-11-05", category: "Savings" },
  { id: "rahul", name: "Pay back Rahul", amount: 2000, due: "2026-11-05", category: "Transfer" },
  { id: "act", name: "ACT Fibernet", amount: 1049, due: "2026-11-07", category: "Bills" },
  { id: "bescom", name: "BESCOM", amount: 1240, due: "2026-11-10", category: "Bills" },
];

const people = [
  { id: "rahul", name: "Rahul Menon", vpa: "rahul.menon@okaxis", you_owe: 2000, by: "2026-11-05", note: "lent for the month" },
  { id: "sarah", name: "Sarah D'Souza", vpa: "sarah.dsouza@oksbi", owes_you: 540, note: "movie ticket, 10 Oct" },
  { id: "priya", name: "Priya Nair", vpa: "priya.nair@ybl", note: "birthday dinner 16 Oct" },
  { id: "landlord", name: "Prakash Rao", vpa: "prakashrao@okhdfcbank", note: "landlord, rent on the 1st" },
];

const profile = {
  name: "Amit", age: 24, city: "Bengaluru", take_home: 85000,
  today: "2026-10-22", payday: "2026-10-31", payday_rule: "last day of month",
  safe_to_spend: { per_day: 1040, days_to_payday: 9 },
  savings_rate: { now: 0.13, usual: 0.21 },
  buffer_months: 2.1,
  sip: { amount: 5000, day: 5 },
};

const write = (name, data) => writeFileSync(join(OUT, name), JSON.stringify(data, null, 2) + "\n");
write("transactions.json", txns);
write("accounts.json", accounts);
write("budgets.json", budgets);
write("goals.json", goals);
write("bills.json", bills);
write("people.json", people);
write("profile.json", profile);
console.log(`Wrote ${txns.length} transactions and 6 state files to /data`);
