'use client';

import React from 'react';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

import type { HeadingBlock } from '../types';

interface HeadingSettingsProps {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

export function HeadingSettings({ block, onChange }: HeadingSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="heading-level">Nível do Título</Label>
        <Select
          id="heading-level"
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
        <Label htmlFor="heading-content">Conteúdo</Label>
        <Input
          id="heading-content"
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Digite o título..."
        />
      </div>
    </div>
  );
}

