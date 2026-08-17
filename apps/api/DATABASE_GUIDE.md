# PromptVault API Database Guide

Use this guide after creating a hosted Supabase project.

## 1. Supabase Auth

Enable these providers in Supabase Dashboard > Authentication > Providers:

- Email/password
- Google OAuth

For Google OAuth, add the web callback URLs later when the Next.js app is deployed.

## 2. SQL Schema

Open Supabase Dashboard > SQL Editor and run:

```sql
-- apps/api/db/schema.sql
```

This creates:

- `profiles`
- `prompt_cards`
- `card_likes`
- `card_runs`
- RLS policies
- indexes
- public storage buckets
- atomic `like_public_card` and `unlike_public_card` RPC functions

If the `storage.buckets` inserts fail in SQL editor, create these buckets manually in Dashboard > Storage:

- `avatars`, public
- `generated-images`, public

## 3. Seed Starter Cards

Create a reserved system auth user from Dashboard > Authentication > Add user.

Then copy that user's UUID and replace every `REPLACE_WITH_SYSTEM_USER_UUID` value in:

```sql
-- apps/api/db/seed.sql
```

Run the edited seed file in SQL Editor. It inserts the 13 public starter cards required by the PRD.

## 4. API Environment Values

Create `apps/api/.env` from `.env.example` and fill:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
```

Where to find them:

- `SUPABASE_URL`: Project Settings > API > Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Project Settings > API > service_role key
- `SUPABASE_JWT_SECRET`: Project Settings > API > JWT Settings > JWT Secret

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never put it in web or mobile env files.

## 5. Important Security Note

The API uses the Supabase service-role key on the server, so the service layer performs ownership/public-access checks before database writes. RLS policies are still created in the database and protect any future anon/user-scoped Supabase access from web or mobile clients.