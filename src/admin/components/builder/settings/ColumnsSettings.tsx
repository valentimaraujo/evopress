'use client';

import React from 'react';

import { Label } from '@/components/ui/Label';

import { BlockEditor } from '../BlockEditor';
import type { ColumnsBlock, ContentBlock } from '../types';

interface ColumnsSettingsProps {
  block: ColumnsBlock;
  onChange: (block: ColumnsBlock) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function ColumnsSettings({ block, onChange, onUploadImage }: ColumnsSettingsProps) {
  const handleColumnCountChange = (count: 2 | 3 | 4) => {
    const newColumns = Array.from({ length: count }, (_, i) => {
      const existingColumn = block.columns[i];
      if (existingColumn) {
        return existingColumn;
      }
      return {
        id: `col-${i + 1}`,
        width: Math.floor(100 / count),
        blocks: [],
      };
    });

    onChange({
      ...block,
      columnCount: count,
      columns: newColumns,
    });
  };

  const handleColumnBlocksChange = (columnId: string, newBlocks: ContentBlock[]) => {
    onChange({
      ...block,
      columns: block.columns.map((col) =>
        col.id === columnId ? { ...col, blocks: newBlocks } : col
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Número de Colunas</Label>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => handleColumnCountChange(2)}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              block.columnCount === 2
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            type="button"
          >
            2
          </button>
          <button
            onClick={() => handleColumnCountChange(3)}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              block.columnCount === 3
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            type="button"
          >
            3
          </button>
          <button
            onClick={() => handleColumnCountChange(4)}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              block.columnCount === 4
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            type="button"
          >
            4
          </button>
        </div>
      </div>
      <div>
        <Label>Editar Colunas</Label>
        <div className="mt-2 space-y-3">
          {block.columns.map((column, index) => (
            <div
              key={column.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Coluna {index + 1}
              </div>
              <div className="min-h-[200px] rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                <BlockEditor
                  blocks={column.blocks}
                  onChange={(newBlocks) => handleColumnBlocksChange(column.id, newBlocks)}
                  onUploadImage={onUploadImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

