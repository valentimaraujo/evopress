import { NextRequest } from 'next/server';

import { getAvailablePagesForMenu } from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(request: NextRequest) {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return formatJSONResponse({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return formatJSONResponse({ error: 'Token inválido' }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const pages = await getAvailablePagesForMenu(search, limit, offset);

    return formatJSONResponse(pages);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar páginas disponíveis' },
      { status: 500 }
    );
  }
}

