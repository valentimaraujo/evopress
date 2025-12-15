'use client';

import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Input } from '@/components/ui/Input';

import type { ImageBlock } from '../types';

interface ImageBlockProps {
  block: ImageBlock;
  isEditing: boolean;
  onChange: (block: ImageBlock) => void;
  onUpload: (file: File) => Promise<string>;
}

export function ImageBlock({ block, isEditing, onChange, onUpload }: ImageBlockProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await onUpload(file);
        onChange({ ...block, url });
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        alert('Erro ao fazer upload da imagem.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            URL da Imagem
          </label>
          <Input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Texto Alternativo
          </label>
          <Input
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="Descrição da imagem"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Upload de Imagem
          </label>
          <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          {uploading && (
            <p className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      {block.url ? (
        <Image
          src={block.url}
          alt={block.alt || 'Imagem'}
          width={800}
          height={600}
          className="max-w-full h-auto rounded-lg shadow-sm"
          unoptimized
        />
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}
