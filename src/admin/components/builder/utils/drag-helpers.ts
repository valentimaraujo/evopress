import type { DragOverEvent } from '@dnd-kit/core';

import type { ContentBlock } from '../types';

export interface DragPosition {
  overId: string;
  position: 'above' | 'below';
}

export function calculateDragPosition(
  event: DragOverEvent,
  overId: string
): DragPosition | null {
  const overElement = document.getElementById(overId);
  if (!overElement) {
    return null;
  }

  const rect = overElement.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const activatorEvent = 'activatorEvent' in event ? (event.activatorEvent as MouseEvent | undefined) : undefined;

  if (!activatorEvent) {
    return null;
  }

  const mouseY = activatorEvent.clientY;
  const position = mouseY < centerY ? 'above' : 'below';

  return { overId, position };
}

export function calculateInsertIndex(
  targetIndex: number,
  dragPosition: DragPosition | null,
  oldIndex?: number
): number {
  let insertIndex = targetIndex + 1;

  if (dragPosition) {
    insertIndex = dragPosition.position === 'above' ? targetIndex : targetIndex + 1;
  }

  if (oldIndex !== undefined && oldIndex < insertIndex) {
    insertIndex -= 1;
  }

  return insertIndex;
}

export function insertBlockAt(
  blocks: ContentBlock[],
  newBlock: ContentBlock,
  insertIndex: number
): ContentBlock[] {
  const newBlocks = [...blocks];
  newBlocks.splice(insertIndex, 0, newBlock);
  return newBlocks;
}

export function moveBlock(
  blocks: ContentBlock[],
  oldIndex: number,
  insertIndex: number
): ContentBlock[] {
  const newBlocks = [...blocks];
  const [movedBlock] = newBlocks.splice(oldIndex, 1);
  newBlocks.splice(insertIndex, 0, movedBlock);
  return newBlocks;
}

