'use client';

import { FormikProvider, useFormik } from 'formik';
import { X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import type { MenuItemFlat } from '@/core/services/menus.service';
import { menuItemSchema, type MenuItemFormValues } from '@/core/validations';

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
  const [saving, setSaving] = useState(false);

  const formik = useFormik<MenuItemFormValues>({
    initialValues: {
      label: item.label || null,
      parentUuid: item.parentUuid || null,
      order: item.order,
      pageUuid: item.pageUuid,
      url: item.url || null,
    },
    validationSchema: menuItemSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSaving(true);
      try {
        await onUpdate(item.uuid, {
          label: values.label !== item.pageTitle ? values.label || undefined : undefined,
          parentUuid: values.parentUuid || null,
        });
      } finally {
        setSaving(false);
        setSubmitting(false);
      }
    },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevenir que o evento se propague para o formulário pai
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    // Validar e submeter apenas este formulário
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      await formik.submitForm();
    }
  };

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevenir que o evento se propague para o formulário pai
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    // Validar e submeter apenas este formulário
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      await formik.submitForm();
    }
  };

  const parentOptions = allItems.filter((i) => i.uuid !== item.uuid);

  const currentIndex = allItems.findIndex((i) => i.uuid === item.uuid);
  const siblings = allItems.filter((i) => i.parentUuid === item.parentUuid && i.uuid !== item.uuid);
  const currentPosition = siblings.findIndex((i) => i.order < item.order) + 1;
  const totalSiblings = siblings.length + 1;

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
    <FormikProvider value={formik}>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-medium text-zinc-900 dark:text-white">
              {item.label || item.pageTitle}
              {item.parentUuid && <span className="ml-2 text-xs text-zinc-500">subitem</span>}
            </h4>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            <FormInput
              name="label"
              label="Rótulo de navegação"
              placeholder={item.pageTitle}
              disabled={saving}
            />

            <FormSelect
              name="parentUuid"
              label="Menu ascendente"
              disabled={saving}
            >
              <option value="">Sem menu ascendente</option>
              {parentOptions.map((parent) => (
                <option key={parent.uuid} value={parent.uuid}>
                  {parent.label || parent.pageTitle}
                </option>
              ))}
            </FormSelect>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Ordem no menu
              </label>
              <select value={currentPosition} disabled className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                <option>
                  {currentPosition} de {totalSiblings}
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Mover
              </label>
              <div className="flex flex-wrap gap-2">
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove('up')}
                    disabled={saving}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Uma acima
                  </button>
                )}
                {currentIndex < allItems.length - 1 && (
                  <button
                    type="button"
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
                        type="button"
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
                    type="button"
                    onClick={() => handleMove('top')}
                    disabled={saving}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Para o topo
                  </button>
                )}
                {item.parentUuid && (
                  <button
                    type="button"
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
                type="button"
                onClick={handleRemove}
                variant="danger"
                size="sm"
                disabled={saving || formik.isSubmitting}
              >
                Remover
              </Button>
              <Button
                type="button"
                onClick={handleSaveClick}
                size="sm"
                disabled={saving || formik.isSubmitting}
              >
                {saving || formik.isSubmitting ? (
                  <>
                    <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                size="sm"
                disabled={saving || formik.isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormikProvider>
  );
}

