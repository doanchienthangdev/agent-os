# INIT.md — agent-os init wizard

> Run after cloning agent-os to customize the substrate for your organization.

## When to run

- Right after `git clone && pnpm install`, before any other work.
- Re-run only with `--reset` flag if you want to change foundational identity (org name, founder, primary Supabase project).

## What it asks

The wizard collects the following inputs interactively:

| Variable | Example | What it affects |
|---|---|---|
| `ORG_NAME` | "AI Film Studio" | Display name across all docs, Tier 1 prose |
| `ORG_SLUG` | "ai-film-studio" | URLs, bot account names, file slugs (auto-derived if omitted) |
| `ORG_REPO_NAME` | "ai-film-studio-os" | This repo's name in references |
| `ORG_TAGLINE` | "AI-native film production studio" | charter.md, README, package.json description |
| `ORG_CATEGORY` | "Creative SaaS" | charter.md positioning |
| `ORG_EVENT_NS` | "filmstudio" | Event type prefix (e.g. `filmstudio.customer.activated`) |
| `PRODUCT_NAME` | "ScriptForge" | Product-specific brand |
| `PRODUCT_DOMAIN` | "scriptforge.ai" | URLs in transparency, manifest, identity |
| `PRIMARY_EMAIL_DOMAIN` | "scriptforge.ai" | Sending addresses |
| `FOUNDER_NAME` | "Jane Doe" | founder-profile.md, identity matrix |
| `FOUNDER_EMAIL` | "jane@scriptforge.ai" | founder-profile.md |
| `FOUNDER_TIMEZONE` | "America/Los_Angeles" | founder-rhythm.yaml |
| `FOUNDER_SLUG` | "janedoe" | founder-profile.md frontmatter slug |
| `PRIMARY_LOCALE` | "en" | locales.yaml default |
| `PRIMARY_LOCALE_FULL` | "en-US" | locales.yaml extended |
| `GITHUB_OWNER` | "yourgithub" | manifest, identity, repo URLs (auto-detected via `gh api user`) |
| `SUPABASE_OPS_PROJECT_REF` | "abcd1234efgh5678" | manifest, migrations, tests |
| `SUPABASE_OPS_PROJECT_NAME` | "filmstudio-ops" | manifest, governance |
| `SUPABASE_OPS_PROJECT_NAME_SNAKE` | "filmstudio_ops" | snake-case variant for SQL identifiers |
| `SUPABASE_PRODUCT_PROJECT_REF` | "wxyz5678ijkl9012" | (only if you have a separate product DB to read) |
| `SUPABASE_PRODUCT_PROJECT_NAME` | "filmstudio" | product DB references |
| `OPS_REGION` | "us-west-1" | manifest |
| `OPS_REGION_HUMAN` | "US West / N. California" | manifest comment |
| `DEPLOYMENT_MODE` | "local" or "production" | .env.local; cron bootstrap conditional |
| `PILLARS_ENABLED` | ["01-growth", "02-customer", "05-ai-ops"] | manifest pillar status; deletes unselected pillar dirs |
| `ORG_SLUG_UPPER` | "FILMSTUDIO" | env var suffix for social tokens |
| `YEAR` | "2026" | LICENSE copyright |

The wizard auto-derives some variables from others (e.g., `ORG_SLUG` from `ORG_NAME`, `ORG_SLUG_UPPER` from `ORG_SLUG`).

## What it changes

After collecting inputs, the wizard:

1. **Substitutes `${PLACEHOLDER}` → user value** across ~120 Tier 1 files. Identical mechanism to `scripts/_extract/scrub.cjs` but in reverse direction.
2. **Updates `knowledge/manifest.yaml`** structurally: sets `owner`, `last_updated`, `tier1_canonical.storage.repo`, `tier2_operational.project_ref`, `tier2_operational.region`, and per-pillar `status` (enabled = `active`, omitted = `planned`).
3. **Updates `knowledge/founder-rhythm.yaml`** with timezone and (optionally) working hours.
4. **Removes pillar directories not in `PILLARS_ENABLED`** — only if they contain only the README.md (never deletes populated pillars).
5. **Creates `runtime/secrets/.env.local`** from `.env.example` with `ORG_NAME`, `FOUNDER_*`, `SUPABASE_*`, `DEPLOYMENT_MODE` pre-filled. Other secrets (Anthropic key, Stripe, etc.) you add manually.
6. **Writes `.wizard-history.md`** recording inputs and timestamp.
7. **Runs smoke test:** `pnpm validate && pnpm check && pnpm test`. Reports PASS/FAIL summary.

## What it does NOT do

- **Does NOT apply Supabase migrations.** Migrations are applied via `supabase db push` after you `supabase link` to your project. The DEPLOY.md prompt walks the AI through this with HITL gating.
- **Does NOT provision a Supabase project for you.** Create the project in the Supabase dashboard first; supply the project ref to the wizard.
- **Does NOT create GitHub bot accounts.** You create those manually; supply usernames in `governance/IDENTITY.md` later.
- **Does NOT push to GitHub.** First commit + push is your decision.
- **Does NOT read or write secrets to any external secret manager.** It writes to a local `.env.local` file only.

## Idempotency

- On second invocation without `--reset`, exits with: "Wizard already complete for `<ORG_NAME>`. Use --reset to re-run."
- With `--reset`: prints a warning, asks for confirmation, then re-runs from scratch (overwriting placeholders that have been replaced).
- Substitutions are NOT reversible. Once `${ORG_NAME}` becomes "AI Film Studio", the placeholder is gone unless you re-extract from the boilerplate.

## What to do after the wizard

1. Review `runtime/secrets/.env.local` and fill in remaining secrets (Anthropic key, etc.).
2. Open Claude Code: `claude code .`.
3. Paste `DEPLOY.md` contents into the session.
4. The AI will walk you through Supabase provisioning and smoke test (with HITL gating).
5. After deploy: pick ONE pillar from `TODOS.md A3` and start filling it in.

## Troubleshooting

- **Wizard fails validation at end:** Check `_build/scrub-report.txt` for which files were touched and which placeholders remain. Manually patch any leftover `${...}` in Tier 1 files.
- **Substitution introduced syntax error in a `.ts` file:** Probably a `${PLACEHOLDER}` landed inside a backtick template literal. Convert to string concatenation: `"prefix " + variable + " suffix"`.
- **Tests fail:** Some test fixtures hardcode org-specific values. Update fixtures to use whatever value the wizard substituted.

## How to remove the wizard once done

The wizard is a one-time tool. Once your org is bootstrapped and stable, you can delete:

```bash
rm scripts/init.cjs
rm scripts/_extract/scrub.cjs
rm INIT.md
rm DEPLOY.md
```

Or keep them for re-extraction if you ever want to spin up another org from this fork.

---

*The wizard is mechanical scaffolding. The real work — filling in your charter, picking your pillars, running your first end-to-end workflow — is yours.*
