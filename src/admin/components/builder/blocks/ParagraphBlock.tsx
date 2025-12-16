'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import React, { useState, useEffect } from 'react';

import { Toolbar } from '../Toolbar';
import type { ParagraphBlock } from '../types';
import { getTiptapExtensions } from '../utils/tiptap-extensions';

interface ParagraphBlockProps {
  block: ParagraphBlock;
  isEditing: boolean;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphBlock({ block, isEditing, onChange }: ParagraphBlockProps) {
  const [mounted, setMounted] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: getTiptapExtensions(),
    immediatelyRender: false,
    content: block.content,
    onUpdate: ({ editor }) => {
      onChange({
        ...block,
        content: editor.getHTML(),
      });
    },
    editable: isEditing && isInlineEditing,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] w-full p-2 rounded-lg border-2 border-indigo-500 bg-white dark:bg-zinc-900',
      },
    },
  });

  useEffect(() => {
    if (editor && block.content !== editor.getHTML()) {
      editor.commands.setContent(block.content);
    }
  }, [block.content, editor]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      return;
    }
    e.stopPropagation();
    setIsInlineEditing(true);
    if (editor) {
      editor.setEditable(true);
    }
  };

  const handleBlur = () => {
    setIsInlineEditing(false);
    if (editor) {
      editor.setEditable(false);
    }
  };

  if (!mounted || !editor) {
    return (
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: block.content || '<p></p>' }}
      />
    );
  }

  if (isEditing && isInlineEditing) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
          <Toolbar editor={editor} />
        </div>
        <div onBlur={handleBlur}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${isEditing ? 'cursor-text hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded px-2 py-1' : ''}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: block.content || '<p></p>' }}
    />
  );
}
