# agent-os

> Boilerplate substrate for an AI-native organization's Operating OS. **You probably want to read [`AGENT-OS-README.md`](./AGENT-OS-README.md) first.**

For agents: start at [`CLAUDE.md`](./CLAUDE.md), then [`knowledge/manifest.yaml`](./knowledge/manifest.yaml).

For humans bootstrapping a new org: run `pnpm install && pnpm init`, then paste [`DEPLOY.md`](./DEPLOY.md) into Claude Code.

## Architecture in one diagram

```
Tier 1 — Canonical          → git (this repo)        → identity, strategy, SOPs
Tier 2 — Operational        → Supabase (your ops DB) → live state
Tier 3 — Events & Artifacts → Supabase Storage       → append-only logs
Tier 4 — Derived            → pgvector (in Tier 2)   → rebuildable embeddings
```

See [`AGENT-OS-README.md`](./AGENT-OS-README.md) for the full pitch.

## Status

**v0.1 — boilerplate.** Substrate is complete; pillars `01`–`08` (except `06-ai-ops`) are empty stubs you fill in for your org. Architecture is load-tested in shape, **not in operation**. Picking one pillar and running it through the loop is the first proof.

## License

UNLICENSED — see [`LICENSE`](./LICENSE).
