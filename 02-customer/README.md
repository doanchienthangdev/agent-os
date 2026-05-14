# 02-customer — Customer Operations Pillar

> Onboarding, support, retention, churn prevention.

**Status:** scaffolded / not yet operating in this org

## What this pillar does (when populated)

- New-user onboarding (welcome flow, activation tracking)
- Tier-1 support (FAQ-handled tickets, triage to humans for the rest)
- Retention campaigns (lifecycle email, re-engagement)
- Churn prevention (early-warning signals, win-back outreach)
- Customer success / account management (B2B contexts)
- Feedback loop back to 03-product

## Roles primarily working in this pillar

When you populate this pillar, typical roles include:

- `customer-orchestrator` — owns the pillar
- `support-agent` — handles FAQ-classified tickets autonomously, escalates rest
- `onboarding-agent` — drives users through activation milestones
- `churn-watcher` — periodic risk scoring + intervention recommendations

Define each in `governance/ROLES.md` as you add them.

## SOPs in this pillar

(none yet — add files under `02-customer/sops/SOP-CUSTOMER-XXX-<name>/`)

## Skills owned by this pillar

(none yet — add files under `05-ai-ops/skills/` and reference them from `knowledge/capability-registry.yaml` with `home_pillar: 02-customer`)

## Key Tier 2 tables (reference; populated from `knowledge/manifest.yaml`)

When populated, this pillar typically owns:
- `ops.support_tickets` — ticket lifecycle
- `ops.support_replies` — reply audit trail
- `ops.churn_signals` — risk scores per customer
- `ops.onboarding_milestones` — activation events

## Removing this pillar

If your organization doesn't need this pillar, delete the directory and update `knowledge/manifest.yaml`, `governance/ROLES.md`, and any subscriptions referencing `02-customer`.
