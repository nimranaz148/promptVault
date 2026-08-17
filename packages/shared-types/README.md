# @promptvault/shared-types (placeholder)

Per `PromptVault-PRD.md` Section 12, this package is meant to hold
Zod schemas + TypeScript types shared across `apps/web`, `apps/mobile`,
and `apps/api`.

**Current status:** `apps/api` already has its own `src/types/` and
`src/schemas/` folders with everything it needs. This package stays empty
for now — once `apps/web` is scaffolded (Phase 5) and needs the same
card/profile types and validation rules, move the contents of
`apps/api/src/types/index.ts` and `apps/api/src/schemas/*.ts` here, then
have both `apps/api` and `apps/web` import from `@promptvault/shared-types`
instead of duplicating the definitions.

Not required to touch before then.
