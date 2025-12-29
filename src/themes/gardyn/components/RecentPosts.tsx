'use client';

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
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-zinc-400">{title}</h3>
            <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post.uuid} className="group flex flex-col space-y-2">
                        <Link
                            href={`/post/${post.slug}`}
                            className="text-lg font-black uppercase tracking-tight text-zinc-900 transition-colors hover:text-primary dark:text-white"
                        >
                            {post.title}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-tighter text-zinc-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        {post.excerpt && (
                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                {post.excerpt}
                            </p>
                        )}
                        <div className="pt-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <Link href={`/post/${post.slug}`} className="text-xs font-black uppercase tracking-widest text-primary underline underline-offset-4">
                                Read More +
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
