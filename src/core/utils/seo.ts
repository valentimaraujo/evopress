import type { Metadata } from 'next';

import type { Post } from '@/core/services/posts.service';

interface GeneratePostMetadataParams {
  post: Post;
}

export function generatePostMetadata({ post }: GeneratePostMetadataParams): Metadata {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || '';
  const keywords = post.seoKeywords?.join(', ') || '';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/${post.postType === 'page' ? 'page' : 'post'}/${post.slug}`;

  return {
    title,
    description,
    keywords: keywords || undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'EvoPress',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

