import Link from 'next/link';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionCookie } from '@/core/utils/cookies';
import { verifyToken } from '@/core/utils/auth';
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  LogOut, 
  Settings 
} from 'lucide-react';

async function getCurrentUser() {
  const token = await getSessionCookie();
  if (!token) return null;
  
  const payload = await verifyToken(token) as { sub: string } | null;
  if (!payload?.sub) return null;

  const [user] = await db.select().from(users).where(eq(users.uuid, payload.sub)).limit(1);
  return user;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const prefix = process.env.DB_PREFIX || 'evopress';
  const systemName = prefix === 'evopress' ? 'EvoPress' : prefix.toUpperCase();
  const user = await getCurrentUser();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/posts', label: 'Posts', icon: FileText },
    { href: '/admin/media', label: 'Mídia', icon: ImageIcon },
    { href: '/admin/users', label: 'Usuários', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
        {/* Header da Sidebar */}
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              {systemName.charAt(0)}
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-800 dark:text-white">
              {systemName}
            </span>
          </div>
        </div>
        
        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Menu
          </p>
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <item.icon className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-indigo-600 dark:text-zinc-500 dark:group-hover:text-white" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer da Sidebar (Perfil) */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                {user?.name || 'Admin'}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email}
              </p>
            </div>
            <a 
              href="/api/auth/logout" 
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all dark:hover:bg-zinc-700"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
