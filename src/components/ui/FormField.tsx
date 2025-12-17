'use client';

import { useField } from 'formik';
import React from 'react';

import { FormError } from './FormError';
import { Label } from './Label';

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  children: (field: any, meta: any) => React.ReactNode;
}

/**
 * Wrapper genérico para campos de formulário com Formik
 * Fornece field, meta e renderiza Label e FormError automaticamente
 */
export function FormField({
  name,
  label,
  required,
  className,
  children,
}: FormFieldProps) {
  const [field, meta] = useField(name);

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      {children(field, meta)}
      <FormError error={meta.error} touched={meta.touched} />
    </div>
  );
}
