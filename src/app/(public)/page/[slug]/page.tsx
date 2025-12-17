import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { ContentBlock } from '@/admin/components/builder/types';
import { getPostBySlug } from '@/core/services/posts.service';
import { generatePostMetadata } from '@/core/utils/seo';
import { PostContent } from '@/theme/components/PostContent';


interface PagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPostBySlug(slug, 'page');

  if (!page) {
    return {
      title: 'Página não encontrada',
    };
  }

  return generatePostMetadata({ post: page });
}

export default async function PagePage({ params }: PagePageProps) {
  const { slug } = await params;
  const page = await getPostBySlug(slug, 'page');

  if (!page) {
    notFound();
  }

  const blocks = (page.contentBlocks as ContentBlock[]) || [];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{page.excerpt}</p>
        )}
      </header>
      <PostContent blocks={blocks} />
    </article>
  );
}

