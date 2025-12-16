'use client';

import React, { useState, useRef, useEffect } from 'react';

import type { HeadingBlock } from '../types';

interface HeadingBlockProps {
  block: HeadingBlock;
  isEditing: boolean;
  onChange: (block: HeadingBlock) => void;
}

export function HeadingBlock({ block, isEditing, onChange }: HeadingBlockProps) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  useEffect(() => {
    if (isInlineEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isInlineEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      return;
    }
    e.stopPropagation();
    setIsInlineEditing(true);
  };

  const handleBlur = () => {
    setIsInlineEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setIsInlineEditing(false);
    }
  };

  if (isEditing && isInlineEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${sizeClasses[block.level]} font-bold border-2 border-indigo-500 rounded px-2 py-1 w-full 
        bg-white dark:bg-zinc-900`}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  const className = `${sizeClasses[block.level]} font-bold ${isEditing ? 'cursor-text hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded px-1' : ''}`;
  const props = { className, onClick: handleClick };

  switch (block.level) {
    case 1:
      return <h1 {...props}>{block.content}</h1>;
    case 2:
      return <h2 {...props}>{block.content}</h2>;
    case 3:
      return <h3 {...props}>{block.content}</h3>;
    case 4:
      return <h4 {...props}>{block.content}</h4>;
    case 5:
      return <h5 {...props}>{block.content}</h5>;
    case 6:
      return <h6 {...props}>{block.content}</h6>;
    default:
      return <h2 {...props}>{block.content}</h2>;
  }
}
