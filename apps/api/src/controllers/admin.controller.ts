import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';

export async function unpublishAnyCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await adminService.unpublishAnyCard(req.params.id);
    res.status(200).json(card);
  } catch (err) { next(err); }
}
