# Agent Roles & Permissions

> Defines the agent roles operating in `${ORG_REPO_NAME}`, what each is permitted to do, and how roles map to skills, tools, and secrets.

**Owner:** founder
**Last updated:** YYYY-MM-DD
**Change policy:** PR + founder review. Tier C per `governance/HITL.md`.

---

## Why roles exist

Without role separation, the only choice is "the agent can do everything" or "the agent can do nothing." Both are wrong.

Roles let us answer questions like:
- *Why can a content drafter read public docs but not query the customer database?*
- *Why can the ETL runner read the production product DB but never write?*
- *Why does the support agent get a different LLM budget than the growth orchestrator?*

The answer is always: **principle of least privilege.** Each role has the minimum capabilities to do its job. Everything else is denied.

## How a role is defined

Every role has the following attributes:

```yaml
role: <slug>
purpose: <one-sentence description>
home_pillar: <00-charter | 01-growth | 02-customer | 03-product | 04-content | 06-ai-ops | 06-finance | 07-compliance | 08-integrations | cross-cutting>
permissions:
  tier1_paths:           # which paths in this repo it can edit (PR-only)
  tier2_schemas_read:    # which Supabase schemas it can SELECT
  tier2_schemas_write:   # which schemas it can INSERT/UPDATE
  tier3_buckets:         # which storage buckets it can read/write
  tier4_namespaces:      # which vector namespaces
  mcp_servers:           # which MCP servers it can use (by name from mcp/servers.yaml)
  skills:                # which skills it may invoke
  secrets:               # which secret keys it may access (by name from SECRETS.md)
hitl_max_tier: <A | B | C | D-Std | D-MAX>  # highest tier this role may attempt without escalation
budget:
  monthly_token_usd: <number>      # legacy field; equivalent to economic_budget.monthly_cap_usd
  monthly_tool_calls: <number>     # operational ceiling, separate from cost
economic_budget:
  monthly_cap_usd: <number>        # hard monthly $ cap; budget enforcement uses this
  alert_at_pct: 0.80               # default — alert at 80%
  escalate_at_pct: 1.00            # default — founder approval at 100%
  hard_block_at_pct: 1.50          # default — block until ROLES.md PR raises cap
  per_task_kind_caps:              # optional; per-instance soft caps for this role's task_kinds
    <task_kind>: <usd_per_instance>
  preferred_models:                # optional; recommended model for this role's tasks
    default: <model_id>
    expensive_tasks: <model_id>
    light_tasks: <model_id>
context_budget:
  preamble_tokens: <number>      # max tokens for session-start preamble
  working_tokens: <number>       # max accumulated working context before /compact is mandatory
  trigger_compact_at: <0..1>     # fraction of working_tokens at which agent self-invokes /compact
memory_config:
  memory_tool_enabled: <bool>    # Anthropic memory tool API; default false (Strategy E)
  episodic_recall_enabled: <bool>  # invoke episodic-recall skill at task start
  recall_window_days: <int>      # how far back ops.agent_runs is queried
  recall_max_runs: <int>         # how many past runs to load as context (~200 tokens each)
  emit_run_summary: <bool>       # write to ops.run_summaries on completion
  accept_corrections: <bool>     # writes to ops.corrections when founder rejects/edits
notify_on_completion: <bool>     # default Telegram ping after Tier B+ actions
escalation_role: <role slug>     # who to fallback to if this role can't proceed
```

See "Context budget guidance" and "Memory configuration guidance" sections below.

Roles are defined as files in `.claude/agents/<role>.md` (Claude Code agent format). This file is the policy reference; the agent file is the runtime instantiation.

---

## The starter roles

The boilerplate ships with 3 generic example roles. Add, remove, or modify as your org grows. Status: ◐ defined here, ○ runtime file `.claude/agents/<role>.md` not yet created.

### `gps` — General Purpose Steward (Chief of Staff)

The orchestrator. Routes work to specialist roles. The role that interfaces with the founder by default.

```yaml
role: gps
purpose: Receive founder requests, decompose into tasks, route to specialist roles, report back.
home_pillar: cross-cutting
personas_bound: [gpt]   # boilerplate placeholder — replace with real personas as you roster them
permissions:
  tier1_paths:
    - "wiki/**"
    - ".archives/**"
    # NO write to 00-charter, governance, pillar SOPs, skills, .claude
  tier2_schemas_read:
    - ops.*
    - metrics.*
  tier2_schemas_write:
    - ops.tasks
    - ops.agent_runs
  tier3_buckets:
    - ops-transcripts (read+write)
    - ops-artifacts (read)
    - ops-agent-logs (write only — append)
  tier4_namespaces:
    - charter_embeddings (read)
    - skills_embeddings (read)
    - transcripts_embeddings (read)
  mcp_servers:
    - github (read+comment, no merge)
    - telegram (send to founder)
    - supabase-ops (limited to schemas above)
  skills:
    - "*"              # may invoke any skill, but specialists do the work
  secrets:
    - ANTHROPIC_API_KEY
    - GITHUB_TOKEN_READONLY
    - TELEGRAM_BOT_TOKEN
    - SUPABASE_OPS_ANON_KEY
hitl_max_tier: C
budget:
  monthly_token_usd: 200
  monthly_tool_calls: 5000
economic_budget:
  monthly_cap_usd: 200
  alert_at_pct: 0.80
  escalate_at_pct: 1.00
  hard_block_at_pct: 1.50
  preferred_models:
    default: claude-sonnet-4-6
    expensive_tasks: claude-opus-4-7
    light_tasks: claude-haiku-4-5
context_budget:
  preamble_tokens: 6000
  working_tokens: 80000
  trigger_compact_at: 0.6
memory_config:
  memory_tool_enabled: false
  episodic_recall_enabled: true
  recall_window_days: 90
  recall_max_runs: 5
  emit_run_summary: true
  accept_corrections: true
notify_on_completion: true
escalation_role: founder
```

