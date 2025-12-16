import Link from 'next/link';
import React from 'react';

import { Menu } from './Menu';

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
              EvoPress
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <Menu location="header" />
            {false && (
              <Link
                href="/"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Início
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

