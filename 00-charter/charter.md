# ${ORG_NAME} — Operating Charter

> Vision, market, monetization, cognitive style, and boundaries. The single canonical answer to "what is ${ORG_NAME}?"

**Status:** v0.1 (boilerplate stub — fill in)
**Last updated:** YYYY-MM-DD
**Project:** ${ORG_NAME}
**Domain:** ${PRODUCT_DOMAIN}

---

## Mission

[1-2 sentences. What ${ORG_NAME} exists to accomplish. Avoid platitudes; be specific about who is helped and how their life changes.]

## Vision

[The world ${ORG_NAME} is trying to create over the next 5-10 years. Concrete enough that you can tell whether you're moving toward it or not.]

## Category

**${ORG_CATEGORY}** — [one-line market positioning]

## Monetization

[How ${ORG_NAME} makes money. Subscription / transactional / ads / services / etc. Per-customer economics if known.]

## Boundaries — what ${ORG_NAME} is NOT

- [common misconception 1]
- [common misconception 2]
- [a category we are explicitly choosing not to play in]

## Core values

3-5 values, each phrased as a behavior the org will or will not accept. Examples:

- **[Value 1]** — [what it means in practice; what it forbids]
- **[Value 2]** — [...]
- **[Value 3]** — [...]

> Values that don't forbid anything aren't values; they're advertising.

## Operating principles (non-negotiable)

These constrain every agent and every human who touches the operating repo.

1. **Read before write.** View existing files in the relevant pillar before creating new ones.
2. **PR everything Tier 1.** No direct commits to canonical files (`00-charter/`, `governance/`, any `SOP-*`).
3. **Schema in git, data in DB.** Before querying Tier 2, read the schema definition.
4. **Idempotent + dry-runnable.** Any action touching Tier 2/3 supports `--dry-run` and prefers it when uncertain.
5. **Cite, don't paraphrase.** When referencing a charter or SOP, link the path.
6. **Cost awareness.** Each role has a monthly budget in `governance/ROLES.md`. Track in `ops.agent_runs`.
7. **HITL for irreversible work.** Per `governance/HITL.md`. When in doubt, escalate one tier up.

[Add or modify principles as the org grows. Removing one requires a PR with rationale.]

---

## How to populate this file

1. Replace bracketed placeholders with your specific content.
2. The init wizard substitutes `${ORG_NAME}`, `${ORG_CATEGORY}`, `${PRODUCT_DOMAIN}` automatically.
3. Commit. Future agents read this on every session start.

Once committed, treat as load-bearing. PRs only.
