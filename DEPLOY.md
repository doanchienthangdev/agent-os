# DEPLOY.md — Bootstrap agent-os for a new organization

> Paste this entire file into a Claude Code session inside a freshly cloned and wizard-initialized agent-os repo. The AI will walk the founder through Supabase provisioning, secret setup, and end-to-end smoke test, with HITL gating at every irreversible step.

---

You are the operator inside an agent-os boilerplate that has been customized for a specific organization. Your job is to walk the founder through the final infrastructure provisioning — the parts the init wizard deliberately did not automate.

**Read this entire file before doing anything. Do not skip steps. Do not reorder phases.**

## Before you start: read the operating contract

Before any action, read these files in order:

1. `AGENT-OS-README.md` — what this boilerplate is and why it exists
2. `CLAUDE.md` — your session-start contract (already loaded if you're in Claude Code)
3. `knowledge/manifest.yaml` — the truth-tier data contract; teaches you where every kind of company truth lives
4. `governance/HITL.md` — the safety model; you will be required to follow this
5. `governance/ROLES.md` — role permissions schema + the 3 starter roles

Internalize:

- **Tier 1 = git, Tier 2 = Postgres, Tier 3 = Storage, Tier 4 = pgvector inside Tier 2.**
- **Every action that touches Tier 2/3, the world outside this repo, or external services is governed by HITL tiers (A/B/C/D-Std/D-MAX).**
- **You are bootstrapping. Default to asking before acting. Operate at HITL Tier C posture even for actions that will eventually be Tier B.**

If you cannot find any of those files, STOP and tell the founder the boilerplate is incomplete.

---

## Phase 1 — Confirm the founder is ready

Use AskUserQuestion. One question per turn. Do NOT proceed past this phase until all checks pass.

### 1.1 Has the init wizard run?

Check: does `.wizard-history.md` exist at the repo root?

```bash
ls -la .wizard-history.md
```

- If NO: STOP. Tell the founder: "Run `pnpm install && pnpm init` first. The wizard substitutes `${ORG_NAME}` and other placeholders across ~120 files. Without it, this DEPLOY prompt cannot proceed."
- If YES: read it. Verify `status: complete`.

### 1.2 Are placeholders substituted?

Sample-grep for unresolved `${...}` in Tier 1 files:

```bash
grep -rn '\${ORG_NAME\|\${SUPABASE\|\${PRODUCT\|\${FOUNDER' \
  knowledge/manifest.yaml CLAUDE.md README.md governance/ROLES.md \
  --include="*.md" --include="*.yaml" 2>&1 | head -10
```

- If hits remain in those specific files: STOP. Wizard didn't complete. Ask founder to re-run `pnpm init --reset`.
- If no hits: proceed.

### 1.3 Is `runtime/secrets/.env.local` populated?

Verify the file exists and has values for at minimum: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `AGENT_OS_DEPLOYMENT_MODE`.

```bash
test -f runtime/secrets/.env.local && echo "exists" || echo "MISSING"
```

**DO NOT print the contents of this file** — it contains secrets. Only verify keys exist via grep:

```bash
grep -c "^SUPABASE_URL=" runtime/secrets/.env.local
grep -c "^ANTHROPIC_API_KEY=" runtime/secrets/.env.local
```

If keys are missing, ask the founder to fill them in before proceeding.

### 1.4 Has the founder created the Supabase ops project?

Ask the founder explicitly: "Have you created a Supabase project for ops (separate from any product DB), and is its project ref in `runtime/secrets/.env.local`?"

- If NO: STOP. Direct them to create one at https://supabase.com/dashboard/projects. They need a fresh project (not shared with anything else), the ref (e.g., `abcd1234efgh5678`), and the service-role key.
- If YES: proceed.

---

## Phase 2 — Read the wizard's output

Read `.wizard-history.md` fully. Internalize:

- Org name, founder name, timezone, primary locale
- Which pillars were enabled
- Supabase project ref
- Deployment mode

Read `knowledge/manifest.yaml` again. Confirm structurally:

- `tier1_canonical.storage.repo` matches the github owner+repo
- `tier2_operational.project_ref` matches the founder's Supabase ref
- Each enabled pillar has `status: active`; disabled ones are `status: planned` or removed entirely

Report a 3-sentence summary back to the founder: "Bootstrapping {ORG_NAME} owned by {FOUNDER_NAME}. Pillars enabled: {list}. Supabase ops project ref: {ref last 4 chars}." Wait for their confirmation before continuing.

---

## Phase 3 — Validate Tier 1 health

Run, in order:

```bash
pnpm validate
```

Expected: every Tier 1 yaml file passes its JSON Schema in `knowledge/schemas/`. If any fail, STOP and report the failures — do not attempt to fix without founder direction.

```bash
pnpm check
```

Expected: cross-tier consistency check passes (project-scoped, no DB calls yet).

```bash
pnpm test
```

Expected: full vitest suite passes. If any test fails because of a substitution mismatch (e.g., test fixture hardcoded "ritsu-ops"), STOP and report. Do NOT silently delete failing tests.

If all three commands pass, proceed.

---

## Phase 4 — Supabase provisioning [HITL Tier C — REQUIRES EXPLICIT APPROVAL]

**You MUST NOT run any migration apply command without explicit "yes, apply migrations" from the founder in this exact session. Verbal "yes, sounds good" is NOT enough — you must hear the literal word "apply".**

### 4.1 Link the Supabase project

```bash
supabase link --project-ref ${SUPABASE_OPS_PROJECT_REF}
```

(Use the actual ref from `.env.local`, not the literal placeholder.)

The CLI will prompt for the Postgres password. The founder enters it; you do NOT print or store it.

### 4.2 Dry-run the migration diff

```bash
supabase db diff --schema ops,public --linked
```

Show the founder the full output. Explain in plain language what the migrations will do (22 sequential migrations creating ops.tasks, ops.agent_runs, HITL audit trigger, memory tables, economic tables, knowledge graph, RLS policies, pg_cron setup, consistency engine).

### 4.3 Wait for explicit approval

Use AskUserQuestion. The question is exactly: "Apply these 22 migrations to your Supabase project `${SUPABASE_OPS_PROJECT_REF}`? This is irreversible without project reset."

Options:
- "Yes, apply"
- "No, abort"
- "Show me migration X first" (then read the specific migration file and re-ask)

If the founder picks "No, abort": stop. Note in the deploy summary that migrations were NOT applied; founder will run them later.

If "Yes, apply":

```bash
supabase db push
```

Capture output. If any migration fails partway, STOP and report. Do NOT attempt automatic rollback.

### 4.4 Generate bundled TS files

After successful migration, regenerate the bundled outputs that Edge Functions consume:

```bash
pnpm wave2:bundle-schedules
pnpm wave2:bundle-invariants
pnpm wave2:bundle-manifest-tables
```

These read YAML from `knowledge/` and emit `supabase/functions/_shared/*.generated.ts`.

### 4.5 Deploy Edge Functions (optional, founder choice)

Ask: "Deploy minion-worker and scheduled-run-dispatcher Edge Functions to Supabase now? (Required for production mode; optional for local mode.)"

If yes:

```bash
supabase functions deploy minion-worker
supabase functions deploy scheduled-run-dispatcher
```

### 4.6 Report

Tell the founder which tables now exist:

```bash
supabase db remote query "SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('ops','public','metrics') ORDER BY schemaname, tablename;"
```

Show count and names. Expected: ~30 tables across `ops`, `public`, `metrics` schemas.

---

## Phase 5 — Cron / worker bootstrap [Tier C — conditional]

This phase only applies if `AGENT_OS_DEPLOYMENT_MODE=production` in `.env.local`. Otherwise skip.

If production:

1. Show the founder `scripts/wave2-bootstrap-cron-secrets.sh`. Explain: it inlines `WORKER_SECRET` (from `.env.local`) into the pg_cron job command via the Supabase Management API. The GUC pattern (`current_setting('app.worker_secret')`) does NOT work on hosted Supabase due to permission restrictions, so this bootstrap script is the only viable shape.

2. Confirm `SUPABASE_ACCESS_TOKEN` is available. The script reads it from `runtime/secrets/.env.local` or a separate path if configured. If missing, the founder must mint one at https://supabase.com/dashboard/account/tokens and add it to `.env.local`.

3. Wait for explicit "yes, run cron bootstrap".

4. Run:

```bash
bash scripts/wave2-bootstrap-cron-secrets.sh
```

5. Verify the cron job registered:

```bash
supabase db remote query "SELECT jobname, schedule, command FROM cron.job WHERE jobname LIKE '%minion-worker%';"
```

Expected: 1 row with the inlined WORKER_SECRET in the command (don't print this output to chat — it contains the secret).

---

## Phase 6 — Smoke test

Verify the substrate is healthy end-to-end.

### 6.1 Tier 2 readability

```bash
supabase db remote query "SELECT count(*) FROM ops.tasks;"
supabase db remote query "SELECT count(*) FROM ops.agent_runs;"
supabase db remote query "SELECT count(*) FROM ops.run_summaries;"
supabase db remote query "SELECT count(*) FROM ops.cost_attributions;"
supabase db remote query "SELECT count(*) FROM ops.consistency_checks;"
```

Expected: all return `0` (fresh project).

### 6.2 RLS policies in place

```bash
supabase db remote query "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'ops' AND rowsecurity = true LIMIT 10;"
```

Expected: at least the ops tables that should have RLS show `rowsecurity = true`.

### 6.3 pg_cron job alive (production only)

```bash
supabase db remote query "SELECT jobname, active FROM cron.job;"
```

Expected: at least `minion-worker-tick` with `active = true`.

### 6.4 Edge function health (if deployed)

```bash
supabase functions list
```

Expected: `minion-worker` and `scheduled-run-dispatcher` shown as deployed.

### 6.5 Test suite re-run

```bash
pnpm test
```

If still passes after migrations, the substrate is healthy.

---

## Phase 7 — Hand-off

Tell the founder, in this order:

### What's now live

- `${SUPABASE_OPS_PROJECT_NAME}` Supabase project linked, 22 migrations applied
- Tables: ops.* (~30), public.* (~5), metrics.* (~1) — list them
- Edge functions deployed: [list, or note skipped]
- Cron jobs active: [list, or note local-mode skipped]
- Health check: PASS / FAIL

### What's NOT live (deliberately)

- Pillars 01-08 except 05-ai-ops are empty stubs. No agent role has run an end-to-end loop yet.
- No external integrations beyond Anthropic API. No Telegram bot. No social media tokens. No Stripe.
- No populated wiki, no charter content beyond stubs in `00-charter/`.

### What to do next

The architecture is theory until a pillar runs end-to-end. Order:

1. **Fill in `00-charter/`** — at minimum `charter.md` (mission, values), `product.md` (positioning), `brand_voice.md` (tone). 30-60 minutes total. Without this, agent reasoning has no grounding.
2. **Pick ONE pillar to prove** — recommendation: `02-customer/support-agent` (exercises HITL, cost, memory, knowledge graph) or `01-growth/growth-orchestrator` (exercises ETL, content, publishing).
3. **Add the role to `governance/ROLES.md`** — copy the template from one of the 3 starter roles.
4. **Provision the role's identity** — bot account, secrets — per `governance/IDENTITY.md`.
5. **Write the role's first SOP** — under `<pillar>/sops/SOP-<PILLAR>-001-<name>/`.
6. **Run a real workflow** — use the role for an actual task. Watch `ops.agent_runs` populate. Verify `episodic-recall` returns useful context after 5+ runs.

Repeat for the next pillar after the first is stable.

### Where to read

- `05-ai-ops/README.md` — how skills work
- `knowledge/manifest.yaml` — where every kind of data lives
- `knowledge/economic-architecture.md` — budget calibration after first month
- `knowledge/memory-architecture.md` — Strategy E episodic recall
- `governance/HITL.md` — every time you're about to do something irreversible
- `TODOS.md` — first-mile checklist

---

## Refuse-unprompted list

You MUST NOT do any of these without the founder explicitly stating the action verbatim and saying "yes, do exactly that":

1. Apply Supabase migrations (Phase 4.3 already gates this — do NOT do it earlier)
2. Print or transmit any secret value (.env.local contents)
3. Push any commits to GitHub
4. Modify `governance/HITL.md`, `governance/ROLES.md`, or `governance/IDENTITY.md`
5. Read or write to any Supabase project not named in `.env.local`
6. Enable cron schedules beyond the minion-worker tick
7. Create GitHub bot accounts (founder creates these manually via web UI)
8. Send any external email, Telegram, or social-media message
9. Sign up for any SaaS subscription
10. Modify DNS records
11. Disable any safety hook in `.claude/hooks/`

If the founder asks for any of these, repeat back the exact action and wait for "yes, do exactly that" — not "yes, sounds good", not "ok, go ahead".

---

## If anything fails

- Report the failure factually. State what you ran, what the expected output was, what the actual output was.
- Do NOT attempt to "fix" failures unprompted. Report and wait.
- For Tier C/D-tagged failures (migration mid-flight, edge function deploy errors), recommend the founder contact Supabase support OR open a GitHub issue against the agent-os repo OR consult the source-repo provenance for a known fix.
- If the failure is in a substrate file (e.g., a migration that doesn't apply on a fresh project), this is a substrate bug — report to the founder so they can file an issue.

---

*The boilerplate ships substrate. The DEPLOY prompt provisions infrastructure. The pillars and the workforce — those are yours. Build them.*
