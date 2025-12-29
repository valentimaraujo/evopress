'use client';

import React from 'react';

import type { Post } from '@/core/services/posts.service';
import { renderPublicBlock } from '@/theme/blocks/block-renderer';

interface PostContentProps {
    post: Post;
}

export function PostContent({ post }: PostContentProps) {
    const featuredImage = post.metaData?.featuredImage as string | undefined;

    return (
        <div className="post-content-wrapper">
            {/* Subheader / Page Title */}
            <section id="subheader" className="relative jarallax text-light">
                {featuredImage && (
                    <img src={featuredImage} className="jarallax-img" alt={post.title} />
                )}
                <div className="container relative z-index-1000">
                    <div className="row">
                        <div className="col-lg-12">
                            <ul className="crumb">
                                <li><a href="/">Home</a></li>
                                <li className="active">Blog</li>
                            </ul>
                            <h1 className="text-uppercase">{post.title}</h1>
                        </div>
                    </div>
                </div>
                <img src="/themes/gardyn/images/logo-wm.webp" className="abs end-0 bottom-0 z-2 w-20" alt="" />
                <div className="de-gradient-edge-top dark"></div>
                <div className="de-overlay"></div>
            </section>

            <section>
                <div className="container">
                    <div className="row gx-5">
                        <div className="col-lg-8">
                            <div className="blog-read">
                                <div className="post-text">
                                    {post.excerpt && (
                                        <p className="lead">{post.excerpt}</p>
                                    )}
                                    {post.contentBlocks && (post.contentBlocks as any[]).map((block) => (
                                        <div key={block.id}>
                                            {renderPublicBlock(block)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PostContent;
