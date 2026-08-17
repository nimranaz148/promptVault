-- PromptVault database schema (Supabase / PostgreSQL)
-- Matches PRD Section 8 exactly. Run this in the Supabase SQL editor
-- (or via `supabase db push` if using the CLI) before starting the API.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ============================================================
-- 1. profiles â€” public profile extension of auth.users
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- 2. prompt_cards
-- ============================================================
create table if not exists prompt_cards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) not null,
  type text check (type in ('image', 'video', 'text')) not null,
  category text not null,
  title text not null,
  prompt_body text not null,
  variables jsonb default '[]',
  mode text check (mode in ('save_only', 'run_in_app')) not null default 'save_only',
  ai_provider text,
  tags text[] default '{}',
  is_public boolean default false,
  like_count int default 0,
  forked_from uuid references prompt_cards(id),
  folder_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table prompt_cards enable row level security;

create policy "Owners have full access to their own cards"
  on prompt_cards for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Public cards are readable by anyone"
  on prompt_cards for select
  using (is_public = true);

-- Indexes (PRD Section 8 â€” cover the three most common query patterns)
create index if not exists idx_cards_owner on prompt_cards(owner_id);
create index if not exists idx_cards_public_category on prompt_cards(category) where is_public = true;
create index if not exists idx_cards_type on prompt_cards(type);
create index if not exists idx_cards_folder on prompt_cards(folder_id);

-- ============================================================
-- ============================================================
-- 3. folders
-- ============================================================
create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(owner_id, name)
);

alter table folders enable row level security;
create policy "Users manage their own folders"
  on folders for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

alter table prompt_cards
  drop constraint if exists prompt_cards_folder_id_fkey;
alter table prompt_cards
  add constraint prompt_cards_folder_id_fkey
  foreign key (folder_id) references folders(id) on delete set null;
-- 4. card_likes
-- ============================================================
create table if not exists card_likes (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references prompt_cards(id) not null,
  user_id uuid references profiles(id) not null,
  created_at timestamptz default now(),
  unique(card_id, user_id)
);

alter table card_likes enable row level security;

create policy "Users manage their own likes"
  on card_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 4. card_runs
-- ============================================================
create table if not exists card_runs (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references prompt_cards(id) not null,
  user_id uuid references profiles(id) not null,
  filled_prompt text not null,
  result_type text check (result_type in ('image_url', 'text', 'video_script')),
  result_value text,
  created_at timestamptz default now()
);

alter table card_runs enable row level security;

create policy "Users see and create only their own runs"
  on card_runs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 5. Atomic like/unlike RPC functions
-- These keep card_likes and prompt_cards.like_count in the same database
-- transaction, matching the PRD Section 8 requirement.
-- ============================================================
create or replace function like_public_card(card_id_input uuid, user_id_input uuid)
returns void as $$
begin
  if not exists (
    select 1 from prompt_cards
    where id = card_id_input and is_public = true
  ) then
    raise exception 'Card not found or is not public' using errcode = 'P0002';
  end if;

  insert into card_likes (card_id, user_id)
  values (card_id_input, user_id_input);

  update prompt_cards
  set like_count = like_count + 1
  where id = card_id_input;
exception
  when unique_violation then
    raise exception 'You already liked this card' using errcode = '23505';
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function like_public_card(uuid, uuid) from public, anon, authenticated;
grant execute on function like_public_card(uuid, uuid) to service_role;

create or replace function unlike_public_card(card_id_input uuid, user_id_input uuid)
returns void as $$
declare
  deleted_count int;
begin
  if not exists (
    select 1 from prompt_cards
    where id = card_id_input and is_public = true
  ) then
    raise exception 'Card not found or is not public' using errcode = 'P0002';
  end if;

  delete from card_likes
  where card_id = card_id_input and user_id = user_id_input;

  get diagnostics deleted_count = row_count;

  if deleted_count = 0 then
    raise exception 'Like not found' using errcode = 'P0002';
  end if;

  update prompt_cards
  set like_count = greatest(like_count - 1, 0)
  where id = card_id_input;
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function unlike_public_card(uuid, uuid) from public, anon, authenticated;
grant execute on function unlike_public_card(uuid, uuid) to service_role;

-- ============================================================
-- 6. Storage buckets (PRD Section 8)
-- Run separately if `storage.buckets` insert isn't permitted via SQL editor â€”
-- in that case create these two buckets manually in the Supabase Dashboard
-- under Storage, both set to "Public".
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('generated-images', 'generated-images', true)
on conflict (id) do nothing;





