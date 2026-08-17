import { supabaseAdmin } from '../config/supabase';
import { Profile } from '../types';


async function withPublishedCardCount(profile: Profile): Promise<Profile> {
  const { count, error } = await supabaseAdmin
    .from('prompt_cards')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', profile.id)
    .eq('is_public', true);
  if (error) throw error;
  return { ...profile, published_cards_count: count ?? 0 };
}
// NOTE: `role` lives outside the `profiles` table on purpose - the PRD's
// `profiles` schema (Section 8) doesn't include it. We read it from
// `auth.users.raw_app_meta_data.role`, which Supabase reserves for
// server-controlled claims a client can never edit themselves. Admins are
// assigned by an operator directly in the Supabase dashboard (PRD Section 4).
export async function getProfileRole(userId: string): Promise<'user' | 'admin'> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data?.user) return 'user';
  const role = (data.user.app_metadata as { role?: string } | null)?.role;
  return role === 'admin' ? 'admin' : 'user';
}

export async function findProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();
  if (error) throw error;
  return data ? withPublishedCardCount(data) : null;
}

export async function findProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? withPublishedCardCount(data) : null;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function createProfile(input: {
  id: string;
  username: string;
  display_name?: string;
}): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: input.id,
      username: input.username,
      display_name: input.display_name ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return withPublishedCardCount(data);
}

export async function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'bio'>>
): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return withPublishedCardCount(data);
}



