'use client';

import React from 'react';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

import type { SpacerBlock } from '../types';

interface SpacerSettingsProps {
  block: SpacerBlock;
  onChange: (block: SpacerBlock) => void;
}

export function SpacerSettings({ block, onChange }: SpacerSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="spacer-height">Altura (px)</Label>
        <Input
          id="spacer-height"
          type="number"
          value={block.height}
          onChange={(e) => onChange({ ...block, height: parseInt(e.target.value, 10) || 40 })}
          placeholder="40"
        />
      </div>
    </div>
  );
}

