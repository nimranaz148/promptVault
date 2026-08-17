import { Request, Response, NextFunction } from 'express';
import * as folderService from '../services/folder.service';

export async function listFolders(req: Request, res: Response, next: NextFunction) {
  try { res.status(200).json(await folderService.getMyFolders(req.user!.id)); } catch (err) { next(err); }
}

export async function createFolder(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json(await folderService.createMyFolder(req.user!.id, req.body.name)); } catch (err) { next(err); }
}

export async function updateFolder(req: Request, res: Response, next: NextFunction) {
  try { res.status(200).json(await folderService.renameMyFolder(req.params.id, req.user!.id, req.body.name)); } catch (err) { next(err); }
}

export async function deleteFolder(req: Request, res: Response, next: NextFunction) {
  try { await folderService.deleteMyFolder(req.params.id, req.user!.id); res.status(204).send(); } catch (err) { next(err); }
}
