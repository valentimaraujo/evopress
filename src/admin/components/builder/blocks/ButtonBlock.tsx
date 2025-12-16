'use client';

import React from 'react';

import { Button } from '@/components/ui/Button';

import type { ButtonBlock } from '../types';

interface ButtonBlockProps {
  block: ButtonBlock;
  isEditing: boolean;
  onChange: (block: ButtonBlock) => void;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
  return (
    <Button variant={block.variant || 'primary'}>
      <a href={block.url} target="_blank" rel="noopener noreferrer">
        {block.text || 'Botão'}
      </a>
    </Button>
  );
}
