# gpt — Generic Persona Template

> Boilerplate placeholder persona. Replace with real personas as your org grows.

**Slug:** `gpt`
**Bound role:** `gps` (general-purpose steward)
**Status:** active (so the framework validates out of the box)
**HITL max:** C

## Why this exists

The agent-os boilerplate ships with the workforce-persona framework wired in:
- schema validation
- L2 cross-tier validator (`scripts/cross-tier/validate-personas.cjs`)
- pre/post hooks (specs only — runtime deferred)
- `ops.agent_runs.persona_slug` column (migration 00023)

For the framework to validate cleanly, at least one persona must exist. `gpt`
is that persona. It exists for one job: pass `pnpm check` so the framework
proves itself before you customize it.

## What `gpt` does in your org

Nothing meaningful. Treat it as scaffolding. When you invoke `/gpt` or `@gpt`,
the runtime resolves it to the `gps` role (which IS your generic steward
defined in `governance/ROLES.md`).

## Deleting `gpt`

Once you've added at least one real persona (e.g., `ceo`):
1. Add the new persona block to `knowledge/workforce-personas.yaml` with
   `status: active`.
2. Create the persona's spec folder under `06-ai-ops/workforce-personas/<slug>/`
   with the canonical 8 files.
3. Create `.claude/agents/<slug>.md` and `.claude/commands/<slug>.md`.
4. Update `governance/ROLES.md` to add `personas_bound: [<slug>]` on the
   bound role.
5. Run `pnpm check` to verify framework still validates.
6. THEN remove `gpt` from `knowledge/workforce-personas.yaml`, delete this
   folder, and remove the back-reference from `gps` in `governance/ROLES.md`.

## See also

- `notes/WORKFORCE-PERSONAS-USAGE.md` — full usage guide
- `06-ai-ops/workforce-personas/README.md` — three-plane model explanation
- `knowledge/schemas/workforce-personas.schema.json` — registry schema
