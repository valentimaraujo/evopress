'use client';

import Image from 'next/image';
import React from 'react';

import type { ImageBlock } from '../types';

interface ImageBlockProps {
  block: ImageBlock;
  isEditing: boolean;
  onChange: (block: ImageBlock) => void;
  onUpload: (file: File) => Promise<string>;
}

export function ImageBlock({ block }: ImageBlockProps) {
  if (!block.url) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800">
        <span className="text-sm text-zinc-400 dark:text-zinc-500">Sem imagem</span>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center rounded-lg border-2 border-dashed border-zinc-300 p-3 dark:border-zinc-600">
      <Image
        src={block.url}
        alt={block.alt || 'Imagem'}
        width={800}
        height={600}
        className="max-w-full h-auto rounded"
        unoptimized
      />
    </div>
  );
}
