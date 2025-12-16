import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { ContentBlock } from '@/admin/components/builder/types';
import { getPostBySlug, getRecentPosts } from '@/core/services/posts.service';
import { generatePostMetadata } from '@/core/utils/seo';
import { PostContent } from '@/theme/components/PostContent';
import { RecentPosts } from '@/theme/components/RecentPosts';


interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, 'post');

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return generatePostMetadata({ post });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, 'post');

  if (!post) {
    notFound();
  }

  const blocks = (post.contentBlocks as ContentBlock[]) || [];
  const recentPosts = await getRecentPosts(5, post.uuid);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        <article className="flex-1">
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
            )}
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt.toISOString()}
                className="mt-4 block text-sm text-zinc-500 dark:text-zinc-500"
              >
                Publicado em {post.publishedAt.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </header>
          <PostContent blocks={blocks} />
        </article>
        <RecentPosts posts={recentPosts} />
      </div>
    </div>
  );
}

