import { NextRequest } from 'next/server';

import { moveMenuItem, type MoveMenuItemParams } from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; itemUuid: string }> }
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

    const { uuid, itemUuid } = await params;
    const body = await request.json() as MoveMenuItemParams;

    const success = await moveMenuItem(uuid, itemUuid, body);

    if (!success) {
      return formatJSONResponse({ error: 'Item não encontrado' }, { status: 404 });
    }

    return formatJSONResponse({ message: 'Item movido com sucesso' });
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao mover item' },
      { status: 500 }
    );
  }
}

