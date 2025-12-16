'use client';

import React from 'react';

import { renderBlock } from '../block-renderer';
import type { ColumnsBlock } from '../types';

interface ColumnsBlockProps {
  block: ColumnsBlock;
  isEditing: boolean;
  onChange: (block: ColumnsBlock) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function ColumnsBlock({ block, onUploadImage }: ColumnsBlockProps) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${block.columnCount}, 1fr)` }}>
      {block.columns.map((column, index) => (
        <div
          key={column.id}
          className={`min-h-[100px] ${
            index < block.columns.length - 1 ? 'border-r-2 border-dashed border-zinc-300 pr-4 dark:border-zinc-600' : ''
          }`}
        >
          {column.blocks.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800">
              <span className="text-xs">Coluna vazia</span>
            </div>
          ) : (
            <div className="space-y-4">
              {column.blocks.map((colBlock) => (
                <div key={colBlock.id}>
                  {renderBlock(colBlock, false, () => {}, onUploadImage)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

