'use client';

import React from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import type { ButtonBlock } from '../types';

interface ButtonBlockProps {
  block: ButtonBlock;
  isEditing: boolean;
  onChange: (block: ButtonBlock) => void;
}

export function ButtonBlock({ block, isEditing, onChange }: ButtonBlockProps) {
  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Texto do Botão
          </label>
          <Input
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Clique aqui"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            URL
          </label>
          <Input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Variante
          </label>
          <Select
            value={block.variant || 'primary'}
            onChange={(e) =>
              onChange({
                ...block,
                variant: e.target.value as 'primary' | 'secondary',
              })
            }
          >
            <option value="primary">Primário</option>
            <option value="secondary">Secundário</option>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Button variant={block.variant || 'primary'}>
        <a href={block.url} target="_blank" rel="noopener noreferrer">{block.text || 'Botão'}</a>
      </Button>
    </div>
  );
}
