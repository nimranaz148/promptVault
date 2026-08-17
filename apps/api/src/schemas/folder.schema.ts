import { z } from 'zod';

export const folderIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});

export const createFolderSchema = z.object({
  body: z.object({ name: z.string().trim().min(1).max(60) }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateFolderSchema = z.object({
  body: z.object({ name: z.string().trim().min(1).max(60) }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});
