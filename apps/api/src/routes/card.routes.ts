import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { generationLimiter } from '../middleware/rateLimit.middleware';
import {
  createCardSchema,
  updateCardSchema,
  listCardsQuerySchema,
  cardIdParamSchema,
  runCardSchema,
} from '../schemas/card.schema';
import * as cardController from '../controllers/card.controller';
import * as generationController from '../controllers/generation.controller';

const router = Router();

// All /cards routes require auth — this is the "My Library" resource group.
router.use(requireAuth);

router.get('/', validate(listCardsQuerySchema), cardController.listMyCards);
router.post('/', validate(createCardSchema), cardController.createCard);
router.get('/:id', validate(cardIdParamSchema), cardController.getCard);
router.patch('/:id', validate(updateCardSchema), cardController.updateCard);
router.delete('/:id', validate(cardIdParamSchema), cardController.deleteCard);

router.post('/:id/duplicate', validate(cardIdParamSchema), cardController.duplicateCard);
router.post('/:id/publish', validate(cardIdParamSchema), cardController.publishCard);
router.post('/:id/unpublish', validate(cardIdParamSchema), cardController.unpublishCard);

// Generation — the only endpoint with a real per-call cost, so it gets its
// own stricter rate limiter on top of the general one (PRD Section 10).
router.post(
  '/:id/run',
  generationLimiter,
  validate(runCardSchema),
  generationController.runCard
);

export default router;
