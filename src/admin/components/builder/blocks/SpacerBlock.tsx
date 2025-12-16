'use client';

import React from 'react';

import type { SpacerBlock } from '../types';

interface SpacerBlockProps {
  block: SpacerBlock;
  isEditing: boolean;
  onChange: (block: SpacerBlock) => void;
}

export function SpacerBlock({ block }: SpacerBlockProps) {
  return <div style={{ height: `${block.height}px` }} className="w-full" />;
}
