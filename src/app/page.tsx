import Link from 'next/link';
import React from 'react';

import { listPosts } from '@/core/services/posts.service';
import { getActiveTheme } from '@/core/services/themes.service';
import { loadThemeComponent } from '@/core/utils/theme-loader';

export default async function Home() {
  const activeTheme = await getActiveTheme();
  const themeModule = await loadThemeComponent('Layout', activeTheme);
  const Layout = themeModule.Layout || themeModule.default;

  if (!Layout) {
    throw new Error(`Componente Layout não encontrado no tema ${activeTheme}`);
  }

  const { posts } = await listPosts({
    status: 'published',
    postType: 'post',
    limit: 10,
    page: 1,
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Bem-vindo ao EvoPress
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Um CMS moderno e flexível
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Posts Recentes
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.uuid}
                  className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <Link href={`/post/${post.slug}`}>
                    <h3 className="mb-2 text-xl font-semibold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                      {post.title}
                    </h3>
                  </Link>
                  {post.excerpt && (
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{post.authorName}</span>
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </time>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Nenhum post publicado ainda. Volte em breve!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
