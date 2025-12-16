import { NextRequest } from 'next/server';

import { getAllMenus, getMenuBySlug, getMenuItems } from '@/core/services/menus.service';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const location = url.searchParams.get('location');
    const slug = url.searchParams.get('slug');

    if (slug) {
      const menu = await getMenuBySlug(slug);
      if (!menu) {
        return formatJSONResponse({ error: 'Menu não encontrado' }, { status: 404 });
      }
      const items = await getMenuItems(menu.uuid);
      return formatJSONResponse({ menu, items });
    }

    if (location) {
      const menus = await getAllMenus();
      const menu = menus.find((m) => m.location === location);
      if (!menu) {
        return formatJSONResponse({ menu: null, items: [] });
      }
      const items = await getMenuItems(menu.uuid);
      return formatJSONResponse({ menu, items });
    }

    const menus = await getAllMenus();
    return formatJSONResponse(menus);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar menu' },
      { status: 500 }
    );
  }
}

