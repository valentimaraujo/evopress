'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { type ReactNode } from 'react';

import type { ContentBlock } from './types';

interface BlockItemProps {
  block: ContentBlock;
  isSelected: boolean;
  children: ReactNode;
  onSelect: () => void;
  onDelete: () => void;
  onBlockRef?: (ref: HTMLElement | null) => void;
}

export function BlockItem({
  block,
  isSelected,
  children,
  onSelect,
  onDelete,
  onBlockRef,
}: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (onBlockRef) {
      onBlockRef(node);
    }
  };

  return (
    <div
      id={block.id}
      ref={handleRef}
      style={style}
      className={`group relative transition-all ${
        isSelected
          ? 'rounded-lg border-2 border-indigo-400'
          : 'rounded-lg border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
      }`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          !target.closest('button') &&
          !target.closest('input') &&
          !target.closest('select') &&
          !target.closest('[contenteditable]') &&
          !target.closest('a')
        ) {
          onSelect();
        }
      }}
    >
      {isSelected && (
        <>
          <div className="absolute -left-10 top-0 z-10">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing rounded-md bg-indigo-500 p-1.5 text-white shadow-md transition-all hover:bg-indigo-600"
              type="button"
              title="Arrastar"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -right-10 top-0 z-10 rounded-lg bg-red-500 p-2 text-white shadow-lg transition-all hover:bg-red-600 hover:shadow-xl"
            type="button"
            title="Deletar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
      {children}
    </div>
  );
}

