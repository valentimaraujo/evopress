'use client';

import { useField } from 'formik';
import React from 'react';

import { FormError } from './FormError';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface FormRadioGroupProps {
  name: string;
  options: RadioOption[];
  className?: string;
  label?: string;
}

/**
 * Grupo de radio buttons integrado com Formik
 * Inclui FormError automaticamente
 */
export function FormRadioGroup({
  name,
  options,
  className,
  label,
}: FormRadioGroupProps) {
  const [field, meta] = useField(name);

  return (
    <div className={className}>
      {label && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {label}
          </h3>
        </div>
      )}
      <div className="space-y-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={field.value === option.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="mt-1 h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-white">
                {option.label}
              </div>
              {option.description && (
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
      <FormError error={meta.error} touched={meta.touched} />
    </div>
  );
}
