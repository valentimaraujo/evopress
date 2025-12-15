import { NextRequest } from 'next/server';
import { listPosts } from '@/core/services/posts.service';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined;
    const postType = searchParams.get('postType') as 'post' | 'page' | 'custom' | undefined;
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
  } catch (error) {
    return formatJSONResponse(
      { error: 'Erro ao buscar posts' },
      { status: 500 }
    );
  }
}

