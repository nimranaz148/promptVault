import { AppError } from '../utils/AppError';
import {
  findProfileByUsername,
  findProfileById,
  isUsernameTaken,
  createProfile,
  updateProfile,
} from '../models/profile.model';
import { Profile } from '../types';
import { uploadAvatar } from './storage.service';

export async function getPublicProfile(username: string): Promise<Profile> {
  const profile = await findProfileByUsername(username);
  if (!profile) throw AppError.notFound('Profile not found');
  return profile;
}

export async function getMyProfile(userId: string): Promise<Profile> {
  const profile = await findProfileById(userId);
  if (!profile) throw AppError.notFound('Profile not found - complete onboarding first');
  return profile;
}

export async function uploadMyAvatar(userId: string, buffer: Buffer, contentType: string): Promise<Profile> {
  const avatarUrl = await uploadAvatar(buffer, contentType, userId);
  return updateProfile(userId, { avatar_url: avatarUrl });
}
export async function updateMyProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'bio'>>
): Promise<Profile> {
  return updateProfile(userId, updates);
}

/**
 * PRD Section 3.8 - called once after first login (both email/password
 * and Google OAuth signups) to set the user's chosen, unique username.
 */
export async function completeOnboarding(
  userId: string,
  username: string,
  displayName?: string
): Promise<Profile> {
  const existing = await findProfileById(userId);
  if (existing) {
    throw AppError.conflict('Profile already exists - use PATCH /profiles/me instead');
  }

  if (await isUsernameTaken(username)) {
    throw AppError.conflict(`Username "${username}" is already taken`);
  }

  return createProfile({ id: userId, username, display_name: displayName });
}


