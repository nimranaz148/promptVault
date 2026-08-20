// Community API — public feed + like/save (PRD Section 9).

import { api } from "./client";
import type { ListCardsParams } from "./cards";
import type { Paginated, PromptCard } from "@/types";

export const communityApi = {
  list: (params: ListCardsParams = {}) => {
    const q = new URLSearchParams();
    if (params.type) q.set("type", params.type);
    if (params.category) q.set("category", params.category);
    if (params.tag) q.set("tag", params.tag);
    if (params.search) q.set("search", params.search);
    if (params.username) q.set("username", params.username);
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const s = q.toString();
    return api.get<Paginated<PromptCard>>(`/community/cards${s ? `?${s}` : ""}`);
  },

  get: (id: string) => api.get<PromptCard>(`/community/cards/${id}`),

  like: (id: string) => api.post<void>(`/community/cards/${id}/like`),

  unlike: (id: string) => api.delete<void>(`/community/cards/${id}/like`),

  save: (id: string) => api.post<PromptCard>(`/community/cards/${id}/save`),
};
