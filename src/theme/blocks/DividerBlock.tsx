import React from 'react';

import type { DividerBlock } from '@/admin/components/builder/types';

interface PublicDividerBlockProps {
  block: DividerBlock;
}

export function PublicDividerBlock({}: PublicDividerBlockProps) {
  return <hr className="my-8 border-t border-zinc-200 dark:border-zinc-700" />;
}

