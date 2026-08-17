# PromptVault — Product Requirements Document (PRD)

**For:** Autonomous coding agents (Claude Code, Cursor, etc.) building this project end-to-end
**Version:** 1.0 — MVP build spec
**Last updated:** August 2026

---

## 0. How to Use This PRD

This document is project context for a coding agent. Build in the phase order defined in **Section 14** — backend first, then web, then mobile (per project owner's preference). Each phase should be scaffolded, minimally tested, and committed before moving to the next. Section numbers are referenced throughout so the agent can jump to the right spec quickly.

---

## 1. Product Summary

**Name:** PromptVault (working name — rename freely)
**One-liner:** A card-based prompt library where users save, organize, and run AI prompts (text, image, video-script) — and discover/reuse prompts from a public community library.

**Problem:** People who use AI tools regularly (developers, students, content creators) end up with their best prompts scattered across notes apps, chat history, and screenshots. They rewrite the same prompts repeatedly and have no easy way to discover good prompts others have already written.

**Solution:** Every prompt is saved as a **card**, typed by generation category (Image / Video / Text). Cards can be plain saved text (copy-paste model) **or** run live inside the app against a real AI provider, user's choice per card. A public community feed lets users browse, like, and save other users' prompt cards into their own library.

**Primary user:** Developers, students, and content creators who use AI tools daily and want one organized, searchable home for their prompts.

---

## 2. MVP Scope

### In scope (v1)
- Auth: email/password + Google OAuth (Supabase Auth)
- **Prompt Cards**, 3 types: Image, Video, Text — each card stores the prompt text, type, tags, and optional template variables
- **Variable/template system** — prompts can contain placeholders (e.g. `{{topic}}`, `{{style}}`); a fill-in form renders before copy/run
- **Two card modes**, chosen per card:
  - **Save-only** — just stored, one-tap copy to clipboard
  - **Run-in-app** — executes against a live AI provider and shows the result inline (image render, text output, or video *script/prompt* — no video rendering in v1, see Section 3.5)
- **Personal library** — organize own cards by type, tags, folders; search/filter
- **Public Community Library** — opt-in publish of a card to a public feed; browse/search other users' public cards; **Like** and **Save to my library** (creates a personal copy)
- Card CRUD, duplicate/fork a card
- Basic user profile (avatar, name, public cards count)
- Mobile app: library, community feed, card detail (run/copy), save/like, auth

### Out of scope for v1 (later phases)
- Actual **video rendering** — v1 generates/stores the video prompt/script only; no integration with Kling/Hailuo/Pika rendering in MVP
- Monetization — no paid prompts, no subscriptions, no billing (Section 2 confirms fully free MVP)
- Comments/discussion threads on community cards
- Teams/workspaces (shared libraries between multiple users) — MVP is single-user library + public feed, not multi-user collaboration
- Prompt versioning/history (Git-style diffs)
- Browser extension (auto-paste into ChatGPT/Claude tabs)
- Content moderation tooling beyond basic report/flag

---

## 3. Tech Stack

### 3.1 Web App
| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Client state | Zustand |
| Server/cache state | TanStack Query |
| Forms | React Hook Form + Zod resolver |
| Auth | Supabase Auth (email/password + Google OAuth), session via httpOnly cookie |

**Frontend separation of concerns** (applies to both web and mobile — same principle as the backend MVC layering in Section 3.3, adapted for a client app):

| Folder | Responsibility | Must NOT do |
|---|---|---|
| `app/` (web) or `app/` (Expo Router) | Route/page files only — compose components, call hooks, no business logic or raw fetch calls | No direct API calls, no data transformation |
| `components/` | Presentational UI only — receives props, renders. Reusable, dumb where possible. | No API calls, no global state mutation |
| `hooks/` | Custom hooks wrapping TanStack Query calls (e.g. `useCards()`, `useCommunityFeed()`) — the only place that calls the API layer | No JSX |
| `lib/api/` | Thin fetch/axios wrapper functions, one per backend resource (`cards.ts`, `community.ts`) — this is the **only** file group that knows the API's URL shape | No React, no UI logic |
| `store/` | Zustand stores — client-only UI state (e.g. active filter tab, modal open/close). Server data belongs in TanStack Query, not here. | No server data caching |
| `types/` | Shared TypeScript types (ideally imported from `packages/shared-types` — see Section 12) | — |

This mirrors the backend's rule: a component never calls `fetch()` directly, the same way a controller never queries the database directly — everything goes through its designated layer.

### 3.2 Mobile App
| Layer | Choice |
|---|---|
| Framework | React Native via Expo |
| Navigation | Expo Router |
| Styling | NativeWind (Tailwind syntax on RN), matches web design tokens |
| State | Zustand (shared store shape with web where possible) |
| Auth | Supabase JS client (same project as web) |

Mobile follows the identical `components/ hooks/ lib/api/ store/` split described in Section 3.1 — the goal is that `hooks/` and `lib/api/` can eventually move into `packages/shared` and be reused by both web and mobile with minimal changes.

### 3.3 Backend (Node.js, MVC architecture — strict separation of concerns)

The API follows **MVC with a service layer**, and each layer has exactly one job. The agent must not mix responsibilities across layers (e.g. no DB queries inside a controller, no business logic inside a route file):

| Layer | Folder | Responsibility | Must NOT do |
|---|---|---|---|
| **Routes** | `routes/` | Define URL + HTTP method, attach middleware, call the matching controller function. Nothing else. | No validation logic, no DB calls, no business logic |
| **Controllers** | `controllers/` | Parse/validate the request (via Zod), call the relevant service, shape the HTTP response (status code + JSON). | No direct DB/Supabase queries, no AI provider calls |
| **Services** | `services/` | All business logic: `generateText()`, `generateImage()`, prompt-variable filling, like/fork logic, moderation checks. Calls models for data access. | No `req`/`res` objects — services must be callable outside an HTTP context (e.g. from a script or test) |
| **Models** | `models/` | All Supabase/Prisma queries — the only layer allowed to talk to the database. | No business logic, no response formatting |
| **Middleware** | `middleware/` | Cross-cutting concerns: JWT auth check, rate limiting, request validation wiring, error handling. | — |

This structure is what makes the codebase testable and lets the agent (or a future teammate) change the AI provider, add a new endpoint, or swap the database layer without touching unrelated code.

| Component | Choice |
|---|---|
| Runtime | Node.js (TypeScript) |
| API framework | Express |
| Database | Supabase (PostgreSQL) via `@supabase/supabase-js` or Prisma (agent's choice — Prisma recommended for typed queries) |
| Validation | Zod (shared schemas between API and web where possible) |
| Background jobs | Not required for MVP — AI calls are synchronous with a loading state; revisit a queue (BullMQ + Redis) only if generation volume causes timeouts |
| Auth | Supabase Auth; backend verifies Supabase JWT on protected routes |
| File storage | Supabase Storage (for generated images + user avatars) |

### 3.4 DevOps
- Repo layout: `apps/web`, `apps/mobile`, `apps/api`, `packages/shared` (Turborepo optional — can stay as simple npm workspaces for solo dev)
- Supabase project (hosted) — no local DB container needed, Supabase gives hosted Postgres + Auth + Storage out of the box
- GitHub Actions CI (lint, typecheck on PR) — optional for MVP, add once core flows work
- **Deploy:**
  - **Web (Next.js)** → Vercel
  - **Backend API (Node.js)** → **Hostinger KVM 2 VPS** (already owned — see Section 3.4.1 for setup)
  - **Mobile** → EAS Build

#### 3.4.1 Backend Deployment — Hostinger KVM 2 VPS

The API deploys to the owner's existing Hostinger KVM 2 VPS instead of a managed platform like Railway/Render. Since this is a full VPS (root access, dedicated resources), the agent must set up the following stack manually:

| Tool | Purpose |
|---|---|
| **Node.js + npm/pnpm** | Install directly on the VPS (via nvm recommended, for easy version switching) |
| **PM2** | Keeps the Node/Express API running in the background, auto-restarts on crash, restarts on server reboot (`pm2 startup`) |
| **Nginx** | Reverse proxy — routes `api.yourdomain.com` (port 80/443) to the Node app's internal port (e.g. `localhost:5000`) |
| **Certbot (Let's Encrypt)** | Free SSL certificate for HTTPS on the API subdomain |
| **Git** | Pull latest code from GitHub on the VPS for each deploy (manual `git pull` + `pm2 restart`, or a simple deploy script — no CI/CD platform needed for MVP) |
| **UFW (firewall)** | Only allow ports 22 (SSH), 80, 443 — block direct access to the Node app's internal port from outside |

**Basic setup order:**
1. SSH into the VPS, install Node.js (via nvm) and PM2 globally
2. Clone the repo, `cd apps/api`, install dependencies, set up `.env` (Section 11 vars) directly on the server — never commit `.env` to Git
3. Start the API with PM2: `pm2 start dist/server.js --name promptvault-api`, then `pm2 save` + `pm2 startup` so it survives reboots
4. Configure Nginx as a reverse proxy for a subdomain (e.g. `api.yourdomain.com` → `localhost:5000`)
5. Point the Hostinger domain's DNS `A` record for the `api` subdomain to the VPS's IP address
6. Run Certbot to issue a free SSL cert for `api.yourdomain.com` — enables `https://` for the frontend to call safely
7. Redeploy flow for future changes: `git pull` → `npm run build` → `pm2 restart promptvault-api`

**Why this matters for CORS/env setup:** once the API lives at `https://api.yourdomain.com`, update `NEXT_PUBLIC_API_URL` (web) and `EXPO_PUBLIC_API_URL` (mobile) to point there, and add the Vercel web app's domain to the API's CORS allow-list (Section 9).

### 3.5 AI Providers

**Text generation:**
Single-provider start (pick one: OpenAI, Gemini, or Anthropic Claude) behind an internal `generateText()` function — wrap it so a second provider can be added later without touching route/controller code.

**Image generation — free options to start:**
- **Pollinations.ai** — no API key required, fully free, best for MVP (start here)
- **Hugging Face Inference API** — free tier, rate-limited, Stable Diffusion/Flux models
- **Google Gemini image generation** — usable within Gemini's free-tier quota

Wrap behind `generateImage(prompt, options)` so the provider is swappable.

**Video — v1 does NOT render video.** A "Video" card type only stores/generates the **prompt/script text** (e.g. via the same `generateText()` call with a video-prompt-writing system prompt). The card shows a "Copy this into [Kling / Hailuo / Pika]" hint with links, but no rendering API is called. This keeps v1 free and avoids the cost/complexity of video generation APIs entirely.

**Billing:** None — no Stripe integration in v1.

---

## 3.6 Card Categories (Sub-types)

Each card's `type` (image/video/text) is further broken into a **category**, so the library and community feed have enough visual density to never feel empty with just 2-4 cards. MVP ships with **13 fixed categories** (agent can add more later — store as a TEXT column, not a hard enum, so new categories don't need a migration):

| Type | Category (`category` value) | Display Label |
|---|---|---|
| image | `text_to_image` | Text-to-Image Generation |
| image | `bg_remove_change` | Background Remove/Change |
| image | `upscale_enhance` | Quality Enhance / Upscale |
| image | `style_transfer` | Style Transfer |
| image | `thumbnail` | Thumbnail Generator |
| video | `text_to_video_script` | Text-to-Video Script |
| video | `reel_script` | Short-form Reel/TikTok Script |
| video | `voiceover_script` | Voiceover/Narration Script |
| text | `blog_post` | Blog Post Writing |
| text | `social_caption` | Social Media Captions |
| text | `ad_copy` | Ad/Marketing Copy |
| text | `code_explain` | Code Generation / Explain Code |
| text | `seo_content` | SEO Content Writing |

Library and Community UI both group/filter by `category`, not just `type` — e.g. the type filter tabs (Section 7) expand into category chips underneath once a type tab is selected.

## 3.7 Starter / Seed Cards

To avoid an empty-state library and community feed on first launch, seed **one system-owned public card per category** (13 total) at Phase 2. These are owned by a reserved `system` profile, marked `is_public = true`, and appear in the Community feed immediately — real users can browse, run, and save-to-library (fork) them from day one.

| Category | Title | Prompt (with variables) |
|---|---|---|
| text_to_image | Cinematic Portrait | "A cinematic portrait of `{{subject}}`, `{{lighting}}` lighting, shot on `{{camera}}`, ultra-detailed, 8k" |
| bg_remove_change | Studio Background Swap | "Remove the background from this image and replace it with a `{{background_style}}` background, keep lighting on `{{subject}}` consistent" |
| upscale_enhance | 4K Upscale & Sharpen | "Upscale this image to `{{resolution}}`, enhance sharpness and detail, remove noise/blur, preserve original colors" |
| style_transfer | Style Convert | "Convert this photo into `{{art_style}}` style artwork, keep facial features recognizable" |
| thumbnail | YouTube Thumbnail | "Create a bold YouTube thumbnail for a video about `{{topic}}`, bright colors, large readable text saying '`{{text_overlay}}`', high-CTR style" |
| text_to_video_script | Product Demo Script | "Write a 30-second video script promoting `{{product}}` for `{{platform}}`, strong hook in the first 3 seconds, end with a call to action" |
| reel_script | Viral Hook Reel Script | "Write a short-form video script about `{{topic}}` in a `{{tone}}` tone, strong opening hook, under 30 seconds runtime" |
| voiceover_script | Calm Narration Script | "Write a calm narration voiceover script explaining `{{topic}}` for a `{{duration}}`-second video, simple everyday language" |
| blog_post | SEO Blog Post | "Write a `{{word_count}}`-word blog post about `{{topic}}` targeting the keyword '`{{keyword}}`', with an intro, 3 subheadings, and a conclusion" |
| social_caption | Instagram Caption Generator | "Write 3 Instagram captions for a post about `{{topic}}` in a `{{tone}}` tone, include relevant hashtags" |
| ad_copy | Facebook Ad Copy | "Write a short Facebook ad for `{{product}}` targeting `{{audience}}`, highlight the main benefit, end with a clear CTA" |
| code_explain | Code Explainer | "Explain what this code does in simple terms and point out potential bugs: `{{code_snippet}}`" |
| seo_content | Meta Description Writer | "Write an SEO meta description (max 155 characters) for a page about `{{topic}}` targeting the keyword '`{{keyword}}`'" |

---

## 3.8 Signup → Profile Creation Flow

Supabase Auth creates a row in `auth.users` on signup, but `profiles` (which holds `username`) is a separate table — the agent must wire this explicitly:

- **Email/password signup:** onboarding form asks for `username` immediately after account creation, before entering `/app`.
- **Google OAuth signup:** no username is collected by Google — show a **one-time "choose your username" screen** immediately after first OAuth login, before entering `/app`. Suggest a default (derived from email/name) but require the user to confirm/edit it since `username` is `UNIQUE`.
- Implementation options for the agent: either a Postgres trigger on `auth.users` INSERT that creates a placeholder `profiles` row (username = temp value, `needs_username: true` flag), or a backend `POST /profiles/complete-onboarding` call from the frontend right after first login. Either approach works — pick one and document it in the repo README.

---

## 4. User Roles & Access

MVP is intentionally simple — no multi-tenant workspace model needed.

| Role | Description |
|---|---|
| **User** | Default role for every signed-up account. Full control of their own cards (create/edit/delete/publish), can browse and save/like community cards. |
| **Admin** | Internal only, manually assigned in DB. Can unpublish/remove reported community cards. No dedicated admin UI required for MVP — direct DB/Supabase-dashboard moderation is acceptable at this scale. |

No workspace, no invite flow, no billing roles — this is a single-user-per-account product.

---

## 5. Website Sitemap (Next.js Routes)

### Marketing / public (3)
1. `/` — Landing (explains the product, shows sample community cards)
2. `/about`
3. `/community` — Public community feed, browsable **without login**; running/saving a card requires login

### Auth (4)
4. `/login`
5. `/signup`
6. `/forgot-password`
7. `/reset-password`

### Core app — protected (7)
8. `/app` — My Library (default view after login)
9. `/app/cards/new` — Create a new card (choose type: Image / Video / Text)
10. `/app/cards/[id]` — Card detail: view prompt, fill variables, run (if run-in-app) or copy (if save-only), edit, publish/unpublish toggle
11. `/app/cards/[id]/edit`
12. `/app/community/[cardId]` — Public card detail page (view/like/save-to-library; run requires login)
13. `/app/profile/[username]` — Public profile showing a user's published cards
14. `/app/settings` — profile, account, connected providers

**~14 total routes** for MVP — deliberately small.

---

## 6. Mobile App Screens (React Native / Expo)

1. Login / Signup
2. My Library (list, filter by type: Image/Video/Text, search)
3. Card detail (fill variables → run or copy)
4. Create/Edit card
5. Community Feed (browse public cards)
6. Community card detail (like / save to my library)
7. My Profile (my published cards)
8. Settings

**8 screens** for MVP.

---

## 7. My Library Layout (`/app`)

**Structure:** top bar (search, avatar menu) + type filter tabs (All / Image / Video / Text) + a **grid of prompt cards**.

**Each card in the grid shows:**
- Type icon/badge (🖼️ Image / 🎬 Video / 📝 Text)
- Title + short prompt preview
- Tags
- Mode indicator (⚡ Run-in-app vs 📋 Save-only)
- Published/private indicator
- Quick actions: copy, run, edit, publish toggle, delete

**Quick Actions bar** above the grid: *New Card · Browse Community*.

---

## 8. Database Schema (Supabase / PostgreSQL)

```sql
-- users handled by Supabase Auth (auth.users); this is the public profile extension
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

prompt_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT CHECK (type IN ('image', 'video', 'text')) NOT NULL,
  category TEXT NOT NULL,               -- e.g. 'bg_remove_change', 'thumbnail', 'blog_post' — see Section 3.6
  title TEXT NOT NULL,
  prompt_body TEXT NOT NULL,           -- may contain {{variable}} placeholders
  variables JSONB DEFAULT '[]',         -- [{ "key": "topic", "label": "Topic", "default": "" }]
  mode TEXT CHECK (mode IN ('save_only', 'run_in_app')) NOT NULL DEFAULT 'save_only',
  ai_provider TEXT,                     -- e.g. 'pollinations', 'openai', 'gemini' (null if save_only)
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  like_count INT DEFAULT 0,
  forked_from UUID REFERENCES prompt_cards(id),  -- set when saved-from-community
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

card_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES prompt_cards(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(card_id, user_id)
)
-- prompt_cards.like_count is a denormalized counter, NOT computed live via COUNT().
-- The service layer increments it by 1 on POST /community/cards/:id/like and
-- decrements it by 1 on DELETE .../like — both inside the same DB transaction
-- as the card_likes insert/delete, so the counter never drifts out of sync.

card_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES prompt_cards(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  filled_prompt TEXT NOT NULL,          -- prompt after variables filled in
  result_type TEXT CHECK (result_type IN ('image_url', 'text', 'video_script')),
  result_value TEXT,                    -- URL for image, raw text for text/video_script
  created_at TIMESTAMPTZ DEFAULT now()
)
```

**Row Level Security (RLS):** enable on `prompt_cards` — owner has full access to their own rows; public `SELECT` allowed only where `is_public = true`. Enable RLS on `card_likes` and `card_runs` scoped to `user_id = auth.uid()`.

**Indexes (add in Phase 2):**
```sql
CREATE INDEX idx_cards_owner ON prompt_cards(owner_id);
CREATE INDEX idx_cards_public_category ON prompt_cards(category) WHERE is_public = true;
CREATE INDEX idx_cards_type ON prompt_cards(type);
```

**Field validation (Zod, enforced at the API layer):**
- `title`: 3–100 characters
- `prompt_body`: 1–5,000 characters
- `tags`: max 10 tags per card, each ≤ 30 characters
- `username` (profiles): 3–20 characters, lowercase alphanumeric + underscore only

**Supabase Storage buckets (create in Phase 0):**
- `avatars` — public bucket, user profile pictures
- `generated-images` — public bucket, images produced by `POST /cards/:id/run` when `result_type = 'image_url'` (download the provider's response and re-upload here rather than storing a third-party URL directly, so results don't break if the provider's temporary link expires)

**Pagination defaults (apply to `GET /cards` and `GET /community/cards`):**
- Default page size: 20 items
- Query params: `?page=1&limit=20`
- Response includes `{ data: [...], page, limit, total }`

---

## 9. Backend API Endpoints (Express, MVC)

All `/api/*` routes except `/api/auth/*` require a valid Supabase JWT (`Authorization: Bearer`). Security baseline: helmet, CORS allow-list, `express-rate-limit` on generation endpoints (the expensive ones to abuse), Zod validation on every body/query, Supabase RLS as the second line of defense.

| Group | Endpoints |
|---|---|
| **Auth** | Handled client-side via Supabase Auth SDK; backend only verifies JWT middleware |
| **Profiles** | `GET /profiles/:username`, `PATCH /profiles/me`, `POST /profiles/complete-onboarding` (sets username on first login — see Section 3.8) |
| **Cards** | `GET /cards` (my library, filterable by type/category/tag, paginated), `POST /cards`, `GET /cards/:id`, `PATCH /cards/:id`, `DELETE /cards/:id`, `POST /cards/:id/duplicate` (copies a card the user already owns), `POST /cards/:id/publish`, `POST /cards/:id/unpublish` |
| **Community** | `GET /community/cards` (public feed, paginated, filter by type/tag/search), `GET /community/cards/:id`, `POST /community/cards/:id/like`, `DELETE /community/cards/:id/like`, `POST /community/cards/:id/save` (forks into caller's library) |
| **Generation** | `POST /cards/:id/run` (fills variables, calls the appropriate provider via `generateText()`/`generateImage()`, stores + returns a `card_runs` row) |
| **Admin** (manual role check) | `PATCH /admin/cards/:id/unpublish` (moderation) |

**~19 endpoints** for MVP.

---

## 10. Non-Functional Requirements

- **Security:** OWASP-Top-10 baseline, no plaintext API keys in client bundles, rate limiting on `/cards/:id/run` specifically (real money/quota cost per call)
- **Data isolation:** Supabase RLS is the source of truth for row access — backend checks are a second layer, never the only layer
- **Performance:** library initial load target < 2s; `run_in_app` calls show a loading state and stream/poll for results rather than blocking indefinitely
- **Observability:** log provider errors and rate-limit hits so free-tier quota exhaustion is visible early

---

## 11. Environment Variables

```
# API (apps/api/.env)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_VERIFY_AUDIENCE=
OPENAI_API_KEY=            # or GEMINI_API_KEY / ANTHROPIC_API_KEY — pick one text provider to start
IMAGE_GEN_PROVIDER=        # pollinations | huggingface | gemini
HUGGINGFACE_API_KEY=

# Web (apps/web/.env)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=

# Mobile (apps/mobile/.env)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=
```

---

## 12. Suggested Project Structure

```
promptvault/
├── apps/
│   ├── web/                    # Next.js
│   │   └── src/
│   │       ├── app/             # routes/pages only — no business logic
│   │       ├── components/      # presentational UI only
│   │       ├── hooks/           # useCards(), useCommunityFeed() — wraps TanStack Query
│   │       ├── lib/api/         # fetch wrappers, one file per backend resource
│   │       └── store/           # Zustand — client-only UI state
│   │
│   ├── mobile/                  # Expo / React Native — same internal split as web/
│   │   └── src/
│   │       ├── app/             # Expo Router screens
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── lib/api/
│   │       └── store/
│   │
│   └── api/                     # Express, MVC layout (see Section 3.3):
│       ├── routes/              # URL + method definitions only
│       ├── controllers/         # request parsing + response shaping only
│       ├── services/            # all business logic
│       ├── models/               # all Supabase/Prisma queries
│       └── middleware/           # auth, rate-limit, validation, error handling
│
├── packages/
│   └── shared-types/            # Zod schemas + TS types shared across web/mobile/api
└── README.md
```

Each folder listed above maps directly to a "Must NOT do" rule in Sections 3.1 and 3.3 — if the agent finds itself writing a `fetch()` call inside a `components/` file, or a Supabase query inside a `controllers/` file, that's a signal the separation has been broken and the code should be moved to its correct layer.

---

## 13. Build Phases (for the coding agent)

1. **Phase 0 — Scaffold:** repo structure, Supabase project setup (Auth + Postgres + Storage), base Next.js/Express/Expo apps, shared types package
2. **Phase 1 — Backend Auth & Profiles:** Supabase Auth wiring, JWT verification middleware, `profiles` table + endpoints
3. **Phase 2 — Backend Core: Prompt Cards CRUD:** `prompt_cards` table + RLS, full CRUD endpoints, variable-template storage
4. **Phase 3 — Backend: AI Generation:** `generateText()` and `generateImage()` service wrappers, `POST /cards/:id/run` endpoint, `card_runs` table
5. **Phase 4 — Backend: Community:** public feed endpoint, like/save-to-library (fork) endpoints, `card_likes` table
6. **Phase 5 — Web: Auth + My Library UI:** login/signup, `/app` grid view, card create/edit forms
7. **Phase 6 — Web: Card Detail + Run/Copy flow:** variable fill-in form, run-in-app result display, copy-to-clipboard for save-only cards
8. **Phase 7 — Web: Community Feed + Profile pages**
9. **Phase 8 — Mobile: Auth + Library parity** (screens 1–4 from Section 6)
10. **Phase 9 — Mobile: Community + Profile parity** (screens 5–8)
11. **Phase 10 — Polish:** loading/error states, empty states, search/filter refinement, basic admin moderation

---

## 14. Open Questions / Assumptions

- Text provider default: spec leaves this open (OpenAI vs Gemini vs Claude) — pick one for MVP, wrap it so switching later doesn't touch route code.
- Image provider default: start with **Pollinations.ai** since it needs no API key — fastest to get Phase 3 working end-to-end.
- Username field on `profiles` assumes public profile URLs (`/app/profile/[username]`) — confirm uniqueness/format rules (lowercase, no spaces) before Phase 1.
- "Save to my library" from community creates a **fork** (copy), not a live reference — so editing the original later won't affect saved copies. Confirmed by the `forked_from` column in Section 8; flag if live-sync behavior is wanted instead.
