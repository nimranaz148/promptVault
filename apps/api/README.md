# PromptVault API

Backend for PromptVault, built per `PromptVault-PRD.md`.
Node.js + Express + TypeScript, strict MVC layering (see PRD Section 3.3):
`routes/ → controllers/ → services/ → models/`, with `middleware/` for
cross-cutting concerns. Database is Supabase (PostgreSQL) with Row Level
Security as a second, independent access-control layer.

## 1. Setup

```bash
cd apps/api
npm install
cp .env.example .env
```

Fill in `.env`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project settings → API
- `SUPABASE_JWT_SECRET` — Supabase project settings → API → JWT Settings
- `TEXT_AI_PROVIDER` + matching API key (`OPENAI_API_KEY` / `GEMINI_API_KEY` / `ANTHROPIC_API_KEY`)
- `IMAGE_GEN_PROVIDER=pollinations` needs **no key** — good default to start with

## 2. Database

In the Supabase SQL editor, run in order:
1. `db/schema.sql` — creates all 4 tables, RLS policies, indexes, and the
   atomic `like_public_card` / `unlike_public_card` RPC functions
2. Create a "system" auth user (Dashboard → Authentication → Add user), copy its UUID
3. Replace `REPLACE_WITH_SYSTEM_USER_UUID` in `db/seed.sql` with that UUID, then run `db/seed.sql`

If the `storage.buckets` insert in `schema.sql` fails due to permissions,
create the `avatars` and `generated-images` buckets manually in
Dashboard → Storage, both marked **Public**.

## 3. Run locally

```bash
npm run dev       # tsx watch — auto-restarts on file changes
```

API will be available at `http://localhost:5000/api`. Health check: `GET /api/health`.

## 4. Build & deploy (Hostinger KVM 2 VPS)

Full step-by-step is in **PRD Section 3.4.1**. Supabase setup details are in `DATABASE_GUIDE.md`. Summary:

```bash
npm run build              # compiles to dist/
pm2 start dist/server.js --name promptvault-api
pm2 save && pm2 startup
```

Then configure Nginx as a reverse proxy for `api.yourdomain.com` → `localhost:5000`,
and run Certbot for a free SSL certificate.

## 5. Folder structure

```
src/
├── server.ts          # entry point
├── app.ts             # express app assembly (middleware + routes)
├── config/            # env loading, supabase client
├── middleware/         # auth, rate-limit, validation, error handling
├── routes/             # URL + method definitions ONLY
├── controllers/        # request parsing + response shaping ONLY
├── services/            # ALL business logic (incl. ai/ provider abstractions)
├── models/               # ALL database queries
├── schemas/              # Zod validation schemas
└── types/                # shared TypeScript types
```

See PRD Section 3.3 for the full "Must NOT do" rules per layer — this is
what keeps the codebase testable and swap-friendly (e.g. changing AI
providers only touches `services/ai/`, nothing else).

## 6. Endpoint reference

Full endpoint list with request/response shapes is in **PRD Section 9**.
Quick summary (19 endpoints):

| Group | Base path |
|---|---|
| Profiles | `/api/profiles` |
| Cards (my library + generation) | `/api/cards` |
| Community | `/api/community` |
| Admin | `/api/admin` |
