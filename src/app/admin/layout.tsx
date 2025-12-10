import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const prefix = process.env.DB_PREFIX || 'evopress';
  const systemName = prefix === 'evopress' ? 'EvoPress' : prefix.toUpperCase();

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Sidebar Simples */}
      <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-16 items-center px-6 font-bold text-zinc-900 dark:text-white">
          {systemName}
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/admin" className="block rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="block rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Posts
          </Link>
          <Link href="/admin/users" className="block rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Usuários
          </Link>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
