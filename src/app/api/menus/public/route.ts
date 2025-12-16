import { NextRequest } from 'next/server';

import { getAllMenus, getMenuItems } from '@/core/services/menus.service';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const location = url.searchParams.get('location');

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

