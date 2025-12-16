import Image from 'next/image';
import React from 'react';

import type { ImageBlock } from '@/admin/components/builder/types';

interface PublicImageBlockProps {
  block: ImageBlock;
}

export function PublicImageBlock({ block }: PublicImageBlockProps) {
  if (!block.url) {
    return null;
  }

  return (
    <div className="relative my-4 flex justify-center">
      <Image
        src={block.url}
        alt={block.alt || 'Imagem'}
        width={800}
        height={600}
        className="max-w-full h-auto rounded-lg"
        unoptimized
      />
    </div>
  );
}

