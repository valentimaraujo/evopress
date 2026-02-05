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
  HTMLBlock,
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

function createDefaultHTML(): Omit<HTMLBlock, 'id'> {
  return {
    type: 'html',
    content: '<section>\n  <div class="container">\n    <h2>Seu HTML aqui</h2>\n  </div>\n</section>',
    fullWidth: true,
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
  html: {
    type: 'html',
    label: 'HTML Puro',
    icon: '</>',
    defaultData: createDefaultHTML(),
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
