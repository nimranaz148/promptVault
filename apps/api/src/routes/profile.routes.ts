import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  completeOnboardingSchema,
  updateProfileSchema,
  usernameParamSchema,
} from '../schemas/profile.schema';
import * as profileController from '../controllers/profile.controller';

const router = Router();

router.get('/me', requireAuth, profileController.getMyProfile);
router.patch('/me', requireAuth, validate(updateProfileSchema), profileController.updateMyProfile);
router.post('/me/avatar', requireAuth, profileController.avatarUpload.single('avatar'), profileController.uploadAvatar);
router.post(
  '/complete-onboarding',
  requireAuth,
  validate(completeOnboardingSchema),
  profileController.completeOnboarding
);
router.get('/:username', validate(usernameParamSchema), profileController.getProfileByUsername);

export default router;

