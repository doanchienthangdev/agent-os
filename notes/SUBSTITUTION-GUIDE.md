# Substitution Guide

> Reference for every `${PLACEHOLDER}` variable used in the agent-os boilerplate.

## How substitution works

The boilerplate ships with `${PLACEHOLDER}`-style variables in ~120 Tier 1 files. The init wizard (`scripts/init.cjs`) collects values from the founder and substitutes them across all template files. After the wizard runs, no `${PLACEHOLDER}` should remain in any Tier 1 file (if some do, the wizard reports them).

## Variable inventory

| Variable | Required? | Wizard collects? | Example value | Used in |
|---|---|---|---|---|
| `${ORG_NAME}` | yes | yes | "AI Film Studio" | charter, README, CLAUDE.md, governance/* |
| `${ORG_SLUG}` | yes | auto from ORG_NAME | "ai-film-studio" | URLs, bot account names |
| `${ORG_SLUG_UPPER}` | yes | auto from ORG_SLUG | "AI_FILM_STUDIO" | env var suffixes (e.g., `TWITTER_BOT_TOKEN_${ORG_SLUG_UPPER}`) |
| `${ORG_REPO_NAME}` | yes | yes | "ai-film-studio-os" | manifest.yaml repo, README |
| `${ORG_TAGLINE}` | yes | yes | "AI-native film production studio" | charter.md, README, package.json |
| `${ORG_CATEGORY}` | yes | yes | "Creative SaaS" | charter.md positioning |
| `${ORG_EVENT_NS}` | yes | yes (auto from ORG_NAME slug) | "filmstudio" | event type prefix (`${ORG_EVENT_NS}.customer.activated`) |
| `${PRODUCT_NAME}` | yes | yes (default = ORG_NAME) | "ScriptForge" | product.md, brand_voice.md |
| `${PRODUCT_DOMAIN}` | yes | yes | "scriptforge.ai" | URLs (transparency, manifest, identity) |
| `${PRIMARY_EMAIL_DOMAIN}` | yes | yes (default = PRODUCT_DOMAIN) | "scriptforge.ai" | sending addresses in IDENTITY.md |
| `${FOUNDER_NAME}` | yes | yes | "Jane Doe" | founder-profile.md, identity matrix, LICENSE |
| `${FOUNDER_EMAIL}` | yes | yes | "jane@scriptforge.ai" | founder-profile.md |
| `${FOUNDER_TIMEZONE}` | yes | yes (auto-detect) | "America/Los_Angeles" | founder-rhythm.yaml, .env.local |
| `${FOUNDER_SLUG}` | yes | auto from FOUNDER_NAME | "janedoe" | founder-profile.md frontmatter |
| `${PRIMARY_LOCALE}` | yes | yes | "en" | locales.yaml, .env.local |
| `${PRIMARY_LOCALE_FULL}` | yes | yes | "en-US" | locales.yaml extended |
| `${GITHUB_OWNER}` | yes | yes (auto via `gh api user`) | "yourgithub" | manifest, identity, repo URLs, AGENT-OS-README |
| `${SUPABASE_OPS_PROJECT_REF}` | yes | yes | "abcd1234efgh5678" | manifest, migrations 14, tests, .env.local |
| `${SUPABASE_OPS_PROJECT_NAME}` | yes | yes | "filmstudio-ops" | manifest, governance, hooks |
| `${SUPABASE_OPS_PROJECT_NAME_SNAKE}` | yes | auto | "filmstudio_ops" | SQL identifiers |
| `${SUPABASE_PRODUCT_PROJECT_REF}` | optional | yes | "wxyz5678ijkl9012" | only if you have a product DB to read |
| `${SUPABASE_PRODUCT_PROJECT_NAME}` | optional | yes | "filmstudio" | hook references |
| `${OPS_REGION}` | yes | yes | "us-west-1" | manifest |
| `${OPS_REGION_HUMAN}` | yes | yes | "US West / N. California" | manifest comment |
| `${DEPLOYMENT_MODE}` | yes | yes | "local" or "production" | .env.local |
| `${YEAR}` | yes | auto | "2026" | LICENSE copyright |

## Variables NOT in the wizard (manual fill)

A few placeholder variables exist in stub templates that the wizard does NOT auto-fill — they require human content judgment:

- Bracketed inline placeholders in `00-charter/*.md` (e.g., `[mission statement]`, `[3-5 values]`, `[describe what makes you different]`) — fill in manually after init
- `[Capability 1]`, `[Persona 1]`, etc. in `00-charter/product.md` — manual
- Regulatory checklist items in `00-charter/transparency.md` — manual

These use `[BRACKETED]` syntax (not `${...}`) precisely to mark them as human-fill, not wizard-substitutable.

## Substitution mechanics

The wizard uses simple regex `\$\{KEY\}` matching across all text files. It does NOT:

- Evaluate JS template literals (you must NOT put `${PLACEHOLDER}` inside backtick strings in TypeScript code — see Phase 3B fix in worker.ts and tests/wave2-bootstrap-cron-secrets.test.ts)
- Touch generated files (`*.generated.ts`)
- Touch files in `node_modules/`, `.git/`, `_build/`, `coverage/`, `runtime/`, `raw/`, `.archives/`
- Touch the wizard's own files (`scripts/init.cjs`, `scripts/_extract/scrub.cjs`, `.wizard-history.md`)

## Adding new substitution variables

If you customize the boilerplate and want to add a new `${MY_NEW_VAR}` placeholder:

1. Add the variable to this table (with example, required-flag, where it's used).
2. Update the wizard (`scripts/init.cjs`) to collect it (in the appropriate Step 1-4 block).
3. Add the variable to the `config` object passed to `applySubstitutions`.
4. Test: run the wizard, verify the variable substitutes in your file.

## Re-substituting after wizard ran

The wizard is one-shot. Once `${ORG_NAME}` becomes "AI Film Studio", the placeholder is gone. To revert:

- Option A: Re-clone the boilerplate and start fresh.
- Option B: Manual find-and-replace your value back to `${ORG_NAME}`, then re-run wizard.
- Option C: Live with the value (most common — orgs don't rebrand often).

## Why ${...} syntax (not {{...}} or other)

`${VAR}` is bash- and JS-template-literal-compatible syntax. It mirrors what's already used in `.env.example` for shell-variable expansion. Choosing it for boilerplate placeholders means founders can mentally recognize them as "this is a placeholder I need to fill in" without learning a new syntax.

The trade-off: in TypeScript code, `${VAR}` inside backtick strings IS evaluated by the JS runtime, which would error if `VAR` isn't a real variable. We avoid this by using string concatenation (`"prefix " + VAR + " suffix"`) in `.ts` files where placeholders need to land.
