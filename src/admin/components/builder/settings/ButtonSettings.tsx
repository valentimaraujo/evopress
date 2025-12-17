'use client';

import { FormikProvider, useFormik } from 'formik';
import React, { useEffect } from 'react';

import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { buttonBlockSchema } from '@/core/validations';

import type { ButtonBlock } from '../types';

interface ButtonSettingsProps {
  block: ButtonBlock;
  onChange: (block: ButtonBlock) => void;
}

export function ButtonSettings({ block, onChange }: ButtonSettingsProps) {
  const formik = useFormik<ButtonBlock>({
    initialValues: block,
    validationSchema: buttonBlockSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onChange(values);
    },
  });

  useEffect(() => {
    const hasChanges = 
      formik.values.text !== block.text ||
      formik.values.url !== block.url ||
      formik.values.variant !== block.variant;
    
    if (hasChanges) {
      onChange(formik.values);
    }
     
  }, [formik.values.text, formik.values.url, formik.values.variant]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormInput
          name="text"
          label="Texto do Botão"
          required
          placeholder="Clique aqui"
        />
        <FormInput
          name="url"
          label="URL"
          required
          placeholder="https://..."
        />
        <FormSelect
          name="variant"
          label="Variante"
          required
        >
          <option value="primary">Primário</option>
          <option value="secondary">Secundário</option>
        </FormSelect>
      </form>
    </FormikProvider>
  );
}

