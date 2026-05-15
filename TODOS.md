# TODOs

> First-mile work after cloning agent-os for a new organization. Append-only; do not delete completed items — move to a `## Done` section instead.

## P0 — Decide pillar layout BEFORE running init wizard

### A0 — Pick your pillar set
The boilerplate ships 7 starter pillars (B2C product company shape) but the wizard
also offers a CUSTOM mode where you supply your own pillar slugs. Decide before
running `pnpm init`. See [`notes/PILLAR-EXAMPLES.md`](./notes/PILLAR-EXAMPLES.md)
for example layouts (B2B SaaS, AI film studio, personal-OS, agency, e-commerce, etc.).

**Effort:** S (~10 min decision).
**Why:** Renaming pillars after init requires manual cleanup.

---

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

### A2.5 — Add real personas (replace `gpt` placeholder)
The boilerplate ships ONE placeholder persona (`gpt`) bound to the `gps` role.
Replace with your real C-suite (typically `ceo` always; `cto` if shipping code;
`cgo` if doing GTM; `cpo` if shipping product; `cmo`, `cso`, `cfo`, etc. as you
grow). See [`notes/WORKFORCE-PERSONAS-USAGE.md`](./notes/WORKFORCE-PERSONAS-USAGE.md)
for the full guide.

**Why:** Personas are the founder-facing interface (`/ceo`, `@cto`). Until real
personas exist, you can only invoke `/gpt`.
**Effort:** S per persona (~15 min CC). M if you also implement the runtime hooks
(persona attribution to `ops.agent_runs.persona_slug`).

---

### A2.6 — Update `cla-routing-keywords.yaml` to match your real personas
The boilerplate ships ONE placeholder route (`general` → `gpt`). Add per-domain
routes (`growth` → `cgo`, `product` → `cpo`, `code` → `cto`, etc.) once your
real personas are in. See [`notes/CLA-USAGE.md`](./notes/CLA-USAGE.md).

**Why:** `/cla propose` uses these routes to dispatch domain analysis to the
right CxO. Without real routes, every CLA proposal falls back to founder.
**Effort:** S (~15 min) once personas exist.

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

### C5 — Implement persona hook runtime
The persona framework ships with hook SPECS (`.claude/hooks/{pre-persona-resolve,post-persona-log}.md`)
but no runtime code. Until implemented, persona invocations work but
`ops.agent_runs.persona_slug` stays NULL. See [`notes/WORKFORCE-PERSONAS-USAGE.md`](./notes/WORKFORCE-PERSONAS-USAGE.md)
"Hook implementation gap" section for the implementation contract.

**Effort:** L (~30-50h to implement properly with tests).
**When:** Defer until you have ≥3 personas active and want to compare effectiveness.

---

### C6 — Use `/cla propose` for your first capability
After your charter + first persona + first pillar are in, ship your first real
capability via the CLA workflow. This exercises the most substrate (8 phases of
ceremony, HITL gating, cost tracking, persona dispatch, audit logging).

**Effort:** L per capability (~quarter for first; smaller after).
**Why:** The architecture is theory until a capability ships through it. CLA is
your fastest path to that proof.

---

## Done
(empty)
