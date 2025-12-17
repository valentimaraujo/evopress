'use client';

import { FormikProvider, useFormik } from 'formik';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import type { Menu, MenuItem, MenuItemFlat } from '@/core/services/menus.service';
import { showError, showSuccess } from '@/core/utils/swal';
import { menuSchema, type MenuFormValues } from '@/core/validations';

import { AddMenuItemsPanel } from './AddMenuItemsPanel';
import { MenuItemsList } from './MenuItemsList';

interface MenuEditorProps {
  menu: Menu | null;
  onSave: () => void;
}

export function MenuEditor({ menu, onSave }: MenuEditorProps) {
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(menu);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [flatItems, setFlatItems] = useState<MenuItemFlat[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuCreated, setMenuCreated] = useState(menu !== null);

  const formik = useFormik<MenuFormValues>({
    initialValues: {
      name: menu?.name || '',
      location: menu?.location || 'header',
    },
    validationSchema: menuSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!currentMenu) {
          const response = await fetch('/api/menus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: values.name.trim(),
              location: values.location || null,
            }),
          });

          if (!response.ok) {
            let errorMessage = 'Erro ao criar menu';
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch {
              errorMessage = `Erro ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const newMenu = await response.json();
          setCurrentMenu(newMenu);
          setMenuCreated(true);
          await showSuccess('Menu criado com sucesso');
          await fetchMenuItems();
        } else {
          const response = await fetch(`/api/menus/${currentMenu.uuid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: values.name.trim(),
              location: values.location || null,
            }),
          });

          if (!response.ok) throw new Error('Erro ao salvar menu');

          const updatedMenu = await response.json();
          setCurrentMenu(updatedMenu);
          await showSuccess('Menu salvo com sucesso');
          onSave();
        }
      } catch (error: unknown) {
        console.error('Erro ao salvar menu:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar menu';
        await showError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (menu) {
      setCurrentMenu(menu);
      formik.setValues({
        name: menu.name || '',
        location: menu.location || 'header',
      });
      setMenuCreated(true);
      fetchMenuItems();
    } else {
      setCurrentMenu(null);
      setMenuCreated(false);
      setItems([]);
      setFlatItems([]);
      formik.setValues({
        name: '',
        location: 'header',
      });
    }
     
  }, [menu]);

  const fetchMenuItems = async () => {
    if (!currentMenu) return;

    setLoading(true);
    try {
      const [hierarchicalResponse, flatResponse] = await Promise.all([
        fetch(`/api/menus/${currentMenu.uuid}/items`),
        fetch(`/api/menus/${currentMenu.uuid}/items?flat=true`),
      ]);

      if (!hierarchicalResponse.ok || !flatResponse.ok) {
        throw new Error('Erro ao buscar itens do menu');
      }

      const hierarchicalData = await hierarchicalResponse.json();
      const flatData = await flatResponse.json();

      setItems(hierarchicalData);
      setFlatItems(flatData);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      await showError('Erro ao carregar itens do menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItems = async (pageUuids: string[]) => {
    if (!currentMenu) return;

    try {
      const newItems = pageUuids.map((pageUuid, index) => ({
        menuUuid: currentMenu.uuid,
        pageUuid,
        order: flatItems.length + index,
        parentUuid: null,
      }));

      const response = await fetch(`/api/menus/${currentMenu.uuid}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItems),
      });

      if (!response.ok) throw new Error('Erro ao adicionar itens');

      await fetchMenuItems();
    } catch (error) {
      console.error('Erro ao adicionar itens:', error);
      await showError('Erro ao adicionar itens ao menu');
    }
  };

  const handleUpdateItem = async (
    uuid: string,
    updates: { label?: string; parentUuid?: string | null; order?: number }
  ) => {
    if (!currentMenu) return;

    try {
      const response = await fetch(`/api/menus/items/${uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Erro ao atualizar item');

      await fetchMenuItems();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      await showError('Erro ao atualizar item');
    }
  };

  const handleMoveItem = async (uuid: string, direction: 'up' | 'down' | 'top' | 'under', targetUuid?: string) => {
    if (!currentMenu) return;

    try {
      const response = await fetch(`/api/menus/${currentMenu.uuid}/items/${uuid}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, targetUuid }),
      });

      if (!response.ok) throw new Error('Erro ao mover item');

      await fetchMenuItems();
    } catch (error) {
      console.error('Erro ao mover item:', error);
      await showError('Erro ao mover item');
    }
  };

  const handleRemoveItem = async (uuid: string) => {
    if (!currentMenu) return;

    try {
      const response = await fetch(`/api/menus/items/${uuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao remover item');

      await fetchMenuItems();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      await showError('Erro ao remover item');
    }
  };

  const handleReorder = async (reorderedItems: Array<{ uuid: string; order: number; parentUuid: string | null }>) => {
    if (!currentMenu) return;

    try {
      const response = await fetch(`/api/menus/${currentMenu.uuid}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderedItems),
      });

      if (!response.ok) throw new Error('Erro ao reordenar itens');

      await fetchMenuItems();
    } catch (error) {
      console.error('Erro ao reordenar itens:', error);
      await showError('Erro ao reordenar itens');
    }
  };


  return (
    <FormikProvider value={formik}>
      <div className="space-y-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Configurações do Menu</h2>
            <div className="space-y-4">
              <FormInput
                name="name"
                label="Nome do menu"
                required
                placeholder="Menu Principal"
                disabled={formik.isSubmitting}
              />
              <FormSelect
                name="location"
                label="Local de exibição"
                disabled={formik.isSubmitting}
              >
                <option value="header">Header Menu</option>
                <option value="footer">Footer Menu</option>
              </FormSelect>
            </div>
          </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={menuCreated && currentMenu ? '' : 'opacity-50 pointer-events-none'}>
            <AddMenuItemsPanel onAddItems={handleAddItems} />
          </div>
          <div className={`rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 ${menuCreated && currentMenu ? '' : 'opacity-50'}`}>
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Estrutura do menu</h3>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Arraste os itens para colocá-los na ordem desejada. Clique na seta à direita do item
              para mostrar opções de configuração adicionais.
            </p>

            {!menuCreated || !currentMenu ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                Salve o menu para começar a adicionar páginas.
              </div>
            ) : loading ? (
              <div className="py-8 text-center text-sm text-zinc-500">Carregando itens...</div>
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                Nenhum item no menu. Adicione páginas usando o painel à esquerda.
              </div>
            ) : (
              <MenuItemsList
                items={items}
                flatItems={flatItems}
                onUpdate={handleUpdateItem}
                onMove={handleMoveItem}
                onRemove={handleRemoveItem}
                onReorder={handleReorder}
              />
            )}
          </div>
        </div>

          <div className="flex justify-between">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  {currentMenu ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                currentMenu ? 'Salvar menu' : 'Criar menu'
              )}
            </Button>
          </div>
        </form>
      </div>
    </FormikProvider>
  );
}

