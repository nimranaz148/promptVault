import { z } from 'zod';

// username rule per PRD Section 8: 3-20 chars, lowercase alphanumeric + underscore
const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_]+$/, 'Username must be lowercase letters, numbers, or underscores only');

export const completeOnboardingSchema = z.object({
  body: z.object({
    username: usernameSchema,
    display_name: z.string().max(60).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    display_name: z.string().max(60).optional(),
    avatar_url: z.string().url().optional(),
    bio: z.string().max(300).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const usernameParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ username: usernameSchema }),
});
