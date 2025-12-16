import { eq, isNull, and } from 'drizzle-orm';

import { db } from '@/db';
import { media } from '@/db/schema';

export interface UploadMediaParams {
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  uploadedByUuid: string;
  metaData?: Record<string, unknown>;
}

export interface MediaItem {
  uuid: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  uploadedByUuid: string;
  metaData: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function uploadMedia(params: UploadMediaParams): Promise<MediaItem> {
  const [newMedia] = await db
    .insert(media)
    .values({
      filename: params.filename,
      originalFilename: params.originalFilename,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      filePath: params.filePath,
      uploadedByUuid: params.uploadedByUuid,
      metaData: params.metaData || {},
    })
    .returning();

  return {
    uuid: newMedia.uuid,
    filename: newMedia.filename,
    originalFilename: newMedia.originalFilename,
    mimeType: newMedia.mimeType,
    fileSize: newMedia.fileSize,
    filePath: newMedia.filePath,
    uploadedByUuid: newMedia.uploadedByUuid,
    metaData: newMedia.metaData as Record<string, unknown> | null,
    createdAt: newMedia.createdAt,
    updatedAt: newMedia.updatedAt,
  };
}

export async function getMediaByUuid(uuid: string): Promise<MediaItem | null> {
  const [mediaItem] = await db
    .select()
    .from(media)
    .where(eq(media.uuid, uuid))
    .limit(1);

  if (!mediaItem || mediaItem.deletedAt) {
    return null;
  }

  return {
    uuid: mediaItem.uuid,
    filename: mediaItem.filename,
    originalFilename: mediaItem.originalFilename,
    mimeType: mediaItem.mimeType,
    fileSize: mediaItem.fileSize,
    filePath: mediaItem.filePath,
    uploadedByUuid: mediaItem.uploadedByUuid,
    metaData: mediaItem.metaData as Record<string, unknown> | null,
    createdAt: mediaItem.createdAt,
    updatedAt: mediaItem.updatedAt,
  };
}

export async function listMedia(uploadedByUuid?: string): Promise<MediaItem[]> {
  const conditions = [isNull(media.deletedAt)];

  if (uploadedByUuid) {
    conditions.push(eq(media.uploadedByUuid, uploadedByUuid));
  }

  const mediaList = await db
    .select()
    .from(media)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return mediaList
    .filter((item) => !item.deletedAt)
    .map((item) => ({
      uuid: item.uuid,
      filename: item.filename,
      originalFilename: item.originalFilename,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      filePath: item.filePath,
      uploadedByUuid: item.uploadedByUuid,
      metaData: item.metaData as Record<string, unknown> | null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
}

