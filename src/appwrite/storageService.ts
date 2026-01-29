import { ID, Permission, Role } from "appwrite";
import { storage } from "./client";
import { APPWRITE_BUCKET_ID } from "./config";

export async function uploadImageToStorage(file: File, userId: string) {
  const created = await storage.createFile({
    bucketId: APPWRITE_BUCKET_ID,
    fileId: ID.unique(),
    file,
    permissions: [
      Permission.read(Role.any()),

      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ],
  });

  const viewUrl = storage.getFileView({
    bucketId: APPWRITE_BUCKET_ID,
    fileId: created.$id,
  });

  return {
    fileId: created.$id,
    url: viewUrl.toString(),
  };
}

export async function deleteImageFromStorage(fileId: string) {
  return storage.deleteFile({
    bucketId: APPWRITE_BUCKET_ID,
    fileId,
  });
}
