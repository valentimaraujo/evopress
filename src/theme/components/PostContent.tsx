import React from 'react';

import type { ContentBlock } from '@/admin/components/builder/types';

import { renderPublicBlock } from '../blocks/block-renderer';

interface PostContentProps {
  blocks: ContentBlock[];
}

export function PostContent({ blocks }: PostContentProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
        Nenhum conteúdo disponível.
      </div>
    );
  }

  return (
    <div className="py-8">
      {blocks.map((block) => (
        <div
          key={block.id}
          className={block.fullWidth ? "" : "mx-auto max-w-4xl px-4 mb-6"}
        >
          {renderPublicBlock(block)}
        </div>
      ))}
    </div>
  );
}

