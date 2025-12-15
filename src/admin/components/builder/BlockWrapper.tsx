'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { type ReactNode } from 'react';

import type { ContentBlock } from './types';

interface BlockWrapperProps {
  block: ContentBlock;
  isSelected: boolean;
  children: ReactNode;
  onSelect: () => void;
  onDelete: () => void;
}

export function BlockWrapper({
  block,
  isSelected,
  children,
  onSelect,
  onDelete,
}: BlockWrapperProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
      onClick={(e) => {
        // Prevent selection if clicking buttons or inputs inside the block
        const target = e.target as HTMLElement;
        if (!target.closest('button') && !target.closest('input') && !target.closest('select') && !target.closest('[contenteditable]')) {
          onSelect();
        }
      }}
    >
      <div className="absolute -left-10 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
