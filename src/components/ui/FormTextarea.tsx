'use client';

import { useField } from 'formik';
import React from 'react';

import { FormError } from './FormError';
import { Label } from './Label';
import { Textarea } from './Textarea';

interface FormTextareaProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  textareaClassName?: string;
  [key: string]: any;
}

/**
 * Textarea integrado com Formik
 * Inclui Label, Textarea e FormError automaticamente
 */
export function FormTextarea({
  name,
  label,
  required,
  className,
  textareaClassName,
  ...props
}: FormTextareaProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <Textarea
        id={name}
        {...props}
        value={field.value ?? ''}
        onChange={(e) => {
          field.onChange(e);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
        onBlur={field.onBlur}
        error={!!hasError}
        className={textareaClassName}
      />
      <FormError error={meta.error} touched={meta.touched} />
    </div>
  );
}
