"use client";

import { create } from "zustand";

// Client-only UI state for My Library (PRD Section 3.1 — store/ holds NO
// server data; card data lives in TanStack Query).

export type LibraryTypeFilter = "all" | "image" | "video" | "text";

interface LibraryState {
  typeFilter: LibraryTypeFilter;
  categoryFilter: string | null;
  search: string;
  activeFolderId: string | null;
  folderMenuOpen: boolean;
  setTypeFilter: (t: LibraryTypeFilter) => void;
  setCategoryFilter: (c: string | null) => void;
  setSearch: (s: string) => void;
  setActiveFolderId: (id: string | null) => void;
  setFolderMenuOpen: (open: boolean) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  typeFilter: "all",
  categoryFilter: null,
  search: "",
  activeFolderId: null,
  folderMenuOpen: false,
  setTypeFilter: (typeFilter) => set({ typeFilter, categoryFilter: null }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSearch: (search) => set({ search }),
  setActiveFolderId: (activeFolderId) => set({ activeFolderId }),
  setFolderMenuOpen: (folderMenuOpen) => set({ folderMenuOpen }),
}));

interface ModalState {
  newFolderOpen: boolean;
  setNewFolderOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  newFolderOpen: false,
  setNewFolderOpen: (newFolderOpen) => set({ newFolderOpen }),
}));
