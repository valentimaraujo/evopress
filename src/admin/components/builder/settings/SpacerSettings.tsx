'use client';

import { FormikProvider, useFormik } from 'formik';
import React, { useEffect } from 'react';

import { FormInput } from '@/components/ui/FormInput';
import { spacerBlockSchema } from '@/core/validations';

import type { SpacerBlock } from '../types';

interface SpacerSettingsProps {
  block: SpacerBlock;
  onChange: (block: SpacerBlock) => void;
}

export function SpacerSettings({ block, onChange }: SpacerSettingsProps) {
  const formik = useFormik<SpacerBlock>({
    initialValues: block,
    validationSchema: spacerBlockSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onChange(values);
    },
  });

  useEffect(() => {
    if (formik.values.height !== block.height) {
      onChange(formik.values);
    }
     
  }, [formik.values.height]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormInput
          name="height"
          label="Altura (px)"
          type="number"
          required
          placeholder="40"
        />
      </form>
    </FormikProvider>
  );
}

