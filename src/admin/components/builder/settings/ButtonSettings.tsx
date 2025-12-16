'use client';

import React from 'react';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

import type { ButtonBlock } from '../types';

interface ButtonSettingsProps {
  block: ButtonBlock;
  onChange: (block: ButtonBlock) => void;
}

export function ButtonSettings({ block, onChange }: ButtonSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="button-text">Texto do Botão</Label>
        <Input
          id="button-text"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Clique aqui"
        />
      </div>
      <div>
        <Label htmlFor="button-url">URL</Label>
        <Input
          id="button-url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <Label htmlFor="button-variant">Variante</Label>
        <Select
          id="button-variant"
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

