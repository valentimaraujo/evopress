'use client';

import { clsx } from 'clsx';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
      secondary:
        'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 focus:ring-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600',
      ghost:
        'bg-transparent text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-800',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

