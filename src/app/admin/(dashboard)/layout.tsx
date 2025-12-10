import Link from 'next/link';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionCookie } from '@/core/utils/cookies';
import { verifyToken } from '@/core/utils/auth';

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

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
        <div className="flex h-16 items-center px-6 font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800">
          {systemName}
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="block rounded-md p-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="block rounded-md p-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Posts
          </Link>
          <Link href="/admin/users" className="block rounded-md p-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Usuários
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-2 text-sm font-medium text-zinc-900 dark:text-white">
            {user?.name || 'Admin'}
          </div>
          <a href="/api/auth/logout" className="block w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            Sair
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
