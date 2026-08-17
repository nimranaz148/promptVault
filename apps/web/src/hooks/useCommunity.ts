"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi } from "@/lib/api/community";
import type { ListCardsParams } from "@/lib/api/cards";
import type { PromptCard } from "@/types";

export function useCommunityFeed(params: ListCardsParams = {}) {
  return useQuery({
    queryKey: ["community", params],
    queryFn: () => communityApi.list(params),
  });
}

export function useCommunityCard(id: string | undefined) {
  return useQuery({
    queryKey: ["community", "detail", id ?? ""],
    queryFn: () => communityApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useLikeCard(card: PromptCard | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.like(id),
    onSuccess: (_data, id) => {
      qc.setQueryData<{ data: PromptCard[] } | undefined>(["community"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((c) => (c.id === id ? { ...c, like_count: c.like_count + 1 } : c)),
        };
      });
      qc.invalidateQueries({ queryKey: ["community", "detail", id] });
    },
  });
}

export function useUnlikeCard(card: PromptCard | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.unlike(id),
    onSuccess: (_data, id) => {
      qc.setQueryData<{ data: PromptCard[] } | undefined>(["community"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((c) =>
            c.id === id ? { ...c, like_count: Math.max(0, c.like_count - 1) } : c
          ),
        };
      });
      qc.invalidateQueries({ queryKey: ["community", "detail", id] });
    },
  });
}
