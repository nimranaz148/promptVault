// Cards API — my library + card CRUD + run (PRD Section 9).

import { api } from "./client";
import type {
  CardRun,
  CreateCardInput,
  Paginated,
  PromptCard,
  RunCardInput,
  UpdateCardInput,
} from "@/types";

export interface ListCardsParams {
  type?: string;
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  folder_id?: string;
}

function toQuery(params: ListCardsParams): string {
  const q = new URLSearchParams();
  if (params.type) q.set("type", params.type);
  if (params.category) q.set("category", params.category);
  if (params.tag) q.set("tag", params.tag);
  if (params.search) q.set("search", params.search);
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.folder_id) q.set("folder_id", params.folder_id);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const cardsApi = {
  list: (params: ListCardsParams = {}) =>
    api.get<Paginated<PromptCard>>(`/cards${toQuery(params)}`),

  get: (id: string) => api.get<PromptCard>(`/cards/${id}`),

  create: (input: CreateCardInput) => api.post<PromptCard>("/cards", input),

  update: (id: string, input: UpdateCardInput) =>
    api.patch<PromptCard>(`/cards/${id}`, input),

  remove: (id: string) => api.delete<void>(`/cards/${id}`),

  duplicate: (id: string) => api.post<PromptCard>(`/cards/${id}/duplicate`),

  publish: (id: string) => api.post<PromptCard>(`/cards/${id}/publish`),

  unpublish: (id: string) => api.post<PromptCard>(`/cards/${id}/unpublish`),

  run: (id: string, input: RunCardInput) =>
    api.post<CardRun>(`/cards/${id}/run`, input),
};
