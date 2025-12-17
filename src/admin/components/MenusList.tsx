'use client';

import { Edit, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import type { Menu } from '@/core/services/menus.service';
import { showConfirmDelete, showError, showSuccess } from '@/core/utils/swal';

export function MenusList() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus');
      if (!response.ok) throw new Error('Erro ao buscar menus');

      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Erro ao buscar menus:', error);
      await showError('Erro ao carregar menus');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menu: Menu) => {
    const result = await showConfirmDelete(menu.name);
    if (!result.isConfirmed) return;

    setDeletingMenuId(menu.uuid);
    try {
      const response = await fetch(`/api/menus/${menu.uuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir menu');
      }

      await showSuccess('Menu excluído com sucesso');
      fetchMenus();
    } catch (error: any) {
      await showError(error.message);
    } finally {
      setDeletingMenuId(null);
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500">Carregando menus...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Menus</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Gerencie os menus de navegação do site
          </p>
        </div>
        <Button onClick={() => router.push('/admin/menus/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Menu
        </Button>
      </div>

      {menus.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">Nenhum menu criado ainda.</p>
          <Button
            onClick={() => router.push('/admin/menus/new')}
            className="mt-4"
          >
            Criar primeiro menu
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {menus.map((menu) => (
              <div
                key={menu.uuid}
                className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{menu.name}</h3>
                  <div className="mt-1 flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {menu.location && <span>Local: {menu.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/menus/${menu.uuid}`)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-700 dark:hover:text-indigo-400"
                    title="Editar menu"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(menu)}
                    disabled={deletingMenuId === menu.uuid}
                    className={`rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 
                      dark:hover:bg-red-900/20 dark:hover:text-red-400 ${
                      deletingMenuId === menu.uuid
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    title="Excluir menu"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

