## What

[1-line description of the change.]

## Why

[The concrete problem solved. Reference an issue if applicable.]

## Substrate scope check

This PR is:
- [ ] A substrate improvement (architecture, schemas, hooks, skills mechanism, consistency engine, init wizard, deploy prompt)
- [ ] Documentation that improves the boilerplate's clarity
- [ ] NOT org-specific content (pillars filled in, role inventory, persona definitions, jurisdiction-specific compliance)

If the second box is unchecked, this PR likely belongs in your fork.

## Substitution check

If this PR adds templated content with `${PLACEHOLDER}` variables:
- [ ] New placeholders documented in `notes/SUBSTITUTION-GUIDE.md`
- [ ] Init wizard handles the new placeholders OR they're documented as wizard-skip (manual fill)
- [ ] No new `${PLACEHOLDER}` accidentally placed inside JS template literals (backticks)

## Migration safety

If this PR touches `supabase/migrations/`:
- [ ] New migration with next sequential number — does NOT edit any shipped migration
- [ ] Idempotent (uses `IF NOT EXISTS` / `IF EXISTS` where applicable)
- [ ] Tested locally with `supabase db reset` against a scratch project
- [ ] Backward compatible (adds, doesn't remove or rename)

## Test

- [ ] `pnpm validate` passes
- [ ] `pnpm test` passes
- [ ] Manual smoke test if behavior changed

## Risk

[What could go wrong? What's the rollback procedure?]
