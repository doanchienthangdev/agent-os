# 01-growth — Marketing, Sales, Partnerships Pillar

> The "top of funnel" pillar: find customers, convert lead → customer, expand partnerships.

**Status:** scaffolded / not yet operating in this org

## What this pillar does (when populated)

- SEO content production and distribution
- Social media presence and engagement
- Email marketing (newsletters, campaigns, onboarding sequences)
- Paid ads (search, social, display)
- Partnership outreach and management
- Conversion-rate analysis and landing-page iteration

## Roles primarily working in this pillar

When you populate this pillar, typical roles include:

- `growth-orchestrator` — owns the pillar; routes campaigns
- `content-drafter` — produces text drafts (cross-cutting, called by growth)
- `seo-researcher` — surface gaps, propose topic clusters
- `outreach-agent` — partnership emails (high HITL gating)

Define each in `governance/ROLES.md` as you add them.

## SOPs in this pillar

(none yet — add files under `01-growth/sops/SOP-GROWTH-XXX-<name>/`)

## Skills owned by this pillar

(none yet — add files under `06-ai-ops/skills/` and reference them from `knowledge/capability-registry.yaml` with `home_pillar: 01-growth`)

## Key Tier 2 tables (reference; populated from `knowledge/manifest.yaml`)

When populated, this pillar typically owns:
- `ops.campaigns` — campaign lifecycle
- `ops.content_drafts` — draft inventory
- `ops.outreach_log` — partnership outreach
- `ops.seo_topics` — content clusters

## Key Tier 1 files (this pillar's canonical knowledge)

- this README
- `01-growth/positioning.md` (when authored)
- `01-growth/SOP-GROWTH-*` files

## Removing this pillar

If your organization doesn't need this pillar, delete the directory. Then update:
- `knowledge/manifest.yaml` (remove the pillar entry under `tier1_canonical.pillars`)
- `governance/ROLES.md` (remove any roles whose `home_pillar` was `01-growth`)
- Any `event-subscriptions.yaml` rules referencing `01-growth`
