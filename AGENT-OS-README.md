# agent-os

> **A boilerplate for the operating substrate of an AI-native organization.**
> 4-tier truth model + governance + memory + economic instrumentation + cross-tier consistency. Fork it, customize it for your org, run it.

[![status: v0.1](https://img.shields.io/badge/status-v0.1-yellow)]() [![license: UNLICENSED](https://img.shields.io/badge/license-UNLICENSED-lightgrey)]()

---

## What this is

`agent-os` is the operating-OS substrate that runs around your product. It is **not** the product itself. The product (the thing your users interact with) lives in a separate codebase. This repo is the AI workforce that operates the company *around* the product: marketing, sales, content, customer success, finance, compliance, AI-Ops itself.

It's extracted from a real, in-flight Operating-OS (`ritsu-works`) and scrubbed of org-specific identity. What survives is the architecture and the discipline.

### What you get out of the box

- **4-tier truth model** — Tier 1 (PR-governed git), Tier 2 (Postgres / Supabase), Tier 3 (storage), Tier 4 (rebuildable derived). Every kind of company truth has one canonical home.
- **HITL tier policy** — A / B / C / D-Std / D-MAX. The agent knows which actions can be autonomous and which require ceremony, codified in a 398-line policy doc.
- **22 sequential Supabase migrations** — `ops.tasks`, `ops.agent_runs` (with HITL audit immutability), `ops.run_summaries` (memory), `ops.cost_attributions` (economic), `ops.consistency_checks` (cross-tier engine), `ops.kpi_snapshots`, knowledge graph tables, RLS policies, pg_cron setup. Schema-in-git, data-in-DB.
- **Strategy E memory architecture** — episodic recall via `ops.run_summaries` queried at task start. No file-based memory tool by default.
- **Economic instrumentation** — per-role budgets with 80% / 100% / 150% escalation, daily reconciliation against your LLM provider's billing API.
- **Cross-tier consistency engine** — L1/L2/L3 invariant sweeps that catch drift between Tier 1 docs and Tier 2 reality before it bites you.
- **Schedule dispatcher + minion-worker** — pg_cron-driven workers that pick up scheduled SOPs and run them.
- **Hooks framework** — 9 pre-tool hooks for safety (dangerous bash, secrets access, customer messages, publish gates, edit-tier1 protection, budget pre-check).
- **Skills framework** — 8 starter skills (episodic-recall, task-decompose, cost-report, monthly-learning-review, etc.) and a SKILL.md convention compatible with Claude Code's progressive-disclosure model.
- **Knowledge graph** — pgvector HNSW embeddings inside Postgres, populated from wiki notes and Tier 3 artifacts.

### What it deliberately does NOT include

- **Empty pillars.** `01-growth`, `02-customer`, `03-product`, `04-content`, `06-finance`, `07-compliance`, `08-integrations` ship as empty README stubs. You fill in the pillars relevant to your org. **If you don't need a pillar, delete the directory.**
- **Industry-specific roles.** The starter `governance/ROLES.md` defines 3 generic roles (`gps`, `content-drafter`, `etl-runner`). Add specialist roles as your workforce grows.
- **A live workforce.** This boilerplate is **load-tested in shape, not in operation**. The architecture is sound, but no single pillar has run end-to-end yet. Picking one pillar and running it through the loop is your first test.

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/${GITHUB_OWNER}/agent-os.git my-org-os
cd my-org-os

# 2. Install deps
pnpm install

# 3. Run init wizard (interactive)
pnpm init
# Answers: ORG_NAME, FOUNDER_NAME, FOUNDER_EMAIL, TIMEZONE, SUPABASE_OPS_PROJECT_REF,
#         DEPLOYMENT_MODE, PILLARS_ENABLED, etc.
# Outputs: every ${PLACEHOLDER} substituted across Tier 1 files,
#          runtime/secrets/.env.local pre-filled, .wizard-history.md written.

# 4. Open in Claude Code (or your AI coding agent of choice)
claude code .

# 5. Paste DEPLOY.md into the AI session
# The AI walks you through Supabase provisioning, secret setup,
# smoke test — with HITL gating at every irreversible step.
```

After deploy: pick **one** pillar, fill it in, run a real workflow through it. The architecture is theory until a pillar runs end-to-end.

## Architecture in one diagram

```
Tier 1 — Canonical          → git (this repo)        → identity, strategy, SOPs
Tier 2 — Operational        → Supabase (your ops DB) → live state
Tier 3 — Events & Artifacts → Supabase Storage       → append-only logs
Tier 4 — Derived            → pgvector (in Tier 2)   → rebuildable embeddings

Workspace plane (transient, not authoritative):
  raw/        → local-only intake (PDFs, recordings, exports)
  wiki/       → extracted reference knowledge (synced; underscore prefix = local)
  .archives/  → local-only scratch
```

Operating Supabase is **separate** from your Product Supabase. The Operating AI cannot harm a paying user.

The full data contract lives in [`knowledge/manifest.yaml`](./knowledge/manifest.yaml). Read it before assuming where data lives.

## Repo layout

```
00-charter/         identity (mission, brand voice, founder profile, transparency)
01-growth/          marketing, sales, partnerships pillar (stub)
02-customer/        customer ops pillar (stub)
03-product/         product ops pillar (stub)
04-content/         content production pillar (stub)
05-ai-ops/          THE meta-framework — skills, SOPs, the workforce that builds the workforce
06-finance/         finance & accounting pillar (stub)
07-compliance/      trust & safety, privacy, AI law (stub)
08-integrations/    external APIs, MCP server hosting (stub)

governance/         HITL policy, ROLES, IDENTITY, BUDGET, SECRETS
knowledge/          manifest.yaml + per-tier yaml configs + JSON schemas
                    + memory-architecture.md, economic-architecture.md, etc.
.claude/            agent runtime (hooks, commands)
supabase/           migrations + edge functions (minion-worker, scheduled-run-dispatcher)
scripts/            validators, bundlers, init wizard
tests/              vitest suite
wiki/               reference notes (mostly empty in boilerplate)
notes/              SOURCE-PROVENANCE, SUBSTITUTION-GUIDE
DEPLOY.md           the Claude Code deployment prompt
INIT.md             init wizard documentation
```

## How the substrate is meant to be used

Per the operating discipline:

1. **Read before write.** View existing files in the relevant pillar before creating new ones.
2. **PR everything Tier 1.** No direct commits to canonical files.
3. **Schema in git, data in DB.** Before querying Tier 2, read the schema definition.
4. **Idempotent + dry-runnable.** Any action touching Tier 2/3 supports `--dry-run`.
5. **Cite, don't paraphrase.** When referencing a charter or SOP, link the path.
6. **Cost awareness.** Each role has a monthly budget; track in `ops.agent_runs`.
7. **HITL for irreversible work.** Per `governance/HITL.md`. When in doubt, escalate one tier up.

## Provenance

- Source: [`${GITHUB_OWNER}/ritsu-works`](https://github.com/${GITHUB_OWNER}/ritsu-works) @ commit `5dca72c` (2026-05-14)
- Extraction process: see [`notes/SOURCE-PROVENANCE.md`](./notes/SOURCE-PROVENANCE.md)
- Substitution variables: see [`notes/SUBSTITUTION-GUIDE.md`](./notes/SUBSTITUTION-GUIDE.md)
- Original CEO review that recommended (then declined) deferred extraction: archived in source repo

## License

UNLICENSED — see [`LICENSE`](./LICENSE). The repo is publicly visible so other founders + AI agents can read the architecture, but the code is not legally free to fork or redistribute. To request a license, contact the source repo owner.

## What to read next

In order:

1. **[`CLAUDE.md`](./CLAUDE.md)** — the agent-onboarding contract; loaded on every session start.
2. **[`knowledge/manifest.yaml`](./knowledge/manifest.yaml)** — the truth-tier data contract.
3. **[`governance/HITL.md`](./governance/HITL.md)** — the safety model. Non-negotiable.
4. **[`governance/ROLES.md`](./governance/ROLES.md)** — role permissions schema + 3 starter roles.
5. **[`DEPLOY.md`](./DEPLOY.md)** — paste into Claude Code in a fresh clone for guided bootstrap.
6. **[`INIT.md`](./INIT.md)** — what the init wizard does and how to re-run it.

If you're going to operate this substrate, also read `knowledge/economic-architecture.md`, `knowledge/memory-architecture.md`, and `knowledge/orchestration-architecture.md` — they explain *why* the Tier 2 schema looks the way it does.
