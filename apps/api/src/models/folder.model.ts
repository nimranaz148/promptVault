import { supabaseAdmin } from '../config/supabase';
import { Folder } from '../types';

export async function listFolders(ownerId: string): Promise<Folder[]> {
  const { data, error } = await supabaseAdmin
    .from('folders')
    .select('*')
    .eq('owner_id', ownerId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function findFolderById(id: string): Promise<Folder | null> {
  const { data, error } = await supabaseAdmin.from('folders').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createFolder(ownerId: string, name: string): Promise<Folder> {
  const { data, error } = await supabaseAdmin
    .from('folders')
    .insert({ owner_id: ownerId, name })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateFolder(id: string, name: string): Promise<Folder> {
  const { data, error } = await supabaseAdmin
    .from('folders')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('folders').delete().eq('id', id);
  if (error) throw error;
}
