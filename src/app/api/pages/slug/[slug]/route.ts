import { NextRequest } from 'next/server';

import { getPostBySlug } from '@/core/services/posts.service';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await getPostBySlug(slug, 'page');

    if (!page) {
      return formatJSONResponse({ error: 'Página não encontrada' }, { status: 404 });
    }

    return formatJSONResponse(page);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar página' },
      { status: 500 }
    );
  }
}

