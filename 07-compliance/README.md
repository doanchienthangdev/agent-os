# 07-compliance — Compliance, Trust & Safety Pillar

> Privacy law, AI law, content moderation, copyright, vulnerable users.

**Status:** scaffolded / not yet operating in this org

## What this pillar does (when populated)

- Data subject access requests (DSAR) handling
- DMCA / copyright dispute review
- Terms of service enforcement (suspensions, bans)
- AI disclosure compliance (per EU AI Act, jurisdiction laws)
- Hallucination incident triage
- Minor-user handling (COPPA, FERPA where applicable)
- Subprocessor audit

## Roles primarily working in this pillar

- `trust-safety` — owns the pillar; direct escalation to founder (does not route through gps)
- `compliance-watcher` — periodic audit + alerting

> **Critical:** Trust-safety decisions affect users' rights. The role's `escalation_role` is `founder` (not `gps`) to make routing unambiguous.

## SOPs in this pillar

(none yet — add files under `07-compliance/sops/`)

## Key Tier 2 tables

When populated, this pillar typically owns:
- `ops.ts_cases` — open trust-safety cases
- `ops.ts_decisions` — adjudication audit trail
- `ops.dsar_requests` — DSAR queue
- `ops.dmca_notices` — copyright takedown records

## Regulatory checklist

Customize per jurisdiction served. See `00-charter/transparency.md` for the customer-facing version. Internal obligations:

- [ ] Privacy policy reviewed quarterly
- [ ] DPA in place with each subprocessor
- [ ] DPIA for high-risk processing classes
- [ ] Breach notification runbook
- [ ] AI risk classification documented (EU AI Act)
- [ ] Bias / accuracy testing log per LLM-touched workflow

## Removing this pillar

**Caution:** Most orgs cannot remove this pillar without legal exposure. Even if you're a tiny side-project, if you process any user data you have GDPR-equivalent obligations in most jurisdictions. Talk to legal counsel before removing.

If you do remove, update `knowledge/manifest.yaml`, `governance/ROLES.md`, and any subscriptions referencing `07-compliance`.
