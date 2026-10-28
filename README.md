# PennyWise

A money companion for young earners in India. **Home** shows what's safe to spend today. **Penny**, the assistant, notices what changed, explains it step by step with charts, and only acts once you say OK.

Designed and built by **Kanishk Singh**, product designer. This repo is the first working slice of the design, built from my case study.

## What's in this slice
- **Home** working on real numbers from a synthetic dataset
- **Penny** (in progress): she uncovers patterns on her own, and answers plain-language questions using tool calls, never numbers from memory
- First screens of **Activity, Plan and Learn**

All data is synthetic. No real bank or personal data is used.

## Principles
Honest · Transparent · Accurate · You stay in control · Without judgement
- Every number Penny says comes from a tool result.
- Nothing changes without your OK, and every action can be undone.
- Penny never picks funds or stocks, never messages friends, never blocks a payment.

## Stack
- Next.js (App Router, TypeScript), plain CSS with CSS variables
- Penny's agents on an open model through Groq's free tier (OpenAI-compatible API, tool calling)
- Data as JSON shaped like India's Account Aggregator deposit data

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # verifies the dataset reproduces the case-study numbers
npm run data     # regenerates /data (seeded), then run check
```

## Design tokens ("copper at night")
| Token | Value | Use |
|---|---|---|
| ground | #0E0D0C | Screen background |
| surface | #181716 | Cards |
| raised | #252321 | Chips, inputs, selected tabs |
| rule | #2A2826 | Dividers, tracks |
| text / muted / faint | #F5F2ED / #B5B0A8 / #95908A | Text levels (all pass WCAG AA) |
| copper | #E39A6B | The only highlight |
| positive / negative / warning | #5CC48A / #EF6F6C / #E5A93B | Status |
| chart grey | #6B6661 | Data that isn't highlighted |

Categories (identity only): Rent #7D9BC9 · Food #D98CA6 · Shopping #A98BD9 · Bills #C9B48A · Transport #5FB3A8 · Other #8C8780

Type: Schibsted Grotesk, scale from Figure 32 to Tab 11. Spacing 4–40 on an 8-point scale, 20px side margins. Radius 8 · 14 · 20 · pill. All tokens live in [`app/tokens.css`](app/tokens.css).

## Structure
```
app/          pages, global styles, tokens.css
components/   Card, Row, Chip, SectionHeader, BottomSheet, Toast, Dock, CategoryIcon
lib/          data loading and formatting
data/         Amit's synthetic dataset (Aug–Oct)
scripts/      dataset generator and totals check
SPEC.md       build spec · SPRINT_PLAN.md · HANDOFF.md
```

## Status
Sprint 1 in progress: foundation done; Home, Penny's interface and Penny's agents next.
