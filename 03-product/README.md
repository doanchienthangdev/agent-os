# 03-product — Product Operations Pillar

> Roadmap, release notes, feedback triage, operations AROUND the product (not the product code itself).

**Status:** scaffolded / not yet operating in this org

> The product codebase lives in a separate repo. This pillar handles operations *around* it: planning, release notes, feedback synthesis.

## What this pillar does (when populated)

- Roadmap intake and prioritization
- Release notes drafting and publication
- User feedback aggregation and synthesis
- Product analytics narrative (DAU/MAU trends, feature adoption)
- Bug triage routing to engineering
- Quarterly retrospectives

## Roles primarily working in this pillar

- `product-orchestrator` — owns the pillar
- `feedback-synthesizer` — clusters user feedback into themes
- `release-notes-drafter` — generates release-note drafts from changelogs

## SOPs in this pillar

(none yet — add files under `03-product/sops/`)

## Key Tier 2 tables

When populated, this pillar typically owns:
- `ops.roadmap_items` — roadmap with status
- `ops.feedback_themes` — clustered user feedback
- `ops.release_notes` — drafted notes per version
- `metrics.product_*` — read from product mirror (populated by `etl-runner`)

## Removing this pillar

If your organization doesn't need this pillar, delete the directory and update `knowledge/manifest.yaml`, `governance/ROLES.md`, and any subscriptions referencing `03-product`.
