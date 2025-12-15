'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

import { renderBlock } from './block-renderer';
import { BlockWrapper } from './BlockWrapper';
import { type ContentBlock } from './types';

interface CanvasProps {
  blocks: ContentBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (block: ContentBlock) => void;
  onDeleteBlock: (id: string) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onUploadImage,
}: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div
      ref={setNodeRef}
      className="h-full min-h-[600px] rounded-xl border-2 border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-zinc-400 dark:text-zinc-500">
                Arraste blocos aqui para começar
              </p>
            </div>
          ) : (
            blocks.map((block) => (
              <BlockWrapper
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onSelectBlock(block.id)}
                onDelete={() => onDeleteBlock(block.id)}
              >
                {renderBlock(block, selectedBlockId === block.id, onUpdateBlock, onUploadImage)}
              </BlockWrapper>
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
