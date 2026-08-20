"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profilesApi, type UpdateProfileInput } from "@/lib/api/profiles";

export function useMe(enabled: boolean = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => profilesApi.me(),
    retry: false,
    enabled,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profilesApi.updateMe(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profilesApi.uploadAvatar(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useProfileByUsername(username: string | undefined) {
  return useQuery({
    queryKey: ["profile", username ?? ""],
    queryFn: () => profilesApi.getByUsername(username!),
    enabled: Boolean(username),
  });
}

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: () => import("@/lib/api/folders").then((m) => m.foldersApi.list()),
  });
}
