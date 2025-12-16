import { eq, and, or, ilike, desc, count, isNull } from 'drizzle-orm';

import { db } from '@/db';
import { posts, users } from '@/db/schema';

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

export interface Post {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  postType: PostType;
  authorUuid: string;
  contentBlocks: unknown[];
  metaData: Record<string, unknown> | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface CreatePostParams {
  title: string;
  slug: string;
  excerpt?: string;
  status?: PostStatus;
  postType?: PostType;
  authorUuid: string;
  contentBlocks?: unknown[];
  metaData?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdatePostParams {
  title?: string;
  slug?: string;
  excerpt?: string;
  status?: PostStatus;
  postType?: PostType;
  contentBlocks?: unknown[];
  metaData?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: Date | null;
}

export async function getPost(uuid: string): Promise<Post | null> {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.uuid, uuid))
    .limit(1);

  if (!post || post.deletedAt) {
    return null;
  }

  return {
    uuid: post.uuid,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status as PostStatus,
    postType: post.postType as PostType,
    authorUuid: post.authorUuid,
    contentBlocks: (post.contentBlocks as unknown[]) || [],
    metaData: (post.metaData as Record<string, unknown>) || null,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    seoKeywords: post.seoKeywords,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
  };
}

export async function createPost(params: CreatePostParams): Promise<Post> {
  const now = new Date();
  const publishedAt =
    params.status === 'published' ? now : null;

  const [newPost] = await db
    .insert(posts)
    .values({
      title: params.title,
      slug: params.slug,
      excerpt: params.excerpt || null,
      status: params.status || 'draft',
      postType: params.postType || 'post',
      authorUuid: params.authorUuid,
      contentBlocks: params.contentBlocks || [],
      metaData: params.metaData || {},
      seoTitle: params.seoTitle || null,
      seoDescription: params.seoDescription || null,
      seoKeywords: params.seoKeywords || null,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return {
    uuid: newPost.uuid,
    title: newPost.title,
    slug: newPost.slug,
    excerpt: newPost.excerpt,
    status: newPost.status as PostStatus,
    postType: newPost.postType as PostType,
    authorUuid: newPost.authorUuid,
    contentBlocks: (newPost.contentBlocks as unknown[]) || [],
    metaData: (newPost.metaData as Record<string, unknown>) || null,
    seoTitle: newPost.seoTitle,
    seoDescription: newPost.seoDescription,
    seoKeywords: newPost.seoKeywords,
    createdAt: newPost.createdAt,
    updatedAt: newPost.updatedAt,
    publishedAt: newPost.publishedAt,
  };
}

export async function updatePost(uuid: string, params: UpdatePostParams): Promise<Post | null> {
  const existingPost = await getPost(uuid);
  if (!existingPost) {
    return null;
  }

  const now = new Date();
  const publishedAt =
    params.status === 'published'
      ? existingPost.publishedAt || now
      : params.status === 'draft'
        ? null
        : params.publishedAt !== undefined
          ? params.publishedAt
          : existingPost.publishedAt;

  const [updatedPost] = await db
    .update(posts)
    .set({
      title: params.title !== undefined ? params.title : existingPost.title,
      slug: params.slug !== undefined ? params.slug : existingPost.slug,
      excerpt: params.excerpt !== undefined ? params.excerpt : existingPost.excerpt,
      status: params.status !== undefined ? params.status : existingPost.status,
      postType: params.postType !== undefined ? params.postType : existingPost.postType,
      contentBlocks: params.contentBlocks !== undefined ? params.contentBlocks : existingPost.contentBlocks,
      metaData: params.metaData !== undefined ? params.metaData : existingPost.metaData,
      seoTitle: params.seoTitle !== undefined ? params.seoTitle : existingPost.seoTitle,
      seoDescription:
        params.seoDescription !== undefined ? params.seoDescription : existingPost.seoDescription,
      seoKeywords:
        params.seoKeywords !== undefined ? params.seoKeywords : existingPost.seoKeywords,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(posts.uuid, uuid))
    .returning();

  return {
    uuid: updatedPost.uuid,
    title: updatedPost.title,
    slug: updatedPost.slug,
    excerpt: updatedPost.excerpt,
    status: updatedPost.status as PostStatus,
    postType: updatedPost.postType as PostType,
    authorUuid: updatedPost.authorUuid,
    contentBlocks: (updatedPost.contentBlocks as unknown[]) || [],
    metaData: (updatedPost.metaData as Record<string, unknown>) || null,
    seoTitle: updatedPost.seoTitle,
    seoDescription: updatedPost.seoDescription,
    seoKeywords: updatedPost.seoKeywords,
    createdAt: updatedPost.createdAt,
    updatedAt: updatedPost.updatedAt,
    publishedAt: updatedPost.publishedAt,
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

export async function deletePost(uuid: string, authorUuid: string): Promise<{ success: boolean; error?: string }> {
  const existingPost = await getPost(uuid);
  
  if (!existingPost) {
    return { success: false, error: 'Post não encontrado' };
  }

  if (existingPost.authorUuid !== authorUuid) {
    return { success: false, error: 'Você não tem permissão para excluir este post' };
  }

  const now = new Date();

  await db
    .update(posts)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(posts.uuid, uuid));

  return { success: true };
}

export async function getPostBySlug(slug: string, postType: PostType): Promise<Post | null> {
  const [post] = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.slug, slug),
        eq(posts.postType, postType),
        eq(posts.status, 'published'),
        isNull(posts.deletedAt)
      )
    )
    .limit(1);

  if (!post) {
    return null;
  }

  return {
    uuid: post.uuid,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status as PostStatus,
    postType: post.postType as PostType,
    authorUuid: post.authorUuid,
    contentBlocks: (post.contentBlocks as unknown[]) || [],
    metaData: (post.metaData as Record<string, unknown>) || null,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    seoKeywords: post.seoKeywords,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
  };
}

export async function getPostBySlugForPreview(
  slug: string,
  postType: PostType,
  authorUuid: string
): Promise<Post | null> {
  const [post] = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.slug, slug),
        eq(posts.postType, postType),
        eq(posts.authorUuid, authorUuid),
        isNull(posts.deletedAt)
      )
    )
    .limit(1);

  if (!post) {
    return null;
  }

  return {
    uuid: post.uuid,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status as PostStatus,
    postType: post.postType as PostType,
    authorUuid: post.authorUuid,
    contentBlocks: (post.contentBlocks as unknown[]) || [],
    metaData: (post.metaData as Record<string, unknown>) || null,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    seoKeywords: post.seoKeywords,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
  };
}

