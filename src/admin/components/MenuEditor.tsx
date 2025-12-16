'use client';

import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import type { Menu, MenuItem, MenuItemFlat } from '@/core/services/menus.service';
import { showError, showSuccess } from '@/core/utils/swal';

import { AddMenuItemsPanel } from './AddMenuItemsPanel';
import { MenuItemsList } from './MenuItemsList';

interface MenuEditorProps {
  menu: Menu | null;
  onSave: () => void;
}

export function MenuEditor({ menu, onSave }: MenuEditorProps) {
  const [menuName, setMenuName] = useState(menu?.name || '');
  const [menuSlug, setMenuSlug] = useState(menu?.slug || '');
  const [menuDescription, setMenuDescription] = useState(menu?.description || '');
  const [menuLocation, setMenuLocation] = useState(menu?.location || 'header');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [flatItems, setFlatItems] = useState<MenuItemFlat[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (menu) {
      setMenuName(menu.name);
      setMenuSlug(menu.slug);
      setMenuDescription(menu.description || '');
      setMenuLocation(menu.location || 'header');
      fetchMenuItems();
    }
  }, [menu]);

  const fetchMenuItems = async () => {
    if (!menu) return;

    setLoading(true);
    try {
      const [hierarchicalResponse, flatResponse] = await Promise.all([
        fetch(`/api/menus/${menu.uuid}/items`),
        fetch(`/api/menus/${menu.uuid}/items?flat=true`),
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
    if (!menu) return;

    try {
      const newItems = pageUuids.map((pageUuid, index) => ({
        menuUuid: menu.uuid,
        pageUuid,
        order: flatItems.length + index,
        parentUuid: null,
      }));

      const response = await fetch(`/api/menus/${menu.uuid}/items`, {
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
    if (!menu) return;

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
    if (!menu) return;

    try {
      const response = await fetch(`/api/menus/${menu.uuid}/items/${uuid}/move`, {
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
    if (!menu) return;

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
    if (!menu) return;

    try {
      const response = await fetch(`/api/menus/${menu.uuid}/reorder`, {
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

  const handleSaveMenu = async () => {
    if (!menu) return;

    if (!menuName.trim()) {
      await showError('O nome do menu é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/menus/${menu.uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuName,
          slug: menuSlug,
          description: menuDescription || null,
          location: menuLocation || null,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar menu');

      await showSuccess('Menu salvo com sucesso');
      onSave();
    } catch (error) {
      console.error('Erro ao salvar menu:', error);
      await showError('Erro ao salvar menu');
    } finally {
      setSaving(false);
    }
  };

  if (!menu) {
    return <div className="text-center text-zinc-500">Menu não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Configurações do Menu</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="menu-name">Nome do menu</Label>
            <Input
              id="menu-name"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Menu Principal"
            />
          </div>
          <div>
            <Label htmlFor="menu-slug">Slug</Label>
            <Input
              id="menu-slug"
              value={menuSlug}
              onChange={(e) => setMenuSlug(e.target.value)}
              placeholder="main-menu"
            />
          </div>
          <div>
            <Label htmlFor="menu-description">Descrição</Label>
            <Textarea
              id="menu-description"
              value={menuDescription}
              onChange={(e) => setMenuDescription(e.target.value)}
              placeholder="Descrição do menu (opcional)"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="menu-location">Local de exibição</Label>
            <select
              id="menu-location"
              value={menuLocation}
              onChange={(e) => setMenuLocation(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="header">Header Menu</option>
              <option value="footer">Footer Menu</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <AddMenuItemsPanel onAddItems={handleAddItems} />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Estrutura do menu</h3>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Arraste os itens para colocá-los na ordem desejada. Clique na seta à direita do item
            para mostrar opções de configuração adicionais.
          </p>

          {loading ? (
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
          onClick={handleSaveMenu}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar menu'}
        </Button>
      </div>
    </div>
  );
}

