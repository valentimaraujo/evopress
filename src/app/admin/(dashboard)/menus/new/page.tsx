'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { showError, showSuccess } from '@/core/utils/swal';

export default function NewMenuPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) {
      await showError('Nome e slug são obrigatórios');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          location: 'header',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar menu');
      }

      const menu = await response.json();
      await showSuccess('Menu criado com sucesso');
      router.push(`/admin/menus/${menu.uuid}`);
    } catch (error: any) {
      await showError(error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Criar Novo Menu</h1>
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div>
            <Label htmlFor="name">Nome do Menu</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Menu Principal"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="main-menu"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do menu"
              rows={3}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Criando...' : 'Criar Menu'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/menus')}
              disabled={creating}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

