# 08-integrations — External Integrations Pillar

> Webhook receivers, external APIs, MCP server hosting, third-party data ETL.

**Status:** scaffolded / not yet operating in this org

## What this pillar does (when populated)

- Webhook receivers (Stripe, GitHub, Telegram, partner systems)
- External API clients (rate-limited, with backoff + observability)
- MCP server hosting (HTTP MCP servers exposed at `mcp.${PRODUCT_DOMAIN}`)
- Third-party data ETL (CRMs, analytics platforms, partner data feeds)
- API key rotation orchestration

## Roles primarily working in this pillar

- `integrations-orchestrator` — owns the pillar
- `webhook-router` — receives, validates, and dispatches incoming webhooks
- `etl-runner` (cross-cutting; primarily 06-ai-ops) — handles inbound third-party ETL into `ops.*` and `metrics.*`

## SOPs in this pillar

(none yet — add files under `08-integrations/sops/`)

## Key Tier 2 tables

When populated, this pillar typically owns:
- `ops.webhook_events` — incoming webhook log
- `ops.api_call_log` — outbound API observability
- `ops.integration_health` — partner uptime tracking

## MCP server

If you expose an HTTP MCP server (e.g., for partners or for cross-org sharing), it lives under `mcp-server/` at the repo root. The server reads tool definitions from `knowledge/mcp-tools.yaml` and authorizes per-role access via `knowledge/mcp-roles.yaml`.

Local-mode (stdio) MCP usage doesn't need this pillar; it's only when you host a long-running HTTP MCP that 08-integrations becomes relevant.

## Removing this pillar

If your organization doesn't need external integrations beyond a handful of well-known SaaS APIs (which can live directly in role MCP configs), delete the directory and update `knowledge/manifest.yaml`, `governance/ROLES.md`, and any subscriptions referencing `08-integrations`.
