# Workforce Personas — Usage Guide

> The persona framework lets you separate WHO is asking (the "façade" — CEO,
> CTO, CGO, etc.) from WHAT permissions they have (the "role" — gps, code-reviewer,
> growth-orchestrator, etc.). One persona binds to one role.

## Why personas exist

Without personas: every action is attributed to a role like `code-reviewer`.
You can't easily ask "what did the CTO recommend this week?" or filter founder
attention by C-suite identity.

With personas: every `ops.agent_runs` row carries BOTH `agent_slug` (the role
doing the work) AND `persona_slug` (the C-suite façade that routed/invoked it).
You can query: "Show me all `persona_slug='cto'` runs from the last 7 days
where outcome='rejected'."

The persona is the **interface** the founder talks to. The role is the
**permission set** that does the work.

## The three planes

```
PERSONA          ROLE                      PILLAR
(façade)         (permissions/budget)      (operational area)
─────            ───────────────           ──────
ceo      ──→     gps                ──→    cross-cutting
cto      ──→     code-reviewer      ──→    06-ai-ops (or your code pillar)
cgo      ──→     gtm-orchestrator   ──→    01-growth (or your gtm pillar)
cpo      ──→     product-orchestrator ─→   03-product (or your product pillar)
gpt ★    ──→     gps                ──→    cross-cutting
```

★ = the boilerplate placeholder. Bound to `gps` so the framework validates out
of the box. Replace with real personas as your org grows.

## Boilerplate state

Your fresh agent-os clone ships with:

- ✅ Schema (`knowledge/schemas/workforce-personas.schema.json`)
- ✅ Validator (`scripts/cross-tier/validate-personas.cjs`) — wired into
      `pnpm check` as L2 critical
- ✅ Hook specs (`.claude/hooks/{pre-persona-resolve,post-persona-log}.md`)
- ✅ Database migration 00024 (`ops.agent_runs.persona_slug` column + index)
- ✅ Registry (`knowledge/workforce-personas.yaml`) with 1 placeholder persona
      (`gpt`)
- ✅ Persona spec folder (`06-ai-ops/workforce-personas/gpt/` with 8 canonical
      files: README, PERSONA, playbook, routing-matrix, kpis, agent, command,
      dossier)
- ✅ Runtime files (`.claude/agents/gpt.md`, `.claude/commands/gpt.md`)
- ✅ Back-reference (`personas_bound: [gpt]` on the `gps` role in
      `governance/ROLES.md`)
- ⚠️ Hook RUNTIME is NOT implemented — hooks are spec-only. `ops.agent_runs.persona_slug`
      will stay NULL until you implement the hooks. See "Hook implementation
      gap" below.

## Adding a real persona (full walk-through)

Let's say you want to add a CTO persona for your org.

### 1. Add the persona block

Edit `knowledge/workforce-personas.yaml`:

```yaml
personas:
  gpt:
    # ... existing placeholder ...

  cto:
    full_name: Chief Technology Officer
    phase: 1
    status: active
    pillar_home: 06-ai-ops/workforce-personas/cto/
    binds_to:
      primary: code-reviewer
    invocations:
      slash_command: /cto
      subagent_mention: "@cto"
    routing_targets: []
    voice_profile: senior-eng-cite-line-numbers
    default_hitl_max: B
    notify_founder: false
```

### 2. Add the role to `governance/ROLES.md`

```yaml
role: code-reviewer
purpose: Review PRs, propose architecture, run pnpm check before merge.
home_pillar: 06-ai-ops
personas_bound: [cto]
permissions:
  tier1_paths: ["wiki/**"]
  ...
hitl_max_tier: B
```

The `personas_bound: [cto]` is the back-reference. The validator enforces this
bidirectional integrity.

### 3. Create the spec folder

```bash
mkdir -p 06-ai-ops/workforce-personas/cto
# Create the canonical 8 files. You can copy from gpt as a starting point:
cp 06-ai-ops/workforce-personas/gpt/*.md 06-ai-ops/workforce-personas/cto/
# Then edit each to be CTO-specific (voice, playbook patterns, KPIs, etc.)
```

### 4. Create the runtime files

```bash
# .claude/agents/cto.md
---
name: cto
description: Senior code reviewer + architecture advisor. Bound to code-reviewer role. Cites file:line; never merges (founder merges).
---
You are operating as the CTO persona. Your bound role is code-reviewer.
...

# .claude/commands/cto.md
---
description: CTO multi-turn session — code review, architecture decisions, technical debt triage.
---
You are entering a multi-turn CTO session...
```

### 5. Verify

```bash
pnpm check
```

Should still pass.

### 6. (Optional) Remove `gpt`

Once your real personas are in place:

```yaml
# knowledge/workforce-personas.yaml — remove the gpt block
# governance/ROLES.md — remove `personas_bound: [gpt]` from gps
# Delete the folder:
rm -rf 06-ai-ops/workforce-personas/gpt/
rm .claude/agents/gpt.md
rm .claude/commands/gpt.md
```

