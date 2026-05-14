# Identity & Service Account Mapping

> Operational governance for ${ORG_NAME}'s per-role service identities across external systems. The implementation reference for the strategy in `knowledge/identity-architecture.md`.

**Status:** v0.1 (boilerplate stub — fill in)
**Tier:** D-Std (changes require magic phrase + PR + 30s confirm — adding/removing identities is high-risk)
**Last updated:** YYYY-MM-DD
**Related:** `knowledge/identity-architecture.md`, `governance/SECRETS.md`, `governance/ROLES.md`

---

## Why this file exists

Per `knowledge/identity-architecture.md`, ${ORG_NAME} uses **per-role service identities for external attribution systems** and **shared internal identities** otherwise. This file is the canonical mapping: which role uses which identity on which system. Without it, drift between roles and identities is silent and dangerous.

---

## Per-role identity matrix

Replace the example rows below with your actual service accounts as you provision them. Each external system (GitHub, email, social, payments) gets its own column.

### GitHub

Each agent role that opens PRs or comments needs a distinct GitHub bot account. Rationale: blast-radius isolation. If one bot is compromised, only that role's writes are affected.

| Role | GitHub username | Account type | Permissions | Token secret |
|---|---|---|---|---|
| `founder` | ${GITHUB_OWNER} | Personal | All repos, admin | `GITHUB_TOKEN_FOUNDER` |
| `gps` | `${ORG_SLUG}-gps-bot` | Bot | read+comment, no merge | `GITHUB_TOKEN_GPS` |
| `content-drafter` | (uses gps for any GH action) | — | — | — |
| `etl-runner` | `${ORG_SLUG}-etl-bot` | Bot | read-only | `GITHUB_TOKEN_ETL` |

### Email (sending)

Per-role sending identity isolates deliverability and reputation. A spam complaint against `support` doesn't tank `marketing`.

| Role | Sending address | Display name | Subdomain (if any) | Provider |
|---|---|---|---|---|
| `founder` | ${FOUNDER_EMAIL} | ${FOUNDER_NAME} | (root) | (your provider) |
| `gps` | gps@${PRIMARY_EMAIL_DOMAIN} | ${ORG_NAME} | (root) | (your provider) |
| `support-agent` (when added) | support@${PRIMARY_EMAIL_DOMAIN} | ${ORG_NAME} Support | (root) | (your provider) |
| `growth-orchestrator` (when added) | growth@${PRIMARY_EMAIL_DOMAIN} | ${ORG_NAME} | mail.${PRODUCT_DOMAIN} | (your provider) |

### Social platforms

| Platform | Account handle | Roles allowed to post | Token secret |
|---|---|---|---|
| Twitter / X | @${ORG_SLUG} | `growth-orchestrator` (when added) | `TWITTER_BOT_TOKEN_${ORG_SLUG_UPPER}` |
| LinkedIn | ${ORG_NAME} (company page) | `growth-orchestrator` | `LINKEDIN_BOT_TOKEN_${ORG_SLUG_UPPER}` |
| YouTube | (channel handle) | (read-only by default; uploads are founder action) | `YOUTUBE_API_KEY_READONLY` |

### Supabase

| Role | Project | Permission | Key secret |
|---|---|---|---|
| `founder` | ${SUPABASE_OPS_PROJECT_NAME} | service_role | `SUPABASE_OPS_FULL_SERVICE_KEY` |
| `gps` | ${SUPABASE_OPS_PROJECT_NAME} | anon | `SUPABASE_OPS_ANON_KEY` |
| `etl-runner` | ${SUPABASE_OPS_PROJECT_NAME} | service_role | `SUPABASE_OPS_FULL_SERVICE_KEY` |
| `etl-runner` | (your product project — read-only) | etl-readonly | `SUPABASE_PRODUCT_READ_KEY` |

### Other external systems

Add rows for each external system the workforce touches: Stripe, Telegram, Slack, your CRM, etc.

---

## Provisioning procedure for a new identity

Adding a new identity is **D-Std** (irreversible-ish, external-many).

1. Open a PR to this file proposing the identity (account name, permissions, token secret name).
2. Wait for founder approval.
3. Founder manually creates the account on the external system.
4. Founder mints the API token / OAuth credential.
5. Founder injects the secret into the secret manager (per `governance/SECRETS.md`).
6. Founder merges the PR.
7. Update `.claude/agents/<role>.md` to reference the new secret name.
8. First usage: agent dry-runs an action and confirms attribution shows correctly.

---

## Deprovisioning procedure

When a role is deprecated or an account is compromised:

1. Founder revokes the API token immediately (do not wait for PR).
2. Open a PR removing the identity from this file.
3. Mark the role as `status: deprecated` in `.claude/agents/<role>.md`.
4. Keep the row in this file with a `deprecated_at` date for ≥ 90 days (audit traceability for past `agent_runs`).
5. After 90 days, archive to `.archives/deprecated-identities/<account>-<date>.md`.

---

## Rotation cadence

| Secret class | Rotation cadence | Triggered by |
|---|---|---|
| GitHub bot tokens | 90d or on suspicion | Calendar reminder + auto-revoke on inactive 60d |
| Email sending API keys | 180d | Provider's max validity |
| Social bot tokens | 90d | Calendar |
| Supabase service keys | 365d or on personnel change | Manual |

---

## How to populate this file

1. Replace example rows with your actual provisioned accounts.
2. The init wizard substitutes `${GITHUB_OWNER}`, `${PRIMARY_EMAIL_DOMAIN}`, `${ORG_SLUG}`, etc.
3. Each row added requires a corresponding entry in `governance/SECRETS.md` and (when role uses it) in `.claude/agents/<role>.md`.

This file is read by the consistency engine — any drift between this matrix and `governance/SECRETS.md` or `.claude/agents/*.md` raises an alert.
