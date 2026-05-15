# Source Provenance

> Where this boilerplate came from, what was preserved, what was scrubbed, and how to re-pull substrate updates.

## v0.2 backport (2026-05-15)

Backported substrate upgrades from ritsu-works commits 5dca72c..9f2c21c (14 commits). What was ported, in 3 themes:

**CLA — Capability Lifecycle Architecture** (commits `79658b3`, `84a9a50`, `be0d4d4`, `1339bae`, `38a47c8`, `9f2c21c`):
- `/cla` slash command + `@cla` subagent
- 10 capability-lifecycle skills (Phase 0-8 dispatchers + version-bumper + dependency-scanner)
- 6 SOPs (master + fix/extend/revise/tune/deprecate sub-flows)
- Migration 00025 (capability update lock + lineage view + helper functions)
- `knowledge/cla-routing-keywords.yaml` (boilerplate ships 1 placeholder route)
- `knowledge/capability-registry.yaml` (boilerplate ships empty)
- 18 test files (~520 test cases)
- Tier 1 schemas + L2 validator wired into `pnpm check`
- See `notes/CLA-USAGE.md`

**Workforce persona FRAMEWORK** (commits `6f789ef`, `c846981`, `e1f8652`, `e16b346`, `f10d5ff`):
- Schema (`knowledge/schemas/workforce-personas.schema.json`)
- Validator (`scripts/cross-tier/validate-personas.cjs`) — wired into `pnpm check` as L2 critical
- Hook specs (`.claude/hooks/{pre-persona-resolve,post-persona-log}.md`) — runtime deferred
- Migration 00024 (`agent_runs.persona_slug` column + index)
- Registry (`knowledge/workforce-personas.yaml`) with 1 placeholder persona (`gpt`)
- Persona spec folder (`06-ai-ops/workforce-personas/gpt/` with 8 canonical files)
- Runtime files (`.claude/agents/gpt.md`, `.claude/commands/gpt.md`)
- Bidirectional binding (`personas_bound: [gpt]` on `gps` role)
- See `notes/WORKFORCE-PERSONAS-USAGE.md`
- **Skipped:** Ritsu's Phase 1-4 specific personas (CEO, CTO, CGO, CPO + Phase 2-4 specs) — their frameworks port; the specific binding instances do not

**check-drift improvements** (commit `ff8e8d8`):
- `validate-pillar-numbering.cjs` with `isTracked()` helper that respects gitignored dirs
- Wired as L1 critical in `pnpm check`
- **Skipped:** Ritsu's 11-pillar v1.0.1 architecture restructure — domain-specific
- **Skipped:** Ritsu's sub-pillar prefix-drop convention — keeps the option open for orgs that want different conventions

**Pillar-set genericization (NEW in v0.2, addressing founder feedback):**
- `scripts/init.cjs` now offers 3 pillar modes: starter set, custom pillars (org defines its own), or keep all
- `notes/PILLAR-EXAMPLES.md` documents pillar layouts for B2C SaaS, B2B SaaS, AI film studio, personal-OS, creator/solopreneur, agency, e-commerce, infrastructure SaaS

**Migration count:** 22 → 24 (added 00024 personas + 00025 capability lock; intentional gap at 00023 documented in `supabase/migrations/00023_skipped.md`)

---

## Source (initial v0.1)

- **Source repo:** `doanchienthangdev/ritsu-works`
- **Source commit SHA:** `5dca72c8f91f798329325366c32634463d422706` (commit message: "Add /check-drift slash command + pnpm check script (project-scoped) (#10)")
- **Source branch:** `main`
- **Extraction date:** 2026-05-14
- **Extraction agent:** Claude Code session (Opus 4.7)
- **Triggering decision:** founder override of CEO review recommendation. CEO review (archived in source repo at `~/.gstack/projects/ritsu-works/ceo-plans/2026-05-14-boilerplate-readiness.md`) recommended Approach C — defer extraction until ritsu's pillars are proven end-to-end. Founder chose Approach B — extract substrate now — on the explicit grounds of multiple concrete next projects (AI film studio, Jarvis personal OS) that need a shared starting point.

## What got copied (and what didn't)

The extraction used `rsync` with an explicit exclude list. The full source repo was filtered down to ~159 files of substrate.

### Excluded from copy

