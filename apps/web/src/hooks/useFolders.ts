import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersApi } from "@/lib/api/folders";

export const FOLDERS_QUERY_KEY = ["folders"];

export function useFolders() {
  const queryClient = useQueryClient();

  const foldersQuery = useQuery({
    queryKey: FOLDERS_QUERY_KEY,
    queryFn: foldersApi.list,
  });

  const createFolder = useMutation({
    mutationFn: foldersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });

  const updateFolder = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => foldersApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });

  const deleteFolder = useMutation({
    mutationFn: foldersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });

  return {
    folders: foldersQuery.data || [],
    isLoading: foldersQuery.isLoading,
    isError: foldersQuery.isError,
    createFolder,
    updateFolder,
    deleteFolder,
  };
}
