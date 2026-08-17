import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

/**
 * Uploads a generated image buffer to the `generated-images` bucket
 * (PRD Section 8) and returns a permanent public URL. We always re-upload
 * rather than storing the provider's own URL directly, since free-tier
 * provider links can expire or rate-limit-block later access.
 */
export async function uploadGeneratedImage(buffer: Buffer, contentType = 'image/png'): Promise<string> {
  const path = `${randomUUID()}.png`;

  const { error } = await supabaseAdmin.storage
    .from(env.generatedImagesBucket)
    .upload(path, buffer, { contentType, upsert: false });

  if (error) {
    throw AppError.badRequest(`Failed to upload generated image: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(env.generatedImagesBucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(buffer: Buffer, contentType: string, userId: string): Promise<string> {
  const extension = contentType.split('/')[1] || 'bin';
  const path = `${userId}/${randomUUID()}.${extension}`;
  const { error } = await supabaseAdmin.storage
    .from(env.avatarsBucket)
    .upload(path, buffer, { contentType, upsert: false });
  if (error) throw AppError.badRequest(`Failed to upload avatar: ${error.message}`);
  const { data } = supabaseAdmin.storage.from(env.avatarsBucket).getPublicUrl(path);
  return data.publicUrl;
}