Then `pnpm check` again.

## Schema constraints

- **Slug:** must match `^[a-z]{3,5}$` (3-5 lowercase letters). Examples: `ceo`,
  `cto`, `cgo`, `cpo`, `cmo`, `cso`, `cfo`, `cco`, `cdo`, `cds`, `coo`, `ciso`.
- **Pillar home:** must match `^06-ai-ops/workforce-personas/[a-z]{3,5}/$`.
  If your org puts personas under a different pillar, edit the regex at
  `knowledge/schemas/workforce-personas.schema.json` line 85.
- **HITL narrowing rule:** persona's `default_hitl_max` MUST NOT exceed the
  bound role's `hitl_max_tier`. Narrowing OK; broadening forbidden. Validator
  enforces this.
- **Bidirectional binding:** persona's `binds_to.primary` MUST be a role in
  ROLES.md, AND that role MUST list the persona slug under `personas_bound: [...]`.

## Hook implementation gap

The two hooks (`.claude/hooks/pre-persona-resolve.md` and
`.claude/hooks/post-persona-log.md`) are **spec-only**. They describe the
contract but no runtime code exists.

What this means in practice:

- ✅ Persona invocations work — you can call `/ceo` or `@cto` and the runtime
  resolves the slug to the bound role's permissions.
- ❌ `ops.agent_runs.persona_slug` stays NULL on every run, because the
  post-persona-log hook isn't wired.
- ❌ Persona-specific dossier files (`06-ai-ops/workforce-personas/<slug>/dossier.md`)
  don't auto-populate.
- ❌ Persona KPIs (`persona.<slug>.invocations_per_week`, etc.) can't be
  measured until logging is wired.

**To implement the hooks**, you need to either:

1. Use Claude Code's hook system (if available in your version) by creating
   shell scripts in `.claude/hooks/` that the Claude Code runtime invokes
   pre/post tool calls. The spec files document the contract.

2. Wire the hooks into your own infrastructure (e.g., wrap the Claude API in
   a proxy that adds `persona_slug` to outgoing requests).

3. Defer until you genuinely need persona attribution (most orgs don't until
   they have ≥3 personas active and want to compare effectiveness).

This is consistent with ritsu-works' own deferred state — see their TODOS.md
"Hook runtime" item.

## Common patterns

### Pattern A: One persona per role

```yaml
ceo  → gps
cto  → code-reviewer
cgo  → gtm-orchestrator
cpo  → product-orchestrator
```

Cleanest. Founder talks to personas; permissions live in roles. No multi-binding.

### Pattern B: One persona, multiple contextual roles

```yaml
ceo:
  binds_to:
    primary: gps
    contextual: [founder-coach]
```

`primary` is the default role used when the persona invokes. `contextual` are
roles the persona may switch to in specific situations (e.g., CEO in
"founder-coach mode" gets different tools).

### Pattern C: Persona narrows a role's HITL ceiling

If `gtm-orchestrator` role has `hitl_max_tier: C` (can do everything up to
Tier C autonomously), but your CGO persona is more cautious:

```yaml
cgo:
  binds_to:
    primary: gtm-orchestrator
  default_hitl_max: B   # narrowed below role's C
```

Now CGO invocations require Tier C ceremony for irreversible actions, even
though the underlying role allows them. This lets you have a "cautious CGO"
without weakening the role's tools.

## Future: implementing the hooks

When you're ready to implement the hooks, the concrete shape is:

**`.claude/hooks/pre-persona-resolve.md`** runtime should:

1. Detect persona invocation pattern in incoming Claude Code event (e.g.,
   slash command starts with `/`, or message contains `@<slug>` mention).
2. Look up the slug in `knowledge/workforce-personas.yaml`.
3. Inject context: `persona_slug`, `bound_role`, `persona_default_hitl_max`.
4. If status=planned/deferred: warn but allow; if persona doesn't exist: error.

**`.claude/hooks/post-persona-log.md`** runtime should:

1. After every Claude tool call that originated from a persona-invoked session,
   write to `ops.agent_runs` with `persona_slug` populated.
2. Append a one-line entry to
   `06-ai-ops/workforce-personas/<persona_slug>/dossier.md`.

Until that's implemented, persona usage is on the honor system. Sessions
invoke `/ceo` correctly; the runtime just doesn't trace the attribution.

## See also

- `06-ai-ops/workforce-personas/README.md` — the three-plane model in more
  detail
- `knowledge/schemas/workforce-personas.schema.json` — the registry schema
- `governance/ROLES.md` — role definitions (each role's `personas_bound` list)
- `governance/HITL.md` — the HITL tier policy (personas inherit from bound roles)
- `notes/CLA-USAGE.md` — CLA depends on persona registry for routing
- `notes/PILLAR-EXAMPLES.md` — different org types need different pillar structures
