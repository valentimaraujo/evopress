import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionCookie } from '@/core/utils/cookies';
import { verifyToken } from '@/core/utils/auth';
import { Sidebar } from '@/components/admin/Sidebar';

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
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 transition-all duration-300">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
