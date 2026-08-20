import { AppError } from '../utils/AppError';
import {
  listCards,
  findCardById,
  createCard,
  updateCard,
  deleteCard,
  setPublicStatus,
  ListCardsFilters,
} from '../models/card.model';
import { PromptCard, PromptVariable } from '../types';
import { assertFolderOwnership } from './folder.service';

/** Throws if `userId` does not own `card`. Central ownership check used
 * everywhere a card is mutated - see SAD Section 5.2 (app-level backstop
 * to RLS). */
function assertOwnership(card: PromptCard, userId: string) {
  if (card.owner_id !== userId) {
    throw AppError.forbidden('You do not own this card');
  }
}

/** Extracts template variables (e.g. {{subject}}) from the prompt body */
function extractVariables(promptBody: string): PromptVariable[] {
  const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  const matches = [...promptBody.matchAll(regex)];
  // Use Set to get unique keys
  const keys = Array.from(new Set(matches.map(m => m[1])));
  return keys.map(key => ({ key, label: key }));
}

export async function getMyCards(userId: string, filters: Omit<ListCardsFilters, 'ownerId'>) {
  return listCards({ ...filters, ownerId: userId });
}

export async function getCardForOwner(id: string, userId: string): Promise<PromptCard> {
  const card = await findCardById(id);
  if (!card) throw AppError.notFound('Card not found');
  assertOwnership(card, userId);
  return card;
}

export async function createNewCard(
  userId: string,
  input: Omit<PromptCard, 'id' | 'owner_id' | 'like_count' | 'forked_from' | 'created_at' | 'updated_at'>
): Promise<PromptCard> {
  await assertFolderOwnership(input.folder_id, userId);
  
  if (input.prompt_body) {
    input.variables = extractVariables(input.prompt_body);
  }
  
  return createCard(userId, input);
}

export async function updateOwnedCard(
  id: string,
  userId: string,
  updates: Partial<PromptCard>
): Promise<PromptCard> {
  await getCardForOwner(id, userId); // throws if not found/not owner
  await assertFolderOwnership(updates.folder_id, userId);
  
  if (updates.prompt_body !== undefined) {
    updates.variables = extractVariables(updates.prompt_body);
  }
  
  return updateCard(id, updates);
}

export async function deleteOwnedCard(id: string, userId: string): Promise<void> {
  await getCardForOwner(id, userId);
  await deleteCard(id);
}

export async function duplicateOwnedCard(id: string, userId: string): Promise<PromptCard> {
  const original = await getCardForOwner(id, userId);
  return createCard(userId, {
    type: original.type,
    category: original.category,
    title: `${original.title} (copy)`,
    prompt_body: original.prompt_body,
    variables: original.variables,
    mode: original.mode,
    ai_provider: original.ai_provider,
    tags: original.tags,
    is_public: false,
  });
}

export async function publishCard(id: string, userId: string): Promise<PromptCard> {
  await getCardForOwner(id, userId);
  return setPublicStatus(id, true);
}

export async function unpublishCard(id: string, userId: string): Promise<PromptCard> {
  await getCardForOwner(id, userId);
  return setPublicStatus(id, false);
}


