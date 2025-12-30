import Link from 'next/link';
import React from 'react';

import type { Post } from '@/core/services/posts.service';

interface RecentPostsProps {
  posts: Post[];
  title?: string;
}

export function RecentPosts({ posts, title = 'Posts Recentes' }: RecentPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.uuid}>
            <Link
              href={`/post/${post.slug}`}
              className="block text-sm font-medium text-zinc-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
            >
              {post.title}
            </Link>
            {post.excerpt && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

