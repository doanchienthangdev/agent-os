# 06-finance — Finance & Accounting Pillar

> Invoicing, expenses, runway, financial reporting.

**Status:** scaffolded / not yet operating in this org

## What this pillar does (when populated)

- Transaction categorization (revenue, expenses, refunds)
- Invoice drafting and delivery
- Expense intake (receipts, vendor invoices)
- Runway tracking and burn analysis
- Monthly financial close
- Tax preparation (jurisdiction-specific — see your locale's compliance pillar)

## Roles primarily working in this pillar

- `backoffice-orchestrator` — owns the pillar
- `backoffice-clerk` — categorization + invoice drafting (read-only on payment systems by default)
- `runway-watcher` — periodic runway alerts

> **Critical:** No agent role holds payment-write keys (Stripe charge, refund, transfer). All money movement requires founder action via HITL Tier C/D. See `governance/HITL.md`.

## SOPs in this pillar

(none yet — add files under `06-finance/sops/`)

## Key Tier 2 tables

When populated, this pillar typically owns:
- `ops.transactions` — categorized financial events
- `ops.invoices_drafts` — drafts awaiting send
- `ops.expenses` — expense ledger
- `ops.runway_snapshots` — monthly runway calculations

## Jurisdiction-specific notes

Tax compliance is jurisdiction-specific. If your org operates in:
- **EU:** VAT registration thresholds + OSS reporting
- **US:** Federal + state sales tax nexus
- **Vietnam / Singapore / India:** local VAT/GST + corporate tax filings
- **UK:** VAT + corporation tax
- (your jurisdiction): document obligations in `06-finance/jurisdiction-<code>.md`

## Removing this pillar

If your organization doesn't need this pillar, delete the directory and update `knowledge/manifest.yaml`, `governance/ROLES.md`, and any subscriptions referencing `06-finance`.
