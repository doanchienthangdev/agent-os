---
name: Substrate enhancement
about: Propose an addition or improvement to the agent-os substrate
title: "[feature] "
labels: enhancement
---

## What you want

[1-2 sentences describing the substrate addition or improvement.]

## Why

[The concrete problem this solves. A scenario where the current substrate falls short.]

## Proposed approach

[How you'd implement it. Files touched, new dependencies, migration changes (if any).]

## Substrate vs fork check

Confirm this is genuinely cross-org generic, not specific to your use case:

- [ ] Useful to ≥3 different organization types (e.g., B2B SaaS + creator studio + agency)
- [ ] No org-specific assumptions baked in (e.g., not "Stripe" — but "payment provider abstraction")
- [ ] No org-specific data model (e.g., not "students table" — but "users table")
- [ ] Documented in `notes/SUBSTITUTION-GUIDE.md` if it adds new placeholders

If any check fails, this likely belongs in your fork, not in agent-os.

## Risk

[What could break? Backward compatibility concerns? Migration safety?]

## Additional context

[Related issues, prior art, references.]
