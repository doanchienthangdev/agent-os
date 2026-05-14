# ${PRODUCT_NAME} — Product Charter

> **Canonical source of truth for what ${PRODUCT_NAME} is.**
> Every agent must align with this document before producing marketing, sales, support, or product-ops output. If reality drifts from this document, update the document via PR — do not let two truths exist.

**Last verified against the live site:** YYYY-MM-DD (https://${PRODUCT_DOMAIN})
**Owner:** founder
**Change policy:** PR + human review

---

## One-line

[The single sentence that describes ${PRODUCT_NAME}. Memorable. Concrete. Names what changes for the user.]

## Tagline (homepage hero)

**[Marketing tagline as it appears on the homepage hero. Verbatim. Update this when the site changes.]**

## Positioning

[1-2 paragraphs. The longer-form positioning that explains what ${PRODUCT_NAME} replaces in the user's stack and what makes it different. Reference real competitors by name.]

## What ${PRODUCT_NAME} is, in plain terms

[A non-marketing paragraph for internal use. Describe the actual mechanism — what the user does, what the system does, what the experience feels like. Avoid jargon.]

## What ${PRODUCT_NAME} is NOT

Boundaries the workforce should not cross when describing the product:

- Not [a common misconception about ${PRODUCT_NAME}].
- Not [a category ${PRODUCT_NAME} is sometimes lumped with].
- Not [a feature scope creep that founder rejects].

---

## Core capabilities

[3-5 bullets. The things ${PRODUCT_NAME} can do, named in user-facing terms. Pull from product README or live site; do NOT invent.]

- **[Capability 1]** — [one-line]
- **[Capability 2]** — [one-line]
- **[Capability 3]** — [one-line]

## User flow (3-step homepage version)

If ${PRODUCT_NAME} has a marketing-friendly 3-step user journey, name it here. Otherwise: list the actual flow steps.

1. **[Step 1]** — [what the user does]
2. **[Step 2]** — [what the system does]
3. **[Step 3]** — [what the user gets]

---

## Target audience

[3-6 personas in priority order. Each: 1 sentence on who they are and what they need.]

1. **[Persona 1]** — [...]
2. **[Persona 2]** — [...]
3. **[Persona 3]** — [...]

## Key differentiators

| Competitor | What ${PRODUCT_NAME} does that they don't |
|---|---|
| [Competitor A] | [...] |
| [Competitor B] | [...] |

---

## Pricing model

[Free / freemium / paid / tiered. Detailed tiers live at https://${PRODUCT_DOMAIN}/pricing — agents must fetch the live page when discussing specific tier limits, never quote from memory.]

## Voice and tone

The site copy uses these patterns. Marketing output should match.

- **[Stylistic choice 1]** — [...]
- **[Stylistic choice 2]** — [...]
- **[Stylistic choice 3]** — [...]

For full brand voice rules, see `00-charter/brand_voice.md`.

---

## Operational implications for the AI workforce

This section is what makes this charter actionable for `${ORG_REPO_NAME}` agents.

- **01-growth must own SEO around [your category keywords].**
- **03-delivery handles support at scale** — [how support is structured for ${PRODUCT_NAME}].
- **02-product owns the feedback loop** from users back to the product team.
- **06-trust-safety / 07-compliance** — [non-negotiable obligations given your category and jurisdiction].
- **04-backoffice handles [primary entity location]-specific tax and compliance.**

---

## What changes when?

- **Product positioning** changes only with founder approval. PR-only.
- **Feature list** updated when new features ship — agent should detect via product changelog feed.
- **Persona priorities** revisited quarterly based on actual user data.
- **Pricing** is live data; never cache numbers. Always fetch from `/pricing` page.

---

## How to populate this file

The boilerplate ships this as a stub. To make it your product charter:

1. Visit https://${PRODUCT_DOMAIN} (your live site or planning doc).
2. Pull homepage hero, capabilities, personas, pricing references.
3. Replace bracketed placeholders.
4. Commit via PR (Tier C — this is canonical).

Once filled in, every marketing/sales/support agent reads this for grounding before producing output.

*This document is the canonical answer to "what is ${PRODUCT_NAME}?" Every other piece of output should be consistent with it.*
