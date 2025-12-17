import React from 'react';

import type { ColumnsBlock, ContentBlock } from '@/admin/components/builder/types';

import { PublicButtonBlock } from './ButtonBlock';
import { PublicDividerBlock } from './DividerBlock';
import { PublicHeadingBlock } from './HeadingBlock';
import { PublicImageBlock } from './ImageBlock';
import { PublicParagraphBlock } from './ParagraphBlock';
import { PublicSpacerBlock } from './SpacerBlock';

interface PublicColumnsBlockProps {
  block: ColumnsBlock;
}

function renderColumnBlock(block: ContentBlock) {
  switch (block.type) {
    case 'heading':
      return <PublicHeadingBlock block={block} />;
    case 'paragraph':
      return <PublicParagraphBlock block={block} />;
    case 'image':
      return <PublicImageBlock block={block} />;
    case 'button':
      return <PublicButtonBlock block={block} />;
    case 'spacer':
      return <PublicSpacerBlock block={block} />;
    case 'divider':
      return <PublicDividerBlock block={block} />;
    default:
      return null;
  }
}

export function PublicColumnsBlock({ block }: PublicColumnsBlockProps) {
  return (
    <div className="my-6 grid gap-6" style={{ gridTemplateColumns: `repeat(${block.columnCount}, 1fr)` }}>
      {block.columns.map((column) => (
        <div key={column.id} className="min-h-[100px]">
          {column.blocks.length === 0 ? null : (
            <div className="space-y-4">
              {column.blocks.map((colBlock) => (
                <div key={colBlock.id}>
                  {renderColumnBlock(colBlock)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

