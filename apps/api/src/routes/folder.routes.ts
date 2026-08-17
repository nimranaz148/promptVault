import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createFolderSchema, folderIdParamSchema, updateFolderSchema } from '../schemas/folder.schema';
import * as folderController from '../controllers/folder.controller';

const router = Router();
router.use(requireAuth);
router.get('/', folderController.listFolders);
router.post('/', validate(createFolderSchema), folderController.createFolder);
router.patch('/:id', validate(updateFolderSchema), folderController.updateFolder);
router.delete('/:id', validate(folderIdParamSchema), folderController.deleteFolder);
export default router;
