# Pillar Examples — Picking the Right Pillars for Your Org

> The starter pillar set in agent-os is a B2C-product-company default. It is not
> universal. Different org types need different pillars.

## The principle

A pillar is a **major operational area** of your org — something that has its own
workflows, roles, KPIs, and SOPs. The boilerplate's starter pillars assume:

- You ship a product to customers
- You do marketing/growth to acquire them
- You provide customer support
- You handle finance + compliance + integrations

That's a B2C SaaS / product-company shape. If you're building something else,
your pillars are different.

## The starter set (B2C product company)

```
00-charter/         (always — identity, brand, values)
01-growth/          marketing, sales, partnerships
02-customer/        customer ops, support, retention
03-product/         product ops (around the product)
04-content/         content production
06-ai-ops/          THE meta-framework (always — keep this)
06-finance/         finance & accounting
07-compliance/      trust & safety, privacy, AI law
08-integrations/    external APIs, MCP server hosting
```

Note: pillar `05` is intentionally skipped (numbering legacy from source).

## When to delete vs replace

- **Delete a pillar** if your org genuinely doesn't have that operational area
  (e.g., a personal-OS doesn't have `01-growth`).
- **Replace a pillar** by renaming it to fit your domain (e.g., rename
  `01-growth` to `01-distribution` for a film studio).
- **Add new pillars** beyond 08 by giving them numbers `09`, `10`, etc.

The init wizard supports both: pick which starter pillars to keep, then optionally
add your own.

---

## Example pillar layouts by org type

### B2C SaaS (the starter set — what ritsu-works was)

```
00-charter, 01-growth, 02-customer, 03-product, 04-content,
06-ai-ops, 06-finance, 07-compliance, 08-integrations
```

### B2B SaaS

```
00-charter, 01-marketing, 02-sales, 03-customer-success, 04-product,
06-ai-ops, 06-finance, 07-compliance, 08-integrations
```

Differences from B2C: split `01-growth` into `01-marketing` + `02-sales` (B2B
sales is high-touch); `02-customer` becomes `03-customer-success` (account
management).

### AI Film Studio

```
00-charter, 01-development, 02-production, 03-post-production, 04-distribution,
05-talent, 06-ai-ops, 07-finance, 08-rights-and-licensing
```

- `01-development` — script, IP, pre-production research
- `02-production` — generation pipeline (text-to-video, voice, music)
- `03-post-production` — editing, color, sound mix
- `04-distribution` — festival circuit, streaming deals, social cuts
- `05-talent` — voice actors, directors, art directors
- `08-rights-and-licensing` — IP holdings, licensing deals, copyright

No `01-growth` — distribution IS growth in this model.
No `07-compliance` (yet) — film industry has its own rights/SAG-AFTRA/MPAA layer
captured in `08-rights-and-licensing`.

### Personal AI assistant (Jarvis-style)

```
00-charter, 01-inbox, 02-calendar, 03-knowledge, 04-projects,
06-ai-ops, 07-personal-ops
```

- `01-inbox` — email, Telegram, Slack triage
- `02-calendar` — scheduling, meeting prep, follow-ups
- `03-knowledge` — wiki, reading list, research
- `04-projects` — multi-step personal projects (renovation, tax filing, etc.)
- `07-personal-ops` — finance, health, errands

No customer/marketing/compliance pillars — it's a personal OS.

### Creator / solopreneur

```
00-charter, 01-audience, 02-content, 03-monetization, 04-products,
06-ai-ops, 06-finance
```

- `01-audience` — newsletter, social, community
- `02-content` — production pipeline (videos, posts, podcasts)
- `03-monetization` — sponsorships, courses, affiliate
- `04-products` — digital goods, services

### Agency

```
00-charter, 01-business-development, 02-clients, 03-delivery, 04-talent,
06-ai-ops, 06-finance, 07-compliance, 08-integrations
```

- `01-business-development` — outbound, RFPs, proposals
- `02-clients` — account management
- `03-delivery` — project delivery (the core work)
- `04-talent` — freelancer/contractor pool

### E-commerce

```
00-charter, 01-acquisition, 02-merchandising, 03-fulfillment, 04-customer,
06-ai-ops, 06-finance, 07-compliance, 08-integrations
```

- `01-acquisition` — paid ads, SEO, partnerships
- `02-merchandising` — catalog, pricing, inventory planning
- `03-fulfillment` — orders, shipping, returns

### Infrastructure / dev-tools SaaS

```
00-charter, 01-developer-relations, 02-product, 03-customer-engineering,
04-content, 06-ai-ops, 06-finance, 07-compliance, 08-integrations
```

- `01-developer-relations` — community, docs, conference talks
- `03-customer-engineering` — onboarding, integration support, churn
- `04-content` — heavy weight here; tutorials + reference docs are the marketing

---

## The schema constraint

Per `scripts/cross-tier/validate-pillar-numbering.cjs`:

- Top-level pillar dirs MUST match `^[0-9]{2}-[a-z][a-z0-9-]+$` (e.g., `00-charter`, `01-development`)
- Sub-pillar dirs MUST NOT have a numeric prefix (e.g., `01-development/script-room/`, not `01-development/01-script-room/`)

If your org needs a different convention (no numeric prefix; `feature-*`; etc.),
edit the regex in `scripts/cross-tier/validate-pillar-numbering.cjs` lines 50-51.

## How the init wizard handles this

When you run `pnpm init`, the wizard offers two pillar modes:

1. **Default starter set** — keep/remove the 7 starter pillars (B2C product shape)
2. **Custom pillars** — provide your own list of pillar slugs. The wizard renames
   the starter dirs to match.

After init, you can always `mv` pillars to rename them, or `rm -rf` to delete.
Just remember to update `knowledge/manifest.yaml` to reflect the new layout, and
re-run `pnpm check` to verify the pillar-numbering validator still passes.
