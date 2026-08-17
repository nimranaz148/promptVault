import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { listCardsQuerySchema, cardIdParamSchema } from '../schemas/card.schema';
import * as communityController from '../controllers/community.controller';

const router = Router();

// Browsing the community feed is public — no auth required (PRD Section 5,
// the /community route is explicitly browsable without login).
router.get('/cards', validate(listCardsQuerySchema), communityController.listCommunityCards);
router.get('/cards/:id', validate(cardIdParamSchema), communityController.getCommunityCard);

// Liking and saving require an account.
router.post('/cards/:id/like', requireAuth, validate(cardIdParamSchema), communityController.likeCard);
router.delete('/cards/:id/like', requireAuth, validate(cardIdParamSchema), communityController.unlikeCard);
router.post('/cards/:id/save', requireAuth, validate(cardIdParamSchema), communityController.saveToLibrary);

export default router;
