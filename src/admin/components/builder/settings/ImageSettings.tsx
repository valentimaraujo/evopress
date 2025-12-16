'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { showError } from '@/core/utils/swal';

import type { ImageBlock } from '../types';

interface ImageSettingsProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
  onUpload: (file: File) => Promise<string>;
}

export function ImageSettings({ block, onChange, onUpload }: ImageSettingsProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await onUpload(file);
        onChange({ ...block, url });
      } catch {
        await showError('Erro ao fazer upload da imagem.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-url">URL da Imagem</Label>
        <Input
          id="image-url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
      <div>
        <Label htmlFor="image-alt">Texto Alternativo</Label>
        <Input
          id="image-alt"
          value={block.alt}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
          placeholder="Descrição da imagem"
        />
      </div>
      <div>
        <Label htmlFor="image-upload">Upload de Imagem</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <p className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </p>
        )}
      </div>
      {block.url && (
        <div className="mt-4">
          <Label>Preview</Label>
          <div className="mt-2 flex justify-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <Image
              src={block.url}
              alt={block.alt || 'Imagem'}
              width={300}
              height={200}
              className="max-w-full h-auto rounded-lg"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}

