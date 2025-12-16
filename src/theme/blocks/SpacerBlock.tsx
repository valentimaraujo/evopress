import React from 'react';

import type { SpacerBlock } from '@/admin/components/builder/types';

interface PublicSpacerBlockProps {
  block: SpacerBlock;
}

export function PublicSpacerBlock({ block }: PublicSpacerBlockProps) {
  return <div style={{ height: `${block.height}px` }} className="w-full" />;
}

