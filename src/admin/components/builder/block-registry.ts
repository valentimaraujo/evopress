import type { BlockDefinition, BlockType, ContentBlock } from './types';

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  heading: {
    type: 'heading',
    label: 'Título',
    icon: 'H',
    defaultData: {
      type: 'heading',
      level: 2,
      content: 'Novo Título',
    } as unknown as Omit<ContentBlock, 'id'>,
  },
  paragraph: {
    type: 'paragraph',
    label: 'Parágrafo',
    icon: 'P',
    defaultData: {
      type: 'paragraph',
      content: 'Digite seu texto aqui...',
    } as unknown as Omit<ContentBlock, 'id'>,
  },
  image: {
    type: 'image',
    label: 'Imagem',
    icon: '▦',
    defaultData: {
      type: 'image',
      url: '',
      alt: '',
    } as unknown as Omit<ContentBlock, 'id'>,
  },
  button: {
    type: 'button',
    label: 'Botão',
    icon: '◉',
    defaultData: {
      type: 'button',
      text: 'Clique aqui',
      url: '#',
      variant: 'primary',
    } as unknown as Omit<ContentBlock, 'id'>,
  },
  spacer: {
    type: 'spacer',
    label: 'Espaçador',
    icon: '↕',
    defaultData: {
      type: 'spacer',
      height: 40,
    } as unknown as Omit<ContentBlock, 'id'>,
  },
  divider: {
    type: 'divider',
    label: 'Divisor',
    icon: '—',
    defaultData: {
      type: 'divider',
    } as unknown as Omit<ContentBlock, 'id'>,
  },
  columns: {
    type: 'columns',
    label: 'Colunas',
    icon: '▥',
    defaultData: {
      type: 'columns',
      columnCount: 2,
      columns: [
        { id: 'col-1', width: 50, blocks: [] },
        { id: 'col-2', width: 50, blocks: [] },
      ],
    } as unknown as Omit<ContentBlock, 'id'>,
  },
};

export function createBlock(type: BlockType, id?: string) {
  const definition = BLOCK_DEFINITIONS[type];
  if (!definition) {
    throw new Error(`Tipo de bloco desconhecido: ${type}`);
  }

  return {
    id: id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...definition.defaultData,
  };
}
