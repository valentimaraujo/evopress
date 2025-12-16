import { NextRequest } from 'next/server';

import { getPost, updatePost } from '@/core/services/posts.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const post = await getPost(uuid);

    if (!post) {
      return formatJSONResponse({ error: 'Post não encontrado' }, { status: 404 });
    }

    return formatJSONResponse(post);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return formatJSONResponse({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return formatJSONResponse({ error: 'Token inválido' }, { status: 401 });
    }

    const { uuid } = await params;
    const existingPost = await getPost(uuid);

    if (!existingPost) {
      return formatJSONResponse({ error: 'Post não encontrado' }, { status: 404 });
    }

    if (existingPost.authorUuid !== payload.sub) {
      return formatJSONResponse(
        { error: 'Você não tem permissão para editar este post' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      status,
      postType,
      contentBlocks,
      metaData,
      seoTitle,
      seoDescription,
      seoKeywords,
      publishedAt,
    } = body;

    const updatedPost = await updatePost(uuid, {
      title,
      slug,
      excerpt,
      status,
      postType,
      contentBlocks,
      metaData,
      seoTitle,
      seoDescription,
      seoKeywords,
      publishedAt,
    });

    if (!updatedPost) {
      return formatJSONResponse({ error: 'Erro ao atualizar post' }, { status: 500 });
    }

    return formatJSONResponse(updatedPost);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao atualizar post' },
      { status: 500 }
    );
  }
}

