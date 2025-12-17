import { existsSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { NextRequest } from 'next/server';
import { join } from 'path';

import { uploadMedia } from '@/core/services/media.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return formatJSONResponse({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return formatJSONResponse({ error: 'Token inválido' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return formatJSONResponse({ error: 'Arquivo não fornecido' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return formatJSONResponse(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return formatJSONResponse(
        { error: 'Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP' },
        { status: 400 }
      );
    }

    await ensureUploadDir();

    const timestamp = Date.now();
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedOriginalName}`;
    const filePath = `/uploads/${filename}`;
    const fullPath = join(UPLOAD_DIR, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(fullPath, buffer);

    const mediaItem = await uploadMedia({
      filename,
      originalFilename: file.name,
      mimeType: file.type,
      fileSize: file.size,
      filePath,
      uploadedByUuid: payload.sub as string,
      metaData: {
        width: null,
        height: null,
      },
    });

    return formatJSONResponse({
      uuid: mediaItem.uuid,
      filename: mediaItem.filename,
      originalFilename: mediaItem.originalFilename,
      mimeType: mediaItem.mimeType,
      fileSize: mediaItem.fileSize,
      filePath: mediaItem.filePath,
      url: mediaItem.filePath,
    });
  } catch (error: unknown) {
    console.error('Erro ao fazer upload:', error);
    return formatJSONResponse(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}

