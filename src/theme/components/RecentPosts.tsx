import Link from 'next/link';
import React from 'react';

import type { PostListItem } from '@/core/services/posts.service';

interface RecentPostsProps {
  posts: PostListItem[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <aside className="w-full lg:w-80">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Posts Recentes
        </h2>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.uuid}>
              <Link
                href={`/post/${post.slug}`}
                className="block transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt.toISOString()}
                    className="mt-2 block text-xs text-zinc-500 dark:text-zinc-500"
                  >
                    {post.publishedAt.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

