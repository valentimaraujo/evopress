import { NextRequest } from 'next/server';

import { createMenu, getAllMenus, type CreateMenuParams } from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET() {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return formatJSONResponse({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return formatJSONResponse({ error: 'Token inválido' }, { status: 401 });
    }

    const menus = await getAllMenus();
    return formatJSONResponse(menus);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao listar menus' },
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

    const body = await request.json() as CreateMenuParams;

    if (!body.name || !body.slug) {
      return formatJSONResponse(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const menu = await createMenu(body);
    return formatJSONResponse(menu, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('unique')) {
      return formatJSONResponse(
        { error: 'Já existe um menu com este slug' },
        { status: 409 }
      );
    }
    return formatJSONResponse(
      { error: 'Erro ao criar menu' },
      { status: 500 }
    );
  }
}

