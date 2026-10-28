# PennyWise · Handoff after Session 1

The foundation is built: Next.js app, design tokens, Amit's dataset and shared components. Read `SPEC.md` first for scope and rules; this file covers only where things live.

## Run
```
npm install
npm run dev      # http://localhost:3000 (component check page)
npm run check    # verifies the dataset reproduces SPEC.md numbers
npm run data     # regenerates /data (deterministic, seeded), then run check
```
Stack: Next 16 (App Router), React 19, TypeScript 5, plain CSS (global tokens + CSS Modules per component). No UI library. Schibsted Grotesk loads via `next/font/google` as `--font-schibsted`.

## Folders
```
app/
  layout.tsx          phone frame (.stage > .phone), ToastProvider, #overlay-root
  globals.css         reset, phone frame, .screen scroll area
  tokens.css          ALL design tokens + type classes (.t-figure … .t-tab), colour helpers (.c-muted, .c-copper …)
  page.tsx            placeholder Home (server): computes today from data → ComponentCheck
  ComponentCheck.tsx  client demo of every component. S2 replaces page.tsx + this file with the real Home.
components/           Card, Row, Chip/ChipRow, SectionHeader, BottomSheet, Toast/ToastProvider/useToast,
                      Dock, CategoryIcon, Icon (line icon set), Portal
lib/data.ts           typed imports of /data + isSpend(), istParts(), isOn(), sum(), TODAY
lib/format.ts         inr() (₹1,00,000 grouping), time(), shortDate()
data/                 transactions, accounts, budgets, goals, bills, people, profile (.json)
scripts/              generate-data.mjs, check-totals.mjs
```

## Page layout pattern
```tsx
<>
  <main className="screen">…scrolling content…</main>   // has bottom padding for the dock
  <Dock onPenny={openPenny} />                         // outside .screen, absolute in the phone
  <BottomSheet open={…} onClose={…} title="…">…</BottomSheet>
</>
```
Sheets and toasts render through `Portal` into `#overlay-root`, so they stay inside the phone frame on desktop.

## Components (short API)
- `Card({ flush? })`: surface, radius 20, padding 20 (`flush` for row lists).
- `Row({ leading, title, subtitle, value, meta, onClick? })`: min height 64; a button when `onClick` is set.
- `Chip({ selected, onClick })`, `ChipRow`: 36px pill with a 44px hit area; selected = copper tint.
- `SectionHeader({ title, action?, onAction? })`.
- `BottomSheet({ open, onClose, title?, children })`: dimmed backdrop; drag the handle (>120px or flick) to dismiss; backdrop tap and Esc also close.
- `useToast()({ message, actionLabel: "Undo", onAction, duration? })`: global toast above the dock. For a toast inside Penny's sheet, render `<Toast inline visible message actionLabel onAction />` directly.
- `Dock({ onPenny })`: tabs link to `/`, `/activity`, `/plan`, `/learn` (S3 creates the last three; they 404 until then). The active tab is shown in text colour; the Penny button is the copper element.
- `CategoryIcon({ category, size=40 })`: line icon in the category colour on a 30% tint of it.

## Design rules applied in code
- Copper is the only highlight (primary button, Penny button, selected chip, "left" figure).
- Text is at least 12px. The Figma Tab style is 11/14; `.t-tab` raises it to 12/14.
- Tap targets are at least 44px (`--tap`).

## Data
Amit, today = Thu 22 Oct 2026, all timestamps are IST (`+05:30`); read hours and days with `istParts()`, never `new Date().getHours()`.
- 456 transactions from 1 Aug to 22 Oct, 142 of them in Oct 1–22 (for the "Checking 142 payments…" line).
- **Spending** = debits in Rent/Food/Shopping/Bills/Transport/Other. `Transfer` (ATM, card bill, Rahul's loan), `Savings` (SIP) and `Income` (salary) are not spending.
- **Usual by now** = average of Aug 1–22 and Sep 1–22 (each month is exactly ₹45,600 by the 22nd).
- Late-night delivery = Swiggy/Zomato with hour ≥ 22. Oct pattern: Thu 1 Oct, then 13 from Tue 6 Oct on Tue–Thu (some nights have a second "dessert" order). Weeks of 5, 12 and 19 Oct have 4, 5 and 4 late orders.
- Fuzzy-find hooks: Chai Point has the note "near office"; Meghana Foods has the note "biryani". Nothing is labelled "gift" (for test Q6).
- Strangers' UPI IDs: autos, tea stall, provisions shop, barber, laundry.
- State files: `profile.json` (safe to spend ₹1,040/day, payday 31 Oct, savings rate 13% vs 21%, buffer 2.1 months), `budgets.json` (limits, 12 Oct Food change, empty `caps` for Penny to write into), `goals.json`, `bills.json` (card ₹5,482 due 28 Oct and later), `people.json` (Rahul ₹2,000 by 5 Nov, Sarah owes ₹540), `accounts.json` (balances are a snapshot, not derived from transactions).

## What `npm run check` prints
```
✓ Oct 1–22 spent                       52,400
✓ Usual by now (Aug/Sep 1–22 avg)      45,600
✓ Over usual                            6,800
✓ Food Oct                             14,600
✓ Food usual                            8,800
✓ Food share of jump (%)                   85
✓ Delivery Oct                          9,400
✓ Delivery usual                        4,000
✓ Delivery orders Oct                      22
✓ Delivery orders usual                    10
✓ After 10 pm Tue–Thu, Oct                 14
✓   …of those from 6 Oct                   13
✓ Shopping Oct                          7,200
✓ Transport Oct                         4,300
✓ Bills Oct                             5,500
✓ Today spent                             380
✓ Today left                              660

Info: 456 transactions Aug 1 – Oct 22, 142 in Oct 1–22 ("Checking 142 payments…")
Info: late delivery orders per week — before 6 Oct 1.0, since 5.4 (Mon–Sun weeks from 5 Oct: 4, 5, 4)
Info: today = Namma Metro ₹140, Chai Point ₹60, Uber ₹180

All checks pass
```
It exits with code 1 if any line fails. If you edit the generator, rerun `npm run data && npm run check`.

## Notes for the next sessions
- S2 (Home): replace `app/page.tsx` and `ComponentCheck.*`. Compute numbers from `lib/data.ts`; don't hard-code them.
- S3 (tabs): add `app/activity/page.tsx`, `app/plan/page.tsx` and `app/learn/page.tsx` using the layout pattern above.
- S4/S5 (Penny): open Penny with `<BottomSheet>` from `Dock.onPenny`. Put tool logic over `transactions` with `isSpend` and `istParts`.
- Git: Session 1 is commit `2d377c2` on `main`. Branch from it for each session.
