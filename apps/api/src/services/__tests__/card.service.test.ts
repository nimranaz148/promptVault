import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../models/card.model', () => ({
  listCards: vi.fn(),
  findCardById: vi.fn(),
  createCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
  setPublicStatus: vi.fn(),
}));

vi.mock('../folder.service', () => ({
  assertFolderOwnership: vi.fn(),
}));

import { findCardById, updateCard } from '../../models/card.model';
import { assertFolderOwnership } from '../folder.service';
import { updateOwnedCard } from '../card.service';

const ownerId = '11111111-1111-4111-8111-111111111111';
const cardId = '22222222-2222-4222-8222-222222222222';
const folderId = '33333333-3333-4333-8333-333333333333';

const ownedCard = {
  id: cardId,
  owner_id: ownerId,
  type: 'text',
  category: 'blog_post',
  title: 'SEO Blog Post',
  prompt_body: 'Write about {{topic}}',
  variables: [],
  mode: 'save_only',
  ai_provider: null,
  tags: [],
  is_public: false,
  like_count: 0,
  forked_from: null,
  created_at: '2026-08-05T00:00:00.000Z',
  updated_at: '2026-08-05T00:00:00.000Z',
} as const;

describe('card service ownership checks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findCardById).mockResolvedValue(ownedCard as never);
    vi.mocked(assertFolderOwnership).mockResolvedValue(undefined);
    vi.mocked(updateCard).mockResolvedValue({ ...ownedCard, folder_id: folderId } as never);
  });

  it('checks target folder ownership before updating a card folder', async () => {
    await updateOwnedCard(cardId, ownerId, { folder_id: folderId });

    expect(assertFolderOwnership).toHaveBeenCalledWith(folderId, ownerId);
    expect(updateCard).toHaveBeenCalledWith(cardId, { folder_id: folderId });
  });

  it('does not update the card when the target folder is not owned by the user', async () => {
    vi.mocked(assertFolderOwnership).mockRejectedValue({ statusCode: 403 });

    await expect(updateOwnedCard(cardId, ownerId, { folder_id: folderId })).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(updateCard).not.toHaveBeenCalled();
  });
});