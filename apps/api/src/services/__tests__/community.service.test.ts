import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../models/card.model', () => ({
  listCards: vi.fn(),
  findCardById: vi.fn(),
  createCard: vi.fn(),
  likePublicCard: vi.fn(),
  unlikePublicCard: vi.fn(),
}));

import { likePublicCard, unlikePublicCard } from '../../models/card.model';
import { likeCard, unlikeCard } from '../community.service';

describe('community service likes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the atomic like RPC wrapper', async () => {
    vi.mocked(likePublicCard).mockResolvedValue(undefined);

    await likeCard('card-id', 'user-id');

    expect(likePublicCard).toHaveBeenCalledWith('card-id', 'user-id');
  });

  it('maps duplicate likes to conflict errors', async () => {
    vi.mocked(likePublicCard).mockRejectedValue({ code: '23505' });

    await expect(likeCard('card-id', 'user-id')).rejects.toMatchObject({
      statusCode: 409,
      message: 'You already liked this card',
    });
  });

  it('uses the atomic unlike RPC wrapper', async () => {
    vi.mocked(unlikePublicCard).mockResolvedValue(undefined);

    await unlikeCard('card-id', 'user-id');

    expect(unlikePublicCard).toHaveBeenCalledWith('card-id', 'user-id');
  });

  it('maps missing likes to not found errors', async () => {
    vi.mocked(unlikePublicCard).mockRejectedValue({ code: 'P0002' });

    await expect(unlikeCard('card-id', 'user-id')).rejects.toMatchObject({
      statusCode: 404,
      message: 'Like not found',
    });
  });
});