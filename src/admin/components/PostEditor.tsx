'use client';

import { useEditor as useTiptapEditor, EditorContent } from '@tiptap/react';
import { FormikProvider, useFormik } from 'formik';
import { Save, Code, Layout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTextarea } from '@/components/ui/FormTextarea';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type { Post, PostStatus, PostType } from '@/core/services/posts.service';
import { showError } from '@/core/utils/swal';
import { postSchema, type PostFormValues } from '@/core/validations';

import { BlockEditor } from './builder/BlockEditor';
import { Toolbar } from './builder/Toolbar';
import type { ContentBlock } from './builder/types';
import { blocksToHtml } from './builder/utils/content-converter';
import { getTiptapExtensions } from './builder/utils/tiptap-extensions';

interface PostEditorProps {
  post?: Post | null;
  mode?: 'visual' | 'simple';
  defaultPostType?: PostType;
}

export function PostEditor({ post, mode: initialMode = 'simple', defaultPostType }: PostEditorProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'visual' | 'simple'>(initialMode || 'simple');
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    (post?.contentBlocks as ContentBlock[]) || []
  );
  const [isHomepage, setIsHomepage] = useState(
    (post?.metaData as Record<string, unknown>)?.isHomepage === true
  );

  const formik = useFormik<PostFormValues>({
    initialValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || null,
      status: (post?.status || 'draft') as PostStatus,
      postType: (post?.postType || defaultPostType || 'post') as PostType,
      seoTitle: post?.seoTitle || null,
      seoDescription: post?.seoDescription || null,
      seoKeywords: post?.seoKeywords || null,
      contentBlocks: blocks,
      metaData: post?.metaData || null,
    },
    validationSchema: postSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const finalSlug = values.slug || (values.title ? generateSlug(values.title) : 'post-' + Date.now());

        const payload = {
          title: values.title,
          slug: finalSlug,
          excerpt: values.excerpt || null,
          status: values.status || 'draft',
          postType: values.postType || 'post',
          contentBlocks: blocks,
          metaData: {
            editorMode: mode,
            isHomepage: values.postType === 'page' && isHomepage ? true : undefined,
          },
          seoTitle: values.seoTitle || null,
          seoDescription: values.seoDescription || null,
          seoKeywords: values.seoKeywords && values.seoKeywords.length > 0 ? values.seoKeywords : null,
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

        if (values.postType === 'page' && isHomepage && savedPost.uuid) {
          try {
            await fetch('/api/settings/homepage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pageUuid: savedPost.uuid }),
            });
          } catch {
            // Silenciosamente falha se não conseguir definir homepage
          }
        }

        const basePath = savedPost.postType === 'page' ? '/admin/pages' : '/admin/posts';
        router.push(`${basePath}/${savedPost.uuid}`);
        router.refresh();
      } catch (error: any) {
        await showError(error.message || 'Erro ao salvar o post');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const simpleEditor = useTiptapEditor({
    extensions: getTiptapExtensions(),
    immediatelyRender: false,
    content: blocksToHtml(blocks),
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
      const newContent = blocksToHtml(blocks);
      if (currentContent !== newContent && newContent) {
        simpleEditor.commands.setContent(newContent);
      }
    }
  }, [blocks, mode, simpleEditor]);

  useEffect(() => {
    if (post) {
      formik.setValues({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || null,
        status: (post.status || 'draft') as PostStatus,
        postType: (post.postType || defaultPostType || 'post') as PostType,
        seoTitle: post.seoTitle || null,
        seoDescription: post.seoDescription || null,
        seoKeywords: post.seoKeywords || null,
        contentBlocks: blocks,
        metaData: post.metaData || null,
      });
      const metaData = post.metaData as Record<string, unknown> | null;
      setIsHomepage(metaData?.isHomepage === true);
    }
     
  }, [post]);

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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('title', e.target.value);
    if (!post || !formik.values.slug) {
      formik.setFieldValue('slug', generateSlug(e.target.value));
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
      const htmlContent = blocksToHtml(blocks);
      if (simpleEditor && htmlContent) {
        simpleEditor.commands.setContent(htmlContent);
      }
    }
    setMode(newMode);
  };

  return (
    <FormikProvider value={formik}>
      <div className="flex h-full flex-col bg-zinc-50 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {post ? (post.postType === 'page' ? 'Editar Página' : 'Editar Post') : (defaultPostType === 'page' ? 'Nova Página' : 'Novo Post')}
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
            <Button onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting} variant="primary">
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full gap-6 p-6 overflow-hidden">
          <div className="flex flex-1 flex-col gap-6 overflow-hidden">
            <div className="space-y-4">
              <FormInput
                name="title"
                label="Título"
                required
                placeholder="Digite o título..."
                onChange={handleTitleChange}
              />

              <FormInput
                name="slug"
                label="Slug"
                required
                placeholder="url-do-post"
              />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex flex-col h-full">
                {mode === 'visual' ? (
                  <div className="flex-1 overflow-hidden">
                    <BlockEditor blocks={blocks} onChange={setBlocks} onUploadImage={handleUploadImage} />
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {simpleEditor && (
                      <>
                        <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                          <Toolbar editor={simpleEditor} />
                        </div>
                        <div
                          className="flex-1 cursor-text overflow-y-auto bg-white dark:bg-zinc-900"
                          onClick={() => simpleEditor.commands.focus()}
                        >
                          <EditorContent editor={simpleEditor} className="h-full min-h-full" />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-80 shrink-0 space-y-6 overflow-y-auto">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
                Configurações
              </h3>
              <div className="space-y-4">
                <FormSelect
                  name="status"
                  label="Status"
                  required
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </FormSelect>

                {!defaultPostType && (
                  <FormSelect
                    name="postType"
                    label="Tipo"
                    required
                  >
                    <option value="post">Post</option>
                    <option value="page">Página</option>
                  </FormSelect>
                )}

                <FormTextarea
                  name="excerpt"
                  label="Resumo"
                  placeholder="Breve descrição..."
                  autoResize
                />

                {formik.values.postType === 'page' && (
                  <div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isHomepage}
                        onChange={(e) => setIsHomepage(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Definir como página inicial
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">SEO</h3>
              <div className="space-y-4">
                <FormInput
                  name="seoTitle"
                  label="Título SEO"
                />

                <FormTextarea
                  name="seoDescription"
                  label="Descrição SEO"
                  autoResize
                />

                <div>
                  <Label htmlFor="seoKeywords">Palavras-chave</Label>
                  <Input
                    id="seoKeywords"
                    value={formik.values.seoKeywords?.join(', ') || ''}
                    onChange={(e) => {
                      const keywords = e.target.value
                        ? e.target.value.split(',').map((k) => k.trim()).filter((k) => k.length > 0)
                        : null;
                      formik.setFieldValue('seoKeywords', keywords);
                    }}
                    placeholder="palavra1, palavra2, palavra3"
                    className="mt-2"
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Separe as palavras-chave por vírgulas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </FormikProvider>
  );
}
