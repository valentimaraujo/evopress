import { Plus } from 'lucide-react';
import Link from 'next/link';

import { PostsList } from '@/admin/components/PostsList';

export default function PostsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Posts
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Gerencie todos os seus posts e páginas.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <PostsList />
        </div>
      </div>
    </div>
  );
}

