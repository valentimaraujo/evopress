import { eq, and, or, ilike, desc, isNull, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { menus, menuItems, posts } from '@/db/schema';

import type { Post } from './posts.service';

export interface Menu {
  uuid: string;
  name: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  uuid: string;
  menuUuid: string;
  pageUuid: string;
  label: string | null;
  order: number;
  parentUuid: string | null;
  url: string | null;
  page?: Post;
  children?: MenuItem[];
  depth?: number;
}

export interface MenuItemFlat {
  uuid: string;
  menuUuid: string;
  pageUuid: string;
  label: string | null;
  order: number;
  parentUuid: string | null;
  url: string | null;
  pageTitle: string;
}

export interface CreateMenuParams {
  name: string;
  location?: string;
}

export interface UpdateMenuParams {
  name?: string;
  location?: string;
}

export interface CreateMenuItemParams {
  menuUuid: string;
  pageUuid: string;
  label?: string;
  order: number;
  parentUuid?: string | null;
}

export interface UpdateMenuItemParams {
  label?: string;
  order?: number;
  parentUuid?: string | null;
  url?: string | null;
}

export interface MoveMenuItemParams {
  direction: 'up' | 'down' | 'top' | 'under';
  targetUuid?: string;
}


export async function getMenuByUuid(uuid: string): Promise<Menu | null> {
  const [menu] = await db
    .select()
    .from(menus)
    .where(and(eq(menus.uuid, uuid), isNull(menus.deletedAt)))
    .limit(1);

  return menu || null;
}

export async function getAllMenus(): Promise<Menu[]> {
  return db
    .select()
    .from(menus)
    .where(isNull(menus.deletedAt))
    .orderBy(desc(menus.createdAt));
}

export async function getMenuItemsFlat(menuUuid: string): Promise<MenuItemFlat[]> {
  const items = await db
    .select({
      uuid: menuItems.uuid,
      menuUuid: menuItems.menuUuid,
      pageUuid: menuItems.pageUuid,
      label: menuItems.label,
      order: menuItems.order,
      parentUuid: menuItems.parentUuid,
      url: menuItems.url,
      pageTitle: posts.title,
    })
    .from(menuItems)
    .innerJoin(posts, eq(menuItems.pageUuid, posts.uuid))
    .where(and(eq(menuItems.menuUuid, menuUuid), isNull(menuItems.deletedAt)))
    .orderBy(menuItems.order);

  return items;
}

export async function getMenuItems(menuUuid: string): Promise<MenuItem[]> {
  const flatItems = await db
    .select({
      uuid: menuItems.uuid,
      menuUuid: menuItems.menuUuid,
      pageUuid: menuItems.pageUuid,
      label: menuItems.label,
      order: menuItems.order,
      parentUuid: menuItems.parentUuid,
      url: menuItems.url,
      page: {
        uuid: posts.uuid,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        status: posts.status,
        postType: posts.postType,
        authorUuid: posts.authorUuid,
        contentBlocks: posts.contentBlocks,
        metaData: posts.metaData,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        seoKeywords: posts.seoKeywords,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
      },
    })
    .from(menuItems)
    .innerJoin(posts, eq(menuItems.pageUuid, posts.uuid))
    .where(and(eq(menuItems.menuUuid, menuUuid), isNull(menuItems.deletedAt)))
    .orderBy(menuItems.order);

  const items: MenuItem[] = flatItems.map((item) => ({
    uuid: item.uuid,
    menuUuid: item.menuUuid,
    pageUuid: item.pageUuid,
    label: item.label,
    order: item.order,
    parentUuid: item.parentUuid,
    url: item.url,
    page: item.page as Post,
  }));

  return buildMenuTree(items);
}

function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();
  const rootItems: MenuItem[] = [];

  items.forEach((item) => {
    itemMap.set(item.uuid, { ...item, children: [] });
  });

  items.forEach((item) => {
    const menuItem = itemMap.get(item.uuid)!;
    if (item.parentUuid) {
      const parent = itemMap.get(item.parentUuid);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuItem);
        menuItem.depth = (parent.depth || 0) + 1;
      }
    } else {
      menuItem.depth = 0;
      rootItems.push(menuItem);
    }
  });

  return rootItems.sort((a, b) => a.order - b.order);
}

