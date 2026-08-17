import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { cardIdParamSchema } from '../schemas/card.schema';
import * as adminController from '../controllers/admin.controller';

const router = Router();

router.use(requireAuth, requireAdmin);

router.patch('/cards/:id/unpublish', validate(cardIdParamSchema), adminController.unpublishAnyCard);

export default router;
