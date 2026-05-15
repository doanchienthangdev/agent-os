# Migration 00023 — intentionally skipped

The agent-os boilerplate ships migrations 00001-00022 + 00024 + 00025.
There is no 00023.sql.

## Why?

Migration number 00023 in the source repo (`ritsu-works`) was Ritsu-specific
(`00023_pillar_rename_campaigns_default.sql` — renamed `ops.campaigns.pillar`
default from `01-growth` to `03-gtm` for Ritsu's pillar v1.0.1 architecture).

The agent-os boilerplate does NOT inherit Ritsu's 11-pillar architecture, so
this migration is not applicable. We preserved the migration NUMBERS of the
two substrate-relevant migrations that came after (00024, 00025) so tests
that reference them by exact filename continue to work.

## Implications

- `supabase db push` skips this number naturally — no error.
- The numbering gap is intentional and documented here.
- If your org needs a migration in this slot, you can author one as
  `00023_<your-name>.sql` and apply normally.

## Don't delete this file

This file documents the intentional gap. Removing it loses the rationale and
future operators will wonder.
