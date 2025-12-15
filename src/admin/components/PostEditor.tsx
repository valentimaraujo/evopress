'use client';

import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { useEditor as useTiptapEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, Code, Layout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { Post, PostStatus, PostType } from '@/core/services/posts.service';

import { BlockEditor } from './builder/BlockEditor';
import { Toolbar } from './builder/Toolbar';
import type { ContentBlock } from './builder/types';

interface PostEditorProps {
  post?: Post | null;
  mode?: 'visual' | 'simple';
}

export function PostEditor({ post, mode: initialMode = 'simple' }: PostEditorProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'visual' | 'simple'>(initialMode || 'simple');
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft');
  const [postType, setPostType] = useState<PostType>(post?.postType || 'post');
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(post?.seoKeywords?.join(', ') || '');
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    (post?.contentBlocks as ContentBlock[]) || []
  );

  const getSimpleContent = useCallback((currentBlocks: ContentBlock[]) => {
    if (post && currentBlocks.length === 0) {
      const content = post.contentBlocks?.[0];
      if (content && typeof content === 'object' && 'content' in content) {
        return (content as { content: string }).content;
      }
    }
    const paragraphBlock = currentBlocks.find((b) => b.type === 'paragraph') as
      | { content: string }
      | undefined;
    if (paragraphBlock) {
      return paragraphBlock.content;
    }
    if (currentBlocks.length > 0) {
      return currentBlocks
        .map((block) => {
          if (block.type === 'heading') {
            const { level } = block as { level: number };
            const { content } = block as { content: string };
            return `<h${level}>${content}</h${level}>`;
          }
          if (block.type === 'paragraph') {
            return (block as { content: string }).content;
          }
          return '';
        })
        .filter(Boolean)
        .join('');
    }
    return '';
  }, [post]);

  const simpleEditor = useTiptapEditor({
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
    content: getSimpleContent(blocks),
    onUpdate: ({ editor }) => {
      if (mode === 'simple') {
        const htmlContent = editor.getHTML();
        setBlocks([
          {
            id: 'simple-content',
            type: 'paragraph',
            content: htmlContent,
          },
        ]);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-full h-full w-full p-4',
        style: 'min-height: 100%; height: 100%;',
      },
    },
  });

  useEffect(() => {
    if (simpleEditor && mode === 'simple') {
      const currentContent = simpleEditor.getHTML();
      const newContent = getSimpleContent(blocks);
      // Only update if content is significantly different to avoid cursor jumps
      if (Math.abs(currentContent.length - newContent.length) > 10 || (currentContent === '<p></p>' && newContent)) {
         if (currentContent !== newContent) {
            simpleEditor.commands.setContent(newContent);
         }
      }
    }
  }, [blocks, mode, simpleEditor, getSimpleContent]);

  const handleUploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload');
    }

    const data = await response.json();
    return data.url || data.filePath;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        status,
        postType,
        contentBlocks: blocks,
        metaData: {
          editorMode: mode,
        },
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords ? seoKeywords.split(',').map((k) => k.trim()) : null,
      };

      const url = post ? `/api/posts/${post.uuid}` : '/api/posts';
      const method = post ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar');
      }

      const savedPost = await response.json();
      router.push(`/admin/posts/${savedPost.uuid}`);
      router.refresh();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o post');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post || !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleModeChange = (newMode: 'visual' | 'simple') => {
    if (newMode === mode) return;

    if (newMode === 'visual' && mode === 'simple') {
      if (simpleEditor) {
        const htmlContent = simpleEditor.getHTML();
        if (htmlContent && htmlContent !== '<p></p>') {
          setBlocks([
            {
              id: 'simple-content',
              type: 'paragraph',
              content: htmlContent,
            },
          ]);
        } else {
          setBlocks([]);
        }
      }
    } else if (newMode === 'simple' && mode === 'visual') {
      const htmlContent = getSimpleContent(blocks);
      if (simpleEditor) {
        simpleEditor.commands.setContent(htmlContent);
      }
    }
    setMode(newMode);
  };

  return (
    <div className="flex h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {post ? 'Editar Post' : 'Novo Post'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => handleModeChange('simple')}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
                  mode === 'simple'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900 dark:text-indigo-400'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300'
                }`}
                type="button"
              >
                <Code className="h-4 w-4" />
                Simples
              </button>
              <button
                onClick={() => handleModeChange('visual')}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
                  mode === 'visual'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900 dark:text-indigo-400'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300'
                }`}
                type="button"
              >
                <Layout className="h-4 w-4" />
                Visual
              </button>
            </div>
            <Button onClick={handleSave} disabled={saving} variant="primary">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full gap-6 p-6">
          {/* Main Column */}
          <div className="flex flex-1 flex-col gap-6 overflow-hidden">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" required>
                  Título
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Digite o título..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-do-post"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex flex-col h-full min-h-[500px]">
                    {mode === 'visual' ? (
                        <div className="flex-1 overflow-hidden">
                            <BlockEditor
                            blocks={blocks}
                            onChange={setBlocks}
                            onUploadImage={handleUploadImage}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            {simpleEditor && (
                                <>
                                <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                                    <Toolbar editor={simpleEditor} />
                                </div>
                                <div className="flex-1 cursor-text overflow-y-auto bg-white dark:bg-zinc-900" onClick={() => simpleEditor.commands.focus()}>
                                    <EditorContent editor={simpleEditor} className="h-full min-h-full" />
                                </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="w-80 shrink-0 space-y-6 overflow-y-auto">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
                Configurações
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PostStatus)}
                    className="mt-2"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="postType">Tipo</Label>
                  <Select
                    id="postType"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as PostType)}
                    className="mt-2"
                  >
                    <option value="post">Post</option>
                    <option value="page">Página</option>
                    <option value="custom">Custom</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Breve descrição..."
                    className="mt-2"
                    autoResize
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">SEO</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">Título SEO</Label>
                  <Input
                    id="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription">Descrição SEO</Label>
                  <Textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="mt-2"
                    autoResize
                  />
                </div>

                <div>
                  <Label htmlFor="seoKeywords">Palavras-chave</Label>
                  <Input
                    id="seoKeywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="palavra1, palavra2, palavra3"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
