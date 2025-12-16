'use client';

import { X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { MenuItemFlat } from '@/core/services/menus.service';

interface MenuItemEditorProps {
  item: MenuItemFlat;
  allItems: MenuItemFlat[];
  onUpdate: (uuid: string, updates: { label?: string; parentUuid?: string | null; order?: number }) => Promise<void>;
  onMove: (uuid: string, direction: 'up' | 'down' | 'top' | 'under', targetUuid?: string) => Promise<void>;
  onRemove: (uuid: string) => Promise<void>;
  onCancel: () => void;
}

export function MenuItemEditor({
  item,
  allItems,
  onUpdate,
  onMove,
  onRemove,
  onCancel,
}: MenuItemEditorProps) {
  const [label, setLabel] = useState(item.label || item.pageTitle);
  const [parentUuid, setParentUuid] = useState<string>(item.parentUuid || '');
  const [saving, setSaving] = useState(false);

  const parentOptions = allItems.filter((i) => i.uuid !== item.uuid);

  const currentIndex = allItems.findIndex((i) => i.uuid === item.uuid);
  const siblings = allItems.filter((i) => i.parentUuid === item.parentUuid && i.uuid !== item.uuid);
  const currentPosition = siblings.findIndex((i) => i.order < item.order) + 1;
  const totalSiblings = siblings.length + 1;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(item.uuid, {
        label: label !== item.pageTitle ? label : undefined,
        parentUuid: parentUuid || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (direction: 'up' | 'down' | 'top' | 'under', targetUuid?: string) => {
    setSaving(true);
    try {
      await onMove(item.uuid, direction, targetUuid);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (confirm('Tem certeza que deseja remover este item do menu?')) {
      await onRemove(item.uuid);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-zinc-900 dark:text-white">
            {item.label || item.pageTitle}
            {item.parentUuid && <span className="ml-2 text-xs text-zinc-500">subitem</span>}
          </h4>
        </div>
        <button
          onClick={onCancel}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Rótulo de navegação
          </label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={item.pageTitle}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Menu ascendente
          </label>
          <Select
            value={parentUuid}
            onChange={(e) => setParentUuid(e.target.value)}
          >
            <option value="">Sem menu ascendente</option>
            {parentOptions.map((parent) => (
              <option key={parent.uuid} value={parent.uuid}>
                {parent.label || parent.pageTitle}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Ordem no menu
          </label>
          <Select value={currentPosition} disabled>
            <option>
              {currentPosition} de {totalSiblings}
            </option>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Mover
          </label>
          <div className="flex flex-wrap gap-2">
            {currentIndex > 0 && (
              <button
                onClick={() => handleMove('up')}
                disabled={saving}
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Uma acima
              </button>
            )}
            {currentIndex < allItems.length - 1 && (
              <button
                onClick={() => handleMove('down')}
                disabled={saving}
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Um abaixo
              </button>
            )}
            {parentOptions.length > 0 && (
              <>
                {parentOptions.map((parent) => (
                  <button
                    key={parent.uuid}
                    onClick={() => handleMove('under', parent.uuid)}
                    disabled={saving}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Sob {parent.label || parent.pageTitle}
                  </button>
                ))}
              </>
            )}
            {currentIndex > 0 && (
              <button
                onClick={() => handleMove('top')}
                disabled={saving}
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Para o topo
              </button>
            )}
            {item.parentUuid && (
              <button
                onClick={() => handleMove('under', undefined)}
                disabled={saving}
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Não mais sob {allItems.find((i) => i.uuid === item.parentUuid)?.label || 'pai'}
              </button>
            )}
          </div>
        </div>

        <div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Original: </span>
          <a
            href={`/admin/posts/${item.pageUuid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {item.pageTitle}
          </a>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRemove}
            variant="danger"
            size="sm"
            disabled={saving}
          >
            Remover
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            disabled={saving}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

