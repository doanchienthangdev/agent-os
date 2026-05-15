# CLA Usage — Capability Lifecycle Architecture

> A short guide to using `/cla` in your fresh agent-os clone.

## What CLA does

CLA is a structured workflow for shipping new capabilities (features, SOPs,
infrastructure changes) through 8 phases:

```
Phase 0 — Drift pre-flight (run pnpm check; abort if fails)
Phase 1 — Problem framing (what are we solving? for whom?)
Phase 2 — Domain deep-dive (route to right CxO; analyze)
Phase 3 — System inventory (what already exists? what's missing?)
Phase 4 — Options generation (3-5 approaches with tradeoffs)
Phase 5 — Architecture (the chosen option in detail; HITL Tier C approval)
Phase 6 — Sprint planning (Wave alignment; cost estimate; dependencies)
Phase 7 — Implementation (per-PR with @cto code review)
Phase 8 — Catalog promotion (move from .archives/cla/ to wiki/capabilities/;
                              update capability-registry.yaml)
```

For evolving an EXISTING capability, use sub-flows:

```
/cla fix <id>        — bug fix (Tier B, ~$0.50, 30min-2h)
/cla extend <id>     — scope expansion (Tier B; auto-escalates to C if ≥20% diff)
/cla revise <id>     — architecture revision (full Tier C ceremony, ~$3-5)
/cla tune <id>       — KPI re-tuning (Tier B, ~$0.10, 10min)
/cla deprecate <id>  — sunset capability (Tier C, irreversible)
/cla history <id>    — show lineage chain (read-only)
```

## Boilerplate state

Your fresh agent-os clone ships with the CLA framework wired in:

- ✅ Slash command `/cla` (in `.claude/commands/cla.md`)
- ✅ Subagent `@cla` (in `.claude/agents/cla.md`)
- ✅ 10 capability-lifecycle skills under `06-ai-ops/skills/capability-lifecycle/`
- ✅ 6 SOPs (master + fix/extend/revise/tune/deprecate) under `06-ai-ops/sops/`
- ✅ Database migrations 00011 + 00025 (capability tables + lock columns)
- ✅ Routing keywords yaml (`knowledge/cla-routing-keywords.yaml`) with 1
      placeholder route mapping to `gpt` persona
- ✅ Capability registry yaml (`knowledge/capability-registry.yaml`) — empty
- ✅ Validator (`scripts/cross-tier/validate-cla-routing-keywords.cjs`) wired
      into `pnpm check`
- ✅ Tests (`tests/cla/*.test.ts`) — 18 test files, 128+ test cases

## What you need to use CLA

1. **Apply the migrations** (`supabase db push` from your linked Supabase project)
2. **Populate `knowledge/cla-routing-keywords.yaml`** with your real CxO routes
   (replace the placeholder `general` route)
3. **Populate `knowledge/workforce-personas.yaml`** with your real personas
   (replace the placeholder `gpt` persona)
4. **Have a real role in `governance/ROLES.md`** that handles capability
   architecture decisions (typically `code-reviewer` or `cto`-bound persona)

## First-time `/cla propose` walkthrough

In your first use:

```
> /cla propose "Add weekly digest email to existing customers"
```

The workflow will:

1. **Phase 0:** Run `pnpm check`. Must pass before proceeding.
2. **Phase 1:** Ask you to fill in `.archives/cla/<capability-id>/problem.md`
   with: what problem, for whom, what would success look like.
3. **Phase 2:** Scan your problem statement against
   `knowledge/cla-routing-keywords.yaml`. Match → dispatch to that route's CxO.
   No match → use ambiguous_fallback (default: `founder_decides`).
4. **Phase 3:** Auto-scan `06-ai-ops/skills/`, `*/sops/`, `supabase/migrations/`
   to find what already exists that solves a similar problem.
