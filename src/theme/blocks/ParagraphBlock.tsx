import React from 'react';

import type { ParagraphBlock } from '@/admin/components/builder/types';

interface PublicParagraphBlockProps {
  block: ParagraphBlock;
}

export function PublicParagraphBlock({ block }: PublicParagraphBlockProps) {
  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: block.content || '<p></p>' }}
    />
  );
}

