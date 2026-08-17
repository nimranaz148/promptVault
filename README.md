# PromptVault

PromptVault is a full-stack prompt library for saving, organizing, running, and sharing AI prompts across image, video-script, and text workflows.

The repo is an npm workspace monorepo:

```text
promptvault/
  apps/
    api/       Express + TypeScript API backed by Supabase
    web/       Next.js 14 app with auth, library, community, profiles, and settings
    mobile/    Expo mobile placeholder for the later mobile phases
  packages/
    shared-types/  placeholder for shared schemas/types
```

## Status

- API: implemented and tested.
- Web: implemented and production build passes.
- Mobile: not scaffolded yet.

See `progress.md` for the current verification status and `PromptVault-PRD.md` for the product spec.

## Common Commands

```bash
npm run dev --workspace=apps/web
npm run build --workspace=apps/web
npm run lint --workspace=apps/web
npm run typecheck --workspace=apps/web

npm run dev --workspace=apps/api
npm run build --workspace=apps/api
npm run typecheck --workspace=apps/api
npm test --workspace=apps/api
```

## Environment

Copy the example env files in each app and fill in Supabase/API provider values before running locally.

- Web needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_URL`.
- API needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, and optional AI provider keys.
