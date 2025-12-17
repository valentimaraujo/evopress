import React from 'react';

import { getAppVersionFormatted } from '@/core/utils/app-version';

import { Menu } from './Menu';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 md:text-left">
            <p>© {new Date().getFullYear()} EvoPress. Todos os direitos reservados.</p>
            <p className="mt-2">{getAppVersionFormatted()}</p>
          </div>
          <nav className="hidden md:flex">
            <Menu location="footer" />
          </nav>
        </div>
      </div>
    </footer>
  );
}

