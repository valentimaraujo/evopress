'use client';

import { useField } from 'formik';
import React from 'react';

import { FormError } from './FormError';
import { Input } from './Input';
import { Label } from './Label';

interface FormInputProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  [key: string]: any;
}

/**
 * Input integrado com Formik
 * Inclui Label, Input e FormError automaticamente
 */
export function FormInput({
  name,
  label,
  required,
  className,
  inputClassName,
  ...props
}: FormInputProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <Input
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
        className={inputClassName}
      />
      <FormError error={meta.error} touched={meta.touched} />
    </div>
  );
}
