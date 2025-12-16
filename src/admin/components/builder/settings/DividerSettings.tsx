'use client';

import React from 'react';

import type { DividerBlock } from '../types';

interface DividerSettingsProps {
  block: DividerBlock;
  onChange: (block: DividerBlock) => void;
}

export function DividerSettings({}: DividerSettingsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Este bloco não possui configurações.
      </p>
    </div>
  );
}

