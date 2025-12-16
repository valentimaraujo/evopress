'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  Highlighter,
  Eraser,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface ToolbarProps {
  editor: Editor | null;
}

const TEXT_COLORS = [
  { label: 'Preto', value: '#000000' },
  { label: 'Vermelho', value: '#ef4444' },
  { label: 'Laranja', value: '#f97316' },
  { label: 'Amarelo', value: '#eab308' },
  { label: 'Verde', value: '#22c55e' },
  { label: 'Azul', value: '#3b82f6' },
  { label: 'Roxo', value: '#a855f7' },
  { label: 'Rosa', value: '#ec4899' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Amarelo', value: '#fef08a' },
  { label: 'Verde', value: '#dcfce7' },
  { label: 'Azul', value: '#dbeafe' },
  { label: 'Rosa', value: '#fce7f3' },
  { label: 'Laranja', value: '#fed7aa' },
];

export function Toolbar({ editor }: ToolbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'color' | 'highlight'>('none');
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveDropdown('none');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const toggleDropdown = (dropdown: 'color' | 'highlight') => {
    setActiveDropdown(activeDropdown === dropdown ? 'none' : dropdown);
  };

  return (
    <div ref={toolbarRef} className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Formatting */}
      <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('bold')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Negrito"
          type="button"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('italic')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Itálico"
          type="button"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('underline')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Sublinhado"
          type="button"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('strike')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Riscado"
          type="button"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </div>

      {/* Colors */}
      <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        <div className="relative">
          <button
            onClick={() => toggleDropdown('color')}
            className={`rounded p-1.5 transition-colors ${
              editor.isActive('textStyle', { color: /.*/ }) || activeDropdown === 'color'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
            }`}
            title="Cor do texto"
            type="button"
          >
            <Palette className="h-4 w-4" />
          </button>
          {activeDropdown === 'color' && (
            <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="grid grid-cols-4 gap-1">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run();
                      setActiveDropdown('none');
                    }}
                    className="h-8 w-8 rounded border-2 border-zinc-200 transition-transform hover:scale-110 dark:border-zinc-700"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                    type="button"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => toggleDropdown('highlight')}
            className={`rounded p-1.5 transition-colors ${
              editor.isActive('highlight') || activeDropdown === 'highlight'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
            }`}
            title="Destaque"
            type="button"
          >
            <Highlighter className="h-4 w-4" />
          </button>
          {activeDropdown === 'highlight' && (
            <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="grid grid-cols-4 gap-1">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: color.value }).run();
                      setActiveDropdown('none');
                    }}
                    className="h-8 w-8 rounded border-2 border-zinc-200 transition-transform hover:scale-110 dark:border-zinc-700"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                    type="button"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive({ textAlign: 'left' })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Esquerda"
          type="button"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive({ textAlign: 'center' })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Centro"
          type="button"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive({ textAlign: 'right' })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Direita"
          type="button"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive({ textAlign: 'justify' })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Justificado"
          type="button"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Título 1"
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Título 2"
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Título 3"
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Lista com marcadores"
          type="button"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Lista numerada"
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      {/* Misc */}
      <div className="flex items-center gap-1">
        <button
          onClick={setLink}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('link')
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
          }`}
          title="Link"
          type="button"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="rounded p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          title="Limpar formatação"
          type="button"
        >
          <Eraser className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
