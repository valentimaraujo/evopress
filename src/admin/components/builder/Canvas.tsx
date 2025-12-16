'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

import { renderBlock } from './block-renderer';
import { BlockItem } from './BlockItem';
import { DropIndicator } from './DropIndicator';
import type { ContentBlock } from './types';

interface CanvasProps {
  blocks: ContentBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (block: ContentBlock) => void;
  onDeleteBlock: (id: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  onBlockRef?: (id: string, ref: HTMLElement | null) => void;
  dragPosition?: { overId: string; position: 'above' | 'below' } | null;
}

export function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onUploadImage,
  onBlockRef,
  dragPosition,
}: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div
      ref={setNodeRef}
      data-canvas
      className="relative h-full rounded-xl border border-dashed border-zinc-200 bg-white p-12 dark:border-zinc-700 dark:bg-zinc-900"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectBlock(null);
        }
      }}
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
            <>
              {dragPosition && dragPosition.overId === blocks[0]?.id && dragPosition.position === 'above' && (
                <div className="relative">
                  <DropIndicator position="above" />
                </div>
              )}
              {blocks.map((block, index) => (
                <div key={block.id} className="relative">
                  {dragPosition && dragPosition.overId === block.id && dragPosition.position === 'above' && index > 0 && (
                    <DropIndicator position="above" />
                  )}
                  <BlockItem
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onDelete={() => onDeleteBlock(block.id)}
                    onBlockRef={(ref) => onBlockRef?.(block.id, ref)}
                  >
                    {renderBlock(
                      block,
                      selectedBlockId === block.id &&
                        (block.type === 'heading' || block.type === 'paragraph'),
                      onUpdateBlock,
                      onUploadImage
                    )}
                  </BlockItem>
                  {dragPosition && dragPosition.overId === block.id && dragPosition.position === 'below' && (
                    <DropIndicator position="below" />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
