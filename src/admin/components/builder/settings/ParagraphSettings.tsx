'use client';

import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FormikProvider, useFormik } from 'formik';
import React, { useState, useEffect } from 'react';

import { FormError } from '@/components/ui/FormError';
import { Label } from '@/components/ui/Label';
import { paragraphBlockSchema } from '@/core/validations';

import { Toolbar } from '../Toolbar';
import type { ParagraphBlock } from '../types';

interface ParagraphSettingsProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export function ParagraphSettings({ block, onChange }: ParagraphSettingsProps) {
  const [mounted, setMounted] = useState(false);

  const formik = useFormik<ParagraphBlock>({
    initialValues: block,
    validationSchema: paragraphBlockSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onChange(values);
    },
  });

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
    content: formik.values.content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      formik.setFieldValue('content', newContent);
      onChange({
        ...formik.values,
        content: newContent,
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && formik.values.content !== editor.getHTML()) {
      editor.commands.setContent(formik.values.content);
    }
  }, [formik.values.content, editor]);

  if (!mounted || !editor) {
    return <div className="text-sm text-zinc-500">Carregando editor...</div>;
  }

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="paragraph-content">Conteúdo</Label>
        <div className="mt-2 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 p-2 dark:border-zinc-700">
            <Toolbar editor={editor} />
          </div>
          <div className="min-h-[200px]">
            <EditorContent editor={editor} />
          </div>
        </div>
        <FormError error={formik.errors.content} touched={formik.touched.content} />
      </div>
      </form>
    </FormikProvider>
  );
}

