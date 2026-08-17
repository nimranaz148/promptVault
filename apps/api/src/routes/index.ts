import { Router } from 'express';
import profileRoutes from './profile.routes';
import cardRoutes from './card.routes';
import communityRoutes from './community.routes';
import adminRoutes from './admin.routes';
import folderRoutes from './folder.routes';

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

router.use('/profiles', profileRoutes);
router.use('/folders', folderRoutes);
router.use('/cards', cardRoutes); // includes POST /cards/:id/run - see Section 9 "Generation" group in the PRD
router.use('/community', communityRoutes);
router.use('/admin', adminRoutes);

export default router;



