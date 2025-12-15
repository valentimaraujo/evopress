'use client';

import React from 'react';

import { Input } from '@/components/ui/Input';

import type { SpacerBlock } from '../types';

interface SpacerBlockProps {
  block: SpacerBlock;
  isEditing: boolean;
  onChange: (block: SpacerBlock) => void;
}

export function SpacerBlock({ block, isEditing, onChange }: SpacerBlockProps) {
  if (isEditing) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Altura (px)
        </label>
        <Input
          type="number"
          value={block.height}
          onChange={(e) => onChange({ ...block, height: parseInt(e.target.value, 10) })}
          placeholder="40"
        />
      </div>
    );
  }

  return <div style={{ height: block.height }} className="w-full bg-zinc-50/50 dark:bg-zinc-900/20" />;
}
