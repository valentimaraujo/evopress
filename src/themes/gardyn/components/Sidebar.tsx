'use client';

import React from 'react';

import type { Post } from '@/core/services/posts.service';

import { RecentPosts } from './RecentPosts';

interface SidebarProps {
    recentPosts: Post[];
}

export function Sidebar({ recentPosts }: SidebarProps) {
    return (
        <aside className="col-lg-4">
            {/* Search Widget - Exact HTML from typical Gardyn widgets if found, otherwise keep structure */}
            <div className="widget">
                <h4>Search</h4>
                <div className="relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type and hit enter..."
                    />
                </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="widget widget-post">
                <h4>Recent Posts</h4>
                <RecentPosts posts={recentPosts} />
            </div>

            {/* Popular Tags Widget */}
            <div className="widget widget_tags">
                <h4>Popular Tags</h4>
                <ul>
                    <li><a href="#">Garden</a></li>
                    <li><a href="#">Design</a></li>
                    <li><a href="#">Nature</a></li>
                    <li><a href="#">Outdoor</a></li>
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
