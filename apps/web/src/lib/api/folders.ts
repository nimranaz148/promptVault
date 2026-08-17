// Folders API — card organization (backend completion item).

import { api } from "./client";
import type { Folder } from "@/types";

export const foldersApi = {
  list: () => api.get<Folder[]>("/folders"),

  create: (name: string) => api.post<Folder>("/folders", { name }),

  update: (id: string, name: string) => api.patch<Folder>(`/folders/${id}`, { name }),

  remove: (id: string) => api.delete<void>(`/folders/${id}`),
};
