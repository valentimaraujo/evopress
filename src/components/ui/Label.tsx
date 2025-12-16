'use client';

import { clsx } from 'clsx';
import { type LabelHTMLAttributes, forwardRef } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          'block text-sm font-medium text-zinc-700 dark:text-zinc-300',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

