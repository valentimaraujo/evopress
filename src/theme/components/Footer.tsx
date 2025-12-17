import React from 'react';

import { getAppVersionFormatted } from '@/core/utils/app-version';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} EvoPress. Todos os direitos reservados.</p>
          <p className="mt-2">{getAppVersionFormatted()}</p>
        </div>
      </div>
    </footer>
  );
}

