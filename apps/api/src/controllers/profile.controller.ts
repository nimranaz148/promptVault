import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service';
import { AppError } from '../utils/AppError';

export async function getProfileByUsername(req: Request, res: Response, next: NextFunction) {
  try { res.status(200).json(await profileService.getPublicProfile(req.params.username)); } catch (err) { next(err); }
}

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try { res.status(200).json(await profileService.getMyProfile(req.user!.id)); } catch (err) { next(err); }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try { res.status(200).json(await profileService.updateMyProfile(req.user!.id, req.body)); } catch (err) { next(err); }
}

export async function completeOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, display_name } = req.body;
    res.status(201).json(await profileService.completeOnboarding(req.user!.id, username, display_name));
  } catch (err) { next(err); }
}

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  },
});

export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw AppError.badRequest('A JPEG, PNG, or WebP avatar file is required');
    const profile = await profileService.uploadMyAvatar(req.user!.id, req.file.buffer, req.file.mimetype);
    res.status(200).json(profile);
  } catch (err) { next(err); }
}
