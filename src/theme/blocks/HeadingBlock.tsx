import React from 'react';

import type { HeadingBlock } from '@/admin/components/builder/types';

interface PublicHeadingBlockProps {
  block: HeadingBlock;
}

export function PublicHeadingBlock({ block }: PublicHeadingBlockProps) {
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  const className = `${sizeClasses[block.level]} font-bold`;

  switch (block.level) {
    case 1:
      return <h1 className={className}>{block.content}</h1>;
    case 2:
      return <h2 className={className}>{block.content}</h2>;
    case 3:
      return <h3 className={className}>{block.content}</h3>;
    case 4:
      return <h4 className={className}>{block.content}</h4>;
    case 5:
      return <h5 className={className}>{block.content}</h5>;
    case 6:
      return <h6 className={className}>{block.content}</h6>;
    default:
      return <h2 className={className}>{block.content}</h2>;
  }
}

