import { describe, expect, it } from 'vitest';
import { createCardSchema, listCardsQuerySchema } from '../card.schema';
import { completeOnboardingSchema } from '../profile.schema';

describe('card schemas', () => {
  it('accepts a valid prompt card payload', () => {
    const parsed = createCardSchema.parse({
      body: {
        type: 'text',
        category: 'blog_post',
        title: 'SEO Blog Post',
        prompt_body: 'Write about {{topic}}',
        variables: [{ key: 'topic', label: 'Topic', default: 'AI' }],
        mode: 'run_in_app',
        ai_provider: 'openai',
        tags: ['seo', 'blog'],
      },
      query: {},
      params: {},
    });

    expect(parsed.body.tags).toEqual(['seo', 'blog']);
    expect(parsed.body.is_public).toBe(false);
  });

  it('rejects too many tags', () => {
    expect(() =>
      createCardSchema.parse({
        body: {
          type: 'text',
          category: 'blog_post',
          title: 'SEO Blog Post',
          prompt_body: 'Write about {{topic}}',
          tags: Array.from({ length: 11 }, (_, index) => `tag${index}`),
        },
        query: {},
        params: {},
      })
    ).toThrow();
  });

  it('coerces pagination defaults and limits maximum page size', () => {
    const parsed = listCardsQuerySchema.parse({ query: { page: '2' }, body: {}, params: {} });

    expect(parsed.query.page).toBe(2);
    expect(parsed.query.limit).toBe(20);
    expect(() => listCardsQuerySchema.parse({ query: { limit: '101' }, body: {}, params: {} })).toThrow();
  });
});

describe('profile schemas', () => {
  it('accepts valid lowercase usernames', () => {
    const parsed = completeOnboardingSchema.parse({
      body: { username: 'user_123', display_name: 'User' },
      query: {},
      params: {},
    });

    expect(parsed.body.username).toBe('user_123');
  });

  it('rejects uppercase or spaced usernames', () => {
    expect(() =>
      completeOnboardingSchema.parse({ body: { username: 'Bad User' }, query: {}, params: {} })
    ).toThrow();
  });
});