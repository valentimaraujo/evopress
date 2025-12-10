'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg p-2 text-zinc-500">
        <Sun className="h-5 w-5" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={collapsed 
        ? "flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
        : "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
      }
      title={collapsed ? (isDark ? 'Modo escuro ativo' : 'Modo claro ativo') : undefined}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <Sun className={`h-5 w-5 transition-all ${isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
        <Moon className={`absolute h-5 w-5 transition-all ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
      </div>
      {!collapsed && (
        <span className="flex-1 text-left">
          {isDark ? 'Modo Escuro' : 'Modo Claro'}
        </span>
      )}
    </button>
  );
}
