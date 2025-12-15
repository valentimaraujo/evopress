import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq, and, or, ilike, desc, count, isNull } from 'drizzle-orm';

export type PostStatus = 'draft' | 'published' | 'archived';
export type PostType = 'post' | 'page' | 'custom';

export interface PostListItem {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  postType: PostType;
  authorUuid: string;
  authorName: string;
  authorEmail: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  contentBlocksCount: number;
}

export interface ListPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  postType?: PostType;
  authorUuid?: string;
}

export interface ListPostsResult {
  posts: PostListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function listPosts(params: ListPostsParams = {}): Promise<ListPostsResult> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [isNull(posts.deletedAt)];

  if (params.status) {
    conditions.push(eq(posts.status, params.status));
  }

  if (params.postType) {
    conditions.push(eq(posts.postType, params.postType));
  }

  if (params.authorUuid) {
    conditions.push(eq(posts.authorUuid, params.authorUuid));
  }

  if (params.search) {
    const searchPattern = `%${params.search}%`;
    conditions.push(
      or(
        ilike(posts.title, searchPattern),
        ilike(posts.slug, searchPattern)
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: count() })
    .from(posts)
    .where(whereClause);

  const total = totalResult?.count || 0;

  const postsList = await db
    .select({
      uuid: posts.uuid,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      status: posts.status,
      postType: posts.postType,
      authorUuid: posts.authorUuid,
      authorName: users.name,
      authorEmail: users.email,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      seoKeywords: posts.seoKeywords,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      publishedAt: posts.publishedAt,
      contentBlocks: posts.contentBlocks,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorUuid, users.uuid))
    .where(whereClause)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  const formattedPosts: PostListItem[] = postsList.map((post) => ({
    uuid: post.uuid,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status as PostStatus,
    postType: post.postType as PostType,
    authorUuid: post.authorUuid,
    authorName: post.authorName,
    authorEmail: post.authorEmail,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    seoKeywords: post.seoKeywords,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
    contentBlocksCount: Array.isArray(post.contentBlocks) ? post.contentBlocks.length : 0,
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    posts: formattedPosts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

