import { eq } from 'drizzle-orm';

import { Sidebar } from '@/components/admin/Sidebar';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { db } from '@/db';
import { users } from '@/db/schema';

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
    <div className="flex h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 overflow-hidden">
      <Sidebar 
        systemName={systemName} 
        userName={user?.name || 'Admin'} 
        userEmail={user?.email || ''} 
      />

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
