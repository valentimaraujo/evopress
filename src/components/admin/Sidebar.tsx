'use client';

import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  LogOut, 
  ChevronLeft,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { ThemeToggle } from '@/components/ui/ThemeToggle';


interface SidebarProps {
  systemName: string;
  user: { name: string; email: string } | null;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ systemName, user, isCollapsed: externalCollapsed, onToggle }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggle = onToggle || (() => setInternalCollapsed(!internalCollapsed));
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/posts', label: 'Posts', icon: FileText },
    { href: '/admin/media', label: 'Mídia', icon: ImageIcon },
    { href: '/admin/users', label: 'Usuários', icon: Users },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button 
          onClick={handleToggle}
          className="rounded-lg bg-white p-2 shadow-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <Menu className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="relative">
        <aside 
          className={clsx(
            "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-200 bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 lg:static lg:h-screen",
            collapsed ? "w-20" : "w-72"
          )}
        >
          {/* Header */}
          <div className="flex h-20 items-center shrink-0 px-4 lg:px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shrink-0">
              {systemName.charAt(0)}
            </div>
            <span className={clsx(
              "ml-2 text-xl font-bold tracking-tight text-zinc-800 dark:text-white whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden",
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
            )}>
              {systemName}
            </span>
          </div>
          
          {/* Navegação */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 space-y-1">
            <div className={clsx("transition-all duration-300", collapsed ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-10 mb-4")}>
              <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Menu
              </p>
            </div>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={clsx(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={clsx("h-5 w-5 shrink-0 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-white")} />
                  <span className={clsx(
                    "whitespace-nowrap transition-[opacity,width] duration-300 ease-in-out overflow-hidden",
                    collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
                  )}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Footer (Perfil + Theme) */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 shrink-0">
            
            <ThemeToggle collapsed={collapsed} />

            {user && (
              <div className={clsx(
                "flex items-center gap-3 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800/50 transition-all duration-300",
                collapsed ? "justify-center bg-transparent p-0" : ""
              )}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400 shrink-0">
                  {user.name.charAt(0)}
                </div>
                
                <div className={clsx(
                  "flex-1 overflow-hidden transition-[opacity,width] duration-300 ease-in-out",
                  collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"
                )}>
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
                
                {!collapsed && (
                  <a 
                    href="/api/auth/logout" 
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all dark:hover:bg-zinc-700 shrink-0"
                    title="Sair"
                  >
                    <LogOut className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Botão de Toggle Flutuante na Borda */}
        <button
          onClick={handleToggle}
          className="hidden lg:flex absolute -right-3 top-20 z-50 h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-200 bg-white shadow-md transition-all hover:scale-110 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <ChevronLeft className={clsx("h-4 w-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-300", collapsed && "rotate-180")} />
        </button>
      </div>
    </>
  );
}
