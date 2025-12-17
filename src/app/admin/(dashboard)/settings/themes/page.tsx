import React from 'react';

import { ThemesList } from '@/admin/components/ThemesList';

export default function ThemesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gerenciar Temas</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Escolha e ative um tema para o site público. O tema base sempre está disponível.
        </p>
      </div>
      <ThemesList />
    </div>
  );
}

