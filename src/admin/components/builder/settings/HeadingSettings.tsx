'use client';

import { FormikProvider, useFormik } from 'formik';
import React, { useEffect } from 'react';

import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { headingBlockSchema } from '@/core/validations';

import type { HeadingBlock } from '../types';

interface HeadingSettingsProps {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

export function HeadingSettings({ block, onChange }: HeadingSettingsProps) {
  const formik = useFormik<HeadingBlock>({
    initialValues: block,
    validationSchema: headingBlockSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onChange(values);
    },
  });

  useEffect(() => {
    const hasChanges = 
      formik.values.level !== block.level ||
      formik.values.content !== block.content;
    
    if (hasChanges) {
      onChange(formik.values);
    }
     
  }, [formik.values.level, formik.values.content]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormSelect
          name="level"
          label="Nível do Título"
          required
          type="number"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
          <option value={6}>H6</option>
        </FormSelect>
        <FormInput
          name="content"
          label="Conteúdo"
          required
          placeholder="Digite o título..."
        />
      </form>
    </FormikProvider>
  );
}

