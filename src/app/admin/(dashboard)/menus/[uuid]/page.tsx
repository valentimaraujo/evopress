'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { MenuEditor } from '@/admin/components/MenuEditor';
import type { Menu } from '@/core/services/menus.service';
import { showError } from '@/core/utils/swal';

interface MenuEditPageProps {
  params: Promise<{ uuid: string }>;
}

export default function MenuEditPage({ params }: MenuEditPageProps) {
  const router = useRouter();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ uuid: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/menus/${resolvedParams.uuid}`);
        if (!response.ok) {
          if (response.status === 404) {
            await showError('Menu não encontrado');
            router.push('/admin/menus');
            return;
          }
          throw new Error('Erro ao buscar menu');
        }

        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error('Erro ao buscar menu:', error);
        await showError('Erro ao carregar menu');
        router.push('/admin/menus');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [resolvedParams, router]);

  const handleSave = () => {
    router.push('/admin/menus');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-zinc-500">Carregando menu...</div>
      </div>
    );
  }

  if (!menu) {
    return null;
  }

  return (
    <div className="p-6">
      <MenuEditor menu={menu} onSave={handleSave} />
    </div>
  );
}

