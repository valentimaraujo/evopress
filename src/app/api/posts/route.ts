import { NextRequest } from 'next/server';

import { listPosts, createPost } from '@/core/services/posts.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined;
    const postType = searchParams.get('postType') as 'post' | 'page' | undefined;
    const authorUuid = searchParams.get('authorUuid') || undefined;

    const result = await listPosts({
      page,
      limit,
      search,
      status,
      postType,
      authorUuid,
    });

    return formatJSONResponse(result);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar posts' },
      { status: 500 }
    );
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
    } = body;

    const newPost = await createPost({
      title,
      slug,
      excerpt,
      status,
      postType,
      authorUuid: payload.sub as string,
      contentBlocks: contentBlocks || [],
      metaData: metaData || {},
      seoTitle,
      seoDescription,
      seoKeywords,
    });

    return formatJSONResponse(newPost, { status: 201 });
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao criar post' },
      { status: 500 }
    );
  }
}