- `.git/` — fresh history starts here
- `node_modules/`, `coverage/`, `_build/`, `runtime/` — generated/local-only
- `raw/`, `.archives/` — workspace plane, local-only
- `src/5-star/` — Ritsu-specific marketing knowledge base (40+ files)
- `wiki/articles/`, `wiki/books/`, `wiki/companies/`, `wiki/concepts/`, `wiki/customers/`, `wiki/decisions/`, `wiki/episodes/`, `wiki/ideas/`, `wiki/meetings/`, `wiki/observations/`, `wiki/persons/`, `wiki/repos/`, `wiki/weekly_reviews/` — Ritsu's collected reference notes
- `notes/wave-2-implementation-plan.md`, `notes/master-init-v2.9-resume.md`, `notes/pg-cron-setup.md`, `notes/boilerplate-candidates.md` — Ritsu work product
- `knowledge/phase-a2-extensions/` — 13 Ritsu-specific Bài-#8-#20 design drafts
- `supabase/functions/_shared/*.generated.ts` — bundler outputs, regenerable
- `package-lock.json` — using pnpm; only `pnpm-lock.yaml` carries forward
- `.claude/worktrees/` — worktree metadata
- `--version`, `.DS_Store` — noise

### Classification of what was copied (~159 files)

| Bucket | Count | Treatment |
|---|---|---|
| KEEP_VERBATIM | 37 | Pure generic substrate, copied as-is. Includes all 22 Supabase migrations, 20 JSON schemas, edge functions, validators, bundlers, husky hook, tsconfig, vitest config. |
| TEMPLATE_LIGHT | 62 | Mechanically substituted via `scripts/_extract/scrub.cjs` Pass-3A — Ritsu strings → `${PLACEHOLDER}`. 299 replacements across 60 files. Includes governance/HITL.md, knowledge/manifest.yaml, all skills, all hooks, all knowledge yaml files, tests. |
| TEMPLATE_HEAVY | 25 | Manually rewritten as generic stubs in Pass-3B. Includes 00-charter/* (5 files), governance/ROLES.md, governance/IDENTITY.md, all 7 pillar READMEs, README.md, CLAUDE.md, package.json, TODOS.md, supabase/functions/_shared/worker.ts (prompt template fix), tests/wave2-bootstrap-cron-secrets.test.ts (template literal fix). |
| BOILERPLATE_NEW | 12 | Authored fresh: AGENT-OS-README.md, DEPLOY.md, INIT.md, LICENSE, CONTRIBUTING.md, .github/workflows/ci.yml, .github/ISSUE_TEMPLATE/{bug,feature}.md, .github/PULL_REQUEST_TEMPLATE.md, scripts/init.cjs, scripts/_extract/scrub.cjs, this file, notes/SUBSTITUTION-GUIDE.md. |

## Legitimate residual "ritsu" references in the boilerplate

After scrub, 30 case-insensitive "ritsu" mentions remain. All intentional:

- `scripts/_extract/scrub.cjs` (~27 hits) — regex patterns IN the scrub tool that reference Ritsu. These exist to support re-extracting from a future Ritsu-based source if needed. Not user-facing.
- `AGENT-OS-README.md` (2 hits) — provenance link to source repo. Intentional.
- `DEPLOY.md` (1 hit) — example troubleshooting scenario referencing "ritsu-ops" as a hardcoded test fixture artifact.

If you fork agent-os and want to remove all traces, you can `rm scripts/_extract/scrub.cjs` after the wizard runs (it's a one-time tool).

## Re-pulling substrate updates from ritsu-works

If `ritsu-works` ships a substrate improvement (e.g., a new migration, a hook fix, a consistency-engine enhancement) that you want in your fork:

1. Identify the changed file(s) in ritsu-works.
2. Determine if the change is in a KEEP_VERBATIM file (safe to copy as-is) or a TEMPLATE file (need to apply scrub before copying into your fork).
3. For KEEP_VERBATIM files: `cp /path/to/ritsu-works/<file> /path/to/your-fork/<file>`. Test.
4. For TEMPLATE files: copy to a scratch dir, run the scrub script against it manually, then merge into your fork.

There is no automated re-sync mechanism (yet). Substrate updates are rare; manual merging is acceptable.

## Boilerplate-extraction tooling left in the repo

The following files exist solely to support boilerplate extraction and re-extraction:

- `scripts/_extract/scrub.cjs` — Pass-3A substitution from ritsu-named files to `${PLACEHOLDER}` versions
- `scripts/init.cjs` — wizard that does the reverse (substitutes `${PLACEHOLDER}` → user values)
- `notes/SOURCE-PROVENANCE.md` — this file
- `notes/SUBSTITUTION-GUIDE.md` — variable reference

For an org that's done with bootstrapping and doesn't anticipate re-extracting, all four can be deleted.

## License + redistribution

agent-os is licensed UNLICENSED (see `LICENSE`). The repo is publicly visible at `https://github.com/${GITHUB_OWNER}/agent-os` for reference, but the code is not legally free to fork or redistribute.

The source repo (`ritsu-works`) is also UNLICENSED. Both are owned by the same founder.

If you arrived here via a fork that the source repo owner did not authorize, that fork violates the LICENSE. Please contact the source repo owner.
