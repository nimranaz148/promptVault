import { Request, Response, NextFunction } from 'express';
import * as communityService from '../services/community.service';

export async function listCommunityCards(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, category, tag, search, page, limit, username } = req.query as Record<string, string>;
    const result = await communityService.getCommunityFeed({
      type,
      category,
      tag,
      search,
      username,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCommunityCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await communityService.getPublicCard(req.params.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function likeCard(req: Request, res: Response, next: NextFunction) {
  try {
    await communityService.likeCard(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function unlikeCard(req: Request, res: Response, next: NextFunction) {
  try {
    await communityService.unlikeCard(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function saveToLibrary(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await communityService.saveToMyLibrary(req.params.id, req.user!.id);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}
