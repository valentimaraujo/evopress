import { NextRequest } from 'next/server';

import { getPostBySlug } from '@/core/services/posts.service';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let post = await getPostBySlug(slug, 'post');
    
    if (!post) {
      post = await getPostBySlug(slug, 'custom');
    }

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

