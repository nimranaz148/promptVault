# PromptVault Web App

Next.js 14 App Router frontend for PromptVault.

## Implemented Routes

- `/` landing page
- `/about`
- `/community`
- `/community/[cardId]`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/app`
- `/app/cards/new`
- `/app/cards/[id]`
- `/app/cards/[id]/edit`
- `/profile/[username]`
- `/settings`

## Stack

- Next.js 14, React 18, TypeScript
- Tailwind CSS
- TanStack Query
- Supabase Auth client
- Zustand for client UI state
- shadcn-style local UI primitives

## Commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

`npm run lint` currently passes with non-blocking warnings for raw `<img>` usage. Those can be migrated to `next/image` later once remote image domains and sizing behavior are finalized.
