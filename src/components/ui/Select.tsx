'use client';

import { clsx } from 'clsx';
import { type SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-colors',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-white',
          error &&
            'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500',
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';

