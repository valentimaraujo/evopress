export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'spacer'
  | 'divider'
  | 'columns';

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

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  columns: Array<{
    id: string;
    width: number;
    blocks: ContentBlock[];
  }>;
  columnCount: 2 | 3 | 4;
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ButtonBlock
  | SpacerBlock
  | DividerBlock
  | ColumnsBlock;

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  defaultData: Omit<ContentBlock, 'id'>;
}
