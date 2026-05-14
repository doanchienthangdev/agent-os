---
type: identity
slug: founder/${FOUNDER_SLUG}
created_at: YYYY-MM-DD
last_assessed_at: YYYY-MM-DD
---

# ${FOUNDER_NAME} — Founder Profile

> Single source of truth for who the founder is, how they think, and what they need from the AI workforce.
>
> Every agent reads this on session start (per `CLAUDE.md`) so it can match the founder's working style, escalation thresholds, and decision rhythm.

---

## Identity

- **Name:** ${FOUNDER_NAME}
- **Email:** ${FOUNDER_EMAIL}
- **Timezone:** ${FOUNDER_TIMEZONE}
- **Primary working hours:** [e.g., 09:00–18:00 weekdays, plus 21:00–23:00 deep work]
- **Locale primary:** ${PRIMARY_LOCALE}
- **Background (1-3 lines):** [where founder came from, what shaped their thinking]

## Cognitive style

- **How founder thinks:** [analytical / intuitive / pattern-matching / first-principles / etc. Pick 1-2 dominant modes.]
- **How founder decides:** [data-first / gut-first / collaborative / dictator / etc.]
- **What founder is fastest at:** [the work that energizes them and produces 10x output]
- **What founder is slowest at:** [the work that drains them — agents should compensate]
- **Bias to flag:** [a known cognitive bias the founder watches for, e.g., "tends to under-estimate UX time", "over-trusts strangers initially"]

## What founder needs from the workforce

- **Default communication style:** [terse / detailed / bulleted / narrative]
- **When to interrupt:** [only for HITL Tier C+ / for blockers / for surprising data / never during deep work]
- **How to deliver bad news:** [headline-first / context-first / with options]
- **How to ask questions:** [one at a time / batched / with recommended option labeled]

## Boundaries (what founder does NOT want delegated)

- [Specific decision class founder reserves]
- [Specific external relationship founder reserves]
- [Specific category of public statement founder reserves]

## Capacity signals

When founder is at capacity, agents should down-shift to lower-tier autonomous work and batch updates. Capacity proxies:

- Hours since last commit
- Open-but-unread Telegram messages count
- `ops.attention_log` entries (founder-explicit signals)

## Founder rhythm reference

Daily/weekly cadence lives in [`knowledge/founder-rhythm.yaml`](../knowledge/founder-rhythm.yaml). This file is the **identity**; `founder-rhythm.yaml` is the **schedule**.

---

## How to populate this file

1. Replace bracketed placeholders during init wizard or manually.
2. Re-assess every quarter — your cognitive style and capacity change as the company grows.
3. Update `last_assessed_at` when you do.

This file is read on every session start. Keep it accurate; agents calibrate against it.
