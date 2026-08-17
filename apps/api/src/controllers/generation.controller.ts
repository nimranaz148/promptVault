import { Request, Response, NextFunction } from 'express';
import * as generationService from '../services/generation.service';

export async function runCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { values } = req.body;
    const run = await generationService.runCard(req.params.id, req.user!.id, values ?? {});
    res.status(200).json(run);
  } catch (err) {
    next(err);
  }
}
