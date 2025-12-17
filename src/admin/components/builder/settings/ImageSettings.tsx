'use client';

import { FormikProvider, useFormik } from 'formik';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { FormInput } from '@/components/ui/FormInput';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { showError } from '@/core/utils/swal';
import { imageBlockSchema } from '@/core/validations';

import type { ImageBlock } from '../types';

interface ImageSettingsProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
  onUpload: (file: File) => Promise<string>;
}

export function ImageSettings({ block, onChange, onUpload }: ImageSettingsProps) {
  const [uploading, setUploading] = useState(false);

  const formik = useFormik<ImageBlock>({
    initialValues: block,
    validationSchema: imageBlockSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onChange(values);
    },
  });

  useEffect(() => {
    const hasChanges = 
      formik.values.url !== block.url ||
      formik.values.alt !== block.alt;
    
    if (hasChanges) {
      onChange(formik.values);
    }
     
  }, [formik.values.url, formik.values.alt]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const uploadedUrl = await onUpload(file);
        formik.setFieldValue('url', uploadedUrl);
        onChange({ ...formik.values, url: uploadedUrl });
      } catch {
        await showError('Erro ao fazer upload da imagem.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormInput
        name="url"
        label="URL da Imagem"
        required
        placeholder="https://exemplo.com/imagem.jpg"
      />
      <FormInput
        name="alt"
        label="Texto Alternativo"
        placeholder="Descrição da imagem"
      />
      <div>
        <Label htmlFor="image-upload">Upload de Imagem</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-2"
        />
        {uploading && (
          <p className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </p>
        )}
      </div>
      {formik.values.url && (
        <div className="mt-4">
          <Label>Preview</Label>
          <div className="mt-2 flex justify-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <Image
              src={formik.values.url}
              alt={formik.values.alt || 'Imagem'}
              width={300}
              height={200}
              className="max-w-full h-auto rounded-lg"
              unoptimized
            />
          </div>
        </div>
      )}
      </form>
    </FormikProvider>
  );
}

