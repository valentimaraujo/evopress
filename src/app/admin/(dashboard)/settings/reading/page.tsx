import React from 'react';

import { ReadingSettings } from '@/admin/components/ReadingSettings';

export default function ReadingSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Configurações de Leitura</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Configure como sua página inicial será exibida
        </p>
      </div>
      <ReadingSettings />
    </div>
  );
}

