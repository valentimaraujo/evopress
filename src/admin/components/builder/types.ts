export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'spacer'
  | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt: string;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  text: string;
  url: string;
  variant: 'primary' | 'secondary';
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  height: number;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ButtonBlock
  | SpacerBlock
  | DividerBlock;

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  defaultData: Omit<ContentBlock, 'id'>;
}
