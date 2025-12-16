import { NextRequest } from 'next/server';

import { getHomepage, setHomepage } from '@/core/services/posts.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET() {
  try {
    const homepage = await getHomepage();
    return formatJSONResponse(homepage);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar página inicial' },
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

    const body = await request.json() as { pageUuid: string };

    if (!body.pageUuid) {
      return formatJSONResponse(
        { error: 'pageUuid é obrigatório' },
        { status: 400 }
      );
    }

    const homepage = await setHomepage(body.pageUuid);

    if (!homepage) {
      return formatJSONResponse(
        { error: 'Página não encontrada ou não é uma página' },
        { status: 404 }
      );
    }

    return formatJSONResponse(homepage);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao definir página inicial' },
      { status: 500 }
    );
  }
}

