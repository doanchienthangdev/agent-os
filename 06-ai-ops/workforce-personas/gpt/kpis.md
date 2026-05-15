# gpt — KPIs

> Placeholder KPIs. None tracked until you replace this persona.

## KPI definitions (empty)

When you populate, define KPIs that measure this persona's effectiveness, e.g.:

- **`persona.<slug>.invocations_per_week`** — how often the persona is called
- **`persona.<slug>.avg_tier_used`** — average HITL tier (lower = more autonomous)
- **`persona.<slug>.founder_corrections_pct`** — % of runs where founder rejected/edited output
- **`persona.<slug>.tokens_per_invocation`** — cost-per-call tracking

## Where KPIs come from

- **Source data:** `ops.agent_runs` filtered by `persona_slug = '<slug>'`
- **Aggregation:** weekly via materialized view or scheduled SOP
- **Storage:** `ops.kpi_snapshots` with `kpi_name = 'persona.<slug>.<metric>'`
- **Ownership map:** `knowledge/kpi-ownership.yaml` (if your org uses it)

## When to populate

After 30+ days of real persona invocations. Before then, persona KPIs are
not meaningful (sample too small).
