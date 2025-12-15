'use client';

import React from 'react';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import type { HeadingBlock } from '../types';

interface HeadingBlockProps {
  block: HeadingBlock;
  isEditing: boolean;
  onChange: (block: HeadingBlock) => void;
}

export function HeadingBlock({ block, isEditing, onChange }: HeadingBlockProps) {
  const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nível do Título
          </label>
          <Select
            value={block.level}
            onChange={(e) => onChange({ ...block, level: parseInt(e.target.value, 10) as HeadingBlock['level'] })}
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
            <option value={5}>H5</option>
            <option value={6}>H6</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Conteúdo
          </label>
          <Input
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            placeholder="Digite o título..."
          />
        </div>
      </div>
    );
  }

  return <HeadingTag className={`text-${6 - block.level}xl font-bold p-4`}>{block.content}</HeadingTag>;
}
