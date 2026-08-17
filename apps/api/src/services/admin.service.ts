import { updateCard } from '../models/card.model';
import { AppError } from '../utils/AppError';

export async function unpublishAnyCard(cardId: string) {
  try {
    return await updateCard(cardId, { is_public: false });
  } catch (error) {
    const message = (error as { code?: string }).code === 'PGRST116' ? 'Card not found' : undefined;
    if (message) throw AppError.notFound(message);
    throw error;
  }
}