export async function createMenu(params: CreateMenuParams): Promise<Menu> {
  try {
    const [menu] = await db
      .insert(menus)
      .values({
        name: params.name,
        location: params.location || null,
      })
      .returning();

    if (!menu) {
      throw new Error('Erro ao criar menu no banco de dados');
    }

    return menu;
  } catch (error: any) {
    throw error;
  }
}

export async function updateMenu(uuid: string, params: UpdateMenuParams): Promise<Menu | null> {
  const updateData: Partial<typeof menus.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (params.name !== undefined) updateData.name = params.name;
  if (params.location !== undefined) updateData.location = params.location || null;

  const [menu] = await db
    .update(menus)
    .set(updateData)
    .where(eq(menus.uuid, uuid))
    .returning();

  return menu || null;
}

export async function deleteMenu(uuid: string): Promise<boolean> {
  const now = new Date();
  await db
    .update(menus)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(menus.uuid, uuid));

  await db
    .update(menuItems)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(menuItems.menuUuid, uuid));

  return true;
}

export async function createMenuItem(params: CreateMenuItemParams): Promise<MenuItem> {
  const now = new Date();
  const [item] = await db
    .insert(menuItems)
    .values({
      menuUuid: params.menuUuid,
      pageUuid: params.pageUuid,
      label: params.label || null,
      order: params.order,
      parentUuid: params.parentUuid || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const [page] = await db
    .select()
    .from(posts)
    .where(eq(posts.uuid, params.pageUuid))
    .limit(1);

  return {
    uuid: item.uuid,
    menuUuid: item.menuUuid,
    pageUuid: item.pageUuid,
    label: item.label,
    order: item.order,
    parentUuid: item.parentUuid,
    url: item.url,
    page: page as Post | undefined,
  };
}

export async function createMenuItems(menuUuid: string, items: CreateMenuItemParams[]): Promise<MenuItem[]> {
  const now = new Date();
  const createdItems = await db
    .insert(menuItems)
    .values(
      items.map((item) => ({
        menuUuid,
        pageUuid: item.pageUuid,
        label: item.label || null,
        order: item.order,
        parentUuid: item.parentUuid || null,
        createdAt: now,
        updatedAt: now,
      }))
    )
    .returning();

  const pageUuids = createdItems.map((item) => item.pageUuid);
  const pages = await db
    .select()
    .from(posts)
    .where(inArray(posts.uuid, pageUuids));

  const pageMap = new Map(pages.map((p) => [p.uuid, p as Post]));

  return createdItems.map((item) => ({
    uuid: item.uuid,
    menuUuid: item.menuUuid,
    pageUuid: item.pageUuid,
    label: item.label,
    order: item.order,
    parentUuid: item.parentUuid,
    url: item.url,
    page: pageMap.get(item.pageUuid),
  }));
}

export async function updateMenuItem(uuid: string, params: UpdateMenuItemParams): Promise<MenuItem | null> {
  const updateData: Partial<typeof menuItems.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (params.label !== undefined) updateData.label = params.label || null;
  if (params.order !== undefined) updateData.order = params.order;
  if (params.parentUuid !== undefined) updateData.parentUuid = params.parentUuid || null;
  if (params.url !== undefined) updateData.url = params.url || null;

  const [item] = await db
    .update(menuItems)
    .set(updateData)
    .where(eq(menuItems.uuid, uuid))
    .returning();

  if (!item) return null;

  const [page] = await db
    .select()
    .from(posts)
    .where(eq(posts.uuid, item.pageUuid))
    .limit(1);

  return {
    uuid: item.uuid,
    menuUuid: item.menuUuid,
    pageUuid: item.pageUuid,
    label: item.label,
    order: item.order,
    parentUuid: item.parentUuid,
    url: item.url,
    page: page as Post | undefined,
  };
}

export async function deleteMenuItem(uuid: string): Promise<boolean> {
  const now = new Date();

  await db
    .update(menuItems)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(menuItems.uuid, uuid));

  await db
    .update(menuItems)
    .set({
      parentUuid: null,
      updatedAt: now,
    })
    .where(eq(menuItems.parentUuid, uuid));

  return true;
}

export async function moveMenuItem(
  menuUuid: string,
  itemUuid: string,
  params: MoveMenuItemParams
): Promise<boolean> {
  const flatItems = await getMenuItemsFlat(menuUuid);
  const itemIndex = flatItems.findIndex((item) => item.uuid === itemUuid);

  if (itemIndex === -1) return false;

  const item = flatItems[itemIndex];
  let newOrder = item.order;
  let newParentUuid = item.parentUuid;

  if (params.direction === 'up' && itemIndex > 0) {
    const prevItem = flatItems[itemIndex - 1];
    if (prevItem.parentUuid === item.parentUuid) {
      newOrder = prevItem.order;
      await db
        .update(menuItems)
        .set({ order: item.order, updatedAt: new Date() })
        .where(eq(menuItems.uuid, prevItem.uuid));
    }
  } else if (params.direction === 'down' && itemIndex < flatItems.length - 1) {
    const nextItem = flatItems[itemIndex + 1];
    if (nextItem.parentUuid === item.parentUuid) {
      newOrder = nextItem.order;
      await db
        .update(menuItems)
        .set({ order: item.order, updatedAt: new Date() })
        .where(eq(menuItems.uuid, nextItem.uuid));
    }
  } else if (params.direction === 'top') {
    const siblings = flatItems.filter((i) => i.parentUuid === item.parentUuid && i.uuid !== itemUuid);
    newOrder = siblings.length > 0 ? Math.min(...siblings.map((i) => i.order)) - 1 : 0;
  } else if (params.direction === 'under' && params.targetUuid) {
    const targetItem = flatItems.find((i) => i.uuid === params.targetUuid);
    if (targetItem) {
      newParentUuid = targetItem.uuid;
      const children = flatItems.filter((i) => i.parentUuid === targetItem.uuid);
      newOrder = children.length > 0 ? Math.max(...children.map((i) => i.order)) + 1 : targetItem.order + 1;
    }
  }

  await db
    .update(menuItems)
    .set({
      order: newOrder,
      parentUuid: newParentUuid,
      updatedAt: new Date(),
    })
    .where(eq(menuItems.uuid, itemUuid));

  return true;
}

export async function reorderMenuItems(
  menuUuid: string,
  items: Array<{ uuid: string; order: number; parentUuid: string | null }>
): Promise<boolean> {
  const now = new Date();

  for (const item of items) {
    await db
      .update(menuItems)
      .set({
        order: item.order,
        parentUuid: item.parentUuid || null,
        updatedAt: now,
      })
      .where(and(eq(menuItems.uuid, item.uuid), eq(menuItems.menuUuid, menuUuid)));
  }

  return true;
}

export async function getAvailablePagesForMenu(
  search?: string,
  limit: number = 10,
  offset: number = 0
): Promise<Post[]> {
  const conditions = [
    eq(posts.postType, 'page'),
    eq(posts.status, 'published'),
    isNull(posts.deletedAt),
  ];

  if (search) {
    conditions.push(or(ilike(posts.title, `%${search}%`), ilike(posts.slug, `%${search}%`)));
  }

  const pages = await db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return pages as Post[];
}

export async function validateMenuHierarchy(menuUuid: string): Promise<{ valid: boolean; error?: string }> {
  const items = await getMenuItemsFlat(menuUuid);

  for (const item of items) {
    if (item.parentUuid) {
      let currentUuid: string | null = item.parentUuid;
      const visited = new Set<string>([item.uuid]);

      while (currentUuid) {
        if (visited.has(currentUuid)) {
          return { valid: false, error: 'Loop detectado na hierarquia do menu' };
        }
        visited.add(currentUuid);
        const parent = items.find((i) => i.uuid === currentUuid);
        if (!parent) break;
        currentUuid = parent.parentUuid;
      }
    }
  }

  return { valid: true };
}

