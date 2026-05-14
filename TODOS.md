# TODOs

> First-mile work after cloning agent-os for a new organization. Append-only; do not delete completed items — move to a `## Done` section instead.

## P1 — First session after `pnpm init`

### A1 — Fill in 00-charter
The wizard substitutes `${PLACEHOLDER}` variables but cannot fill in your specific:
- mission, vision, core values (`charter.md`)
- product positioning, target personas, capabilities (`product.md`)
- brand voice rules, DO/DON'T, samples (`brand_voice.md`)
- founder cognitive style and capacity signals (`founder-profile.md`)
- regulatory obligations checklist (`transparency.md`)

**Why:** every agent reads these on session start. Empty stubs produce empty agent reasoning.
**Effort:** S–M (~30–60 min CC) — you don't need to fill everything; fill what's load-bearing for your first pillar.
**Blocks:** any meaningful pillar work.

---

### A2 — Choose your pillars
The boilerplate ships with 7 pillar slots (`01-growth, 02-customer, 03-product, 04-content, 06-finance, 07-compliance, 08-integrations`). Most orgs need 3-5, not all 7. Decide and `rm -rf` the ones you don't need; update `knowledge/manifest.yaml` accordingly.

**Why:** empty pillars create cognitive overhead and false expectations.
**Effort:** S (~15 min decision + cleanup).
**Surfaced from:** boilerplate convention.

---

### A3 — Pick one pillar to prove end-to-end
The architecture is theory until a pillar runs the full loop (HITL → cost → memory → knowledge → audit). Pick the pillar that exercises the most substrate (recommendation: `02-customer/support-agent` or `01-growth/growth-orchestrator`). Run a real workflow through it. THEN extract more.

**Why:** the original CEO review of the source repo flagged this as the #1 risk of forking the substrate prematurely. Mitigate by proving one pillar first.
**Effort:** XL (~quarter).
**Blocks:** confidence in the substrate's load-bearing fitness.

---

## P2 — First month

### B1 — Add your specialist roles to governance/ROLES.md
The boilerplate ships with 3 generic roles (`gps`, `content-drafter`, `etl-runner`). Most orgs add 3-5 more (e.g., `growth-orchestrator`, `support-agent`, `code-reviewer`, `trust-safety`, `backoffice-clerk`). Each new role needs a row in `governance/ROLES.md`, a runtime config in `.claude/agents/<role>.md`, and identity provisioning in `governance/IDENTITY.md`.

**Effort:** M per role (~30 min CC).

---

### B2 — Provision Supabase ops project + apply migrations
The boilerplate ships 22 migrations. The wizard does NOT apply them. Provision a fresh Supabase project, set `SUPABASE_OPS_PROJECT_REF` in `.env.local`, then `supabase link --project-ref ${SUPABASE_OPS_PROJECT_REF}` and `pnpm db:push`. The DEPLOY.md prompt walks you through this with HITL gating.

**Effort:** S (~10 min if Supabase project exists; ~20 min including project creation).

---

### B3 — First end-to-end test of memory loop
After running 5+ tasks via your first pillar role, verify:
- `ops.agent_runs` has rows
- `ops.run_summaries` has corresponding summary rows
- `episodic-recall` skill returns useful context for new tasks of the same kind

**Why:** validates the Strategy E memory architecture is actually wired up, not just defined in tables.
**Effort:** S (~15 min verification).

---

## P3 — Eventually

### C1 — Calibrate budget thresholds
Default thresholds (80%/100%/150%) are conservative starting points. After 30+ days of `ops.cost_attributions` data, tune `economic_budget.monthly_cap_usd` per role to reflect actual usage.

---

### C2 — Configure cron schedules beyond minion-worker tick
The boilerplate ships pg_cron setup for the minion-worker tick only. As you add scheduled SOPs, register them in `knowledge/schedules.yaml` and run `pnpm wave2:bundle-schedules`.

---

### C3 — Configure consistency engine invariants for your org
`knowledge/cross-tier-invariants.yaml` ships with substrate-only invariants. Add invariants specific to your org's data model.

---

### C4 — Audit `notes/SUBSTITUTION-GUIDE.md` and remove unused placeholders
After init, some `${PLACEHOLDER}` variables you didn't use may still litter Tier 1 files. Optional cleanup pass.

---

## Done
(empty)
