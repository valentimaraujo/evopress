'use client';

import React from 'react';

import { ButtonBlock } from './blocks/ButtonBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { SpacerBlock } from './blocks/SpacerBlock';
import type { ContentBlock } from './types';


export function renderBlock(
  block: ContentBlock,
  isEditing: boolean,
  onChange: (block: ContentBlock) => void,
  onUploadImage: (file: File) => Promise<string>
) {
  switch (block.type) {
    case 'heading':
      return (
        <HeadingBlock
          block={block}
          isEditing={isEditing}
          onChange={onChange}
        />
      );
    case 'paragraph':
      return (
        <ParagraphBlock
          block={block}
          isEditing={isEditing}
          onChange={onChange}
        />
      );
    case 'image':
      return (
        <ImageBlock
          block={block}
          isEditing={isEditing}
          onChange={onChange}
          onUpload={onUploadImage}
        />
      );
    case 'button':
      return (
        <ButtonBlock
          block={block}
          isEditing={isEditing}
          onChange={onChange}
        />
      );
    case 'spacer':
      return (
        <SpacerBlock
          block={block}
          isEditing={isEditing}
          onChange={onChange}
        />
      );
    case 'divider':
      return <DividerBlock block={block} isEditing={isEditing} onChange={onChange} />;
    default:
      return <div>Tipo de bloco desconhecido</div>;
  }
}
