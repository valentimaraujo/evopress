'use client';

import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { renderBlock } from '../block-renderer';
import { BlockEditor } from '../BlockEditor';
import type { ColumnsBlock, ContentBlock } from '../types';

interface ColumnsBlockProps {
  block: ColumnsBlock;
  isEditing: boolean;
  onChange: (block: ColumnsBlock) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function ColumnsBlock({ block, isEditing, onChange, onUploadImage }: ColumnsBlockProps) {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const removeColumn = (columnId: string) => {
    if (block.columns.length <= 2) {
      return;
    }

    const updatedColumns = block.columns
      .filter((col) => col.id !== columnId)
      .map((col) => ({
        ...col,
        width: Math.floor(100 / (block.columns.length - 1)),
      }));

    onChange({
      ...block,
      columns: updatedColumns,
      columnCount: Math.max(2, block.columns.length - 1) as 2 | 3 | 4,
    });
  };

  if (isEditing) {
    return (
      <div className="w-full rounded-lg border-2 border-indigo-400 bg-white p-4 dark:border-indigo-500 dark:bg-zinc-900">
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Número de Colunas
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleColumnCountChange(2)}
                className={`rounded p-2 transition-colors ${
                  block.columnCount === 2
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
                type="button"
                title="2 Colunas"
              >
                <span className="text-sm font-semibold">2</span>
              </button>
              <button
                onClick={() => handleColumnCountChange(3)}
                className={`rounded p-2 transition-colors ${
                  block.columnCount === 3
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
                type="button"
                title="3 Colunas"
              >
                <span className="text-sm font-semibold">3</span>
              </button>
              <button
                onClick={() => handleColumnCountChange(4)}
                className={`rounded p-2 transition-colors ${
                  block.columnCount === 4
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
                type="button"
                title="4 Colunas"
              >
                <span className="text-sm font-semibold">4</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${block.columnCount}, 1fr)` }}>
          {block.columns.map((column, index) => (
            <div
              key={column.id}
              className={`rounded-lg border-2 ${
                editingColumnId === column.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800'
              } p-4`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Coluna {index + 1}
                </span>
                {block.columns.length > 2 && (
                  <button
                    onClick={() => removeColumn(column.id)}
                    className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    type="button"
                    title="Remover coluna"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setEditingColumnId(editingColumnId === column.id ? null : column.id)}
                className="w-full rounded border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                type="button"
              >
                {editingColumnId === column.id ? 'Fechar Editor' : 'Editar Coluna'}
              </button>
              {editingColumnId === column.id && (
                <div className="mt-4">
                  <BlockEditor
                    blocks={column.blocks}
                    onChange={(newBlocks) => handleColumnBlocksChange(column.id, newBlocks)}
                    onUploadImage={onUploadImage}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalBlocks = block.columns.reduce((sum, col) => sum + col.blocks.length, 0);

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
        type="button"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            {block.columnCount === 2 ? '▦' : block.columnCount === 3 ? '▥' : '▤'}
          </span>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {block.columnCount} Colunas
          </span>
          {totalBlocks > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              ({totalBlocks} {totalBlocks === 1 ? 'bloco' : 'blocos'})
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-zinc-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        )}
      </button>
      {isExpanded && (
        <div className="grid gap-3 border-t border-zinc-200 p-3 dark:border-zinc-700" style={{ gridTemplateColumns: `repeat(${block.columnCount}, 1fr)` }}>
          {block.columns.map((column) => (
            <div key={column.id} className="min-h-[50px]">
              {column.blocks.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
                  <span className="text-xs">Vazia</span>
                </div>
              ) : (
                <div className="space-y-3">
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
      )}
    </div>
  );
}

