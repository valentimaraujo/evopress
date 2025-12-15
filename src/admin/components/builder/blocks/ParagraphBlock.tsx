'use client';

import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState, useEffect } from 'react';

import { Toolbar } from '../Toolbar';
import type { ParagraphBlock } from '../types';

interface ParagraphBlockProps {
  block: ParagraphBlock;
  isEditing: boolean;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphBlock({ block, isEditing, onChange }: ParagraphBlockProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline hover:text-indigo-700',
        },
      }),
    ],
    immediatelyRender: false,
    content: block.content,
    onUpdate: ({ editor }) => {
      onChange({
        ...block,
        content: editor.getHTML(),
      });
    },
    editable: isEditing,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] w-full p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && !isEditing) {
      editor.setEditable(false);
    } else if (editor && isEditing) {
      editor.setEditable(true);
      editor.commands.focus();
    }
  }, [editor, isEditing]);

  if (!mounted || !editor) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: block.content || '<p></p>' }}
          className="min-h-[100px] p-4"
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="w-full rounded-lg border-2 border-indigo-400 bg-white dark:border-indigo-500 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-2 dark:border-zinc-700">
          <Toolbar editor={editor} />
        </div>
        <div className="min-h-[100px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none min-h-[100px] cursor-pointer rounded-lg border-2 border-transparent p-4 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
      onClick={() => {
        // Trigger parent selection logic, handled by the BlockWrapper click mostly
      }}
      dangerouslySetInnerHTML={{ __html: block.content || '<p></p>' }}
    />
  );
}
