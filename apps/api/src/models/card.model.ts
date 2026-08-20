import { supabaseAdmin } from '../config/supabase';
import { PromptCard } from '../types';

export interface ListCardsFilters {
  ownerId?: string;
  publicOnly?: boolean;
  type?: string;
  category?: string;
  tag?: string;
  search?: string;
  page: number;
  limit: number;
  folderId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  folderId?: string;
  total: number;
}

export async function listCards(filters: ListCardsFilters): Promise<PaginatedResult<PromptCard>> {
  const { ownerId, publicOnly, type, category, tag, search, page, limit, folderId } = filters;

  let query = supabaseAdmin.from('prompt_cards').select('*, owner:profiles(username, avatar_url)', { count: 'exact' });

  if (ownerId) query = query.eq('owner_id', ownerId);
  if (publicOnly) query = query.eq('is_public', true);
  if (type) query = query.eq('type', type);
  if (category) query = query.eq('category', category);
  if (tag) query = query.contains('tags', [tag]);
  if (folderId) query = query.eq('folder_id', folderId);
  if (search) {
    const term = search.replace(/[%,]/g, ' ');
    query = query.or(`title.ilike.%${term}%,prompt_body.ilike.%${term}%,category.ilike.%${term}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { data: data ?? [], page, limit, total: count ?? 0 };
}

export async function findCardById(id: string): Promise<PromptCard | null> {
  const { data, error } = await supabaseAdmin
    .from('prompt_cards')
    .select('*, owner:profiles(username, avatar_url)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCard(
  ownerId: string,
  input: Partial<PromptCard>
): Promise<PromptCard> {
  const { data, error } = await supabaseAdmin
    .from('prompt_cards')
    .insert({ ...input, owner_id: ownerId })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateCard(
  id: string,
  updates: Partial<PromptCard>
): Promise<PromptCard> {
  const { data, error } = await supabaseAdmin
    .from('prompt_cards')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCard(id: string): Promise<void> {
  // Delete referencing runs and likes first to prevent foreign key violation
  const { error: runError } = await supabaseAdmin.from('card_runs').delete().eq('card_id', id);
  if (runError) throw runError;

  const { error: likeError } = await supabaseAdmin.from('card_likes').delete().eq('card_id', id);
  if (likeError) throw likeError;

  // If other cards forked this one, set their forked_from to null to avoid FK violation
  const { error: forkError } = await supabaseAdmin.from('prompt_cards').update({ forked_from: null }).eq('forked_from', id);
  if (forkError) throw forkError;

  const { error } = await supabaseAdmin.from('prompt_cards').delete().eq('id', id);
  if (error) throw error;
}

export async function setPublicStatus(id: string, isPublic: boolean): Promise<PromptCard> {
  return updateCard(id, { is_public: isPublic });
}

/**
 * Likes/unlikes a public card inside one Postgres function call, so the
 * card_likes row and prompt_cards.like_count update succeed or fail together.
 */
export async function likePublicCard(cardId: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('like_public_card', {
    card_id_input: cardId,
    user_id_input: userId,
  });
  if (error) throw error;
}

export async function unlikePublicCard(cardId: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('unlike_public_card', {
    card_id_input: cardId,
    user_id_input: userId,
  });
  if (error) throw error;
}


