# gpt — Dossier

> Append-only audit log of `gpt` persona invocations.
>
> Maintained by `.claude/hooks/post-persona-log.md` (currently SPEC ONLY — runtime
> not yet implemented; rows here will be empty until your org wires the hook).

## Format

Each entry:

```
## YYYY-MM-DDTHH:MM:SS — invocation N

- Run ID: <ops.agent_runs.id>
- Invoked by: <founder|other persona>
- Routing trigger: <slash command | subagent mention | direct dispatch>
- Bound role used: gps
- HITL tier applied: <A|B|C|D-Std|D-MAX>
- Outcome: <success|failed|deferred>
- Tokens: in=N, out=N, cost=$N.NNN
- Notes: <one-line summary>
```

## Entries

(none yet)
