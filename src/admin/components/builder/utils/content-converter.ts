import type { ContentBlock, HeadingBlock, ParagraphBlock } from '../types';

export function blocksToHtml(blocks: ContentBlock[]): string {
  if (blocks.length === 0) {
    return '';
  }

  const paragraphBlock = blocks.find((b): b is ParagraphBlock => b.type === 'paragraph');
  if (paragraphBlock) {
    return paragraphBlock.content;
  }

  return blocks
    .map((block) => {
      if (block.type === 'heading') {
        const headingBlock = block as HeadingBlock;
        return `<h${headingBlock.level}>${headingBlock.content}</h${headingBlock.level}>`;
      }
      if (block.type === 'paragraph') {
        const paraBlock = block as ParagraphBlock;
        return paraBlock.content;
      }
      return '';
    })
    .filter(Boolean)
    .join('');
}

