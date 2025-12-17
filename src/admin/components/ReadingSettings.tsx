'use client';

import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import type { Post } from '@/core/services/posts.service';
import type { ReadingSettings } from '@/core/services/settings.service';
import { showError, showSuccess } from '@/core/utils/swal';

export function ReadingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>({
    homepageType: 'posts',
    homepagePage: null,
    postsPage: null,
  });
  const [pages, setPages] = useState<Post[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchPages();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/reading');
      if (!response.ok) throw new Error('Erro ao buscar configurações');

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
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

  const handleSave = async () => {
    if (settings.homepageType === 'page' && !settings.homepagePage) {
      await showError('Selecione uma página inicial');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/settings/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar configurações');
      }

      await showSuccess('Configurações salvas com sucesso');
    } catch (error: any) {
      await showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Sua página inicial exibe
        </h2>

        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="homepageType"
              value="posts"
              checked={settings.homepageType === 'posts'}
              onChange={(e) =>
                setSettings({ ...settings, homepageType: e.target.value as 'posts' | 'page' })
              }
              className="mt-1 h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-white">
                Seus posts mais recentes
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Exibe os posts mais recentes na página inicial do site.
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="homepageType"
              value="page"
              checked={settings.homepageType === 'page'}
              onChange={(e) =>
                setSettings({ ...settings, homepageType: e.target.value as 'posts' | 'page' })
              }
              className="mt-1 h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-white">Uma página estática</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Selecione uma página para ser exibida como página inicial.
              </div>
            </div>
          </label>
        </div>
      </div>

      {settings.homepageType === 'page' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Configurações de Página Estática
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="homepagePage">Página inicial</Label>
              <Select
                id="homepagePage"
                value={settings.homepagePage || ''}
                onChange={(e) =>
                  setSettings({ ...settings, homepagePage: e.target.value || null })
                }
                className="mt-2"
              >
                <option value="">— Selecione —</option>
                {pages.map((page) => (
                  <option key={page.uuid} value={page.uuid}>
                    {page.title}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="postsPage">Página de posts</Label>
              <Select
                id="postsPage"
                value={settings.postsPage || ''}
                onChange={(e) =>
                  setSettings({ ...settings, postsPage: e.target.value || null })
                }
                className="mt-2"
              >
                <option value="">— Selecione —</option>
                {pages.map((page) => (
                  <option key={page.uuid} value={page.uuid}>
                    {page.title}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Opcional. Selecione uma página onde os posts serão exibidos.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  );
}