### `content-drafter` — Pure-text draft generation

```yaml
role: content-drafter
purpose: Generate text drafts (blog, email, social, support reply, doc) on request. NEVER ships.
home_pillar: cross-cutting (called by other roles)
permissions:
  tier1_paths:
    - ".archives/drafts/**"
    - "wiki/**" (read only)
  tier2_schemas_read:
    - ops.content_drafts
    - metrics.product_dau_snapshot
  tier2_schemas_write:
    - ops.content_drafts
    - ops.agent_runs
  tier3_buckets:
    - ops-artifacts (write — draft attachments)
    - ops-agent-logs (write append)
  tier4_namespaces:
    - charter_embeddings (read — voice consistency)
  mcp_servers:
    # NONE that can publish. Only read-only research.
    - web-fetch (read public URLs)
  skills:
    - blog-post-drafting
    - email-drafting
    - social-post-drafting
    - support-reply-drafting
  secrets:
    - ANTHROPIC_API_KEY
hitl_max_tier: A
budget:
  monthly_token_usd: 400
  monthly_tool_calls: 50000
economic_budget:
  monthly_cap_usd: 400
context_budget:
  preamble_tokens: 3000
  working_tokens: 30000
  trigger_compact_at: 0.7
memory_config:
  memory_tool_enabled: false
  episodic_recall_enabled: true
  recall_window_days: 60
  recall_max_runs: 3
  emit_run_summary: true
notify_on_completion: false
escalation_role: gps
```

> **The "never ships" boundary is enforced.** content-drafter has no access to email-sender, social, GitHub merge, or any publishing MCP. Output ends up in `.archives/drafts/` or `ops.content_drafts`. Another role with publishing permission must explicitly pick it up and ship.

### `etl-runner` — Cross-tier data plumbing

```yaml
role: etl-runner
purpose: Run scheduled ETL jobs that move data between tiers. Read product DB, write ops mirror, rebuild embeddings.
home_pillar: 06-ai-ops
permissions:
  tier1_paths: []
  tier2_schemas_read:
    - ops.*
    # plus: read-only foreign data wrapper into product.* via dedicated views
  tier2_schemas_write:
    - metrics.*           # the ONLY role that writes to metrics.*
    - ops.agent_runs
    - ops.tier3_index
  tier3_buckets:
    - ops-transcripts (read+write)
    - ops-artifacts (read)
    - ops-agent-logs (read — to embed)
  tier4_namespaces:
    - "*" (write, rebuild)
  mcp_servers:
    - supabase-ops (full)
    - supabase-product (read-only, via dedicated read role)
    - vector-store (write)
  skills:
    - schema-migration
    - embedding-rebuild
    - cross-tier-sync
  secrets:
    - ANTHROPIC_API_KEY
    - SUPABASE_OPS_SERVICE_KEY
    - SUPABASE_PRODUCT_READ_KEY      # the ONE role that holds this
    - VECTOR_STORE_WRITE_KEY
hitl_max_tier: B
budget:
  monthly_token_usd: 100
  monthly_tool_calls: 50000
economic_budget:
  monthly_cap_usd: 100
context_budget:
  preamble_tokens: 2000
  working_tokens: 20000
  trigger_compact_at: 0.8
memory_config:
  memory_tool_enabled: false
  episodic_recall_enabled: true
  recall_window_days: 7
  recall_max_runs: 2
  emit_run_summary: true
notify_on_completion: false
escalation_role: gps
```

> **Critical:** `etl-runner` is the **only** role that holds `SUPABASE_PRODUCT_READ_KEY`. Any other role that needs product data must request it via `metrics.*` tables that `etl-runner` populates. This is the single most important access boundary in the company.

### `founder` (the human role)

```yaml
role: founder
purpose: The human operator. Decision authority for all Tier C/D actions. Source of override.
permissions: ["*"]
hitl_max_tier: D-MAX
budget: unlimited
escalation_role: none
```

The founder role is documented for completeness, but its policy is "everything." The constraints are organizational, not technical.

---

## How to add more roles

The starter set covers orchestration, drafting, and ETL. As your org grows, you'll add specialist roles. Common additions:

- `growth-orchestrator` — owns 01-growth (SEO, ads, partnerships)
- `support-agent` — owns 03-customer Tier-1 support
- `code-reviewer` — reviews PRs in this repo and the product repo
- `trust-safety` — owns 06-compliance + content moderation
- `backoffice-clerk` — owns 04-finance categorization + invoicing

