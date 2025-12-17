'use client';

import { FormikProvider, useFormik } from 'formik';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { FormRadioGroup } from '@/components/ui/FormRadioGroup';
import { FormSelect } from '@/components/ui/FormSelect';
import type { Post } from '@/core/services/posts.service';
import { showError, showSuccess } from '@/core/utils/swal';
import { readingSettingsSchema, type ReadingSettingsFormValues } from '@/core/validations';

export function ReadingSettings() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Post[]>([]);

  const formik = useFormik<ReadingSettingsFormValues>({
    initialValues: {
      homepageType: 'posts',
      homepagePage: null,
      postsPage: null,
    },
    validationSchema: readingSettingsSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch('/api/settings/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao salvar configurações');
        }

        await showSuccess('Configurações salvas com sucesso');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações';
        await showError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    fetchSettings();
    fetchPages();
     
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/reading');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      formik.setValues({
        homepageType: data.homepageType || 'posts',
        homepagePage: data.homepagePage || null,
        postsPage: data.postsPage || null,
      });
    } catch (error: unknown) {
      console.error('Erro ao buscar configurações:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar configurações. Tente recarregar a página.';
      await showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages/available?limit=100');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500">Carregando configurações...</div>;
  }

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <FormRadioGroup
            name="homepageType"
            label="Sua página inicial exibe"
            options={[
              {
                value: 'posts',
                label: 'Seus posts mais recentes',
                description: 'Exibe os posts mais recentes na página inicial do site.',
              },
              {
                value: 'page',
                label: 'Uma página estática',
                description: 'Selecione uma página para ser exibida como página inicial.',
              },
            ]}
          />
        </div>

        {formik.values.homepageType === 'page' && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              Configurações de Página Estática
            </h3>

            <div className="space-y-4">
              <FormSelect
                name="homepagePage"
                label="Página inicial"
                required
                className="mt-2"
              >
                <option value="">— Selecione —</option>
                {pages.map((page) => (
                  <option key={page.uuid} value={page.uuid}>
                    {page.title}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                name="postsPage"
                label="Página de posts"
                className="mt-2"
              >
                <option value="">— Selecione —</option>
                {pages.map((page) => (
                  <option key={page.uuid} value={page.uuid}>
                    {page.title}
                  </option>
                ))}
              </FormSelect>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Opcional. Selecione uma página onde os posts serão exibidos.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <>
                <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Salvando...
              </>
            ) : (
              'Salvar alterações'
            )}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}

