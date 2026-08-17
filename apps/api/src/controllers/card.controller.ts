import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/card.service';

export async function listMyCards(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, category, tag, search, page, limit, folder_id } = req.query as Record<string, string>;
    const result = await cardService.getMyCards(req.user!.id, {
      type,
      category,
      tag,
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      folderId: folder_id,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.getCardForOwner(req.params.id, req.user!.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function createCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.createNewCard(req.user!.id, req.body);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

export async function updateCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.updateOwnedCard(req.params.id, req.user!.id, req.body);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function deleteCard(req: Request, res: Response, next: NextFunction) {
  try {
    await cardService.deleteOwnedCard(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function duplicateCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.duplicateOwnedCard(req.params.id, req.user!.id);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

export async function publishCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.publishCard(req.params.id, req.user!.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function unpublishCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.unpublishCard(req.params.id, req.user!.id);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

