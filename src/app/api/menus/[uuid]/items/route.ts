import { NextRequest } from 'next/server';

import {
  getMenuItems,
  getMenuItemsFlat,
  createMenuItem,
  createMenuItems,
  type CreateMenuItemParams,
} from '@/core/services/menus.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const url = new URL(request.url);
    const flat = url.searchParams.get('flat') === 'true';

    if (flat) {
      const items = await getMenuItemsFlat(uuid);
      return formatJSONResponse(items);
    }

    const items = await getMenuItems(uuid);
    return formatJSONResponse(items);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar itens do menu' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json() as CreateMenuItemParams | CreateMenuItemParams[];

    if (Array.isArray(body)) {
      const items = await createMenuItems(uuid, body);
      return formatJSONResponse(items, { status: 201 });
    }

    const item = await createMenuItem({ ...body, menuUuid: uuid });
    return formatJSONResponse(item, { status: 201 });
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao criar item do menu' },
      { status: 500 }
    );
  }
}