Process to add a role:

1. Open a PR adding to this file (Tier C action).
2. Add the runtime config in `.claude/agents/<role>.md`.
3. If new secrets needed, update `governance/SECRETS.md`.
4. If new MCP servers needed, update `mcp/servers.yaml` (Tier C action).
5. If new tables/buckets needed, update `knowledge/manifest.yaml` and `knowledge/schemas/`.
6. Founder approval required (HITL Tier C).

When deprecating a role:

1. Remove from active rotation by editing `.claude/agents/<role>.md` to `status: deprecated`.
2. **Do not delete** for ≥ 90 days — past `agent_runs` reference the role; deletion breaks audit traceability.
3. After 90 days, archive the agent file to `.archives/deprecated-roles/<role>-<date>.md` and remove from active config.

---

## Context budget guidance

Each role above carries a `context_budget`. Default values by role archetype:

| Archetype | preamble_tokens | working_tokens | trigger_compact_at | Rationale |
|---|---|---|---|---|
| Orchestrator (gps) | 6000 | 80000 | 0.6 | reads full pillar context; long sessions |
| Specialist drafter | 3000 | 30000 | 0.7 | narrow task; should compact aggressively |
| High-volume responder | 3000 | 25000 | 0.7 | many short tickets; restart often |
| ETL / data plumbing | 2000 | 20000 | 0.8 | mostly tool calls; minimal reasoning context |
| T&S triage | 5000 | 50000 | 0.6 | needs full charter + policy refs |
| Backoffice | 4000 | 40000 | 0.65 | structured workflows; medium horizon |
| Code reviewer | 4000 | 50000 | 0.65 | reads diffs; medium-long sessions |
| Founder | unlimited | unlimited | 0.85 | human discretion; trigger only at near-limit |

**How `trigger_compact_at` works.** When agent's working context reaches `working_tokens × trigger_compact_at`, the agent self-invokes `/compact` with role-appropriate instructions.

**How to tune.** First-month settings are conservative defaults. After 4 weeks of `ops.agent_runs` data:
- If a role rarely hits `trigger_compact_at`, raise `working_tokens`.
- If a role's quality degrades before compact triggers, lower `trigger_compact_at`.
- If preamble blows past `preamble_tokens`, role is reading too much — split context, use subagents.

These values change via PR.

## Memory configuration guidance

Each role's `memory_config` sets the role's posture toward learning across sessions. Strategy E baseline (v1.0): all roles use episodic recall (Type 2 memory: `ops.agent_runs`); no role uses the file-based memory tool API (Type 3 file memory).

**Default values by role archetype:**

| Archetype | memory_tool | recall_window_days | recall_max_runs | emit_run_summary |
|---|---|---|---|---|
| Orchestrator | false | 90 | 5 | true |
| Specialist drafter | false | 60 | 3 | true |
| High-volume responder | false | 30 | 5 | true |
| ETL / data plumbing | false | 7 | 2 | true |
| T&S triage | false | 180 | 5 | true |
| Backoffice | false | 90 | 3 | true |
| Code reviewer | false | 60 | 3 | true |

**`memory_tool_enabled: true` is a D-Std change** — requires PR ceremony plus a documented use case for multi-day file-based state that episodic recall cannot serve.

These values change via PR.

---

## Quick-glance permission matrix (starter roles)

| Role | T1 write | ops.* read | ops.* write | Product DB | Public post | Money in/out | Max HITL |
|---|---|---|---|---|---|---|---|
| `gps` | wiki only | full | tasks/runs | none | no | no | C |
| `content-drafter` | drafts only | partial | drafts | none | **never** | no | A |
| `etl-runner` | none | full | metrics+sync | **read only** | no | no | B |
| `founder` | all | all | all | all | all | all | D-MAX |

> The **only** role with any access to product Supabase is `etl-runner`, and that access is read-only via dedicated read keys. Every other role gets product data through `metrics.*` tables. This is the firewall.

## When a role hits its budget

The `pre-llm-call-budget` hook enforces a 3-tier escalation:

- **80%** — first breach posts heads-up notification.
- **100%** — every additional LLM call is HELD; founder approval required.
- **150%** — hard ceiling. Founder must open a PR to this file (Tier C) raising `monthly_cap_usd`.

Per-task-kind soft caps (`per_task_kind_caps`) act independently: even if monthly budget is healthy, a single task whose estimated cost exceeds its cap will escalate.

Budgets reset on the 1st of each month at 00:00 UTC.

## What this file is NOT

- Not the runtime config — that's `.claude/agents/<role>.md`
- Not the secret store — values live in the secret manager (see `SECRETS.md`)
- Not the workflow definition — that's `workflows/`
- Not the skill implementation — that's `skills/<skill>/SKILL.md`

This file is the **policy contract**. The runtime artifacts must conform to it.

---

*A role is a promise. It says "this is exactly what I am allowed to do — and nothing more." Without that promise written down, every agent is a god, and gods make for terrible employees.*
