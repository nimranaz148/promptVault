import { AppError } from '../utils/AppError';
import { createFolder, deleteFolder, findFolderById, listFolders, updateFolder } from '../models/folder.model';
import { Folder } from '../types';

async function ownedFolder(id: string, userId: string): Promise<Folder> {
  const folder = await findFolderById(id);
  if (!folder) throw AppError.notFound('Folder not found');
  if (folder.owner_id !== userId) throw AppError.forbidden('You do not own this folder');
  return folder;
}

export function getMyFolders(userId: string) {
  return listFolders(userId);
}

export function createMyFolder(userId: string, name: string) {
  return createFolder(userId, name);
}

export async function renameMyFolder(id: string, userId: string, name: string) {
  await ownedFolder(id, userId);
  return updateFolder(id, name);
}

export async function deleteMyFolder(id: string, userId: string) {
  await ownedFolder(id, userId);
  await deleteFolder(id);
}

export async function assertFolderOwnership(folderId: string | null | undefined, userId: string) {
  if (folderId) await ownedFolder(folderId, userId);
}
