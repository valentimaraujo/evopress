import React from 'react';

import type { ContentBlock } from '@/admin/components/builder/types';
import { getPost } from '@/core/services/posts.service';
import { getRecentPosts } from '@/core/services/posts.service';
import { getReadingSettings } from '@/core/services/settings.service';
import { PostContent } from '@/theme/components/PostContent';

export default async function HomePage() {
  const readingSettings = await getReadingSettings();

  if (readingSettings.homepageType === 'page' && readingSettings.homepagePage) {
    const homepage = await getPost(readingSettings.homepagePage);

    if (!homepage) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Página inicial não encontrada
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A página configurada como inicial não foi encontrada. Configure uma nova página nas configurações.
          </p>
        </div>
      );
    }

    const blocks = (homepage.contentBlocks as ContentBlock[]) || [];

    return (
      <article className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            {homepage.title}
          </h1>
          {homepage.excerpt && (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">{homepage.excerpt}</p>
          )}
        </header>
        <PostContent blocks={blocks} />
      </article>
    );
  }

  const recentPosts = await getRecentPosts(10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          Posts Recentes
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Confira os posts mais recentes do blog
        </p>
      </div>

      {recentPosts.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">Nenhum post publicado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <article
              key={post.uuid}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            >
              <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                <a
                  href={`/post/${post.slug}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {post.title}
                </a>
              </h2>
              {post.excerpt && (
                <p className="mb-4 text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
              )}
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt.toISOString()}
                  className="text-sm text-zinc-500 dark:text-zinc-500"
                >
                  {post.publishedAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

