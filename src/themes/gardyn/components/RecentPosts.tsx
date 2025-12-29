'use client';

import Link from 'next/link';
import React from 'react';

import type { Post, PostListItem } from '@/core/services/posts.service';

interface RecentPostsProps {
    posts: (Post | PostListItem)[];
    title?: string;
}

export function RecentPosts({ posts }: RecentPostsProps) {
    return (
        <ul className="de-bloglist-type-1">
            {posts.map((post) => {
                const featuredImage = post.metaData?.featuredImage as string | undefined;
                return (
                    <li key={post.uuid}>
                        <div className="d-image">
                            {featuredImage && (
                                <img src={featuredImage} alt={post.title} />
                            )}
                        </div>
                        <div className="d-content">
                            <Link href={`/blog/${post.slug}`}>
                                <h4>{post.title}</h4>
                            </Link>
                            <div className="d-date">
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default RecentPosts;
