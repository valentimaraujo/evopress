'use client';

import { useDraggable } from '@dnd-kit/core';
import React from 'react';

import { BLOCK_DEFINITIONS } from './block-registry';

export function Sidebar() {
  return (
    <div className="w-80 shrink-0 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">Blocos</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(BLOCK_DEFINITIONS).map((blockDef) => (
          <DraggableBlock key={blockDef.type} blockDef={blockDef} />
        ))}
      </div>
    </div>
  );
}

interface DraggableBlockProps {
  blockDef: typeof BLOCK_DEFINITIONS[keyof typeof BLOCK_DEFINITIONS];
}

function DraggableBlock({ blockDef }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebar-${blockDef.type}`,
    data: { type: blockDef.type },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      type="button"
    >
      <span className="text-xl">{blockDef.icon}</span>
      {blockDef.label}
    </button>
  );
}
