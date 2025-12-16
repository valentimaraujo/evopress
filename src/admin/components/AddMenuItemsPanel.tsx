'use client';

import { Search } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Post } from '@/core/services/posts.service';
import { showSuccess } from '@/core/utils/swal';

interface AddMenuItemsPanelProps {
  onAddItems: (pageUuids: string[]) => Promise<void>;
}

type TabType = 'recent' | 'all' | 'search';

export function AddMenuItemsPanel({ onAddItems }: AddMenuItemsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [pages, setPages] = useState<Post[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPages = useCallback(async (tab: TabType, page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.set('search', search);
      }
      params.set('limit', '10');
      params.set('offset', String((page - 1) * 10));

      const response = await fetch(`/api/pages/available?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar páginas');

      const data = await response.json();
      if (page === 1) {
        setPages(data);
      } else {
        setPages((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === 10);
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'recent' || activeTab === 'all') {
      fetchPages(activeTab, 1);
    }
  }, [activeTab, fetchPages]);

  useEffect(() => {
    if (activeTab === 'search' && searchQuery) {
      const timeoutId = setTimeout(() => {
        fetchPages('search', 1, searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (activeTab === 'search' && !searchQuery) {
      setPages([]);
    }
  }, [searchQuery, activeTab, fetchPages]);

  const handleSelectPage = (pageUuid: string) => {
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageUuid)) {
        newSet.delete(pageUuid);
      } else {
        newSet.add(pageUuid);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPages.size === pages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(pages.map((p) => p.uuid)));
    }
  };

  const handleAddToMenu = async () => {
    if (selectedPages.size === 0) return;

    try {
      await onAddItems(Array.from(selectedPages));
      setSelectedPages(new Set());
      await showSuccess('Páginas adicionadas ao menu');
    } catch (error) {
      console.error('Erro ao adicionar páginas:', error);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPages(activeTab, nextPage, activeTab === 'search' ? searchQuery : undefined);
    }
  };

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        Adicionar itens no menu
      </h3>

      <div className="mb-4">
        <div className="flex border-b border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Mais recentes
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Ver tudo
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Pesquisar
          </button>
        </div>
      </div>

      {activeTab === 'search' && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Pesquisar páginas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <div className="mb-4 max-h-96 space-y-2 overflow-y-auto">
        {loading && pages.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">Carregando...</div>
        ) : pages.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">
            {activeTab === 'search' ? 'Nenhuma página encontrada' : 'Nenhuma página disponível'}
          </div>
        ) : (
          pages.map((page) => (
            <label
              key={page.uuid}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <input
                type="checkbox"
                checked={selectedPages.has(page.uuid)}
                onChange={() => handleSelectPage(page.uuid)}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="font-medium text-zinc-900 dark:text-white">{page.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{page.slug}</div>
              </div>
            </label>
          ))
        )}

        {hasMore && pages.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        )}
      </div>

      {pages.length > 0 && (
        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <label className="mb-3 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={selectedPages.size === pages.length && pages.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Selecionar todos</span>
          </label>
          <Button
            onClick={handleAddToMenu}
            disabled={selectedPages.size === 0}
            className="w-full"
          >
            Adicionar ao menu
          </Button>
        </div>
      )}
    </div>
  );
}

