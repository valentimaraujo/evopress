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

import { Label } from '@/components/ui/Label';

import { Toolbar } from '../Toolbar';
import type { ParagraphBlock } from '../types';

interface ParagraphSettingsProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphSettings({ block, onChange }: ParagraphSettingsProps) {
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
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] w-full p-4 rounded-lg border border-zinc-200 dark:border-zinc-700',
      },
    },
  });

  useEffect(() => {
    if (editor && block.content !== editor.getHTML()) {
      editor.commands.setContent(block.content);
    }
  }, [block.content, editor]);

  if (!mounted || !editor) {
    return <div className="text-sm text-zinc-500">Carregando editor...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Conteúdo</Label>
        <div className="mt-2 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 p-2 dark:border-zinc-700">
            <Toolbar editor={editor} />
          </div>
          <div className="min-h-[200px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}

