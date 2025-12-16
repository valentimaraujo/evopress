'use client';

import React from 'react';

import { ButtonBlock } from './blocks/ButtonBlock';
import { ColumnsBlock } from './blocks/ColumnsBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { SpacerBlock } from './blocks/SpacerBlock';
import { ButtonSettings } from './settings/ButtonSettings';
import { ColumnsSettings } from './settings/ColumnsSettings';
import { DividerSettings } from './settings/DividerSettings';
import { HeadingSettings } from './settings/HeadingSettings';
import { ImageSettings } from './settings/ImageSettings';
import { ParagraphSettings } from './settings/ParagraphSettings';
import { SpacerSettings } from './settings/SpacerSettings';
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
    case 'columns':
      return (
        <ColumnsBlock
          block={block}
          isEditing={isEditing}
          onChange={onChange}
          onUploadImage={onUploadImage}
        />
      );
    default:
      return <div>Tipo de bloco desconhecido</div>;
  }
}

export function renderBlockSettings(
  block: ContentBlock,
  onChange: (block: ContentBlock) => void,
  onUploadImage: (file: File) => Promise<string>
) {
  switch (block.type) {
    case 'heading':
      return <HeadingSettings block={block} onChange={onChange} />;
    case 'paragraph':
      return <ParagraphSettings block={block} onChange={onChange} />;
    case 'image':
      return <ImageSettings block={block} onChange={onChange} onUpload={onUploadImage} />;
    case 'button':
      return <ButtonSettings block={block} onChange={onChange} />;
    case 'spacer':
      return <SpacerSettings block={block} onChange={onChange} />;
    case 'divider':
      return <DividerSettings block={block} onChange={onChange} />;
    case 'columns':
      return <ColumnsSettings block={block} onChange={onChange} onUploadImage={onUploadImage} />;
    default:
      return <div>Tipo de bloco desconhecido</div>;
  }
}
