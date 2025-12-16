'use client';

import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Dialog({ open, onClose, title, children, size = 'md' }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={clsx(
          'w-full rounded-2xl bg-white shadow-xl dark:bg-zinc-900',
          sizeStyles[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className={clsx('p-6', !title && 'pt-6')}>{children}</div>
      </div>
    </div>
  );
}

