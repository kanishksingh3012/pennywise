# PennyWise · Build spec (slice 1)

Read this first in every build session. It is the only context a session needs. Don't re-read the Figma file unless a block says so.

## Goal
A mobile-first web app on a shareable link where:
- **Home works** on real (synthetic) numbers.
- **Penny works both ways.** Flow A: she uncovers the late-night pattern herself and raises it on Home. Flow B: the user asks in plain language and gets real numbers, a chart and "How I got this", then a proposal that only happens after OK.
- **Activity, Plan and Learn** show their first screen (static).

## Scope
| Priority | Item |
|---|---|
| P0 | Home (working), Penny UI, Penny agents on Groq, both flows, deploy |
| P1 | Activity / Plan / Learn first screens (static) |
| P2 (stretch) | One tap per tab (Activity → search, Plan → change budget sheet, Learn → lesson), voice input, what-if slider |

Not in this slice: onboarding, branding, real Account Aggregator sandbox, profile, notifications, widget.

## Stack
- Next.js (App Router, TypeScript), plain CSS with CSS variables for tokens. No UI library.
- Deploy on Vercel (free). Mobile viewport 390 wide, works on desktop centred in a phone frame.
- LLM: **Groq free tier** through the OpenAI-compatible API (`openai` npm package, `baseURL: https://api.groq.com/openai/v1`). Key in `GROQ_API_KEY`, server-side only. Pick a current Groq model that supports tool calling at build time (check Groq's model list); keep the model name in one config constant so it can be swapped (Gemini free tier is the backup).
- Data: JSON files in `/data`, shaped like Account Aggregator deposit transactions. No database.

## Design tokens (from the Figma design system)
Colours: ground #0E0D0C · surface #181716 · raised #252321 · rule #2A2826 · text #F5F2ED · muted #B5B0A8 · faint #95908A · copper #E39A6B · copper-tint #33231A · positive #5CC48A · negative #EF6F6C · warning #E5A93B · chart grey #6B6661.
Categories (identity only, icons tinted 30%): Rent #7D9BC9 · Food #D98CA6 · Shopping #A98BD9 · Bills #C9B48A · Transport #5FB3A8 · Other #8C8780.
Font: Schibsted Grotesk (Google Fonts). Type scale: Figure 32/36 SemiBold · Title 24/28 SemiBold · Title 20/26 SemiBold · Value 24/30, 20/28, 16/24 Medium · Heading 16/22 SemiBold · Body 16/24, 15/22, 14/20 Regular (15/20, 14/20 Medium) · Label 14/20 SemiBold · Meta 13/18, 12/16 · Tab 11/14 Medium.
Spacing 4·8·12·16·20·24·32·40, side margins 20. Radius sm 8 · md 14 · card 20 · pill 999.

## Rules (enforce in code)
- Copper is the only highlight. Category colours are for identity. Never colour alone: pair with a label or number.
- One major chart per screen. Text ≥ 12px. Tap targets ≥ 44px.
- Toasts show on the screen where the action happened. Cards for things that last. Sheets for detail.
- **Every number Penny says comes from a tool result.** Never from the model's memory.
- **Nothing changes without OK.** Write actions go through `propose_action` → user taps Confirm → `confirm_action`. Undo available.
- Penny never picks funds or stocks, never messages friends, never blocks a payment.
- When unsure, she asks one question with chips. When the data can't answer, she says so and offers what she can do.

## Data (Amit, 24, Bengaluru, ₹85,000 take-home) · today is Thu 22 Oct 2026
- Accounts: HDFC Savings ₹24,800 · SBI Savings ₹6,400 · Cash ₹1,400 (ATM ₹2,000 Sun 18 Oct, ₹520 not logged) · HDFC Millennia card, ₹5,482 due Wed 28 Oct, limit ₹30,000.
- October 1–22: spent ₹52,400 (usual by now ₹45,600, +₹6,800). Food ₹14,600 vs usual ₹8,800 (+₹5,800 = 85% of the jump). Delivery ₹9,400 vs usual ₹4,000, 22 orders (usual 10), 14 of them after 10 pm Tue–Thu, starting around 6 Oct (before: ~1 late order a week, since: ~4).
- Safe to spend ₹1,040/day for 9 days to payday (Sat 31 Oct). Today spent ₹380 (Metro ₹140, Uber ₹180, Chai Point ₹60 cash), ₹660 left.
- Budgets: Food ₹10,000 · Shopping ₹10,000 (₹7,200 used) · Transport ₹6,000 (₹4,300) · Bills fixed ₹5,500. Last change: 12 Oct Food ₹9,000 → ₹10,000 "Friend's birthday dinner".
- Savings rate 13% (usual 21%) · buffer 2.1 months · Goals: Goa ₹18,600/₹30,000 mid-March (₹2,500/month) · emergency fund 2.1/3 months · pay back Rahul ₹2,000 by Thu 5 Nov. Sarah owes ₹540. SIP ₹5,000 on the 5th.
- Generate ~140 transactions for 1–22 Oct plus Aug–Sep history so "usual" can be computed. Late-night delivery orders (Swiggy/Zomato, ₹350–₹450) must reproduce the numbers above. Include a few payments to strangers' personal UPI IDs (rides, small shops).
- Transaction fields: `id, ts (ISO), amount, direction (debit|credit), mode (UPI|CARD|CASH|ATM|TRANSFER), account, merchant, payee_vpa, category, subcategory, note, location {area, lat, lng}`.

## Screens
**Home** (match "Home · final" in Figma): header (date, "Good evening, Amit", glass pill with bell and avatar) · small section tabs · Today card (spent ₹380 / left ₹660, day blocks, payments carousel) · Penny insights carousel (header with coin and dots top-right; first insight comes from the scan) · Cash flow card (All/UPI/Cash/Card tabs, In/Out/Left, pace chart, "How your money left" accordion, "Open full picture" → sheet) · Budget rings · Vitals · Needs you carousel · To review (top 3, See all) · Coming up (Th 22 – We 28 strip) · Where it went · floating dock (Home, Activity, Plan, Learn + Penny button).
**Penny** (sheet over the current screen): listening · thinking ("Checking 142 payments…") · answer bubble + chart + "How I got this" (expandable tool trace) · chips for follow-ups · clarifying question chips · confirm card (what I'll do / won't do) · toast after confirm, inside Penny · edge states (not sure, not enough data, I don't know).
**Charts:** vs-usual bars (copper highlight on the biggest change) · food stack · day × time heat map · weekly trend with a marker · what-if (stretch).
**Tabs (static, P1):** Activity hub, Plan hub, Learn first screen, copied from "Final · Activity", "Final · Plan", "Final · Learn" in Figma.

## Penny's agents and tools
Lead **Penny** routes to **Analyst** (answers with numbers), **Sorter** (labels payments, stretch) and **Coach** (proposals). One loop: understand → tool calls (several if needed) → analyse → reply with chart → suggest → act only after OK → save memory.

Tools (keep to these, general not one-per-question):
- `query({category?, subcategory?, merchant?, person?, account?, mode?, from?, to?, weekday?, hour_from?, hour_to?, min?, max?})` → payments
- `aggregate({filter, group_by: category|merchant|weekday|hour|week|day|account|mode, measure: sum|count|avg})`
- `compare({filter, period, baseline: usual|last_month|same_weekday})` → value, baseline, delta, share of jump
- `find({text})` → fuzzy match merchants, people, notes ("that biryani place")
- `show_chart({type: vs_usual|stack|heatmap|trend|what_if, data, highlight?})` → rendered by the UI
- `get_state()` → budgets, goals, safe-to-spend, bills, caps
- `propose_action({type: set_cap|change_budget|label|reserve|create_goal, params, will, wont})` → confirm card
- `confirm_action({proposal_id})` → only callable after the user taps Confirm
- `save_note({text})` → memory

**Scan (flow A):** compare every slice (category × weekday × hour band, merchant, account) of the last 3 weeks against the user's own Aug–Sep normal; flag the biggest changes with a start date. The top finding becomes the first Home insight. Penny phrases it and asks why; she never hard-codes "late-night".

**Memory:** current chat · saved notes (pull only relevant ones) · a small monthly profile (usual spend per category, payday, bills).
**Prompt:** include today's date, the rules above, and the tool list. Validate tool arguments; retry once on a bad call.

## Flows to demo
- **Flow A (Penny uncovers):** Home insight "4 late-night orders this week" → Ask why → big picture (vs-usual bars) → Food stack → heat map → "Something changed around 6 Oct. What was it?" chips → what-if → confirm cap ₹1,500/month + Goa earmark → toast in Penny → Home shows "Penny is watching".
- **Flow B (you ask):** "Where is my money going this month?" → same chain, driven by the question.

## Test questions (Penny must pass 8 of 10)
1. Where is my money going this month? 2. Why am I broke by the 20th? 3. kal kitna kharcha hua? 4. How much on that chai place near office? 5. Is it weekends or weeknights? 6. What did I spend on gifts? (no label → honest) 7. How much did I spend at Swiggy after 10 pm? 8. Am I on track for Goa? 9. Which card bill is due and when? 10. Should I buy Nifty 50 funds? (no picks → Learn)

## Definition of done
Link opens on a phone · Home numbers come from data · Flow A and Flow B work end to end with tool traces · confirm updates Home · 8/10 test questions pass · 60-second demo recorded.

## References
Figma: the design file is shared on request · pages: Pennywise (Home · final, Penny flow F1–F9, Penny flow v2, edge states, Final sections, Design system), Deck, Research, Explorations.
