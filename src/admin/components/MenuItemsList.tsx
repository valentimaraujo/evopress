'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import React, { useState } from 'react';

import type { MenuItem, MenuItemFlat } from '@/core/services/menus.service';

import { MenuItemEditor } from './MenuItemEditor';

interface MenuItemsListProps {
  items: MenuItem[];
  flatItems: MenuItemFlat[];
  onUpdate: (uuid: string, updates: { label?: string; parentUuid?: string | null; order?: number }) => Promise<void>;
  onMove: (uuid: string, direction: 'up' | 'down' | 'top' | 'under', targetUuid?: string) => Promise<void>;
  onRemove: (uuid: string) => Promise<void>;
  onReorder: (items: Array<{ uuid: string; order: number; parentUuid: string | null }>) => Promise<void>;
}

interface MenuItemRowProps {
  item: MenuItemFlat & { depth: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  isDragging?: boolean;
}

function MenuItemRow({ item, isExpanded, onToggleExpand, onEdit, isDragging }: MenuItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      <div style={{ marginLeft: `${item.depth * 24}px` }} className="flex items-center gap-2 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:hover:text-zinc-300"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {hasChildren ? (
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <div className="flex-1">
          <div className="font-medium text-zinc-900 dark:text-white">
            {item.label || item.pageTitle}
          </div>
          {item.parentUuid && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">subitem</div>
          )}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

function flattenMenuItems(
  items: MenuItem[],
  depth: number = 0,
  parentUuid: string | null = null
): Array<MenuItemFlat & { depth: number }> {
  const result: Array<MenuItemFlat & { depth: number }> = [];
  
  for (const item of items) {
    result.push({
      uuid: item.uuid,
      menuUuid: item.menuUuid,
      pageUuid: item.pageUuid,
      label: item.label,
      order: item.order,
      parentUuid: item.parentUuid || parentUuid,
      url: item.url,
      pageTitle: item.page?.title || '',
      depth,
    });
    
    if (item.children && item.children.length > 0) {
      result.push(...flattenMenuItems(item.children, depth + 1, item.uuid));
    }
  }
  
  return result;
}

export function MenuItemsList({
  items,
  flatItems,
  onUpdate,
  onMove,
  onRemove,
  onReorder,
}: MenuItemsListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<MenuItemFlat | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const flattened = flattenMenuItems(items);
  const itemIds = flattened.map((item) => item.uuid);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeIndex = flattened.findIndex((item) => item.uuid === active.id);
    const overIndex = flattened.findIndex((item) => item.uuid === over.id);

    if (activeIndex === -1 || overIndex === -1) {
      setActiveId(null);
      return;
    }

    const newItems = [...flattened];
    const [movedItem] = newItems.splice(activeIndex, 1);
    newItems.splice(overIndex, 0, movedItem);

    const reorderedItems = newItems.map((item, index) => ({
      uuid: item.uuid,
      order: index,
      parentUuid: item.parentUuid,
    }));

    await onReorder(reorderedItems);
    setActiveId(null);
  };

  const handleToggleExpand = (uuid: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uuid)) {
        newSet.delete(uuid);
      } else {
        newSet.add(uuid);
      }
      return newSet;
    });
  };

  const activeItem = activeId ? flattened.find((item) => item.uuid === activeId) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2">
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {flattened.map((item) => (
              <MenuItemRow
                key={item.uuid}
                item={item}
                isExpanded={expandedItems.has(item.uuid)}
                onToggleExpand={() => handleToggleExpand(item.uuid)}
                onEdit={() => setEditingItem(flatItems.find((i) => i.uuid === item.uuid) || null)}
                isDragging={activeId === item.uuid}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="rounded-lg border border-indigo-500 bg-indigo-50 p-3 shadow-lg dark:bg-indigo-900/20">
              <div className="font-medium text-zinc-900 dark:text-white">
                {activeItem.label || activeItem.pageTitle}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {editingItem && (
        <div className="mt-4">
          <MenuItemEditor
            item={editingItem}
            allItems={flatItems}
            onUpdate={async (uuid, updates) => {
              await onUpdate(uuid, updates);
              setEditingItem(null);
            }}
            onMove={async (uuid, direction, targetUuid) => {
              await onMove(uuid, direction, targetUuid);
              setEditingItem(null);
            }}
            onRemove={async (uuid) => {
              await onRemove(uuid);
              setEditingItem(null);
            }}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      )}
    </>
  );
}

