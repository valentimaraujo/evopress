'use client';

import React from 'react';

import type { Post } from '@/core/services/posts.service';
import { renderPublicBlock } from '@/theme/blocks/block-renderer';

interface PostContentProps {
    post: Post;
}

export function PostContent({ post }: PostContentProps) {
    return (
        <article className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-12 text-center">
                <div className="mb-4 flex items-center justify-center space-x-2 text-sm font-bold uppercase tracking-widest text-primary">
                    <span>Blog</span>
                    <span className="h-1 w-1 rounded-full bg-primary/30" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h1 className="mb-6 text-4xl font-black uppercase tracking-tight text-zinc-900 md:text-5xl dark:text-white">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Featured Image Placeholder or actual if available */}
            {/* (In EvoPress, images would be blocks, but we can have a featured image in metadata) */}

            {/* Content Blocks */}
            <div className="prose prose-zinc prose-lg mx-auto dark:prose-invert prose-headings:uppercase prose-headings:font-black prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                {post.contentBlocks && post.contentBlocks.length > 0 ? (
                    post.contentBlocks.map((block) => (
                        <div key={block.id} className="mb-8 last:mb-0">
                            {renderPublicBlock(block)}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-zinc-500 italic">Este post ainda não tem conteúdo.</p>
                )}
            </div>

            {/* Footer / Tags */}
            <footer className="mt-16 border-t border-zinc-100 pt-8 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <Link href="/blog" className="text-sm font-bold uppercase tracking-wide text-zinc-500 hover:text-primary">
                        ← Voltar para o Blog
                    </Link>
                    <div className="flex space-x-2">
                        {/* Social Share icons could go here */}
                    </div>
                </div>
            </footer>
        </article>
    );
}

// Simple internal Link wrapper if needed, but next/link is usually available
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
}
