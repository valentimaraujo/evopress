import { NextRequest } from 'next/server';

import { updateMenuItem, deleteMenuItem, type UpdateMenuItemParams } from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

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
    const body = await request.json() as UpdateMenuItemParams;

    const item = await updateMenuItem(uuid, body);

    if (!item) {
      return formatJSONResponse({ error: 'Item não encontrado' }, { status: 404 });
    }

    return formatJSONResponse(item);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao atualizar item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    await deleteMenuItem(uuid);

    return formatJSONResponse({ message: 'Item excluído com sucesso' });
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao excluir item' },
      { status: 500 }
    );
  }
}

