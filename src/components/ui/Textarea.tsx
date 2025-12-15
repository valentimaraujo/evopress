'use client';

import { clsx } from 'clsx';
import { type TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, autoResize = false, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize, props.value]);

    const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <textarea
        ref={textareaRef}
        className={clsx(
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm placeholder-zinc-400 transition-colors',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500',
          'resize-none',
          error &&
            'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500',
          className
        )}
        {...props}
        onChange={autoResize ? handleResize : props.onChange}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

