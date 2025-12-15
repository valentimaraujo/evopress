'use client';

import React from 'react';

import type { DividerBlock } from '../types';

interface DividerBlockProps {
  block: DividerBlock;
  isEditing: boolean;
  onChange: (block: DividerBlock) => void;
}

export function DividerBlock({}: DividerBlockProps) {
  return <hr className="my-4 border-t border-zinc-200 dark:border-zinc-700" />;
}
