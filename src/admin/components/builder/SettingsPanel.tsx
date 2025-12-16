'use client';

import { X } from 'lucide-react';
import React from 'react';

import { renderBlockSettings } from './block-renderer';
import type { ContentBlock } from './types';

interface SettingsPanelProps {
  selectedBlock: ContentBlock | null;
  onClose: () => void;
  onChange: (block: ContentBlock) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function SettingsPanel({
  selectedBlock,
  onClose,
  onChange,
  onUploadImage,
}: SettingsPanelProps) {
  if (!selectedBlock) {
    return null;
  }

  const blockLabel =
    selectedBlock.type === 'heading'
      ? 'Título'
      : selectedBlock.type === 'paragraph'
        ? 'Parágrafo'
        : selectedBlock.type === 'image'
          ? 'Imagem'
          : selectedBlock.type === 'button'
            ? 'Botão'
            : selectedBlock.type === 'spacer'
              ? 'Espaçador'
              : selectedBlock.type === 'divider'
                ? 'Divisor'
                : selectedBlock.type === 'columns'
                  ? 'Colunas'
                  : 'Bloco';

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 p-3 dark:border-zinc-700">
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-white truncate pr-2">
          {blockLabel} Settings
        </h3>
        <button
          onClick={onClose}
          className="shrink-0 rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          type="button"
          title="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-3">
        {renderBlockSettings(selectedBlock, onChange, onUploadImage)}
      </div>
    </div>
  );
}
