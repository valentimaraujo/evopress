'use client';

import { useField } from 'formik';
import React from 'react';

import { FormError } from './FormError';
import { Label } from './Label';
import { Select } from './Select';

interface FormSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  selectClassName?: string;
  type?: 'string' | 'number';
  children: React.ReactNode;
  [key: string]: any;
}

/**
 * Select integrado com Formik
 * Inclui Label, Select e FormError automaticamente
 */
export function FormSelect({
  name,
  label,
  required,
  className,
  selectClassName,
  type = 'string',
  children,
  ...props
}: FormSelectProps) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value: any = e.target.value;
    
    // Se o campo espera um número, converter
    if (type === 'number') {
      value = value === '' ? null : Number(value);
    } else {
      value = value === '' ? null : value;
    }
    
    helpers.setValue(value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      <Select
        id={name}
        {...props}
        value={String(field.value ?? '')}
        onChange={handleChange}
        onBlur={field.onBlur}
        error={!!hasError}
        className={selectClassName}
      >
        {children}
      </Select>
      <FormError error={meta.error} touched={meta.touched} />
    </div>
  );
}
