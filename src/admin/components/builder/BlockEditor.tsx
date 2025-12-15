'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import React, { useState } from 'react';

import { createBlock, BLOCK_DEFINITIONS } from './block-registry';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import type { ContentBlock } from './types';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function BlockEditor({ blocks, onChange, onUploadImage }: BlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id.toString().startsWith('sidebar-')) {
      const blockType = active.id.toString().replace('sidebar-', '') as ContentBlock['type'];
      const newBlock = createBlock(blockType) as ContentBlock;
      onChange([...blocks, newBlock]);
    } else if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(blocks, oldIndex, newIndex));
      }
    }

    setActiveId(null);
  };

  const handleUpdateBlock = (updatedBlock: ContentBlock) => {
    onChange(blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)));
  };

  const handleDeleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Canvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onUploadImage={onUploadImage}
          />
        </div>
      </div>
      <DragOverlay>
        {activeId && activeId.toString().startsWith('sidebar-') ? (
          <div className="rounded-lg border border-indigo-500 bg-white p-4 shadow-lg dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <span className="text-lg font-semibold">
                  {BLOCK_DEFINITIONS[activeId.toString().replace('sidebar-', '') as keyof typeof BLOCK_DEFINITIONS]?.icon}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
