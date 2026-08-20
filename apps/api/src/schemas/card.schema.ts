import { z } from 'zod';


// Matches PRD Section 8 field validation rules exactly.

const variableSchema = z.object({
  key: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  default: z.string().max(500).optional(),
});

export const createCardSchema = z.object({
  body: z.object({
    type: z.enum(['image', 'video', 'text']),
    category: z.string().trim().min(1).max(50),
    title: z.string().min(3).max(100),
    prompt_body: z.string().min(1).max(5000),
    variables: z.array(variableSchema).max(20).optional().default([]),
    mode: z.enum(['save_only', 'run_in_app']).default('save_only'),
    ai_provider: z.string().max(50).optional().nullable(),
    tags: z
      .array(z.string().max(30))
      .max(10)
      .optional()
      .default([]),
    is_public: z.boolean().optional().default(false),
    folder_id: z.string().uuid().nullable().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateCardSchema = z.object({
  body: createCardSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});

export const listCardsQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    type: z.enum(['image', 'video', 'text']).optional(),
    category: z.string().trim().min(1).max(50).optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    username: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    folder_id: z.string().uuid().optional(),
  }),
});

export const cardIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});

export const runCardSchema = z.object({
  body: z.object({
    // key -> value fill-ins for the card's {{variables}}, e.g. { topic: "cats" }
    values: z.record(z.string(), z.string().max(1000)).optional().default({}),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});


