import type {
  BlockDefinition,
  BlockType,
  ButtonBlock,
  ColumnsBlock,
  ContentBlock,
  DividerBlock,
  HeadingBlock,
  ImageBlock,
  ParagraphBlock,
  SpacerBlock,
} from './types';

function createDefaultHeading(): Omit<HeadingBlock, 'id'> {
  return {
    type: 'heading',
    level: 2,
    content: 'Novo Título',
  };
}

function createDefaultParagraph(): Omit<ParagraphBlock, 'id'> {
  return {
    type: 'paragraph',
    content: 'Digite seu texto aqui...',
  };
}

function createDefaultImage(): Omit<ImageBlock, 'id'> {
  return {
    type: 'image',
    url: '',
    alt: '',
  };
}

function createDefaultButton(): Omit<ButtonBlock, 'id'> {
  return {
    type: 'button',
    text: 'Clique aqui',
    url: '#',
    variant: 'primary',
  };
}

function createDefaultSpacer(): Omit<SpacerBlock, 'id'> {
  return {
    type: 'spacer',
    height: 40,
  };
}

function createDefaultDivider(): Omit<DividerBlock, 'id'> {
  return {
    type: 'divider',
  };
}

function createDefaultColumns(): Omit<ColumnsBlock, 'id'> {
  return {
    type: 'columns',
    columnCount: 2,
    columns: [
      { id: 'col-1', width: 50, blocks: [] },
      { id: 'col-2', width: 50, blocks: [] },
    ],
  };
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  heading: {
    type: 'heading',
    label: 'Título',
    icon: 'H',
    defaultData: createDefaultHeading(),
  },
  paragraph: {
    type: 'paragraph',
    label: 'Parágrafo',
    icon: 'P',
    defaultData: createDefaultParagraph(),
  },
  image: {
    type: 'image',
    label: 'Imagem',
    icon: '▦',
    defaultData: createDefaultImage(),
  },
  button: {
    type: 'button',
    label: 'Botão',
    icon: '◉',
    defaultData: createDefaultButton(),
  },
  spacer: {
    type: 'spacer',
    label: 'Espaçador',
    icon: '↕',
    defaultData: createDefaultSpacer(),
  },
  divider: {
    type: 'divider',
    label: 'Divisor',
    icon: '—',
    defaultData: createDefaultDivider(),
  },
  columns: {
    type: 'columns',
    label: 'Colunas',
    icon: '▥',
    defaultData: createDefaultColumns(),
  },
};

export function createBlock(type: BlockType, id?: string): ContentBlock {
  const definition = BLOCK_DEFINITIONS[type];
  if (!definition) {
    throw new Error(`Tipo de bloco desconhecido: ${type}`);
  }

  return {
    id: id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...definition.defaultData,
  } as ContentBlock;
}
