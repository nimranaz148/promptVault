"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardsApi, type ListCardsParams } from "@/lib/api/cards";
import type { CardRun, CreateCardInput, PromptCard, UpdateCardInput } from "@/types";

const CARD_KEYS = {
  all: ["cards"] as const,
  list: (params: ListCardsParams) => ["cards", params] as const,
  detail: (id: string) => ["cards", id] as const,
};

export function useCards(params: ListCardsParams = {}) {
  return useQuery({
    queryKey: CARD_KEYS.list(params),
    queryFn: () => cardsApi.list(params),
  });
}

export function useCard(id: string | undefined) {
  return useQuery({
    queryKey: CARD_KEYS.detail(id ?? ""),
    queryFn: () => cardsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCardInput) => cardsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARD_KEYS.all }),
  });
}

export function useUpdateCard(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCardInput) => cardsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CARD_KEYS.all });
      qc.invalidateQueries({ queryKey: CARD_KEYS.detail(id) });
    },
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cardsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARD_KEYS.all }),
  });
}

export function useDuplicateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cardsApi.duplicate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARD_KEYS.all }),
  });
}

export function usePublishCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? cardsApi.publish(id) : cardsApi.unpublish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARD_KEYS.all }),
  });
}

export function useRunCard(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Record<string, string>) => cardsApi.run(id, { values }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARD_KEYS.detail(id) }),
  });
}

export function useSaveToLibrary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => import("@/lib/api/community").then((m) => m.communityApi.save(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community"] }),
  });
}

export type { CardRun };
