import React from 'react';

import type { ContentBlock } from '@/admin/components/builder/types';

import { PublicButtonBlock } from './ButtonBlock';
import { PublicColumnsBlock } from './ColumnsBlock';
import { PublicDividerBlock } from './DividerBlock';
import { PublicHeadingBlock } from './HeadingBlock';
import { PublicImageBlock } from './ImageBlock';
import { PublicParagraphBlock } from './ParagraphBlock';
import { PublicSpacerBlock } from './SpacerBlock';

export function renderPublicBlock(block: ContentBlock) {
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
    case 'columns':
      return <PublicColumnsBlock block={block} />;
    default:
      return <div>Tipo de bloco desconhecido: {(block as { type: string }).type}</div>;
  }
}

