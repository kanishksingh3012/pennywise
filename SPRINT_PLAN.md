# PennyWise · Sprint 1 plan

**Dates:** Tue 27 Oct → Thu 29 Oct, 9:30 pm (limit reset) · **Model:** Opus 5.5 for every session · **Budget:** about 15% of the weekly limit (starting at 85% used)
**Goal:** a phone link where Home works, Penny works both ways (she uncovers, you ask), and the main tabs show their first screen.

## Sessions (each one reads SPEC.md only)
| # | Session | Owner | When | Usage | Depends on |
|---|---|---|---|---|---|
| T1 | Publishing check + LinkedIn draft | Kanishk | Tue | 0% | — |
| T3 | Close the slice's design with Figma AI: F9 on the final Home, Penny thinking state, "How I got this" trace, clarifying chips, post-confirm toast, motion notes | Kanishk | Tue | 0% | — |
| S1 | Setup, tokens, Amit's dataset, shared components (card, row, chip, sheet, toast, dock) | Claude | Tue | ~3% | — |
| S2 | Home, working (numbers from data, interactions) | Claude | Wed | ~4% | S1 |
| S4 | Penny UI (chat, states, charts, trace, confirm card) | Claude | Wed–Thu | ~4% | S1 |
| S5 | Penny's brain on Groq (tools, scan, memory, 10 test questions) | Claude | Thu | ~5% | S4 |
| S3 | Tab first screens (static) | Claude | Thu, if budget allows | ~2% | S1 |
| S6 | Deploy to Vercel + demo video | Kanishk + Claude | Thu evening | ~1% | S2, S5 |

S2, S3 and S4 can run side by side once S1 is done. S5 waits for S4.

## Cut order (Opus-only budget is tight)
1. One tap per tab (already stretch) 2. Voice input 3. What-if slider 4. Tab first screens (S3) 5. Heat-map interactions
Penny's depth (S4, S5) is protected.

## Kanishk's checkpoints
- Tue night: T3 designs ready, S1 merged
- Wed evening: 30-minute phone review of Home
- Thu evening: final run of Flow A, Flow B and the test questions, record the demo

## Risks
- Groq free-tier limits → cache the two demo flows, Gemini free tier as backup
- Open model calls tools badly → few general tools, argument checks, one retry, the test set
- Limit runs out early → a scripted Penny on the real shell still demos well; the brain lands after the reset

## After the reset (Fri–Sun, sprint 2)
Remaining tabs and one-tap screens · onboarding / first minute · branding (logo, icon, splash) · Account Aggregator sandbox
