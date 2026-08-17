-- PromptVault backend completion migration.
-- Apply after the initial schema to add folder organization and harden RPC access.

create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(owner_id, name)
);

alter table folders enable row level security;
drop policy if exists "Users manage their own folders" on folders;
create policy "Users manage their own folders"
  on folders for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

alter table prompt_cards add column if not exists folder_id uuid;
alter table prompt_cards drop constraint if exists prompt_cards_folder_id_fkey;
alter table prompt_cards add constraint prompt_cards_folder_id_fkey
  foreign key (folder_id) references folders(id) on delete set null;
create index if not exists idx_cards_folder on prompt_cards(folder_id);

alter function like_public_card(uuid, uuid) set search_path = public;
alter function unlike_public_card(uuid, uuid) set search_path = public;
revoke execute on function like_public_card(uuid, uuid) from public, anon, authenticated;
revoke execute on function unlike_public_card(uuid, uuid) from public, anon, authenticated;
grant execute on function like_public_card(uuid, uuid) to service_role;
grant execute on function unlike_public_card(uuid, uuid) to service_role;
