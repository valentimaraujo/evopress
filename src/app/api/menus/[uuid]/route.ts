import { NextRequest } from 'next/server';

import { getMenuByUuid, updateMenu, deleteMenu, type UpdateMenuParams } from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const menu = await getMenuByUuid(uuid);

    if (!menu) {
      return formatJSONResponse({ error: 'Menu não encontrado' }, { status: 404 });
    }

    return formatJSONResponse(menu);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar menu' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json() as UpdateMenuParams;

    const menu = await updateMenu(uuid, body);

    if (!menu) {
      return formatJSONResponse({ error: 'Menu não encontrado' }, { status: 404 });
    }

    return formatJSONResponse(menu);
  } catch (error: any) {
    if (error.message?.includes('unique')) {
      return formatJSONResponse(
        { error: 'Já existe um menu com este slug' },
        { status: 409 }
      );
    }
    return formatJSONResponse(
      { error: 'Erro ao atualizar menu' },
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
    await deleteMenu(uuid);

    return formatJSONResponse({ message: 'Menu excluído com sucesso' });
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao excluir menu' },
      { status: 500 }
    );
  }
}

