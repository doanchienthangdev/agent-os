# ${ORG_NAME} Transparency Policy

> Public-facing transparency document. Source for the page at `${PRODUCT_DOMAIN}/transparency` (or your equivalent). Updates via PR (Tier C).

**Status:** v0.1 (boilerplate stub — fill in)
**Owner:** founder + 07-compliance pillar
**Change policy:** PR + human review

---

## Why this document exists

${ORG_NAME} runs on AI. Customers and regulators have a right to know what that means in practice — what the AI does, what it doesn't do, what data it sees, and how mistakes are caught and corrected.

This document is the public answer. It must be honest, current, and specific.

---

## What AI does in ${ORG_NAME}

- [Customer-facing AI use case 1 — e.g., "support replies for FAQs"]
- [Customer-facing AI use case 2]
- [Internal AI use case worth disclosing]

## What AI does NOT do

- [Decision class reserved for humans — e.g., "billing disputes >$X"]
- [Decision class reserved for humans — e.g., "account suspensions >7 days"]
- [Anything legally required to be human-decided in your jurisdiction]

## How human-AI hand-off works

[1-2 paragraphs describing escalation. Reference `governance/HITL.md` Tier C/D actions.]

---

## Data ${ORG_NAME} processes

| Data class | Source | Used for | Retention | Lawful basis (GDPR) |
|---|---|---|---|---|
| [class 1] | [source] | [purpose] | [period] | [contract / consent / legitimate interest] |
| [class 2] | [...] | [...] | [...] | [...] |

## Subprocessors

| Subprocessor | What they do | Data accessed | DPA |
|---|---|---|---|
| Anthropic | LLM inference | Prompts containing [classes] | [link] |
| OpenAI (if used) | [purpose] | [...] | [...] |
| Supabase | DB + storage | All operating data | [link] |
| [your other subprocessors] | [...] | [...] | [...] |

---

## Regulatory obligations checklist

For each jurisdiction ${ORG_NAME} serves, mark the obligations:

### General Data Protection Regulation (EU)
- [ ] Privacy notice on landing page
- [ ] Lawful basis documented for each data class
- [ ] DPA with each subprocessor
- [ ] DPIA for high-risk processing
- [ ] Data export on request (right to portability)
- [ ] Data deletion on request (right to erasure)
- [ ] Breach notification within 72 hours

### EU AI Act
- [ ] Risk classification documented (minimal / limited / high)
- [ ] Transparency notice for AI outputs (label "AI-generated")
- [ ] Human-in-the-loop for high-risk decisions
- [ ] Bias and accuracy testing logged

### CCPA / California
- [ ] "Do Not Sell My Information" mechanism
- [ ] Privacy notice updated for California residents
- [ ] Right to deletion within 45 days

### COPPA / FERPA (if minor users)
- [ ] Verifiable parental consent flow
- [ ] No advertising profiles for under-13 users
- [ ] FERPA-compliant data handling (if educational records)

### [Your jurisdiction] (replace as needed)
- [ ] [local obligation 1]
- [ ] [local obligation 2]

---

## How customers contact us about transparency

- **General questions:** transparency@${PRIMARY_EMAIL_DOMAIN}
- **Data subject requests:** privacy@${PRIMARY_EMAIL_DOMAIN}
- **Urgent / breach reports:** urgent@${PRIMARY_EMAIL_DOMAIN}

Response SLAs:
- DSAR: within [N] days
- Breach acknowledgment: within 24 hours
- General questions: within 5 business days

---

## How to populate this file

1. Walk the regulatory checklist with legal counsel.
2. List actual subprocessors with their DPAs linked.
3. Map your data classes (CRM, support tickets, telemetry, etc.).
4. Set the contact addresses to live mailboxes.
5. Publish to `${PRODUCT_DOMAIN}/transparency` (or equivalent).

This is a public document. Treat as Tier C minimum.
