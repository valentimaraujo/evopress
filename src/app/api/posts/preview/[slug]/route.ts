import { NextRequest } from 'next/server';

import { getPostBySlugForPreview } from '@/core/services/posts.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;
    const url = new URL(request.url);
    const postType = (url.searchParams.get('type') || 'post') as 'post' | 'page';

    const post = await getPostBySlugForPreview(slug, postType, payload.sub);

    if (!post) {
      return formatJSONResponse({ error: 'Post não encontrado' }, { status: 404 });
    }

    return formatJSONResponse(post);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar preview' },
      { status: 500 }
    );
  }
}

