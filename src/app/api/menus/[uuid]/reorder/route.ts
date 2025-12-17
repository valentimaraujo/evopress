import { NextRequest } from 'next/server';

import { reorderMenuItems } from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function POST(
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
    const body = await request.json() as Array<{ uuid: string; order: number; parentUuid: string | null }>;

    await reorderMenuItems(uuid, body);

    return formatJSONResponse({ message: 'Itens reordenados com sucesso' });
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao reordenar itens' },
      { status: 500 }
    );
  }
}

