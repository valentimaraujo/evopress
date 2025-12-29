'use client';

import React from 'react';

import type { Post } from '@/core/services/posts.service';

import { RecentPosts } from './RecentPosts';

interface SidebarProps {
    recentPosts: Post[];
}

export function Sidebar({ recentPosts }: SidebarProps) {
    return (
        <aside className="space-y-12">
            {/* Search Widget - Placeholder style */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">Search</h4>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                        placeholder="Type and hit enter..."
                    />
                    <span className="absolute right-4 top-3 text-zinc-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Recent Posts Widget */}
            <RecentPosts posts={recentPosts} title="Explore More" />

            {/* About Widget or Ad-like placeholder */}
            <div className="overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl shadow-primary/20">
                <h4 className="mb-4 text-lg font-black uppercase tracking-tight">Need a Hand?</h4>
                <p className="mb-6 text-sm opacity-90 leading-relaxed">
                    Gardyn offers professional garden design and maintenance services.
                </p>
                <a href="/contact" className="inline-block rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-zinc-100">
                    Get In Touch
                </a>
            </div>
        </aside>
    );
}
