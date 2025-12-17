'use client';

import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { showSuccess, showError } from '@/core/utils/swal';

interface Theme {
  name: string;
  metadata: {
    name: string;
    version: string;
    description?: string;
    author?: string;
  } | null;
}

interface ThemesListProps {
  onThemeActivated?: () => void;
}

export function ThemesList({ onThemeActivated }: ThemesListProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      if (!response.ok) {
        throw new Error('Erro ao buscar temas');
      }

      const data = await response.json();
      setThemes(data.themes || []);
      setActiveTheme(data.activeTheme || 'base');
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      await showError('Erro ao carregar temas');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTheme = async (themeName: string) => {
    if (themeName === activeTheme) {
      return;
    }

    setActivating(themeName);
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao ativar tema');
      }

      await showSuccess('Tema ativado com sucesso');
      setActiveTheme(themeName);
      onThemeActivated?.();
    } catch (error: any) {
      console.error('Erro ao ativar tema:', error);
      await showError(error.message || 'Erro ao ativar tema');
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">Carregando temas...</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Temas Disponíveis
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className={`rounded-lg border p-4 ${
                theme.name === activeTheme
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                  : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {theme.metadata?.name || theme.name}
                </h3>
                {theme.name === activeTheme && (
                  <span className="rounded-full bg-indigo-500 px-2 py-1 text-xs text-white">
                    Ativo
                  </span>
                )}
              </div>
              {theme.metadata && (
                <div className="mb-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>Versão: {theme.metadata.version}</p>
                  {theme.metadata.description && (
                    <p className="text-xs">{theme.metadata.description}</p>
                  )}
                  {theme.metadata.author && (
                    <p className="text-xs">Por: {theme.metadata.author}</p>
                  )}
                </div>
              )}
              <Button
                onClick={() => handleActivateTheme(theme.name)}
                disabled={theme.name === activeTheme || activating === theme.name}
                variant={theme.name === activeTheme ? 'primary' : 'secondary'}
                className="w-full"
              >
                {activating === theme.name ? (
                  <>
                    <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Ativando...
                  </>
                ) : theme.name === activeTheme ? (
                  'Ativo'
                ) : (
                  'Ativar Tema'
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

