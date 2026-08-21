# PromptVault Progress

Updated: 2026-08-17

## Current Summary

PromptVault is a functional full-stack MVP for web and API. The web app and backend are implemented against the PRD scope for the non-mobile MVP. The mobile app remains pending.

## Web App Status

Status: Web MVP implemented. All 14 PRD web routes are present.

Completed:

- Next.js 14 App Router, TypeScript, Tailwind CSS.
- Paper and ink theme with light/dark support, custom fonts, and local UI primitives.
- Route structure under `src/app`.
- API client layer under `src/lib/api`.
- Supabase client auth integration.
- TanStack Query hooks for cards, community, profile, and auth flows.
- Library, card create/edit/detail, run/copy, community, profile, settings, and auth pages.
- Production build now passes after wrapping `useSearchParams()` usage in Suspense boundaries.
- ESLint is configured and runs non-interactively.

Implemented web routes:

- `/`
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

Known web follow-ups:

- Fixing Mocked Profile Card Feed (fetching specific user's cards) [COMPLETED]
- Implementing Modals for 'Save to Library' and Logout confirmation [COMPLETED]
- Fixing Card deletion failing silently due to Foreign Key violations [COMPLETED]
- Fixing Broken Creator Profile Links (routing to username instead of owner_id) [COMPLETED]
- Fixing Next.js Pre-render Compile Blocker (supabase client fallback) [COMPLETED]
- Implementing Folders UI (Sidebar, Dropdowns, Listing filtering) [COMPLETED]
- `npm run lint --workspace=apps/web` passes, but reports warnings for raw `<img>` usage. These are performance warnings, not build blockers.
- Remote image handling can be migrated to `next/image` once image domains and dimensions are finalized.

## Backend Status

Status: Backend MVP implemented and tested.

Completed:

- Express + TypeScript API with routes/controllers/services/models separation.
- Supabase JWT auth middleware with JWKS verification and legacy HS256 fallback.
- Profile onboarding and avatar upload endpoints.
- Prompt card CRUD, duplicate, publish, unpublish, folder assignment, and generation flow.
- Community feed, public card detail, like/unlike, and save-to-library fork flow.
- Text/image/video-script generation service abstractions.
- Supabase schema, RLS policies, indexes, storage buckets, migration, and starter cards.
- Admin card unpublish endpoint.
- Zod validation, Helmet, CORS, rate limiting, and centralized error handling.

Known backend follow-ups:

- Implementing Owner Joined Profiles on Cards (fetching profile info with cards) [COMPLETED]
- Live AI-provider tests remain manual because automated tests mock provider boundaries.
- Operational deployment [COMPLETED] - Both frontend and backend successfully deployed as Serverless functions on Vercel, bypassing the original Render plan due to billing restrictions.

## Deployment Status

Status: Live on Vercel

- **Backend API**: Deployed to Vercel as a Serverless function using `@vercel/node`. Configured dynamic ESM imports for `jose` library to fix build issues, adjusted Express rate-limiting proxy trust, and configured dynamic CORS origin to support Vercel preview environments.
- **Frontend Web**: Deployed to Vercel as a Next.js project. Environment variables securely integrated with Supabase and the live Backend API.
## Mobile App Status

Status: Pending. Expo mobile app is not scaffolded yet.

Remaining mobile screens:

- Login / Signup
- My Library
- Card Detail
- Create/Edit Card
- Community Feed
- Community Card Detail
- My Profile
- Settings

## Verification

Latest local verification:

- `npm run typecheck --workspace=apps/web` passes.
- `npm run lint --workspace=apps/web` passes with image optimization warnings.
- `npm run build --workspace=apps/web` passes.
- `npm run typecheck --workspace=apps/api` passes.
- `npm run build --workspace=apps/api` passes.
- `npm test --workspace=apps/api` passes: 4 files, 21 tests.
