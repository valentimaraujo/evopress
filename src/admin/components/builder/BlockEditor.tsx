'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type Modifier,
} from '@dnd-kit/core';
import React, { useState } from 'react';

import { createBlock, BLOCK_DEFINITIONS } from './block-registry';
import { renderBlock } from './block-renderer';
import { Canvas } from './Canvas';
import { SettingsPanel } from './SettingsPanel';
import { Sidebar } from './Sidebar';
import type { ContentBlock } from './types';
import {
  calculateDragPosition,
  calculateInsertIndex,
  insertBlockAt,
  moveBlock,
} from './utils/drag-helpers';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onUploadImage: (file: File) => Promise<string>;
}

const centerModifier: Modifier = ({ transform, activeNodeRect, activatorEvent }) => {
  if (!activeNodeRect || !activatorEvent) {
    return transform;
  }

  const mouseEvent = activatorEvent as MouseEvent;
  const rect = activeNodeRect;
  
  const offsetX = mouseEvent.clientX - rect.left;
  const offsetY = mouseEvent.clientY - rect.top;

  return {
    ...transform,
    x: transform.x - offsetX + 10,
    y: transform.y - offsetY + 10,
  };
};

export function BlockEditor({ blocks, onChange, onUploadImage }: BlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlockRef, setSelectedBlockRef] = useState<HTMLElement | null>(null);
  const [dragPosition, setDragPosition] = useState<{ overId: string; position: 'above' | 'below' } | null>(null);
  const [activeBlock, setActiveBlock] = useState<ContentBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDragPosition(null);
    if (!event.active.id.toString().startsWith('sidebar-')) {
      const block = blocks.find((b) => b.id === event.active.id);
      setActiveBlock(block || null);
    } else {
      setActiveBlock(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over || over.id === 'canvas') {
      setDragPosition(null);
      return;
    }

    const position = calculateDragPosition(event, over.id.toString());
    setDragPosition(position);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id.toString().startsWith('sidebar-')) {
      const blockType = active.id.toString().replace('sidebar-', '') as ContentBlock['type'];
      const newBlock = createBlock(blockType);

      if (over.id === 'canvas') {
        onChange([...blocks, newBlock]);
      } else {
        const targetIndex = blocks.findIndex((block) => block.id === over.id);
        if (targetIndex !== -1) {
          const currentDragPosition =
            dragPosition?.overId === over.id.toString() ? dragPosition : null;
          const insertIndex = calculateInsertIndex(targetIndex, currentDragPosition);
          onChange(insertBlockAt(blocks, newBlock, insertIndex));
        } else {
          onChange([...blocks, newBlock]);
        }
      }
    } else if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const currentDragPosition =
          dragPosition?.overId === over.id.toString() ? dragPosition : null;
        const insertIndex = calculateInsertIndex(newIndex, currentDragPosition, oldIndex);
        onChange(moveBlock(blocks, oldIndex, insertIndex));
      }
    }

    setActiveId(null);
    setDragPosition(null);
    setActiveBlock(null);
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

  const selectedBlock = selectedBlockId ? blocks.find((b) => b.id === selectedBlockId) || null : null;

  const handleBlockRef = (id: string, ref: HTMLElement | null) => {
    if (id === selectedBlockId) {
      setSelectedBlockRef(ref);
    } else if (ref === null && id === selectedBlockId) {
      setSelectedBlockRef(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[centerModifier]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4">
        <Sidebar
          settingsPanel={
            selectedBlock && selectedBlockRef ? (
              <SettingsPanel
                selectedBlock={selectedBlock}
                onClose={() => {
                  setSelectedBlockId(null);
                  setSelectedBlockRef(null);
                }}
                onChange={handleUpdateBlock}
                onUploadImage={onUploadImage}
              />
            ) : null
          }
        />
        <div className="relative flex-1 overflow-hidden" data-canvas-container>
          <div className="h-full overflow-y-auto relative">
            <Canvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onUploadImage={onUploadImage}
              onBlockRef={handleBlockRef}
              dragPosition={dragPosition}
            />
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId && activeId.toString().startsWith('sidebar-') ? (
          <div className="rounded-lg border border-indigo-500 bg-white p-4 shadow-lg dark:bg-zinc-900">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <span className="text-lg font-semibold">
                  {BLOCK_DEFINITIONS[activeId.toString().replace('sidebar-', '') as keyof typeof BLOCK_DEFINITIONS]?.icon}
                </span>
              </div>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {BLOCK_DEFINITIONS[activeId.toString().replace('sidebar-', '') as keyof typeof BLOCK_DEFINITIONS]?.label}
              </span>
            </div>
          </div>
        ) : activeBlock ? (
          <div className="rounded-lg border-2 border-indigo-400 bg-white p-4 shadow-lg opacity-90 dark:bg-zinc-900">
            {renderBlock(activeBlock, false, () => {}, onUploadImage)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