5. **Phase 4:** Generate 3-5 implementation options with tradeoffs.
6. **Phase 5 (Tier C):** Propose architecture in detail. Wait for founder
   approval.
7. **Phase 6:** Break into a sprint with cost estimate.
8. **Phase 7:** Per-PR implementation with code review.
9. **Phase 8:** Promote artifacts from `.archives/cla/<id>/` to
   `wiki/capabilities/<id>/`. Update `capability-registry.yaml`. Set
   `state: deployed`.

## Where artifacts live

```
.archives/cla/<capability-id>/        ← working folder (gitignored, local-only)
  ├── README.md
  ├── problem.md
  ├── domain-analysis.md
  ├── gap-analysis.md
  ├── options.md
  ├── spec.md                          ← architecture (the load-bearing doc)
  ├── sprint-plan.md
  ├── retrospective.md
  └── refs/                            ← screenshots, transcripts, etc.

wiki/capabilities/<capability-id>/     ← promoted on Phase 8 (committed, synced)
  ├── README.md
  ├── spec.md                          ← canonical capability spec
  └── retrospective.md                 ← what worked, what didn't
```

## The `_TEMPLATE` folder

`.archives/cla/_TEMPLATE/` ships with stub artifact files. Phase 0 copies these
to `.archives/cla/<your-capability-id>/` to bootstrap a new run. Don't edit the
TEMPLATE files directly unless you want to change the bootstrap shape for ALL
future capabilities.

## Sub-flows in detail

- **`/cla fix <id>`** — small bug, no scope change. Skips Phases 1-5; jumps
  to Phase 7 (implementation) + Phase 8 (catalog update with patch version
  bump). Cost: ~$0.50, time: 30min-2h with CC+gstack.

- **`/cla extend <id>`** — adds new functionality to existing capability.
  Spec diff > 20% lines OR touches Section 4 (components) auto-escalates to
  full Tier C ceremony (revise sub-flow). Cost: $1-3.

- **`/cla revise <id>`** — architecture revision. Full Tier C ceremony from
  Phase 1. New spec.md (major version bump). Old spec archived as
  `spec-v<X.Y.Z>.md`. Cost: $3-5.

- **`/cla tune <id>`** — KPI threshold re-tuning. No code changes. Just
  updates `kpis.md` and capability-registry.yaml entry. Cost: ~$0.10.

- **`/cla deprecate <id>`** — sunset. Disables associated SOP schedules,
  marks capability state=deprecated, optionally keeps spec for reference.
  Tier C ceremony (irreversible).

- **`/cla history <id>`** — read-only lineage query. Walks
  `ops.v_capability_lineage` view recursively to show supersedes_id chain.

## When NOT to use /cla

- **Bug fixes within an existing PR** — just commit the fix; no need for
  ceremony.
- **Documentation-only changes** — open a PR; CLA is for capabilities with
  code/schema/SOP impact.
- **Experimental spikes** — use `.archives/spikes/<name>/` for throwaway work;
  CLA workflow is for things you intend to ship.
- **First-time-anything in a fresh org** — write the capability manually first;
  use CLA for the SECOND capability (so you're testing CLA against an existing
  proven pattern).

## Customizing CLA for your org

The biggest customization knob is **routes in
`knowledge/cla-routing-keywords.yaml`**. The placeholder boilerplate has 1
route (`general` → `gpt`). For a real org you'll add 5-10 routes mapping
domain keywords (growth, product, code, marketing, etc.) to your real CxO
personas. See `notes/PILLAR-EXAMPLES.md` and
`notes/WORKFORCE-PERSONAS-USAGE.md` for related guidance.

The other heavy customization point is the persona dispatcher itself — the
8 capability-lifecycle skills currently invoke `@cto`, `@muse_panel`, and
`@<cxo>` personas. If your org uses different persona slugs, edit each skill
file to match. Search `06-ai-ops/skills/capability-lifecycle/` for `@cto` to
find dispatch points.
