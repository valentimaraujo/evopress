'use client';

import { useDraggable } from '@dnd-kit/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, type ReactNode } from 'react';

import { BLOCK_DEFINITIONS } from './block-registry';

interface SidebarProps {
  settingsPanel?: ReactNode;
}

export function Sidebar({ settingsPanel }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`shrink-0 rounded-xl border border-zinc-200 bg-white transition-all dark:border-zinc-700 
        dark:bg-zinc-900 ${isExpanded ? 'w-80 p-2' : 'w-16 p-2'} flex flex-col overflow-hidden`}
    >
      {settingsPanel && isExpanded && (
        <div className="mb-3 shrink-0 overflow-visible">
          {settingsPanel}
        </div>
      )}
      <div className="mb-3 flex shrink-0 items-center justify-between">
        {isExpanded && (
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">Blocos</h3>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          type="button"
          title={isExpanded ? 'Recolher' : 'Expandir'}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className={`overflow-y-auto overflow-x-hidden ${isExpanded ? 'grid grid-cols-3' : 'flex flex-col gap-1.5'}`}>
        {Object.values(BLOCK_DEFINITIONS).map((blockDef) => (
          <DraggableBlock key={blockDef.type} blockDef={blockDef} isExpanded={isExpanded} />
        ))}
      </div>
    </div>
  );
}

interface DraggableBlockProps {
  blockDef: typeof BLOCK_DEFINITIONS[keyof typeof BLOCK_DEFINITIONS];
  isExpanded: boolean;
}

function DraggableBlock({ blockDef, isExpanded }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${blockDef.type}`,
    data: { type: blockDef.type },
  });

  const style = transform && !isDragging
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (!isExpanded) {
    return (
      <button
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-semibold transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        type="button"
        title={blockDef.label}
      >
        {blockDef.icon}
      </button>
    );
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center gap-0.5 rounded border border-zinc-200 bg-zinc-50 p-2 aspect-square text-center text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      type="button"
    >
      <span className="text-sm font-semibold">{blockDef.icon}</span>
      <span className="text-xs leading-tight">{blockDef.label}</span>
    </button>
  );
}
