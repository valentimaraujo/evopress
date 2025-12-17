import Link from 'next/link';
import React from 'react';

import type { ButtonBlock } from '@/admin/components/builder/types';

interface PublicButtonBlockProps {
  block: ButtonBlock;
}

export function PublicButtonBlock({ block }: PublicButtonBlockProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600',
  };

  const className = `${baseClasses} ${variantClasses[block.variant || 'primary']}`;

  const isExternal = block.url.startsWith('http://') || block.url.startsWith('https://');

  if (isExternal) {
    return (
      <a href={block.url} target="_blank" rel="noopener noreferrer" className={className}>
        {block.text || 'Botão'}
      </a>
    );
  }

  return (
    <Link href={block.url} className={className}>
      {block.text || 'Botão'}
    </Link>
  );
}

