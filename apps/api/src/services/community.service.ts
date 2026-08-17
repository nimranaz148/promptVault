import { AppError } from '../utils/AppError';
import { listCards, findCardById, createCard, likePublicCard, unlikePublicCard, ListCardsFilters } from '../models/card.model';
import { PromptCard } from '../types';

export async function getCommunityFeed(filters: Omit<ListCardsFilters, 'ownerId' | 'publicOnly'>) {
  return listCards({ ...filters, publicOnly: true });
}

export async function getPublicCard(id: string): Promise<PromptCard> {
  const card = await findCardById(id);
  if (!card || !card.is_public) {
    throw AppError.notFound('Card not found or is not public');
  }
  return card;
}

export async function likeCard(cardId: string, userId: string): Promise<void> {
  try {
    await likePublicCard(cardId, userId);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === '23505') throw AppError.conflict('You already liked this card');
    if (code === 'P0002') throw AppError.notFound('Card not found or is not public');
    throw err;
  }
}

export async function unlikeCard(cardId: string, userId: string): Promise<void> {
  try {
    await unlikePublicCard(cardId, userId);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === 'P0002') throw AppError.notFound('Like not found');
    throw err;
  }
}

/**
 * "Save to my library" — forks a public card into the caller's own
 * collection. Per PRD Section 14 (Open Questions), this is a COPY, not a
 * live reference: editing the original later never affects saved forks.
 */
export async function saveToMyLibrary(cardId: string, userId: string): Promise<PromptCard> {
  const original = await getPublicCard(cardId);

  return createCard(userId, {
    type: original.type,
    category: original.category,
    title: original.title,
    prompt_body: original.prompt_body,
    variables: original.variables,
    mode: original.mode,
    ai_provider: original.ai_provider,
    tags: original.tags,
    is_public: false,
    forked_from: original.id,
  });
}
