import React from 'react';

import type { ContentBlock } from '@/admin/components/builder/types';

interface PostContentProps {
  blocks: ContentBlock[];
}

function renderPublicBlock(block: ContentBlock) {
  switch (block.type) {
    case 'heading': {
      const level = block.level;
      const HeadingComponent = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : level === 4 ? 'h4' : level === 5 ? 'h5' : 'h6';
      if (HeadingComponent === 'h1') {
        return <h1 className="mb-4 font-bold text-zinc-900 dark:text-white">{block.content}</h1>;
      } else if (HeadingComponent === 'h2') {
        return <h2 className="mb-4 font-bold text-zinc-900 dark:text-white">{block.content}</h2>;
      } else if (HeadingComponent === 'h3') {
        return <h3 className="mb-4 font-bold text-zinc-900 dark:text-white">{block.content}</h3>;
      } else if (HeadingComponent === 'h4') {
        return <h4 className="mb-4 font-bold text-zinc-900 dark:text-white">{block.content}</h4>;
      } else if (HeadingComponent === 'h5') {
        return <h5 className="mb-4 font-bold text-zinc-900 dark:text-white">{block.content}</h5>;
      } else {
        return <h6 className="mb-4 font-bold text-zinc-900 dark:text-white">{block.content}</h6>;
      }
    }
    case 'paragraph':
      return (
        <div
          className="prose prose-sm dark:prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: block.content || '<p></p>' }}
        />
      );
    case 'image':
      return (
        <div className="my-6">
          <img
            src={block.url}
            alt={block.alt || ''}
            className="w-full rounded-lg"
          />
        </div>
      );
    case 'button':
      return (
        <div className="my-4">
          <a
            href={block.url}
            className={`inline-block rounded-lg px-6 py-3 font-medium transition-colors ${
              block.variant === 'primary'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800'
            }`}
          >
            {block.text}
          </a>
        </div>
      );
    case 'spacer':
      return <div style={{ height: `${block.height}px` }} />;
    case 'divider':
      return <hr className="my-8 border-zinc-200 dark:border-zinc-700" />;
    case 'columns':
      return (
        <div className={`my-6 grid gap-4 ${block.columnCount === 2 ? 'grid-cols-1 md:grid-cols-2' : block.columnCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4'}`}>
          {block.columns.map((column) => (
            <div key={column.id}>
              {column.blocks.map((colBlock) => (
                <div key={colBlock.id}>{renderPublicBlock(colBlock)}</div>
              ))}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function PostContent({ blocks }: PostContentProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <div key={block.id}>{renderPublicBlock(block)}</div>
      ))}
    </div>
  );
}

